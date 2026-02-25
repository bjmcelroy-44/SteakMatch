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

const extractProgram = `
(() => {
  function toArray(setObj) {
    return Array.from(setObj || []);
  }

  const data = {
    traits: TRAITS,
    questionPool: QUESTION_POOL,
    questionGroups: QUESTION_GROUPS,
    intakeGroups: INTAKE_GROUPS,
    commonDynamicGroups: COMMON_DYNAMIC_GROUPS,
    expertDynamicGroups: EXPERT_DYNAMIC_GROUPS,
    intermediateDynamicGroups: INTERMEDIATE_DYNAMIC_GROUPS,
    beginnerDynamicGroups: BEGINNER_DYNAMIC_GROUPS,
    cuisinePriorityGroups: CUISINE_PRIORITY_GROUPS,
    questionRelevanceNotes: QUESTION_RELEVANCE_NOTES,
    cuts: CUTS,
    cookingTipsDb: COOKING_TIPS_DB,
    sets: {
      specialtyCutIds: toArray(SPECIALTY_CUT_IDS),
      classicCutIds: toArray(CLASSIC_CUT_IDS),
      highPrecisionCutIds: toArray(HIGH_PRECISION_CUT_IDS),
      boneInCutIds: toArray(BONE_IN_CUT_IDS),
      smokeFriendlyCutIds: toArray(SMOKE_FRIENDLY_CUT_IDS),
      fatCapForwardCutIds: toArray(FAT_CAP_FORWARD_CUT_IDS),
      slicedBoardCutIds: toArray(SLICED_BOARD_CUT_IDS),
      premiumOccasionIds: toArray(PREMIUM_OCCASION_IDS),
      casualCrowdIds: toArray(CASUAL_CROWD_IDS),
      mexicanFocusIds: toArray(MEXICAN_FOCUS_IDS),
      italianFocusIds: toArray(ITALIAN_FOCUS_IDS),
      steakhouseFocusIds: toArray(STEAKHOUSE_FOCUS_IDS),
      bbqFocusIds: toArray(BBQ_FOCUS_IDS),
      asianQuickCookIds: toArray(ASIAN_QUICK_COOK_IDS),
    },
  };

  globalThis.__engineData = data;
})();
`;

vm.runInContext(source + "\n" + extractProgram, context, { timeout: 20000 });

const outputDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPath = path.join(outputDir, "engine_data.json");
fs.writeFileSync(outputPath, JSON.stringify(context.__engineData, null, 2), "utf8");
console.log(`Wrote ${outputPath}`);
