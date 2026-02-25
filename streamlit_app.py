from __future__ import annotations

from html import escape
from pathlib import Path
from typing import Any

import streamlit as st

from server_engine import SelectionState, SteakSelectionEngine


APP_DIR = Path(__file__).parent
DATA_PATH = APP_DIR / "data" / "engine_data.json"


@st.cache_resource(show_spinner=False)
def get_engine() -> SteakSelectionEngine:
    return SteakSelectionEngine(DATA_PATH)


def inject_styles() -> None:
    st.markdown(
        """
        <style>
        :root {
            --bg-deep: #140f0d;
            --bg-mid: #2a1c18;
            --paper: #f4ecde;
            --paper-soft: #fbf6ee;
            --ink: #2a201a;
            --ink-soft: #5f4a3e;
            --accent: #8f1f2c;
            --accent-soft: #caa46a;
            --line: rgba(94, 64, 52, 0.26);
        }

        [data-testid="stAppViewContainer"] {
            background:
                radial-gradient(circle at 12% 4%, rgba(143, 31, 44, 0.20), transparent 36%),
                radial-gradient(circle at 94% 8%, rgba(202, 164, 106, 0.12), transparent 40%),
                linear-gradient(165deg, var(--bg-deep) 0%, #1e1512 58%, var(--bg-mid) 100%);
        }

        [data-testid="stHeader"] {
            background: transparent;
        }

        .block-container {
            max-width: 1040px;
            padding-top: 1.4rem;
            padding-bottom: 2rem;
        }

        .hero-card {
            border: 1px solid rgba(202, 164, 106, 0.32);
            border-radius: 16px;
            background: linear-gradient(150deg, #2a1c18 0%, #3b2822 100%);
            box-shadow: 0 18px 36px rgba(8, 7, 6, 0.34);
            padding: 1.4rem 1.45rem;
            margin-bottom: 1rem;
        }

        .hero-eyebrow {
            font-size: 0.74rem;
            letter-spacing: 0.10em;
            font-weight: 800;
            text-transform: uppercase;
            color: var(--accent-soft);
            margin-bottom: 0.3rem;
        }

        .hero-title {
            font-size: clamp(1.85rem, 4.8vw, 3rem);
            line-height: 1.0;
            font-weight: 900;
            letter-spacing: 0.03em;
            text-transform: uppercase;
            color: #f9f4ec;
            margin: 0;
        }

        .hero-copy {
            margin: 0.68rem 0 0;
            color: #f0e8dc;
            font-size: 1.02rem;
            max-width: 70ch;
        }

        .panel {
            background: var(--paper);
            color: var(--ink);
            border: 1px solid var(--line);
            border-radius: 16px;
            box-shadow: 0 16px 30px rgba(8, 7, 6, 0.22);
            padding: 1.05rem 1.1rem;
        }

        .panel h3 {
            margin: 0 0 0.35rem;
            color: #36261f;
            font-size: 1.15rem;
            line-height: 1.2;
        }

        .panel p {
            margin: 0.35rem 0 0;
            color: var(--ink-soft);
        }

        .question-meta {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.45rem;
        }

        .question-type {
            display: inline-block;
            padding: 0.22rem 0.56rem;
            border-radius: 999px;
            font-size: 0.73rem;
            font-weight: 800;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            background: rgba(143, 31, 44, 0.12);
            color: #6d1f29;
        }

        .info-dot {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.15rem;
            height: 1.15rem;
            border-radius: 999px;
            border: 1px solid rgba(143, 31, 44, 0.42);
            color: #6d1f29;
            font-size: 0.74rem;
            font-weight: 800;
            cursor: help;
            user-select: none;
        }

        .result-title {
            font-size: 2.1rem;
            line-height: 1.0;
            text-transform: uppercase;
            letter-spacing: 0.03em;
            font-weight: 900;
            color: #fbf6ee;
            margin: 0.15rem 0 0;
        }

        div[data-testid="stButton"] > button {
            border-radius: 12px;
            border: 1px solid #c7af8e;
            background: var(--paper-soft);
            color: var(--ink);
            font-weight: 700;
            min-height: 3rem;
            transition: all 140ms ease;
        }

        div[data-testid="stButton"] > button:hover {
            border-color: #8f1f2c;
            color: #8f1f2c;
        }

        div[data-testid="stButton"] > button[kind="primary"] {
            background: linear-gradient(132deg, #8f1f2c 0%, #b74a3a 100%);
            color: #fffdf8;
            border-color: #8f1f2c;
        }

        div[data-testid="stMarkdownContainer"] ul {
            margin-top: 0.35rem;
            margin-bottom: 0.25rem;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def init_session_state() -> None:
    defaults: dict[str, Any] = {
        "started": False,
        "finished": False,
        "dynamic_built": False,
        "current_question": 0,
        "question_set": [],
        "answers": [],
        "result": None,
        "selection_state": None,
        "question_history": [],
        "question_last_set": [],
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def start_assessment() -> None:
    engine = get_engine()
    selection_state = engine.create_selection_state(
        history=st.session_state.question_history,
        last_set=st.session_state.question_last_set,
    )
    intake_questions = engine.select_questions_for_groups(engine.intake_groups, selection_state)

    st.session_state.selection_state = selection_state
    st.session_state.question_set = intake_questions
    st.session_state.answers = [None] * len(intake_questions)
    st.session_state.current_question = 0
    st.session_state.dynamic_built = False
    st.session_state.finished = False
    st.session_state.result = None
    st.session_state.started = True


def maybe_build_dynamic_questions() -> None:
    if st.session_state.dynamic_built:
        return

    engine = get_engine()
    intake_count = len(engine.intake_groups)
    if len(st.session_state.answers) < intake_count:
        return
    if any(answer is None for answer in st.session_state.answers[:intake_count]):
        return

    selection_state = st.session_state.selection_state
    if not isinstance(selection_state, SelectionState):
        return

    dynamic_questions = engine.append_dynamic_questions(
        question_set=st.session_state.question_set,
        answers=st.session_state.answers,
        selection_state=selection_state,
    )

    if dynamic_questions:
        st.session_state.question_set = st.session_state.question_set + dynamic_questions
        st.session_state.answers = st.session_state.answers + [None] * len(dynamic_questions)

    st.session_state.dynamic_built = True
    next_history, last_set = engine.persist_selection_history(selection_state)
    st.session_state.question_history = next_history
    st.session_state.question_last_set = last_set


def finish_assessment() -> None:
    engine = get_engine()
    st.session_state.result = engine.recommend(
        question_set=st.session_state.question_set,
        answers=st.session_state.answers,
    )
    st.session_state.finished = True


def answer_question(question_index: int, option_index: int) -> None:
    if question_index >= len(st.session_state.answers):
        return

    st.session_state.answers[question_index] = option_index
    maybe_build_dynamic_questions()

    if question_index >= len(st.session_state.question_set) - 1:
        finish_assessment()
        return

    st.session_state.current_question = question_index + 1


def render_intro() -> None:
    st.markdown(
        """
        <div class="hero-card">
          <div class="hero-eyebrow">Beef Cut Analyzer</div>
          <h1 class="hero-title">Find Your Best Beef Cut</h1>
          <p class="hero-copy">
            Answer quick questions and get a clear recommendation with a fit brief,
            why it matches, cooking profile, level-based alternatives, and tips.
          </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown(
        """
        <div class="panel">
          <h3>How It Works</h3>
          <p>Short prompts. Fast selections. One clear recommendation every time.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.write("")
    st.button(
        "Start Beef Cut Analysis",
        type="primary",
        use_container_width=True,
        on_click=start_assessment,
    )


def render_question() -> None:
    engine = get_engine()
    question_set = st.session_state.question_set
    question_index = st.session_state.current_question

    if question_index >= len(question_set):
        finish_assessment()
        return

    question = question_set[question_index]
    total_questions = len(question_set) if st.session_state.dynamic_built else engine.max_question_count
    total_questions = max(total_questions, 1)
    progress = min((question_index + 1) / total_questions, 1.0)

    st.markdown(
        """
        <div class="hero-card">
          <div class="hero-eyebrow">Assessment In Progress</div>
          <h1 class="hero-title">Beef Cut Match</h1>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.caption(f"Question {question_index + 1} of {total_questions}")
    st.progress(progress)

    relevance_note = engine.get_question_relevance(question.get("group", ""))
    st.markdown(
        f"""
        <div class="question-meta">
          <span class="question-type">{escape(question.get("type", "Question"))}</span>
          <span class="info-dot" title="{escape(relevance_note)}">i</span>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown(f"### {question.get('prompt', 'Choose one option.')}")
    detail = (question.get("detail") or "").strip()
    if detail and detail.lower() != "pick one.":
        st.caption(detail)

    option_count = len(question.get("options", []))
    column_count = 2 if option_count > 2 else 1
    columns = st.columns(column_count, gap="small")

    for option_index, option in enumerate(question.get("options", [])):
        with columns[option_index % column_count]:
            st.button(
                option.get("label", f"Option {option_index + 1}"),
                key=f"q_{question_index}_o_{option_index}",
                use_container_width=True,
                on_click=answer_question,
                args=(question_index, option_index),
            )

    st.write("")
    st.button("Restart with a New Question Mix", on_click=start_assessment)


def dedupe_lines(lines: list[str]) -> list[str]:
    unique: list[str] = []
    seen: set[str] = set()
    for line in lines:
        cleaned = line.strip()
        if not cleaned or cleaned in seen:
            continue
        seen.add(cleaned)
        unique.append(cleaned)
    return unique


def render_levels(result: dict[str, Any]) -> None:
    tier_keys = ["tier1", "tier2", "tier3", "tier4"]
    tier_titles = result.get("tierTitles", {})
    tiers = result.get("tiers", {})

    for index, tier_key in enumerate(tier_keys, start=1):
        cuts = tiers.get(tier_key, [])
        title = tier_titles.get(tier_key, f"Level {index}")
        with st.expander(title, expanded=index == 1):
            if not cuts:
                st.write("No cuts available in this level.")
                continue
            for cut in cuts:
                st.markdown(
                    "- "
                    f"**{cut['name']}** | {cut['costTier']} | {cut['difficulty']} | "
                    f"{cut['familiarity']} | {cut['equipment']}"
                )


def render_results() -> None:
    result = st.session_state.result
    if not isinstance(result, dict):
        st.write("No result available. Start a new run.")
        st.button("Start Beef Cut Analysis", type="primary", on_click=start_assessment)
        return

    primary_cut = result.get("primaryCut", {})
    cut_name = primary_cut.get("name", "Recommended Cut")
    synopsis = result.get("executiveSynopsis", "")
    highlights = result.get("executiveHighlights", [])
    fit_notes = result.get("fitNotes", [])
    cooking_profile = result.get("cookingProfile", [])
    tips = result.get("tips", [])

    st.markdown(
        f"""
        <div class="hero-card">
          <div class="hero-eyebrow">Recommendation Ready</div>
          <p class="result-title">{escape(cut_name)}</p>
          <p class="hero-copy">{escape(synopsis)}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    fit_brief_lines = dedupe_lines([*highlights, *fit_notes])
    why_this_works = dedupe_lines(
        [
            line
            for line in fit_notes
            if line.startswith("Preference Match")
            or line.startswith("Core Alignment")
            or line.startswith("Best Cooking Lane")
            or line.startswith("Business Lens")
        ]
    )

    left_col, right_col = st.columns([1.4, 1], gap="large")

    with left_col:
        st.markdown("### Fit Brief")
        for line in fit_brief_lines:
            st.markdown(f"- {line}")

        st.markdown("### Why This Works")
        for line in why_this_works:
            st.markdown(f"- {line}")

        st.markdown("### Cooking Profile")
        for label, value in cooking_profile:
            st.markdown(f"- **{label}:** {value}")

    with right_col:
        st.markdown("### Cooking Tips and Tricks")
        for tip in tips:
            st.markdown(f"- {tip}")

    st.markdown("### Recommendation Levels")
    render_levels(result)

    st.write("")
    st.button(
        "Run Again with a New Question Mix",
        type="primary",
        use_container_width=True,
        on_click=start_assessment,
    )


def main() -> None:
    st.set_page_config(page_title="Beef Cut Fit Analyzer", layout="wide")
    inject_styles()
    init_session_state()

    if st.session_state.started and not st.session_state.question_set:
        start_assessment()

    if not st.session_state.started:
        render_intro()
        return
    if st.session_state.finished:
        render_results()
        return

    render_question()


if __name__ == "__main__":
    main()
