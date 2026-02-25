const fs = require("fs");
const path = require("path");
const vm = require("vm");

const appJsPath = path.resolve(process.cwd(), "app.js");
const source = fs.readFileSync(appJsPath, "utf8");

function createElementStub() {
  return {
    textContent: "",
    innerHTML: "",
    className: "",
    style: {},
    disabled: false,
    classList: {
      add() {},
      remove() {},
      contains() {
        return false;
      },
    },
    addEventListener() {},
    appendChild() {},
  };
}

const elementRegistry = new Map();
const documentStub = {
  getElementById(id) {
    if (!elementRegistry.has(id)) {
      elementRegistry.set(id, createElementStub());
    }
    return elementRegistry.get(id);
  },
  createElement() {
    return createElementStub();
  },
};

const localStorageStub = {
  store: new Map(),
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  },
  setItem(key, value) {
    this.store.set(key, String(value));
  },
  removeItem(key) {
    this.store.delete(key);
  },
};

const context = {
  console,
  document: documentStub,
  localStorage: localStorageStub,
  window: {},
  setTimeout,
  clearTimeout,
  Math,
  JSON,
  Array,
  Object,
  Set,
  Map,
  Date,
  Number,
  String,
  Boolean,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  Infinity,
  NaN,
};

vm.createContext(context);

