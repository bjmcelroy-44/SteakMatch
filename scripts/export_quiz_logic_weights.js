const fs = require("fs");
const path = require("path");
const vm = require("vm");

const APP_JS_PATH = path.resolve(process.cwd(), "app.js");
const source = fs.readFileSync(APP_JS_PATH, "utf8");

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
  function effectValue(option, key) {
    if (!option.effects || typeof option.effects[key] !== "number") {
      return 0;
    }
    return option.effects[key];
  }

  function toVariant(id) {
    const match = id && id.match(/_([abc])$/);
    return match ? match[1].toUpperCase() : "A";
  }

  function buildTradeoffFlags(option) {
    const richness = effectValue(option, "richness");
    const tenderness = effectValue(option, "tenderness");
    const boldness = effectValue(option, "boldness");
    const adventure = effectValue(option, "adventure");
    const value = effectValue(option, "value");
    const precision = effectValue(option, "precision");

    const flags = [];
    if (value > 0 && richness < 0) flags.push("value_vs_richness");
    if (value > 0 && tenderness < 0) flags.push("value_vs_tenderness");
    if (richness > 0 && value < 0) flags.push("richness_vs_value");
    if (tenderness > 0 && value < 0) flags.push("tenderness_vs_value");
    if (boldness > 0 && tenderness < 0) flags.push("boldness_vs_tenderness");
    if (precision > 0 && value < 0) flags.push("precision_vs_value");
    if (adventure > 0 && precision < 0) flags.push("adventure_vs_precision");
    if (flags.length === 0) flags.push("none");
    return flags.join("|");
  }

  function buildRows(questionSource) {
    const rows = [];
    questionSource.forEach((question) => {
      const optionCount = Array.isArray(question.options) ? question.options.length : 0;
      for (let optionIndex = 0; optionIndex < optionCount; optionIndex += 1) {
        const option = question.options[optionIndex];
        const effects = option.effects || {};
        const signal = option.signal || {};
        const deltas = TRAITS.map((trait) => effectValue(option, trait.key));
        const deltaNet = deltas.reduce((sum, value) => sum + value, 0);
        const deltaAbs = deltas.reduce((sum, value) => sum + Math.abs(value), 0);

        rows.push({
          group: question.group || "",
          question_id: question.id || "",
          variant: toVariant(question.id || ""),
          type: question.type || "",
          prompt: question.prompt || "",
          option_order: optionIndex + 1,
          option_label: option.label || "",
          option_impact: option.impact || "",
          richness: effectValue(option, "richness"),
          tenderness: effectValue(option, "tenderness"),
          boldness: effectValue(option, "boldness"),
          adventure: effectValue(option, "adventure"),
          value: effectValue(option, "value"),
          precision: effectValue(option, "precision"),
          delta_net: deltaNet,
          delta_abs_total: deltaAbs,
          tradeoff_flags: buildTradeoffFlags(option),
          signal_keys: Object.keys(signal).join("|"),
          signal_json: JSON.stringify(signal),
        });
      }
    });
    return rows;
  }

  function canonicalQuestions() {
    const output = [];
    QUESTION_GROUPS.forEach((group) => {
      const preferred = QUESTION_POOL.find(
        (question) => question.group === group && /_a$/.test(question.id || "")
      );
      const fallback = QUESTION_POOL.find((question) => question.group === group);
      if (preferred) {
        output.push(preferred);
      } else if (fallback) {
        output.push(fallback);
      }
    });
    return output;
  }

  globalThis.__quizLogicRowsCanonical = buildRows(canonicalQuestions());
  globalThis.__quizLogicRowsFull = buildRows(QUESTION_POOL);
})();
`;

vm.runInContext(source + "\n" + extractProgram, context, { timeout: 20000 });

const canonicalRows = context.__quizLogicRowsCanonical || [];
const fullRows = context.__quizLogicRowsFull || [];

function csvEscape(value) {
  if (value === null || value === undefined) {
    return "";
  }
  const text = String(value).replace(/\r?\n/g, " ");
  if (/[",]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows) {
  if (!rows.length) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  });
  return lines.join("\n") + "\n";
}

const canonicalOutPath = path.resolve(process.cwd(), "quiz_logic_weights.csv");
const fullOutPath = path.resolve(process.cwd(), "quiz_logic_weights_full_pool.csv");

fs.writeFileSync(canonicalOutPath, toCsv(canonicalRows), "utf8");
fs.writeFileSync(fullOutPath, toCsv(fullRows), "utf8");

console.log(`Wrote ${canonicalOutPath} (${canonicalRows.length} rows)`);
console.log(`Wrote ${fullOutPath} (${fullRows.length} rows)`);
