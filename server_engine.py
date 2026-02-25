from __future__ import annotations

from dataclasses import dataclass
import json
import math
import random
import re
from pathlib import Path
from typing import Any


def clamp(value: float, minimum: float, maximum: float) -> float:
    return min(maximum, max(minimum, value))


def _pick_random(items: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not items:
        return None
    return random.choice(items)


@dataclass
class SelectionState:
    history_list: list[str]
    history_set: set[str]
    last_set: set[str]
    selected_ids: list[str]


class SteakSelectionEngine:
    def __init__(self, data_path: Path) -> None:
        with data_path.open("r", encoding="utf-8") as handle:
            self.data = json.load(handle)

        self.traits = [entry["key"] for entry in self.data["traits"]]
        self.question_pool = self.data["questionPool"]
        self.intake_groups = self.data["intakeGroups"]
        self.common_dynamic_groups = self.data["commonDynamicGroups"]
        self.expert_dynamic_groups = self.data["expertDynamicGroups"]
        self.intermediate_dynamic_groups = self.data["intermediateDynamicGroups"]
        self.beginner_dynamic_groups = self.data["beginnerDynamicGroups"]
        self.cuisine_priority_groups = self.data["cuisinePriorityGroups"]
        self.question_relevance_notes = self.data["questionRelevanceNotes"]
        self.cuts = self.data["cuts"]
        self.cooking_tips_db = self.data["cookingTipsDb"]
        self.max_question_count = 22
        self.all_question_groups = list(
            dict.fromkeys(question["group"] for question in self.question_pool if question.get("group"))
        )

        sets_data = self.data["sets"]
        self.specialty_cut_ids = set(sets_data["specialtyCutIds"])
        self.classic_cut_ids = set(sets_data["classicCutIds"])
        self.high_precision_cut_ids = set(sets_data["highPrecisionCutIds"])
        self.bone_in_cut_ids = set(sets_data["boneInCutIds"])
        self.smoke_friendly_cut_ids = set(sets_data["smokeFriendlyCutIds"])
        self.fat_cap_forward_cut_ids = set(sets_data["fatCapForwardCutIds"])
        self.sliced_board_cut_ids = set(sets_data["slicedBoardCutIds"])
        self.premium_occasion_ids = set(sets_data["premiumOccasionIds"])
        self.casual_crowd_ids = set(sets_data["casualCrowdIds"])
        self.mexican_focus_ids = set(sets_data["mexicanFocusIds"])
        self.italian_focus_ids = set(sets_data["italianFocusIds"])
        self.steakhouse_focus_ids = set(sets_data["steakhouseFocusIds"])
        self.bbq_focus_ids = set(sets_data["bbqFocusIds"])
        self.asian_quick_cook_ids = set(sets_data["asianQuickCookIds"])

        self.cut_tip_alias = {
            "coulotte": "picanha",
            "sirloin_flap": "bavette",
            "bone_in_strip": "strip",
            "tomahawk_ribeye": "ribeye",
            "filet_medallions": "filet_mignon",
        }

    def get_question_relevance(self, group: str) -> str:
        return self.question_relevance_notes.get(
            group,
            "This answer helps refine your cut recommendation and improve fit.",
        )

    def create_selection_state(
        self, history: list[str] | None = None, last_set: list[str] | None = None
    ) -> SelectionState:
        history_list = list(history or [])
        return SelectionState(
            history_list=history_list,
            history_set=set(history_list),
            last_set=set(last_set or []),
            selected_ids=[],
        )

    def _pick_question_for_group(
        self, group: str, selection_state: SelectionState
    ) -> dict[str, Any] | None:
        candidates = [question for question in self.question_pool if question["group"] == group]
        if not candidates:
            return None

        selected_id_set = set(selection_state.selected_ids)
        available = [question for question in candidates if question["id"] not in selected_id_set]
        source = available if available else candidates
        not_in_last = [question for question in source if question["id"] not in selection_state.last_set]
        unseen = [question for question in not_in_last if question["id"] not in selection_state.history_set]
        fallback_unseen = [
            question for question in source if question["id"] not in selection_state.history_set
        ]

        if unseen:
            pool = unseen
        elif not_in_last:
            pool = not_in_last
        elif fallback_unseen:
            pool = fallback_unseen
        else:
            pool = source

        return _pick_random(pool) or source[0]

    def select_questions_for_groups(
        self, groups: list[str], selection_state: SelectionState, limit: int | None = None
    ) -> list[dict[str, Any]]:
        selected: list[dict[str, Any]] = []
        for group in groups:
            if limit is not None and len(selected) >= limit:
                break
            question = self._pick_question_for_group(group, selection_state)
            if not question:
                continue
            selected.append(question)
            selection_state.selected_ids.append(question["id"])
        return selected

    def persist_selection_history(self, selection_state: SelectionState) -> tuple[list[str], list[str]]:
        for question_id in selection_state.selected_ids:
            if question_id not in selection_state.history_set:
                selection_state.history_set.add(question_id)
                selection_state.history_list.append(question_id)

        next_history = selection_state.history_list[-len(self.question_pool) :]
        return next_history, list(selection_state.selected_ids)

    def _pick_additional_from_pool(
        self, selection_state: SelectionState, count: int
    ) -> list[dict[str, Any]]:
        selected: list[dict[str, Any]] = []
        while len(selected) < count:
            selected_id_set = set(selection_state.selected_ids)
            available = [question for question in self.question_pool if question["id"] not in selected_id_set]
            if not available:
                break

            not_in_last = [
                question for question in available if question["id"] not in selection_state.last_set
            ]
            unseen = [
                question for question in not_in_last if question["id"] not in selection_state.history_set
            ]
            fallback_unseen = [
                question for question in available if question["id"] not in selection_state.history_set
            ]
            pool = unseen or not_in_last or fallback_unseen or available
            picked = _pick_random(pool) or available[0]
            selected.append(picked)
            selection_state.selected_ids.append(picked["id"])

        return selected

    def select_additional_questions(
        self,
        selection_state: SelectionState,
        existing_questions: list[dict[str, Any]],
        count: int,
        signals: dict[str, Any] | None = None,
    ) -> list[dict[str, Any]]:
        if count <= 0:
            return []

        signals = signals or {}
        used_groups = {question["group"] for question in existing_questions if question.get("group")}
        cuisine_priority = self.cuisine_priority_groups.get(signals.get("cuisineStyle"), [])
        priority_groups = [
            group for group in cuisine_priority if group in self.all_question_groups and group not in used_groups
        ]
        remaining_groups = [
            group for group in self.all_question_groups if group not in used_groups and group not in priority_groups
        ]

        selected = self.select_questions_for_groups(
            priority_groups + remaining_groups, selection_state, limit=count
        )
        if len(selected) >= count:
            return selected

        selected.extend(self._pick_additional_from_pool(selection_state, count - len(selected)))
        return selected

    def get_expertise_band(self, signals: dict[str, Any]) -> str:
        if signals.get("expertiseBand"):
            return signals["expertiseBand"]
        if signals.get("comfort") == "Expert cut fluency":
            return "Expert"
        if signals.get("comfort") == "Comfortable with common cuts":
            return "Intermediate"
        return "Beginner"

    def prioritize_groups(self, groups: list[str], priority_groups: list[str]) -> list[str]:
        ordered: list[str] = []
        for group in priority_groups:
            if group in groups and group not in ordered:
                ordered.append(group)
        for group in groups:
            if group not in ordered:
                ordered.append(group)
        return ordered

    def build_dynamic_question_groups(self, signals: dict[str, Any]) -> list[str]:
        expertise_band = self.get_expertise_band(signals)
        if expertise_band == "Expert":
            expertise_groups = self.expert_dynamic_groups
        elif expertise_band == "Intermediate":
            expertise_groups = self.intermediate_dynamic_groups
        else:
            expertise_groups = self.beginner_dynamic_groups

        dynamic_groups = list(self.common_dynamic_groups) + list(expertise_groups)
        cuisine_priority = self.cuisine_priority_groups.get(signals.get("cuisineStyle"), [])
        return self.prioritize_groups(dynamic_groups, cuisine_priority)

    def append_dynamic_questions(
        self,
        question_set: list[dict[str, Any]],
        answers: list[int | None],
        selection_state: SelectionState,
    ) -> list[dict[str, Any]]:
        intake_count = len(self.intake_groups)
        if len(question_set) < intake_count or len(answers) < intake_count:
            return []

        intake_signals = self.build_assessment_signals_for_range(question_set, answers, 0, intake_count)
        dynamic_groups = self.build_dynamic_question_groups(intake_signals)
        dynamic_questions = self.select_questions_for_groups(dynamic_groups, selection_state)

        needed = self.max_question_count - (len(question_set) + len(dynamic_questions))
        if needed > 0:
            dynamic_questions.extend(
                self.select_additional_questions(
                    selection_state,
                    existing_questions=question_set + dynamic_questions,
                    count=needed,
                    signals=intake_signals,
                )
            )

        return dynamic_questions

    def build_assessment_signals(
        self, question_set: list[dict[str, Any]], answers: list[int | None]
    ) -> dict[str, Any]:
        return self.build_assessment_signals_for_range(question_set, answers, 0, len(question_set))

    def build_assessment_signals_for_range(
        self,
        question_set: list[dict[str, Any]],
        answers: list[int | None],
        start_index: int,
        end_exclusive: int,
    ) -> dict[str, Any]:
        signals: dict[str, Any] = {}
        safe_start = max(0, start_index)
        safe_end = min(len(question_set), end_exclusive)

        for question_index in range(safe_start, safe_end):
            selected_option_index = answers[question_index]
            if selected_option_index is None:
                continue
            options = question_set[question_index]["options"]
            if selected_option_index < 0 or selected_option_index >= len(options):
                continue
            option = options[selected_option_index]
            for key, value in option.get("signal", {}).items():
                signals[key] = value

        return signals

    def build_profile_vector(
        self, question_set: list[dict[str, Any]], answers: list[int | None]
    ) -> dict[str, float]:
        vector = {trait: 5.0 for trait in self.traits}
        for question_index, selected_option_index in enumerate(answers):
            if selected_option_index is None:
                continue
            options = question_set[question_index]["options"]
            if selected_option_index < 0 or selected_option_index >= len(options):
                continue
            option = options[selected_option_index]
            for trait, effect in option.get("effects", {}).items():
                vector[trait] = clamp(vector.get(trait, 5.0) + effect, 0, 10)
        return vector

    def get_cut_family(self, cut: dict[str, Any]) -> str:
        reference = (cut.get("imps", [""])[0] or "").lower()
        if "sirloin" in reference:
            return "Sirloin"
        if "rib" in reference:
            return "Rib"
        if "chuck" in reference:
            return "Chuck"
        if "plate" in reference:
            return "Plate"
        if "flank" in reference:
            return "Flank"
        if "round" in reference:
            return "Round"
        if "loin" in reference:
            return "Loin"
        return "Specialty"

    def get_cost_tier(self, cut: dict[str, Any]) -> str:
        value = cut["profile"]["value"]
        if value >= 7:
            return "Value"
        if value >= 4:
            return "Mid-Premium"
        return "Premium"

    def derive_best_method(self, profile: dict[str, float]) -> str:
        if profile["precision"] >= 8:
            return "Pan sear + controlled finish"
        if profile["boldness"] >= 8:
            return "High-heat grill + pan sear"
        if profile["value"] >= 8:
            return "Roast / quick-cook adaptable methods"
        return "High-heat grill + pan sear"

    def derive_budget_orientation(self, profile: dict[str, float]) -> str:
        if profile["value"] >= 8:
            return "Value-focused"
        if profile["value"] >= 6:
            return "Moderate"
        if profile["value"] >= 4:
            return "Mid-premium"
        return "Selective premium"

    def derive_substitution_flexibility(self, profile: dict[str, float]) -> str:
        if profile["adventure"] >= 8:
            return "High"
        if profile["adventure"] >= 5:
            return "Moderate"
        if profile["adventure"] >= 3:
            return "Limited"
        return "Low (exact cuts preferred)"

    def derive_flavor_target(self, profile: dict[str, float]) -> str:
        if profile["boldness"] >= 8:
            return "Bold / savory"
        if profile["boldness"] <= 3:
            return "Clean / mild"
        return "Balanced"

    def derive_richness_target(self, profile: dict[str, float]) -> str:
        if profile["richness"] >= 8:
            return "Very rich"
        if profile["richness"] >= 6:
            return "Rich"
        if profile["richness"] <= 3:
            return "Lean"
        return "Moderate"

    def derive_texture_target(self, profile: dict[str, float]) -> str:
        if profile["tenderness"] >= 8:
            return "Very tender"
        if profile["tenderness"] <= 4 and profile["boldness"] >= 7:
            return "Firmer chew"
        return "Balanced tenderness"

    def derive_cook_window(self, profile: dict[str, float]) -> str:
        if profile["precision"] >= 8:
            return "30-45 minutes"
        if profile["value"] >= 8 and profile["precision"] <= 4:
            return "10-15 minutes"
        if profile["boldness"] >= 8 and profile["adventure"] >= 7:
            return "45+ minute project"
        return "20-30 minutes"

    def derive_meal_format(self, profile: dict[str, float]) -> str:
        if profile["value"] >= 9 and profile["precision"] <= 3:
            return "Sandwich / bun"
        if profile["value"] >= 8:
            return "Tacos / bowls"
        if profile["boldness"] >= 7 and profile["adventure"] >= 6:
            return "Sliced board"
        return "Plated steak"

    def derive_occasion_type(self, profile: dict[str, float]) -> str:
        if profile["value"] >= 8 and profile["precision"] <= 5:
            return "Weeknight dinner"
        if profile["richness"] >= 8 and profile["tenderness"] >= 7:
            return "Date night"
        if profile["boldness"] >= 8 and profile["adventure"] >= 6:
            return "Game day / BBQ"
        return "Hosting guests"

    def classify_program(self, cut: dict[str, Any]) -> str:
        profile = cut["profile"]
        if profile["tenderness"] >= 8 and profile["value"] <= 4:
            return "Premium Tender Cuts"
        if profile["boldness"] >= 8 and profile["adventure"] >= 6:
            return "Flavor-Forward Bistro Cuts"
        if profile["value"] >= 7:
            return "Value / Operational Cuts"
        if profile["richness"] >= 8:
            return "Rich Marbling-Forward Cuts"
        return "Balanced Steakhouse Cuts"

    def get_secondary_program(
        self, ranked_cuts: list[dict[str, Any]], primary_program: str
    ) -> str:
        for result in ranked_cuts[1:]:
            program = self.classify_program(result["cut"])
            if program != primary_program:
                return program
        return primary_program

    def get_top_families(self, ranked_cuts: list[dict[str, Any]], limit: int) -> list[str]:
        family_scores: dict[str, float] = {}
        for result in ranked_cuts[:10]:
            family = self.get_cut_family(result["cut"])
            family_scores[family] = family_scores.get(family, 0) + result["score"]
        return [entry[0] for entry in sorted(family_scores.items(), key=lambda item: item[1], reverse=True)[:limit]]

    def build_profile_summary(
        self, profile: dict[str, float], ranked_cuts: list[dict[str, Any]], signals: dict[str, Any]
    ) -> dict[str, str]:
        primary_fit = self.classify_program(ranked_cuts[0]["cut"])
        secondary_fit = self.get_secondary_program(ranked_cuts, primary_fit)
        return {
            "primaryFit": primary_fit,
            "secondaryFit": secondary_fit,
            "bestCookingMatch": signals.get("method") or self.derive_best_method(profile),
            "budgetOrientation": signals.get("budget") or self.derive_budget_orientation(profile),
            "substitutionFlexibility": signals.get("substitution")
            or self.derive_substitution_flexibility(profile),
            "recommendedFamilies": ", ".join(self.get_top_families(ranked_cuts, 3)),
        }

    def get_tie_breaker_score(self, cut: dict[str, Any]) -> float:
        profile = cut["profile"]
        availability_bias = 10 - profile["adventure"]
        practical_bias = profile["value"] + profile["precision"]
        return availability_bias + practical_bias

    def rank_cuts(
        self, profile: dict[str, float], signals: dict[str, Any] | None = None
    ) -> list[dict[str, Any]]:
        signals = signals or {}
        max_distance = math.sqrt(len(self.traits) * (10**2))
        ranked: list[dict[str, Any]] = []

        for cut in self.cuts:
            distance = math.sqrt(
                sum((profile[trait] - cut["profile"][trait]) ** 2 for trait in self.traits)
            )
            baseline_score = max(0, round((1 - distance / max_distance) * 100))
            adjusted_score = clamp(
                baseline_score
                + self.get_method_fit_adjustment(cut, signals.get("method"))
                + self.get_doneness_fit_adjustment(cut, signals.get("doneness"))
                + self.get_budget_fit_adjustment(cut, signals.get("budget"))
                + self.get_comfort_adjustment(cut, signals.get("comfort"))
                + self.get_specialty_fit_adjustment(cut, signals.get("specialtyComfort"))
                + self.get_technique_fit_adjustment(cut, signals.get("advancedTechnique"))
                + self.get_buy_precision_fit_adjustment(cut, signals.get("buyPrecision"))
                + self.get_guidance_fit_adjustment(cut, signals.get("guidanceLevel"))
                + self.get_priority_fit_adjustment(cut, signals.get("priority"))
                + self.get_substitution_fit_adjustment(cut, signals.get("substitution"))
                + self.get_portion_fit_adjustment(cut, signals.get("portionStyle"))
                + self.get_bone_fit_adjustment(cut, signals.get("bonePreference"))
                + self.get_cook_window_fit_adjustment(cut, signals.get("cookWindow"))
                + self.get_smoke_fit_adjustment(cut, signals.get("smokeLevel"))
                + self.get_fat_cap_fit_adjustment(cut, signals.get("fatCapPreference"))
                + self.get_seasoning_intent_adjustment(cut, signals.get("seasoningIntent"))
                + self.get_pairing_fit_adjustment(cut, signals.get("pairingStyle"))
                + self.get_meal_format_fit_adjustment(cut, signals.get("mealFormat"))
                + self.get_cuisine_fit_adjustment(
                    cut,
                    signals.get("cuisineStyle"),
                    signals.get("mealFormat"),
                    signals.get("seasoningStyle"),
                )
                + self.get_occasion_fit_adjustment(cut, signals.get("occasionType")),
                0,
                100,
            )
            adjusted_score = min(
                adjusted_score,
                self.get_doneness_score_cap(cut, signals.get("doneness")),
            )
            ranked.append({"cut": cut, "score": adjusted_score})

        ranked.sort(
            key=lambda item: (
                item["score"],
                self.get_tie_breaker_score(item["cut"]),
            ),
            reverse=True,
        )
        return ranked

    def get_supported_doneness_levels(self, cut: dict[str, Any]) -> set[int]:
        text = cut["cooking"]["doneness"].lower()
        if "varies" in text:
            return {1, 2, 3}

        normalized = text.replace("medium-rare", "mediumrare")
        levels: set[int] = set()

        if "mediumrare" in normalized or re.search(r"\brare\b", normalized):
            levels.add(1)
        if re.search(r"\bmedium\b", normalized):
            levels.add(2)
        if re.search(r"\bwell\b", normalized) or "heat through" in normalized:
            levels.add(3)

        return levels or {2}

    def get_doneness_fit_adjustment(
        self, cut: dict[str, Any], doneness_preference: str | None
    ) -> int:
        if not doneness_preference or doneness_preference == "Varies by cut":
            return 0

        levels = self.get_supported_doneness_levels(cut)
        profile = cut["profile"]

        if doneness_preference == "Rare / Medium-rare":
            if 1 in levels:
                return 5
            if 2 in levels:
                return -2
            return -8

        if doneness_preference == "Medium":
            if 2 in levels:
                return 5
            if 1 in levels and 3 in levels:
                return 2
            if 1 in levels:
                return -3
            return -3

        if doneness_preference == "Medium-well / Well done":
            if 3 in levels:
                return 8
            if 2 in levels:
                if profile["boldness"] >= 7 or profile["value"] >= 6:
                    return 2
                if profile["tenderness"] >= 8:
                    return -10
                return -6
            return -12

        return 0

    def get_doneness_score_cap(self, cut: dict[str, Any], doneness_preference: str | None) -> float:
        if not doneness_preference or doneness_preference == "Varies by cut":
            return 100

        levels = self.get_supported_doneness_levels(cut)
        profile = cut["profile"]

        if doneness_preference == "Rare / Medium-rare":
            if 1 in levels:
                return 100
            if 2 in levels:
                return 88
            return 70

        if doneness_preference == "Medium":
            if 2 in levels:
                return 100
            if 1 in levels and 3 in levels:
                return 96
            if 1 in levels or 3 in levels:
                return 82
            return 75

        if doneness_preference == "Medium-well / Well done":
            if 3 in levels:
                return 100
            if 2 in levels:
                if profile["tenderness"] >= 8:
                    return 78
                return 88
            return 72

        return 100

    def get_method_fit_adjustment(self, cut: dict[str, Any], preferred_method: str | None) -> int:
        if not preferred_method:
            return 0
        method_text = cut["cooking"]["method"].lower()
        if preferred_method == "High-heat grill":
            if "grill" in method_text or "live fire" in method_text:
                return 6
            if "sear" in method_text:
                return 2
            return -3
        if preferred_method == "Pan sear":
            if "pan" in method_text or "cast-iron" in method_text:
                return 6
            if "sear" in method_text:
                return 3
            return -2
        if preferred_method == "Oven roast + sear":
            if "oven" in method_text or "reverse" in method_text:
                return 6
            if "sear" in method_text:
                return 2
            return -2
        if preferred_method == "Low-and-slow":
            if "low" in method_text or "smoke" in method_text or "marinate" in method_text:
                return 6
            return -4
        if preferred_method == "Sous vide / precision":
            precision = cut["profile"]["precision"]
            if precision >= 7:
                return 5
            if precision >= 5:
                return 2
            return -2
        return 0

    def get_budget_fit_adjustment(self, cut: dict[str, Any], budget_orientation: str | None) -> int:
        if not budget_orientation:
            return 0
        cost_tier = self.get_cost_tier(cut)
        if budget_orientation == "Premium / no strict limit":
            if cost_tier == "Premium":
                return 5
            if cost_tier == "Mid-Premium":
                return 2
            return -2
        if budget_orientation == "Mid-premium":
            if cost_tier == "Mid-Premium":
                return 4
            if cost_tier == "Premium":
                return 1
            return 0
        if budget_orientation == "Moderate":
            if cost_tier == "Mid-Premium":
                return 3
            if cost_tier == "Value":
                return 2
            return -1
        if budget_orientation == "Value-focused":
            if cost_tier == "Value":
                return 5
            if cost_tier == "Mid-Premium":
                return 1
            return -4
        if budget_orientation == "Lowest-cost options first":
            if cost_tier == "Value":
                return 6
            if cost_tier == "Mid-Premium":
                return -1
            return -6
        return 0

    def get_comfort_adjustment(self, cut: dict[str, Any], comfort_level: str | None) -> int:
        if not comfort_level:
            return 0
        adventure = cut["profile"]["adventure"]
        if comfort_level in {"Expert cut fluency", "Very comfortable"}:
            if adventure >= 7:
                return 5
            if adventure >= 5:
                return 2
            return 0
        if comfort_level in {"Comfortable with common cuts", "Somewhat comfortable", "Neutral"}:
            if adventure >= 7:
                return -1
            if adventure >= 5:
                return 1
            return 0
        if comfort_level in {"Familiar basics", "Prefer familiar cuts only"}:
            if adventure >= 7:
                return -4
            if adventure <= 4:
                return 2
            return -1
        if comfort_level == "Need guidance / recipes":
            if adventure >= 7:
                return -5
            if adventure <= 4:
                return 2
            return -1
        return 0

    def get_specialty_fit_adjustment(self, cut: dict[str, Any], specialty_comfort: str | None) -> int:
        if not specialty_comfort:
            return 0
        is_specialty = cut["id"] in self.specialty_cut_ids or cut["profile"]["adventure"] >= 7
        if specialty_comfort == "High":
            return 4 if is_specialty else -1
        if specialty_comfort == "Medium":
            if is_specialty:
                return 2
            return 1 if cut["id"] in self.classic_cut_ids else 0
        if specialty_comfort == "Low":
            if is_specialty:
                return -2
            return 2 if cut["profile"]["adventure"] <= 5 else 0
        if specialty_comfort == "Minimal":
            if is_specialty:
                return -4
            return 3 if cut["id"] in self.classic_cut_ids else 1
        return 0

    def get_technique_fit_adjustment(self, cut: dict[str, Any], advanced_technique: str | None) -> int:
        if not advanced_technique:
            return 0
        method_text = cut["cooking"]["method"].lower()
        if advanced_technique == "Temp-driven reverse sear":
            if cut["id"] in self.high_precision_cut_ids or cut["profile"]["precision"] >= 7:
                return 5
            if cut["profile"]["precision"] >= 5:
                return 2
            return -2
        if advanced_technique == "Two-zone heat control":
            if "grill" in method_text or "live fire" in method_text or "sear" in method_text:
                return 3
            return 1 if cut["profile"]["precision"] >= 6 else -1
        if advanced_technique == "Marinade and high heat":
            if "marinate" in method_text or "slice" in method_text:
                return 3
            if cut["profile"]["value"] >= 6 and cut["profile"]["boldness"] >= 6:
                return 2
            return 0
        if advanced_technique == "Simple single-step":
            if cut["profile"]["precision"] <= 5:
                return 3
            if cut["profile"]["precision"] >= 8:
                return -2
            return 1
        return 0

    def get_buy_precision_fit_adjustment(self, cut: dict[str, Any], buy_precision: str | None) -> int:
        if not buy_precision:
            return 0
        if buy_precision == "Exact spec":
            if cut["id"] in self.high_precision_cut_ids or cut["profile"]["precision"] >= 7:
                return 4
            return 1 if cut["profile"]["precision"] >= 5 else -2
        if buy_precision == "Exact cut flexible thickness":
            return 3 if cut["profile"]["precision"] >= 6 else 1
        if buy_precision == "Family-level flexibility":
            if cut["profile"]["value"] >= 6:
                return 2
            if cut["profile"]["precision"] >= 8:
                return -1
            return 1
        if buy_precision == "Open with guidance":
            if cut["id"] in self.classic_cut_ids or cut["profile"]["adventure"] <= 5:
                return 2
            return -1
        return 0

    def get_guidance_fit_adjustment(self, cut: dict[str, Any], guidance_level: str | None) -> int:
        if not guidance_level:
            return 0
        if guidance_level == "Single cut + simple steps":
            if cut["id"] in self.classic_cut_ids or cut["profile"]["adventure"] <= 4:
                return 3
            return -2
        if guidance_level == "Top 3 + swaps":
            if cut["profile"]["value"] >= 5:
                return 2
            if cut["profile"]["adventure"] >= 8:
                return -1
            return 1
        if guidance_level == "Learn progressively":
            adventure = cut["profile"]["adventure"]
            if 5 <= adventure <= 8:
                return 3
            if adventure >= 9:
                return 1
            return 0
        if guidance_level == "Familiar only":
            if cut["profile"]["adventure"] <= 4:
                return 3
            return -3 if cut["profile"]["adventure"] >= 7 else 0
        return 0

    def get_priority_fit_adjustment(self, cut: dict[str, Any], priority: str | None) -> int:
        if not priority:
            return 0
        profile = cut["profile"]
        if priority == "Best eating quality":
            if profile["tenderness"] >= 8 or profile["richness"] >= 8:
                return 3
            if profile["value"] >= 7:
                return -2
            return 1
        if priority == "Best value":
            if profile["value"] >= 7:
                return 4
            if profile["value"] <= 3:
                return -3
            return 1
        if priority == "Best consistency":
            if profile["precision"] >= 7:
                return 4
            if profile["precision"] >= 5:
                return 2
            return -2
        if priority == "Best fit for the cooking method":
            return 2 if profile["precision"] >= 6 else 0
        return 0

    def get_substitution_fit_adjustment(
        self, cut: dict[str, Any], substitution_flexibility: str | None
    ) -> int:
        if not substitution_flexibility:
            return 0
        profile = cut["profile"]
        if substitution_flexibility == "High (cost-based)":
            if profile["value"] >= 7:
                return 3
            if profile["value"] <= 3:
                return -2
            return 1
        if substitution_flexibility == "Moderate (performance-based)":
            return 2 if profile["precision"] >= 6 else 0
        if substitution_flexibility == "Limited":
            if profile["adventure"] <= 5:
                return 2
            if profile["adventure"] >= 8:
                return -1
            return 0
        if substitution_flexibility == "Low (exact cuts only)":
            if profile["adventure"] <= 4:
                return 2
            if profile["adventure"] >= 7:
                return -2
            return 0
        return 0

    def get_portion_fit_adjustment(self, cut: dict[str, Any], portion_style: str | None) -> int:
        if not portion_style:
            return 0
        method_text = cut["cooking"]["method"].lower()
        family = self.get_cut_family(cut)
        profile = cut["profile"]

        if portion_style == "6-8 oz single steak":
            if profile["tenderness"] >= 8:
                return 3
            if profile["value"] >= 8:
                return -1
            return 1
        if portion_style == "8-12 oz steakhouse cut":
            if family in {"Rib", "Loin", "Sirloin"}:
                return 3
            if family == "Round":
                return -2
            return 0
        if portion_style == "Large shareable sliced cut":
            if (
                "slice" in method_text
                or cut["id"] in {"tri_tip", "coulotte", "sirloin_flap", "london_broil_top_round"}
            ):
                return 4
            if profile["tenderness"] >= 8 and profile["value"] <= 4:
                return -2
            return 1
        if portion_style == "Thin-sliced applications":
            if "slice" in method_text or "thin" in method_text:
                return 4
            if profile["value"] >= 7 and profile["tenderness"] <= 6:
                return 2
            return -1
        if portion_style == "Handheld cookout style":
            if cut["id"] == "all_beef_uncured_hot_dog":
                return 9
            if "grill" in method_text and profile["value"] >= 7 and profile["adventure"] <= 4:
                return 1
            return -4
        return 0

    def get_bone_fit_adjustment(self, cut: dict[str, Any], bone_preference: str | None) -> int:
        if not bone_preference or bone_preference == "Either":
            return 0
        is_bone_in_cut = cut["id"] in self.bone_in_cut_ids
        if bone_preference == "Bone-in":
            return 5 if is_bone_in_cut else -2
        if bone_preference == "Boneless":
            return -4 if is_bone_in_cut else 2
        return 0

    def get_cook_window_fit_adjustment(self, cut: dict[str, Any], cook_window: str | None) -> int:
        if not cook_window:
            return 0
        method_text = cut["cooking"]["method"].lower()
        profile = cut["profile"]
        quick_friendly = (
            cut["id"] == "all_beef_uncured_hot_dog"
            or "quick" in method_text
            or "very hot sear" in method_text
            or (profile["precision"] <= 4 and profile["value"] >= 6)
        )
        project_friendly = (
            "slow" in method_text
            or "braise" in method_text
            or "reverse" in method_text
            or profile["precision"] >= 7
        )
        if cook_window == "10-15 minutes":
            return 5 if quick_friendly else -3
        if cook_window == "20-30 minutes":
            return 2 if (quick_friendly or profile["precision"] <= 6) else 0
        if cook_window == "30-45 minutes":
            return 3 if profile["precision"] >= 6 else -1
        if cook_window == "45+ minute project":
            return 5 if project_friendly else -3
        return 0

    def get_smoke_fit_adjustment(self, cut: dict[str, Any], smoke_level: str | None) -> int:
        if not smoke_level:
            return 0
        method_text = cut["cooking"]["method"].lower()
        smoke_friendly = (
            cut["id"] in self.smoke_friendly_cut_ids
            or "smoke" in method_text
            or "bbq" in method_text
            or "grill" in method_text
        )
        if smoke_level == "None":
            return -2 if (smoke_friendly and cut["profile"]["adventure"] >= 6) else 1
        if smoke_level == "Light":
            return 2 if smoke_friendly else 0
        if smoke_level == "Medium":
            return 4 if smoke_friendly else -1
        if smoke_level == "Heavy":
            return 6 if smoke_friendly else -3
        return 0

    def get_fat_cap_fit_adjustment(self, cut: dict[str, Any], fat_cap_preference: str | None) -> int:
        if not fat_cap_preference:
            return 0
        fat_forward = cut["id"] in self.fat_cap_forward_cut_ids or cut["profile"]["richness"] >= 8
        if fat_cap_preference == "Trimmed lean":
            return -4 if fat_forward else 2
        if fat_cap_preference == "Some fat edge":
            return 1 if fat_forward else 0
        if fat_cap_preference == "Like fat cap":
            return 3 if fat_forward else -1
        if fat_cap_preference == "Love fat cap":
            return 5 if fat_forward else -2
        return 0

    def get_seasoning_intent_adjustment(self, cut: dict[str, Any], seasoning_intent: str | None) -> int:
        if not seasoning_intent:
            return 0
        profile = cut["profile"]
        if seasoning_intent == "Simple prep":
            if profile["precision"] <= 5 and profile["adventure"] <= 5:
                return 4
            if profile["value"] >= 7 and profile["adventure"] <= 6:
                return 2
            if profile["precision"] >= 8 and profile["adventure"] >= 7:
                return -2
            return 1
        if seasoning_intent == "Quality showcase":
            if self.get_cost_tier(cut) == "Premium" or profile["tenderness"] >= 8:
                return 5
            if self.get_cost_tier(cut) == "Mid-Premium":
                return 2
            if profile["value"] >= 8 and profile["tenderness"] <= 6:
                return -2
            return 0
        return 0

    def get_pairing_fit_adjustment(self, cut: dict[str, Any], pairing_style: str | None) -> int:
        if not pairing_style:
            return 0
        profile = cut["profile"]
        if pairing_style == "Rich sides":
            if profile["richness"] <= 6:
                return 3
            if profile["richness"] >= 9:
                return -3
            return 0
        if pairing_style == "Light sides":
            if profile["richness"] >= 7 or profile["boldness"] >= 8:
                return 3
            return 0
        if pairing_style == "Sauce-heavy sides":
            if profile["boldness"] >= 7 or profile["value"] >= 6:
                return 2
            if profile["richness"] >= 9:
                return -1
            return 0
        if pairing_style == "Minimal sides":
            if profile["richness"] >= 7 or profile["boldness"] >= 8:
                return 3
            if profile["boldness"] <= 5 and profile["richness"] <= 5:
                return -1
            return 1
        return 0

    def get_meal_format_fit_adjustment(self, cut: dict[str, Any], meal_format: str | None) -> int:
        if not meal_format:
            return 0
        method_text = cut["cooking"]["method"].lower()
        profile = cut["profile"]
        family = self.get_cut_family(cut)
        if meal_format == "Plated steak":
            if family in {"Rib", "Loin"}:
                return 4
            if profile["tenderness"] >= 8:
                return 2
            return -1
        if meal_format == "Sliced board":
            return 5 if (cut["id"] in self.sliced_board_cut_ids or "slice" in method_text) else -1
        if meal_format == "Tacos / bowls":
            if "slice" in method_text or profile["value"] >= 7:
                return 3
            return 0
        if meal_format == "Sandwich / bun":
            if cut["id"] == "all_beef_uncured_hot_dog":
                return 8
            if profile["value"] >= 8 and profile["adventure"] <= 4:
                return 1
            return -3
        return 0

    def get_cuisine_fit_adjustment(
        self,
        cut: dict[str, Any],
        cuisine_style: str | None,
        meal_format: str | None,
        seasoning_style: str | None,
    ) -> int:
        if not cuisine_style or cuisine_style == "No specific cuisine":
            return 0
        profile = cut["profile"]
        score = 0
        if cuisine_style == "Mexican / fajitas":
            if cut["id"] in self.mexican_focus_ids:
                score += 6
            elif profile["value"] >= 7:
                score += 1
            else:
                score -= 2
            if meal_format == "Tacos / bowls":
                score += 2
            if seasoning_style == "Rub / marinade":
                score += 1
        if cuisine_style == "Italian / comfort dishes":
            if cut["id"] in self.italian_focus_ids:
                score += 4
            elif profile["tenderness"] >= 8:
                score += 2
            elif profile["adventure"] >= 8:
                score -= 2
            if seasoning_style == "Sauce-forward":
                score += 2
        if cuisine_style == "Steakhouse / American grill":
            if cut["id"] in self.steakhouse_focus_ids:
                score += 5
            elif profile["tenderness"] >= 7:
                score += 1
            else:
                score -= 1
            if meal_format == "Plated steak":
                score += 2
        if cuisine_style == "BBQ / smokehouse":
            if cut["id"] in self.bbq_focus_ids or cut["id"] in self.smoke_friendly_cut_ids:
                score += 6
            elif profile["boldness"] >= 7:
                score += 1
            else:
                score -= 2
        if cuisine_style == "Asian / quick-cook":
            if cut["id"] in self.asian_quick_cook_ids:
                score += 5
            elif profile["value"] >= 7:
                score += 1
            else:
                score -= 2
            if meal_format in {"Tacos / bowls", "Sliced board"}:
                score += 1
        return int(clamp(score, -8, 10))

    def get_occasion_fit_adjustment(self, cut: dict[str, Any], occasion_type: str | None) -> int:
        if not occasion_type:
            return 0
        profile = cut["profile"]
        if occasion_type == "Weeknight dinner":
            if profile["value"] >= 7 and profile["precision"] <= 6:
                return 3
            return 0
        if occasion_type == "Date night":
            if cut["id"] in self.premium_occasion_ids:
                return 5
            if profile["value"] >= 8:
                return -2
            return 1
        if occasion_type == "Hosting guests":
            if cut["id"] in self.sliced_board_cut_ids or profile["boldness"] >= 8:
                return 3
            return 0
        if occasion_type == "Game day / BBQ":
            if cut["id"] in self.casual_crowd_ids or cut["id"] in self.smoke_friendly_cut_ids:
                return 4
            return -1
        return 0

    def get_top_cluster(self, ranked_cuts: list[dict[str, Any]], top_score: float) -> list[dict[str, Any]]:
        return [entry for entry in ranked_cuts if entry["score"] >= top_score - 5][:4]

    def get_skill_fit_text(self, signals: dict[str, Any]) -> str:
        if signals.get("advancedTechnique"):
            return f"Technique Fit: {signals['advancedTechnique']}."
        if signals.get("buyPrecision"):
            return f"Purchase Style: {signals['buyPrecision']}."
        if signals.get("specialtyComfort"):
            return f"Specialty Comfort: {signals['specialtyComfort']}."
        if signals.get("guidanceLevel"):
            return f"Guidance Fit: {signals['guidanceLevel']}."
        return "Skill Fit: Balanced to your comfort level."

    def build_preference_snapshot(self, signals: dict[str, Any], profile: dict[str, float]) -> str:
        flavor = signals.get("flavorTarget") or self.derive_flavor_target(profile)
        richness = signals.get("richnessTarget") or self.derive_richness_target(profile)
        texture = signals.get("textureTarget") or self.derive_texture_target(profile)
        method = signals.get("method") or self.derive_best_method(profile)
        return (
            f"{flavor} flavor, {richness.lower()} richness, {texture.lower()} texture, "
            f"and {method.lower()} cooking"
        )

    def get_top_alignment_reasons(
        self, profile: dict[str, float], cut: dict[str, Any], count: int = 3
    ) -> list[str]:
        labels = {
            "richness": "richness level",
            "tenderness": "tenderness target",
            "boldness": "beef flavor intensity",
            "adventure": "cut comfort level",
            "value": "value expectations",
            "precision": "cooking-control style",
        }
        scored = []
        for trait in self.traits:
            user_value = profile[trait]
            cut_value = cut["profile"][trait]
            alignment = 10 - abs(user_value - cut_value)
            weighted_score = alignment * (0.6 + user_value / 10)
            scored.append((trait, weighted_score))
        scored.sort(key=lambda item: item[1], reverse=True)
        return [labels[item[0]] for item in scored[:count]]

    def build_fit_notes(
        self,
        profile: dict[str, float],
        cut: dict[str, Any],
        summary: dict[str, str],
        signals: dict[str, Any],
        has_close_alternatives: bool,
        top_cluster: list[dict[str, Any]],
    ) -> list[str]:
        preference_snapshot = self.build_preference_snapshot(signals, profile)
        alignment_drivers = self.get_top_alignment_reasons(profile, cut, 3)
        doneness_signal = signals.get("doneness")
        if doneness_signal and doneness_signal != "Varies by cut":
            doneness_line = (
                f"Best Cooking Lane: {summary['bestCookingMatch']} tuned for "
                f"{doneness_signal.lower()} finish (cut sweet spot: {cut['cooking']['doneness'].lower()})."
            )
        else:
            doneness_line = (
                f"Best Cooking Lane: {summary['bestCookingMatch']} with "
                f"{cut['cooking']['doneness'].lower()} finish."
            )

        notes = [
            f"Preference Match: {preference_snapshot}.",
            f"Core Alignment: {', '.join(alignment_drivers)}.",
            doneness_line,
            f"Business Lens: {summary['budgetOrientation']}; substitutions {summary['substitutionFlexibility'].lower()}.",
        ]
        if has_close_alternatives:
            alternatives = ", ".join(entry["cut"]["name"] for entry in top_cluster[1:])
            notes.append(f"Close Alternatives: {alternatives}.")
        notes.append(f"Recommendation Logic: {cut['rationale']}")
        return notes

    def to_scale_band(self, value: float) -> int:
        if value < 1.75:
            return 1
        if value < 2.5:
            return 2
        if value < 3.25:
            return 3
        return 4

    def get_difficulty_scale_label(self, value: float) -> str:
        band = self.to_scale_band(value)
        return {1: "Easy", 2: "Moderate", 3: "Skilled", 4: "Advanced"}[band]

    def get_familiarity_scale_label(self, value: float) -> str:
        band = self.to_scale_band(value)
        return {1: "Familiar", 2: "Familiar-Plus", 3: "Specialty", 4: "Deep Specialty"}[band]

    def get_equipment_scale_label(self, value: float) -> str:
        band = self.to_scale_band(value)
        return {1: "Low Equipment", 2: "Standard Equipment", 3: "More Equipment", 4: "Full Equipment"}[band]

    def get_method_complexity_boost(self, method_text: str) -> float:
        if "sous vide" in method_text or "reverse" in method_text or "smoke" in method_text:
            return 1.0
        if "low" in method_text or "marinate" in method_text:
            return 0.5
        return 0.0

    def derive_cut_execution_scale(self, cut: dict[str, Any]) -> dict[str, float]:
        method_text = cut["cooking"]["method"].lower()
        profile = cut["profile"]

        difficulty = 1.0
        if profile["precision"] >= 7:
            difficulty += 1
        elif profile["precision"] >= 5:
            difficulty += 0.5

        if profile["adventure"] >= 8:
            difficulty += 1
        elif profile["adventure"] >= 6:
            difficulty += 0.5

        difficulty += self.get_method_complexity_boost(method_text)

        if profile["adventure"] <= 4:
            familiarity = 1
        elif profile["adventure"] <= 6:
            familiarity = 2
        elif profile["adventure"] <= 8:
            familiarity = 3
        else:
            familiarity = 4

        equipment = 1
        if "grill" in method_text or "pan" in method_text or "cast-iron" in method_text:
            equipment = 2
        if "oven" in method_text or "reverse" in method_text:
            equipment = max(equipment, 3)
        if (
            "smoke" in method_text
            or "sous vide" in method_text
            or "live fire" in method_text
            or "low-and-slow" in method_text
        ):
            equipment = max(equipment, 4)

        if cut["id"] == "all_beef_uncured_hot_dog":
            difficulty = 1
            familiarity = 1
            equipment = 1

        return {
            "difficulty": clamp(difficulty, 1, 4),
            "familiarity": clamp(familiarity, 1, 4),
            "equipment": clamp(equipment, 1, 4),
        }

    def get_expertise_scale_anchor(self, signals: dict[str, Any]) -> float:
        expertise_band = self.get_expertise_band(signals)
        if expertise_band == "Expert":
            return 3.2
        if expertise_band == "Intermediate":
            return 2.4
        return 1.6

    def get_cuisine_scale_bias(self, cuisine_style: str | None) -> dict[str, float]:
        if cuisine_style == "BBQ / smokehouse":
            return {"difficulty": 0.65, "familiarity": 0.25, "equipment": 1.05}
        if cuisine_style == "Steakhouse / American grill":
            return {"difficulty": 0.45, "familiarity": 0.2, "equipment": 0.65}
        if cuisine_style == "Mexican / fajitas":
            return {"difficulty": 0.2, "familiarity": 0.45, "equipment": 0.25}
        if cuisine_style == "Asian / quick-cook":
            return {"difficulty": 0.1, "familiarity": 0.35, "equipment": 0.1}
        if cuisine_style == "Italian / comfort dishes":
            return {"difficulty": -0.2, "familiarity": -0.1, "equipment": -0.2}
        return {"difficulty": 0.0, "familiarity": 0.0, "equipment": 0.0}

    def build_scale_tier_title(self, level: int, target_scale: dict[str, float]) -> str:
        difficulty = self.get_difficulty_scale_label(target_scale["difficulty"])
        familiarity = self.get_familiarity_scale_label(target_scale["familiarity"])
        equipment = self.get_equipment_scale_label(target_scale["equipment"])
        return f"Level {level}: {difficulty} • {familiarity} • {equipment}"

    def build_tier_scale_model(self, signals: dict[str, Any]) -> dict[str, Any]:
        expertise_anchor = self.get_expertise_scale_anchor(signals)
        cuisine_bias = self.get_cuisine_scale_bias(signals.get("cuisineStyle"))
        level_offsets = [-1.1, -0.3, 0.55, 1.35]

        targets = []
        for offset in level_offsets:
            targets.append(
                {
                    "difficulty": clamp(expertise_anchor + cuisine_bias["difficulty"] + offset, 1, 4),
                    "familiarity": clamp(expertise_anchor + cuisine_bias["familiarity"] + offset, 1, 4),
                    "equipment": clamp(expertise_anchor + cuisine_bias["equipment"] + offset, 1, 4),
                }
            )

        return {
            "targets": targets,
            "titles": {
                "tier1": self.build_scale_tier_title(1, targets[0]),
                "tier2": self.build_scale_tier_title(2, targets[1]),
                "tier3": self.build_scale_tier_title(3, targets[2]),
                "tier4": self.build_scale_tier_title(4, targets[3]),
            },
        }

    def get_tier_target_distance(
        self, cut_scale: dict[str, float], target_scale: dict[str, float]
    ) -> float:
        return (
            abs(cut_scale["difficulty"] - target_scale["difficulty"])
            + abs(cut_scale["familiarity"] - target_scale["familiarity"])
            + abs(cut_scale["equipment"] - target_scale["equipment"])
        )

    def get_tier_scale_fit_score(
        self, result: dict[str, Any], target_scale: dict[str, float], signals: dict[str, Any]
    ) -> float:
        cut_scale = self.derive_cut_execution_scale(result["cut"])
        target_distance = self.get_tier_target_distance(cut_scale, target_scale)
        distance_score = clamp(16 - target_distance * 4.25, -10, 16)
        cuisine_bonus = (
            self.get_cuisine_fit_adjustment(
                result["cut"], signals.get("cuisineStyle"), signals.get("mealFormat"), None
            )
            * 0.45
        )
        return result["score"] * 0.55 + distance_score + cuisine_bonus

    def select_tier_cuts_by_scale(
        self,
        ranked_cuts: list[dict[str, Any]],
        used: set[str],
        target_scale: dict[str, float],
        count: int,
        signals: dict[str, Any],
    ) -> list[dict[str, Any]]:
        ordered = []
        for result in ranked_cuts:
            if result["cut"]["id"] in used:
                continue
            ordered.append(
                {
                    "result": result,
                    "tierFitScore": self.get_tier_scale_fit_score(result, target_scale, signals),
                }
            )
        ordered.sort(key=lambda item: (item["tierFitScore"], item["result"]["score"]), reverse=True)

        picks = [entry["result"] for entry in ordered[:count]]
        for pick in picks:
            used.add(pick["cut"]["id"])

        if len(picks) >= count:
            return picks

        for result in ranked_cuts:
            if len(picks) >= count:
                break
            if result["cut"]["id"] in used:
                continue
            picks.append(result)
            used.add(result["cut"]["id"])

        return picks

    def build_tier_recommendations(
        self, ranked_cuts: list[dict[str, Any]], signals: dict[str, Any]
    ) -> dict[str, Any]:
        used: set[str] = set()
        scale_model = self.build_tier_scale_model(signals)
        tier1 = self.select_tier_cuts_by_scale(ranked_cuts, used, scale_model["targets"][0], 3, signals)
        tier2 = self.select_tier_cuts_by_scale(ranked_cuts, used, scale_model["targets"][1], 4, signals)
        tier3 = self.select_tier_cuts_by_scale(ranked_cuts, used, scale_model["targets"][2], 4, signals)
        tier4 = self.select_tier_cuts_by_scale(ranked_cuts, used, scale_model["targets"][3], 4, signals)
        return {
            "tier1": tier1,
            "tier2": tier2,
            "tier3": tier3,
            "tier4": tier4,
            "titles": scale_model["titles"],
        }

    def get_tips_for_cut(self, cut: dict[str, Any]) -> list[str]:
        family = self.get_cut_family(cut)
        by_cut = self.cooking_tips_db["byCut"]
        cut_key = cut["id"]
        cut_tips = by_cut.get(cut_key, [])
        if not cut_tips and cut_key in self.cut_tip_alias:
            cut_tips = by_cut.get(self.cut_tip_alias[cut_key], [])

        family_tips = self.cooking_tips_db["byFamily"].get(
            family, self.cooking_tips_db["byFamily"].get("Specialty", [])
        )
        prioritized = [
            f"Method match: {cut['cooking']['method']}.",
            f"Cut sweet spot doneness: {cut['cooking']['doneness']} ({cut['cooking']['temp']}).",
            cut["cooking"]["note"],
            *cut_tips,
            *family_tips,
        ]
        unique = []
        seen = set()
        for tip in prioritized:
            if tip and tip not in seen:
                seen.add(tip)
                unique.append(tip)
        return unique[:8]

    def recommend(
        self, question_set: list[dict[str, Any]], answers: list[int | None]
    ) -> dict[str, Any]:
        profile = self.build_profile_vector(question_set, answers)
        signals = self.build_assessment_signals(question_set, answers)
        ranked_cuts = self.rank_cuts(profile, signals)
        primary = ranked_cuts[0]
        second = ranked_cuts[1] if len(ranked_cuts) > 1 else primary
        score_gap = primary["score"] - second["score"]
        summary = self.build_profile_summary(profile, ranked_cuts, signals)
        tiers = self.build_tier_recommendations(ranked_cuts, signals)
        top_cluster = self.get_top_cluster(ranked_cuts, primary["score"])
        has_close_alternatives = score_gap <= 5 and len(top_cluster) > 1

        flavor_target = signals.get("flavorTarget") or self.derive_flavor_target(profile)
        richness_target = signals.get("richnessTarget") or self.derive_richness_target(profile)
        texture_target = signals.get("textureTarget") or self.derive_texture_target(profile)
        cook_window = signals.get("cookWindow") or self.derive_cook_window(profile)
        meal_format = signals.get("mealFormat") or self.derive_meal_format(profile)
        selected_doneness = signals.get("doneness")
        cut_doneness = primary["cut"]["cooking"]["doneness"]
        alternative_text = (
            ", ".join(entry["cut"]["name"] for entry in top_cluster[1:3])
            if len(top_cluster) > 1
            else "No close alternatives this round"
        )

        executive_synopsis = (
            f"{primary['cut']['name']} is your top match for this round. "
            f"It aligns with your {flavor_target.lower()} flavor target, "
            f"{richness_target.lower()} richness preference, and "
            f"{texture_target.lower()} texture style while staying practical for your cooking lane."
        )
        executive_highlights = [
            f"Fit Class: {summary['primaryFit']}.",
            f"Cook Plan: {summary['bestCookingMatch']} ({cook_window.lower()}).",
            (
                f"Doneness Fit: target {selected_doneness}; cut sweet spot {cut_doneness}."
                if selected_doneness and selected_doneness != "Varies by cut"
                else f"Doneness Fit: cut sweet spot {cut_doneness}."
            ),
            f"Cuisine Fit: {signals['cuisineStyle']}."
            if signals.get("cuisineStyle") and signals.get("cuisineStyle") != "No specific cuisine"
            else "Cuisine Fit: Cross-cuisine flexibility.",
            self.get_skill_fit_text(signals),
            f"Service Style: {meal_format}.",
            f"Bench Strength: {alternative_text}.",
        ]

        fit_notes = self.build_fit_notes(
            profile,
            primary["cut"],
            summary,
            signals,
            has_close_alternatives,
            top_cluster,
        )

        quick_read = [
            ("Top Cut", primary["cut"]["name"]),
            ("Cook Method", summary["bestCookingMatch"]),
            (
                "Doneness",
                selected_doneness
                if selected_doneness and selected_doneness != "Varies by cut"
                else cut_doneness,
            ),
            (
                "Complexity",
                self.get_difficulty_scale_label(self.derive_cut_execution_scale(primary["cut"])["difficulty"]),
            ),
            (
                "Cuisine Fit",
                signals.get("cuisineStyle")
                if signals.get("cuisineStyle") and signals.get("cuisineStyle") != "No specific cuisine"
                else "Cross-cuisine",
            ),
            ("Best For", signals.get("occasionType") or "Flexible meal context"),
            ("Backups", ", ".join(entry["cut"]["name"] for entry in top_cluster[1:3]) or "See Levels 2-4"),
        ]

        cooking_profile = [
            ("Lead Option", primary["cut"]["name"]),
            ("Method", primary["cut"]["cooking"]["method"]),
            (
                "Your Doneness Target",
                selected_doneness if selected_doneness and selected_doneness != "Varies by cut" else "Varies by cut",
            ),
            ("Cut Sweet Spot", cut_doneness),
            ("Internal Temp", primary["cut"]["cooking"]["temp"]),
        ]
        if has_close_alternatives:
            cooking_profile.append(
                (
                    "Comparison Note",
                    "Use Level 1 to choose availability/price, then follow that cut's cooking profile.",
                )
            )
        cooking_profile.append(("Tip", primary["cut"]["cooking"]["note"]))

        def serialize_tier(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
            output = []
            for entry in entries:
                cut = entry["cut"]
                scale = self.derive_cut_execution_scale(cut)
                output.append(
                    {
                        "name": cut["name"],
                        "family": self.get_cut_family(cut),
                        "costTier": self.get_cost_tier(cut),
                        "difficulty": self.get_difficulty_scale_label(scale["difficulty"]),
                        "familiarity": self.get_familiarity_scale_label(scale["familiarity"]),
                        "equipment": self.get_equipment_scale_label(scale["equipment"]),
                    }
                )
            return output

        return {
            "primaryCut": primary["cut"],
            "summary": summary,
            "signals": signals,
            "profile": profile,
            "executiveSynopsis": executive_synopsis,
            "executiveHighlights": executive_highlights,
            "fitNotes": fit_notes,
            "quickRead": quick_read,
            "cookingProfile": cooking_profile,
            "tierTitles": tiers["titles"],
            "tiers": {
                "tier1": serialize_tier(tiers["tier1"]),
                "tier2": serialize_tier(tiers["tier2"]),
                "tier3": serialize_tier(tiers["tier3"]),
                "tier4": serialize_tier(tiers["tier4"]),
            },
            "tips": self.get_tips_for_cut(primary["cut"]),
        }