const exportProgram = `
(() => {
  const signalValues = {};
  BASE_QUESTIONS.forEach((question) => {
    question.options.forEach((option) => {
      if (!option.signal) {
        return;
      }
      Object.entries(option.signal).forEach(([key, value]) => {
        if (!signalValues[key]) {
          signalValues[key] = new Set();
        }
        signalValues[key].add(value);
      });
    });
  });

  const adjustmentFns = {
    method: getMethodFitAdjustment,
    budget: getBudgetFitAdjustment,
    comfort: getComfortAdjustment,
    specialtyComfort: getSpecialtyFitAdjustment,
    advancedTechnique: getTechniqueFitAdjustment,
    buyPrecision: getBuyPrecisionFitAdjustment,
    guidanceLevel: getGuidanceFitAdjustment,
    priority: getPriorityFitAdjustment,
    substitution: getSubstitutionFitAdjustment,
    portionStyle: getPortionFitAdjustment,
    bonePreference: getBoneFitAdjustment,
    cookWindow: getCookWindowFitAdjustment,
    smokeLevel: getSmokeFitAdjustment,
    fatCapPreference: getFatCapFitAdjustment,
    seasoningIntent: getSeasoningIntentAdjustment,
    pairingStyle: getPairingFitAdjustment,
    mealFormat: getMealFormatFitAdjustment,
    occasionType: getOccasionFitAdjustment,
  };

  const cuisineValues = Array.from(signalValues.cuisineStyle || []);
  const mealFormatValues = Array.from(signalValues.mealFormat || []);
  const seasoningValues = Array.from(signalValues.seasoningStyle || []);

  function csvEscape(value) {
    if (value === null || value === undefined) {
      return "";
    }
    const text = String(value).replace(/\\r?\\n/g, " ");
    if (/[",]/.test(text)) {
      return '"' + text.replace(/"/g, '""') + '"';
    }
    return text;
  }

  function topValuesForCut(cut, signalKey, limit = 3) {
    const values = Array.from(signalValues[signalKey] || []);
    const fn = adjustmentFns[signalKey];
    if (!fn || values.length === 0) {
      return "";
    }
    return values
      .map((value) => ({ value, score: fn(cut, value) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.value + " (+" + item.score + ")")
      .join(" | ");
  }

  function topCuisineForCut(cut, limit = 3) {
    const scored = cuisineValues.map((cuisine) => {
      let bestScore = -Infinity;
      mealFormatValues.forEach((mealFormat) => {
        seasoningValues.forEach((seasoningStyle) => {
          const score = getCuisineFitAdjustment(cut, cuisine, mealFormat, seasoningStyle);
          if (score > bestScore) {
            bestScore = score;
          }
        });
      });
      return { cuisine, score: bestScore };
    });

    return scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.cuisine + " (+" + item.score + ")")
      .join(" | ");
  }

  function summarizeTopTriggers(cut) {
    const triggerCandidates = [];

    Object.entries(adjustmentFns).forEach(([key, fn]) => {
      const values = Array.from(signalValues[key] || []);
      values.forEach((value) => {
        const score = fn(cut, value);
        if (score > 0) {
          triggerCandidates.push({ key, value, score });
        }
      });
    });

    cuisineValues.forEach((cuisine) => {
      const score = getCuisineFitAdjustment(cut, cuisine, null, null);
      if (score > 0) {
        triggerCandidates.push({
          key: "cuisineStyle",
          value: cuisine,
          score,
        });
      }
    });

    return triggerCandidates
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.key + "=" + entry.value + " (+" + entry.score + ")")
      .join(" ; ");
  }

  function buildSelectionSummary(cut) {
    const method = topValuesForCut(cut, "method", 2);
    const expertise = topValuesForCut(cut, "comfort", 1) || topValuesForCut(cut, "specialtyComfort", 1);
    const budget = topValuesForCut(cut, "budget", 1);
    const cuisine = topCuisineForCut(cut, 1);
    const parts = [];

    if (method) {
      parts.push("Best when cooked via " + method.replace(/ \\(\\+\\d+\\)/g, ""));
    }
    if (expertise) {
      parts.push("Fits " + expertise.replace(/ \\(\\+\\d+\\)/g, "") + " familiarity");
    }
    if (budget) {
      parts.push("Aligns with " + budget.replace(/ \\(\\+\\d+\\)/g, "") + " budget");
    }
    if (cuisine) {
      parts.push("Strong in " + cuisine.replace(/ \\(\\+\\d+\\)/g, "") + " cuisine use");
    }

    if (parts.length === 0) {
      return cut.rationale || "Selected when overall profile similarity is highest.";
    }

    return parts.join(". ") + ".";
  }

  const headers = [
    "Cut ID",
    "Cut Name",
    "Family",
    "Cost Tier",
    "Richness (0-10)",
    "Tenderness (0-10)",
    "Beef Flavor / Boldness (0-10)",
    "Familiarity Needed (Adventure 0-10)",
    "Precision Needed (0-10)",
    "Value Orientation (0-10)",
    "Difficulty Scale",
    "Familiarity Scale",
    "Equipment Scale",
    "Top Method Triggers",
    "Top Budget Triggers",
    "Top Familiarity Triggers",
    "Top Cuisine Triggers",
    "Top Meal Context Triggers",
    "Top Side Plan Triggers",
    "Seasoning Intent Triggers",
    "Top Selection Signals",
    "Primary Cooking Method",
    "Doneness Guidance",
    "Temp Guidance",
    "Selection Summary",
  ];

  const rows = CUTS.map((cut) => {
    const scale = deriveCutExecutionScale(cut);

    const familiarityTriggers = [
      topValuesForCut(cut, "comfort", 2),
      topValuesForCut(cut, "specialtyComfort", 2),
      topValuesForCut(cut, "guidanceLevel", 2),
    ]
      .filter(Boolean)
      .join(" || ");

    const methodTriggers = [topValuesForCut(cut, "method", 3), topValuesForCut(cut, "advancedTechnique", 2)]
      .filter(Boolean)
      .join(" || ");

    return [
      cut.id,
      cut.name,
      getCutFamily(cut),
      getCostTier(cut),
      cut.profile.richness,
      cut.profile.tenderness,
      cut.profile.boldness,
      cut.profile.adventure,
      cut.profile.precision,
      cut.profile.value,
      getDifficultyScaleLabel(scale.difficulty),
      getFamiliarityScaleLabel(scale.familiarity),
      getEquipmentScaleLabel(scale.equipment),
      methodTriggers,
      topValuesForCut(cut, "budget", 3),
      familiarityTriggers,
      topCuisineForCut(cut, 3),
      topValuesForCut(cut, "occasionType", 3),
      topValuesForCut(cut, "pairingStyle", 3),
      topValuesForCut(cut, "seasoningIntent", 3),
      summarizeTopTriggers(cut),
      cut.cooking?.method || "",
      cut.cooking?.doneness || "",
      cut.cooking?.temp || "",
      buildSelectionSummary(cut),
    ];
  });

  const csv = [headers, ...rows]
    .map((row) => row.map(csvEscape).join(","))
    .join("\\n");

  globalThis.__cutMatrixCsv = csv;
})();
`;

vm.runInContext(source + "\n" + exportProgram, context, { timeout: 15000 });

const outputPath = path.resolve(process.cwd(), "cut_selection_matrix.csv");
fs.writeFileSync(outputPath, context.__cutMatrixCsv, "utf8");

console.log(`Wrote ${outputPath}`);
