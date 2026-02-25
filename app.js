const TRAITS = [
  {
    key: "richness",
    label: "Richness",
    detail: "Preference for marbling and fat-driven mouthfeel.",
  },
  {
    key: "tenderness",
    label: "Tenderness",
    detail: "Desire for low-resistance, soft texture.",
  },
  {
    key: "boldness",
    label: "Bold Flavor",
    detail: "Preference for deep, beef-forward flavor intensity.",
  },
  {
    key: "adventure",
    label: "Adventure",
    detail: "Comfort with less-common cuts and techniques.",
  },
  {
    key: "value",
    label: "Value Focus",
    detail: "Importance of price-to-flavor efficiency.",
  },
  {
    key: "precision",
    label: "Precision",
    detail: "Interest in control-heavy cooking execution.",
  },
];

const BASE_QUESTIONS = [
  {
    type: "Flavor",
    prompt: "What flavor do you want?",
    detail: "Pick one.",
    options: [
      {
        label: "Clean",
        impact: "Mild",
        effects: { boldness: -2, tenderness: 1, richness: -1, precision: 1 },
        signal: { flavorTarget: "Clean / mild" },
      },
      {
        label: "Balanced",
        impact: "Balanced",
        effects: { boldness: 1, tenderness: 1 },
        signal: { flavorTarget: "Balanced" },
      },
      {
        label: "Bold",
        impact: "Bold",
        effects: { boldness: 2, richness: 1 },
        signal: { flavorTarget: "Bold / savory" },
      },
      {
        label: "Intense",
        impact: "Intense",
        effects: { boldness: 3, adventure: 1, precision: -1 },
        signal: { flavorTarget: "Intense / char-forward" },
      },
    ],
  },
  {
    type: "Richness",
    prompt: "How rich should it be?",
    detail: "Pick one.",
    options: [
      {
        label: "Lean",
        impact: "Lean",
        effects: { richness: -2, value: 1, precision: 1 },
        signal: { richnessTarget: "Lean" },
      },
      {
        label: "Moderate",
        impact: "Balanced",
        effects: { richness: 1, tenderness: 1 },
        signal: { richnessTarget: "Moderate" },
      },
      {
        label: "Rich",
        impact: "Rich",
        effects: { richness: 2, boldness: 1, value: -1 },
        signal: { richnessTarget: "Rich" },
      },
      {
        label: "Very rich",
        impact: "Very rich",
        effects: { richness: 3, boldness: 1, value: -2 },
        signal: { richnessTarget: "Very rich" },
      },
    ],
  },
  {
    type: "Texture",
    prompt: "What texture do you like?",
    detail: "Pick one.",
    options: [
      {
        label: "Very tender",
        impact: "Tender",
        effects: { tenderness: 3, precision: 1, boldness: -1 },
        signal: { textureTarget: "Very tender" },
      },
      {
        label: "Tender + bite",
        impact: "Balanced",
        effects: { tenderness: 1, boldness: 1 },
        signal: { textureTarget: "Balanced tenderness" },
      },
      {
        label: "Meaty chew",
        impact: "Firmer",
        effects: { boldness: 2, adventure: 1, tenderness: -1 },
        signal: { textureTarget: "Firmer chew" },
      },
      {
        label: "Thin-sliced",
        impact: "Slice-thin",
        effects: { value: 1, precision: 1, tenderness: -1, adventure: 1 },
        signal: { textureTarget: "Thin-sliced" },
      },
    ],
  },
  {
    type: "Method",
    prompt: "How will you cook it?",
    detail: "Pick one.",
    options: [
      {
        label: "High-heat grill",
        impact: "Char",
        effects: { boldness: 2, adventure: 1, precision: -1 },
        signal: { method: "High-heat grill" },
      },
      {
        label: "Pan sear",
        impact: "Controlled",
        effects: { precision: 2, tenderness: 1 },
        signal: { method: "Pan sear" },
      },
      {
        label: "Oven + sear",
        impact: "Two-stage",
        effects: { precision: 1, richness: 1, tenderness: 1 },
        signal: { method: "Oven roast + sear" },
      },
      {
        label: "Low and slow",
        impact: "Deep flavor",
        effects: { value: 1, boldness: 1, adventure: 1, tenderness: -1 },
        signal: { method: "Low-and-slow" },
      },
      {
        label: "Sous vide",
        impact: "Precise",
        effects: { precision: 3, tenderness: 1 },
        signal: { method: "Sous vide / precision" },
      },
    ],
  },
  {
    type: "Exploration",
    prompt: "Are you open to less-common cuts?",
    detail: "Pick one.",
    options: [
      {
        label: "Love them",
        impact: "High",
        effects: { adventure: 3, precision: 1 },
        signal: { comfort: "Very comfortable" },
      },
      {
        label: "Open to try",
        impact: "Moderate",
        effects: { adventure: 1 },
        signal: { comfort: "Somewhat comfortable" },
      },
      {
        label: "Neutral",
        impact: "Neutral",
        effects: {},
        signal: { comfort: "Neutral" },
      },
      {
        label: "Stay familiar",
        impact: "Low",
        effects: { adventure: -2, precision: 1 },
        signal: { comfort: "Prefer familiar cuts only" },
      },
      {
        label: "Need guidance",
        impact: "Guided",
        effects: { adventure: -1, precision: -1, value: 1 },
        signal: { comfort: "Need guidance / recipes" },
      },
    ],
  },
  {
    type: "Doneness",
    prompt: "How done do you like your beef?",
    detail: "Pick one.",
    options: [
      {
        label: "Rare / Med-rare",
        impact: "Lower endpoint",
        effects: { boldness: 1, richness: 1, precision: 1 },
        signal: { doneness: "Rare / Medium-rare" },
      },
      {
        label: "Medium",
        impact: "Balanced",
        effects: { tenderness: 1, precision: 1 },
        signal: { doneness: "Medium" },
      },
      {
        label: "Med-well / Well",
        impact: "Higher endpoint",
        effects: { value: 1, boldness: -1, richness: -1 },
        signal: { doneness: "Medium-well / Well done" },
      },
      {
        label: "Depends on cut",
        impact: "Varies",
        effects: { precision: 2, adventure: 1 },
        signal: { doneness: "Varies by cut" },
      },
    ],
  },
  {
    type: "Seasoning",
    prompt: "How do you season it?",
    detail: "Pick one.",
    options: [
      {
        label: "Salt + pepper",
        impact: "Simple",
        effects: { precision: 1, tenderness: 1 },
        signal: { seasoningStyle: "Salt + pepper" },
      },
      {
        label: "Butter + herbs",
        impact: "Baste",
        effects: { richness: 1, precision: 1 },
        signal: { seasoningStyle: "Butter + herbs" },
      },
      {
        label: "Dry rub or marinade",
        impact: "Layered",
        effects: { boldness: 1, adventure: 2, value: 1 },
        signal: { seasoningStyle: "Rub / marinade" },
      },
      {
        label: "Sauce-forward",
        impact: "Sauced",
        effects: { boldness: 1, value: 1, tenderness: -1 },
        signal: { seasoningStyle: "Sauce-forward" },
      },
    ],
  },
  {
    type: "Plating",
    prompt: "How do you want it served?",
    detail: "Pick one.",
    options: [
      {
        label: "Solo steak",
        impact: "Compact",
        effects: { tenderness: 1, precision: 1, richness: -1 },
        signal: { portionStyle: "6-8 oz single steak" },
      },
      {
        label: "Steakhouse plate",
        impact: "Classic",
        effects: { boldness: 1, richness: 1 },
        signal: { portionStyle: "8-12 oz steakhouse cut" },
      },
      {
        label: "Shareable sliced",
        impact: "Shareable",
        effects: { value: 1, boldness: 1, adventure: 1 },
        signal: { portionStyle: "Large shareable sliced cut" },
      },
      {
        label: "Handheld cookout",
        impact: "Handheld",
        effects: { value: 3, boldness: 1, tenderness: 1, adventure: -1, precision: -1 },
        signal: { portionStyle: "Handheld cookout style" },
      },
      {
        label: "Tacos / bowls",
        impact: "Pre-sliced",
        effects: { value: 2, adventure: 1, richness: -1 },
        signal: { portionStyle: "Thin-sliced applications" },
      },
    ],
  },
  {
    type: "Budget",
    prompt: "What budget fits this meal best?",
    detail: "Pick one.",
    options: [
      {
        label: "Premium",
        impact: "Premium",
        effects: { value: -3, tenderness: 1, richness: 1 },
        signal: { budget: "Premium / no strict limit" },
      },
      {
        label: "Mid-premium",
        impact: "Selective",
        effects: { value: -1, richness: 1, tenderness: 1 },
        signal: { budget: "Mid-premium" },
      },
      {
        label: "Balanced",
        impact: "Balanced",
        effects: { value: 1, precision: 1 },
        signal: { budget: "Moderate" },
      },
      {
        label: "Value",
        impact: "Value",
        effects: { value: 3, boldness: 1, adventure: 1 },
        signal: { budget: "Value-focused" },
      },
      {
        label: "Lowest cost",
        impact: "Low cost",
        effects: { value: 4, boldness: 1, tenderness: -1 },
        signal: { budget: "Lowest-cost options first" },
      },
    ],
  },
  {
    type: "Priority",
    prompt: "What matters most to you?",
    detail: "Pick one.",
    options: [
      {
        label: "Eating quality",
        impact: "Quality",
        effects: { tenderness: 1, richness: 1, value: -1 },
        signal: { priority: "Best eating quality" },
      },
      {
        label: "Best value",
        impact: "Value",
        effects: { value: 2, boldness: 1 },
        signal: { priority: "Best value" },
      },
      {
        label: "Consistency",
        impact: "Consistency",
        effects: { precision: 2, tenderness: 1 },
        signal: { priority: "Best consistency" },
      },
      {
        label: "Method fit",
        impact: "Method",
        effects: { precision: 1, adventure: 1, boldness: 1 },
        signal: { priority: "Best fit for the cooking method" },
      },
    ],
  },
  {
    type: "Backup Plan",
    prompt: "If your cut is sold out, what do you do?",
    detail: "Pick one.",
    options: [
      {
        label: "Pick closest match",
        impact: "Performance",
        effects: { precision: 1, adventure: 1 },
        signal: { substitution: "Moderate (performance-based)" },
      },
      {
        label: "Pick best value swap",
        impact: "Value",
        effects: { value: 2, adventure: 1 },
        signal: { substitution: "High (cost-based)" },
      },
      {
        label: "Use my backup list",
        impact: "Limited",
        effects: { precision: 1, adventure: -1 },
        signal: { substitution: "Limited" },
      },
      {
        label: "Wait for exact cut",
        impact: "Exact",
        effects: { precision: 1, adventure: -2 },
        signal: { substitution: "Low (exact cuts only)" },
      },
    ],
  },
  {
    type: "Bone",
    prompt: "Bone-in, boneless, or either?",
    detail: "Pick one.",
    options: [
      {
        label: "Boneless",
        impact: "Boneless",
        effects: { tenderness: 1, precision: 1, adventure: -1 },
        signal: { bonePreference: "Boneless" },
      },
      {
        label: "Bone-in",
        impact: "Bone-in",
        effects: { boldness: 1, richness: 1, adventure: 1 },
        signal: { bonePreference: "Bone-in" },
      },
      {
        label: "Either",
        impact: "Either",
        effects: {},
        signal: { bonePreference: "Either" },
      },
    ],
  },
  {
    type: "Time",
    prompt: "How much time do you have to cook?",
    detail: "Pick one.",
    options: [
      {
        label: "10-15 min",
        impact: "Fast",
        effects: { value: 1, precision: -1, adventure: -1, tenderness: 1 },
        signal: { cookWindow: "10-15 minutes" },
      },
      {
        label: "20-30 min",
        impact: "Standard",
        effects: { precision: 1 },
        signal: { cookWindow: "20-30 minutes" },
      },
      {
        label: "30-45 min",
        impact: "Extended",
        effects: { precision: 1, boldness: 1 },
        signal: { cookWindow: "30-45 minutes" },
      },
      {
        label: "45+ min project",
        impact: "Project",
        effects: { precision: 2, adventure: 1, boldness: 1, value: -1 },
        signal: { cookWindow: "45+ minute project" },
      },
    ],
  },
  {
    type: "Smoke",
    prompt: "How much smoke flavor do you want?",
    detail: "Pick one.",
    options: [
      {
        label: "None",
        impact: "No smoke",
        effects: { precision: 1, tenderness: 1, boldness: -1 },
        signal: { smokeLevel: "None" },
      },
      {
        label: "Light",
        impact: "Light smoke",
        effects: { boldness: 1 },
        signal: { smokeLevel: "Light" },
      },
      {
        label: "Medium",
        impact: "Medium smoke",
        effects: { boldness: 1, adventure: 1 },
        signal: { smokeLevel: "Medium" },
      },
      {
        label: "Heavy",
        impact: "Heavy smoke",
        effects: { boldness: 2, adventure: 1, richness: 1 },
        signal: { smokeLevel: "Heavy" },
      },
    ],
  },
  {
    type: "Fat Cap",
    prompt: "How do you feel about fat cap?",
    detail: "Pick one.",
    options: [
      {
        label: "Trim it off",
        impact: "Lean-first",
        effects: { richness: -2, value: 1 },
        signal: { fatCapPreference: "Trimmed lean" },
      },
      {
        label: "A little is fine",
        impact: "Some fat",
        effects: { richness: -1 },
        signal: { fatCapPreference: "Some fat edge" },
      },
      {
        label: "I like it",
        impact: "Enjoy fat cap",
        effects: { richness: 1, boldness: 1 },
        signal: { fatCapPreference: "Like fat cap" },
      },
      {
        label: "Love fat cap",
        impact: "Fat-forward",
        effects: { richness: 2, boldness: 1, value: -1 },
        signal: { fatCapPreference: "Love fat cap" },
      },
    ],
  },
  {
    type: "Chew",
    prompt: "How much chew do you like?",
    detail: "Pick one.",
    options: [
      {
        label: "Very soft",
        impact: "Soft",
        effects: { tenderness: 2, boldness: -1 },
        signal: { chewTolerance: "Very tender only" },
      },
      {
        label: "Balanced chew",
        impact: "Balanced",
        effects: { tenderness: 1, boldness: 1 },
        signal: { chewTolerance: "Balanced chew" },
      },
      {
        label: "Meaty chew",
        impact: "Chewy",
        effects: { boldness: 2, tenderness: -1, adventure: 1 },
        signal: { chewTolerance: "Pronounced chew" },
      },
      {
        label: "Chew doesn't matter",
        impact: "Flexible",
        effects: { value: 1, adventure: 1 },
        signal: { chewTolerance: "Chew-flexible" },
      },
    ],
  },
  {
    type: "Format",
    prompt: "How will you eat it?",
    detail: "Pick one.",
    options: [
      {
        label: "Knife-and-fork steak",
        impact: "Plated",
        effects: { tenderness: 1, precision: 1 },
        signal: { mealFormat: "Plated steak" },
      },
      {
        label: "Sliced board style",
        impact: "Sliced",
        effects: { boldness: 1, adventure: 1, value: 1 },
        signal: { mealFormat: "Sliced board" },
      },
      {
        label: "Tacos / bowls",
        impact: "Prep format",
        effects: { value: 2, adventure: 1, richness: -1 },
        signal: { mealFormat: "Tacos / bowls" },
      },
      {
        label: "Sandwich / bun",
        impact: "Handheld",
        effects: { value: 2, tenderness: 1, adventure: -1 },
        signal: { mealFormat: "Sandwich / bun" },
      },
    ],
  },
  {
    type: "Leftovers",
    prompt: "Any leftovers planned?",
    detail: "Pick one.",
    options: [
      {
        label: "No leftovers",
        impact: "Single meal",
        effects: { tenderness: 1, precision: 1, value: -1 },
        signal: { leftoversPlan: "No leftovers" },
      },
      {
        label: "Next-day lunch",
        impact: "One extra meal",
        effects: { value: 1, boldness: 1 },
        signal: { leftoversPlan: "Next-day lunch" },
      },
      {
        label: "2-3 meal prep",
        impact: "Meal prep",
        effects: { value: 2, precision: 1 },
        signal: { leftoversPlan: "2-3 meal prep" },
      },
      {
        label: "Batch / freezer",
        impact: "Batch",
        effects: { value: 3, boldness: 1, tenderness: -1 },
        signal: { leftoversPlan: "Batch / freezer" },
      },
    ],
  },
  {
    type: "Occasion",
    prompt: "What is this meal for?",
    detail: "Pick one.",
    options: [
      {
        label: "Weeknight dinner",
        impact: "Routine",
        effects: { value: 1, precision: 1 },
        signal: { occasionType: "Weeknight dinner" },
      },
      {
        label: "Date night",
        impact: "Premium",
        effects: { richness: 1, tenderness: 1, value: -1 },
        signal: { occasionType: "Date night" },
      },
      {
        label: "Hosting guests",
        impact: "Entertaining",
        effects: { boldness: 1, precision: 1 },
        signal: { occasionType: "Hosting guests" },
      },
      {
        label: "Game day / BBQ",
        impact: "Casual crowd",
        effects: { boldness: 1, value: 1, adventure: 1 },
        signal: { occasionType: "Game day / BBQ" },
      },
    ],
  },
  {
    type: "Crust",
    prompt: "How much crust do you want?",
    detail: "Pick one.",
    options: [
      {
        label: "Light sear",
        impact: "Light",
        effects: { tenderness: 1, precision: 1, boldness: -1 },
        signal: { crustLevel: "Light sear" },
      },
      {
        label: "Dark crust",
        impact: "Dark",
        effects: { boldness: 1, precision: 1 },
        signal: { crustLevel: "Dark crust" },
      },
      {
        label: "Hard char",
        impact: "Char-forward",
        effects: { boldness: 2, adventure: 1, precision: -1 },
        signal: { crustLevel: "Hard char" },
      },
      {
        label: "No crust focus",
        impact: "Neutral",
        effects: { value: 1 },
        signal: { crustLevel: "No crust focus" },
      },
    ],
  },
  {
    type: "Routine",
    prompt: "How often do you buy beef?",
    detail: "Pick one.",
    options: [
      {
        label: "Monthly",
        impact: "Low frequency",
        effects: { value: -1, precision: 1 },
        signal: { routineStyle: "Monthly" },
      },
      {
        label: "Weekly",
        impact: "Regular",
        effects: { value: 1 },
        signal: { routineStyle: "Weekly" },
      },
      {
        label: "2-3 times/week",
        impact: "High frequency",
        effects: { value: 2, precision: 1 },
        signal: { routineStyle: "2-3 times/week" },
      },
      {
        label: "Special treat only",
        impact: "Occasional premium",
        effects: { richness: 1, tenderness: 1, value: -1 },
        signal: { routineStyle: "Special treat" },
      },
    ],
  },
  {
    type: "Pairing",
    prompt: "What side style do you like?",
    detail: "Pick one.",
    options: [
      {
        label: "Rich sides",
        impact: "Balance rich plate",
        effects: { richness: -1, value: 1 },
        signal: { pairingStyle: "Rich sides" },
      },
      {
        label: "Light sides",
        impact: "Lean plate",
        effects: { richness: 1, boldness: 1 },
        signal: { pairingStyle: "Light sides" },
      },
      {
        label: "Sauce-heavy sides",
        impact: "Sauce pairing",
        effects: { boldness: 1, value: 1 },
        signal: { pairingStyle: "Sauce-heavy sides" },
      },
      {
        label: "Minimal sides",
        impact: "Meat-forward",
        effects: { boldness: 1, richness: 1, adventure: 1 },
        signal: { pairingStyle: "Minimal sides" },
      },
    ],
  },
];

const QUESTION_GROUPS = [
  "flavor",
  "richness",
  "texture",
  "method",
  "comfort",
  "doneness",
  "seasoning",
  "portion",
  "budget",
  "priority",
  "flexibility",
  "bone",
  "cook_window",
  "smoke",
  "fat_cap",
  "chew",
  "meal_format",
  "leftovers",
  "occasion",
  "crust",
  "routine",
  "pairing",
];

const ALT_QUESTION_COPY = {
  flavor: {
    type: "Flavor",
    prompt: "What flavor do you want?",
    detail: "Pick one.",
  },
  richness: {
    type: "Richness",
    prompt: "How rich should it be?",
    detail: "Pick one.",
  },
  texture: {
    type: "Texture",
    prompt: "What texture do you like?",
    detail: "Pick one.",
  },
  method: {
    type: "Method",
    prompt: "How will you cook it?",
    detail: "Pick one.",
  },
  comfort: {
    type: "Cut Comfort",
    prompt: "Are you open to lesser-known cuts?",
    detail: "Pick one.",
  },
  doneness: {
    type: "Doneness",
    prompt: "How done do you like your beef?",
    detail: "Pick one.",
  },
  seasoning: {
    type: "Seasoning",
    prompt: "How do you season it?",
    detail: "Pick one.",
  },
  portion: {
    type: "Plating",
    prompt: "How do you want it served?",
    detail: "Pick one.",
  },
  budget: {
    type: "Budget",
    prompt: "What budget fits this meal best?",
    detail: "Pick one.",
  },
  priority: {
    type: "Priority",
    prompt: "What matters most to you?",
    detail: "Pick one.",
  },
  flexibility: {
    type: "Backup Plan",
    prompt: "If your cut is sold out, what do you do?",
    detail: "Pick one.",
  },
  bone: {
    type: "Bone",
    prompt: "Bone-in, boneless, or either?",
    detail: "Pick one.",
  },
  cook_window: {
    type: "Cook Time",
    prompt: "How much time do you have to cook?",
    detail: "Pick one.",
  },
  smoke: {
    type: "Smoke",
    prompt: "How much smoke flavor do you want?",
    detail: "Pick one.",
  },
  fat_cap: {
    type: "Fat Cap",
    prompt: "How do you feel about fat cap?",
    detail: "Pick one.",
  },
  chew: {
    type: "Chew",
    prompt: "How much chew do you like?",
    detail: "Pick one.",
  },
  meal_format: {
    type: "Format",
    prompt: "How will you eat it?",
    detail: "Pick one.",
  },
  leftovers: {
    type: "Leftovers",
    prompt: "Any leftovers planned?",
    detail: "Pick one.",
  },
  occasion: {
    type: "Occasion",
    prompt: "What is this meal for?",
    detail: "Pick one.",
  },
  crust: {
    type: "Crust",
    prompt: "How much crust do you want?",
    detail: "Pick one.",
  },
  routine: {
    type: "Routine",
    prompt: "How often do you buy beef?",
    detail: "Pick one.",
  },
  pairing: {
    type: "Pairing",
    prompt: "What side style do you like?",
    detail: "Pick one.",
  },
};

const ALT_QUESTION_COPY_2 = {
  flavor: {
    type: "Flavor Mood",
    prompt: "What beef flavor are you after?",
    detail: "Pick one.",
  },
  richness: {
    type: "Richness Mood",
    prompt: "How much richness do you want?",
    detail: "Pick one.",
  },
  texture: {
    type: "Texture Mood",
    prompt: "What bite do you want?",
    detail: "Pick one.",
  },
  method: {
    type: "Heat Plan",
    prompt: "How will you cook it?",
    detail: "Pick one.",
  },
  comfort: {
    type: "Exploration",
    prompt: "Are you open to less-common cuts?",
    detail: "Pick one.",
  },
  doneness: {
    type: "Finish",
    prompt: "How done do you like your beef?",
    detail: "Pick one.",
  },
  seasoning: {
    type: "Flavor Build",
    prompt: "How do you season it?",
    detail: "Pick one.",
  },
  portion: {
    type: "Serve",
    prompt: "How do you want it served?",
    detail: "Pick one.",
  },
  budget: {
    type: "Spend",
    prompt: "What budget fits this meal best?",
    detail: "Pick one.",
  },
  priority: {
    type: "Driver",
    prompt: "What matters most to you?",
    detail: "Pick one.",
  },
  flexibility: {
    type: "Plan B",
    prompt: "If your cut is sold out, what do you do?",
    detail: "Pick one.",
  },
  bone: {
    type: "Bone",
    prompt: "Bone-in, boneless, or either?",
    detail: "Pick one.",
  },
  cook_window: {
    type: "Time",
    prompt: "How much time do you have to cook?",
    detail: "Pick one.",
  },
  smoke: {
    type: "BBQ",
    prompt: "How much smoke flavor do you want?",
    detail: "Pick one.",
  },
  fat_cap: {
    type: "Fat",
    prompt: "How do you feel about fat cap?",
    detail: "Pick one.",
  },
  chew: {
    type: "Bite",
    prompt: "How much chew do you like?",
    detail: "Pick one.",
  },
  meal_format: {
    type: "Format",
    prompt: "How will you eat it?",
    detail: "Pick one.",
  },
  leftovers: {
    type: "Leftovers",
    prompt: "Any leftovers planned?",
    detail: "Pick one.",
  },
  occasion: {
    type: "Occasion",
    prompt: "What is this meal for?",
    detail: "Pick one.",
  },
  crust: {
    type: "Crust",
    prompt: "How much crust do you want?",
    detail: "Pick one.",
  },
  routine: {
    type: "Cadence",
    prompt: "How often do you buy beef?",
    detail: "Pick one.",
  },
  pairing: {
    type: "Sides",
    prompt: "What side style do you like?",
    detail: "Pick one.",
  },
};

const QUESTION_POOL = BASE_QUESTIONS.flatMap((question, index) => {
  const group = QUESTION_GROUPS[index];
  const altCopy = ALT_QUESTION_COPY[group];
  const altCopy2 = ALT_QUESTION_COPY_2[group];

  return [
    { ...question, id: `${group}_a`, group },
    {
      ...question,
      id: `${group}_b`,
      group,
      type: altCopy.type,
      prompt: altCopy.prompt,
      detail: altCopy.detail,
    },
    {
      ...question,
      id: `${group}_c`,
      group,
      type: altCopy2.type,
      prompt: altCopy2.prompt,
      detail: altCopy2.detail,
    },
  ];
});

const QUESTION_HISTORY_KEY = "beef_cut_fit_question_history_v1";
const QUESTION_LAST_SET_KEY = "beef_cut_fit_last_set_v1";
const ASSESSMENT_QUESTION_COUNT = QUESTION_GROUPS.length;

const CUTS = [
  {
    id: "ribeye",
    name: "Ribeye",
    tagline: "High-marbling benchmark with broad consumer acceptance.",
    rationale:
      "Ribeye is appropriate when the profile prioritizes marbling, savory persistence, and forgiving cookability.",
    profile: {
      richness: 9,
      tenderness: 7,
      boldness: 9,
      adventure: 4,
      value: 2,
      precision: 4,
    },
    imps: [
      "112A - Beef Rib, Ribeye Roll, Lip-On, Boneless",
      "1112C - Beef Rib, Ribeye Steak, Boneless",
    ],
    cooking: {
      method: "High-heat sear with optional controlled finishing",
      doneness: "Medium-rare",
      temp: "130-135F final internal temperature",
      note: "Rest 5-8 minutes before slicing.",
    },
  },
  {
    id: "ribeye_cap",
    name: "Ribeye Cap",
    tagline: "Elite richness concentration with premium tenderness.",
    rationale:
      "Ribeye cap performs best for users with maximal richness preference and low price sensitivity.",
    profile: {
      richness: 10,
      tenderness: 8,
      boldness: 9,
      adventure: 7,
      value: 1,
      precision: 3,
    },
    imps: [
      "112D - Beef Rib, Ribeye Cap, Boneless",
      "1112D - Beef Rib, Ribeye Cap Steak, Boneless",
    ],
    cooking: {
      method: "Rapid high-heat sear to preserve internal fat quality",
      doneness: "Rare to medium-rare",
      temp: "125-133F final internal temperature",
      note: "Avoid prolonged finishing to prevent fat washout.",
    },
  },
  {
    id: "strip",
    name: "New York Strip",
    tagline: "Structured steakhouse texture with high flavor clarity.",
    rationale:
      "Strip loin is a strong fit for balanced users seeking flavor definition and moderate marbling.",
    profile: {
      richness: 6,
      tenderness: 6,
      boldness: 8,
      adventure: 3,
      value: 4,
      precision: 6,
    },
    imps: [
      "180 - Beef Loin, Strip Loin, Boneless",
      "1180 - Beef Loin, Strip Loin Steak, Boneless",
    ],
    cooking: {
      method: "Cast-iron or grill with two-zone finishing",
      doneness: "Medium-rare to medium",
      temp: "132-140F final internal temperature",
      note: "Trim or score external fat edge to reduce flare-up risk.",
    },
  },
  {
    id: "bone_in_strip",
    name: "Bone-In Strip",
    tagline: "Classic strip character with bone-in presentation.",
    rationale:
      "Bone-in strip aligns with traditionalist profiles wanting a defined steakhouse format and stronger plate identity.",
    profile: {
      richness: 6,
      tenderness: 6,
      boldness: 8,
      adventure: 4,
      value: 4,
      precision: 5,
    },
    imps: [
      "1179 - Beef Loin, Strip Loin, Bone-In",
      "1179A - Beef Loin, Strip Loin Steak, Bone-In",
    ],
    cooking: {
      method: "Sear direct heat then finish indirect",
      doneness: "Medium-rare to medium",
      temp: "132-140F final internal temperature",
      note: "Account for slower thermal rise adjacent to bone.",
    },
  },
  {
    id: "strip_filet_split",
    name: "Strip Filet",
    tagline: "Less common strip derivative with tighter portion geometry.",
    rationale:
      "This format fits precision-driven users who want strip flavor with refined portioning.",
    profile: {
      richness: 5,
      tenderness: 7,
      boldness: 7,
      adventure: 6,
      value: 3,
      precision: 7,
    },
    imps: [
      "1180B - Beef Loin, Strip Loin Steak, Boneless, Center-Cut, Split",
    ],
    cooking: {
      method: "Controlled sear with close temperature tracking",
      doneness: "Medium-rare",
      temp: "130-136F final internal temperature",
      note: "Smaller muscle geometry can overcook quickly.",
    },
  },
  {
    id: "filet_mignon",
    name: "Filet Mignon",
    tagline: "Maximum tenderness with lower fat intensity.",
    rationale:
      "Tenderloin is indicated when tenderness and precision outrank maximal beef intensity.",
    profile: {
      richness: 3,
      tenderness: 10,
      boldness: 4,
      adventure: 2,
      value: 1,
      precision: 9,
    },
    imps: [
      "190 - Beef Loin, Tenderloin, Side Muscle Off, Defatted",
      "1190 - Beef Loin, Tenderloin Steak, Side Muscle Off, Defatted",
    ],
    cooking: {
      method: "Pan sear then oven finish",
      doneness: "Rare to medium-rare",
      temp: "125-132F final internal temperature",
      note: "Low intramuscular fat demands strict temperature discipline.",
    },
  },
  {
    id: "porterhouse",
    name: "Porterhouse",
    tagline: "Dual-muscle premium format combining strip and tenderloin.",
    rationale:
      "Porterhouse suits profiles that want high occasion value and dual-texture presentation.",
    profile: {
      richness: 7,
      tenderness: 8,
      boldness: 8,
      adventure: 5,
      value: 2,
      precision: 6,
    },
    imps: ["1173 - Beef Loin, Porterhouse Steak, Bone-In"],
    cooking: {
      method: "Two-zone grill or reverse sear",
      doneness: "Medium-rare",
      temp: "130-136F final internal temperature",
      note: "Manage doneness asymmetry between strip and tenderloin sections.",
    },
  },
  {
    id: "t_bone",
    name: "T-Bone",
    tagline: "Classic bone-in composite steak with balanced character.",
    rationale:
      "T-bone aligns with users who value tradition, visual impact, and mixed texture.",
    profile: {
      richness: 6,
      tenderness: 7,
      boldness: 8,
      adventure: 4,
      value: 3,
      precision: 6,
    },
    imps: ["1174 - Beef Loin, T-Bone Steak, Bone-In"],
    cooking: {
      method: "Direct/indirect hybrid grilling",
      doneness: "Medium-rare to medium",
      temp: "132-138F final internal temperature",
      note: "Rotate regularly to moderate edge overcooking.",
    },
  },
  {
    id: "top_sirloin",
    name: "Top Sirloin",
    tagline: "Reliable utility steak with strong cost efficiency.",
    rationale:
      "Top sirloin supports value-aware profiles needing repeatable performance across cooking methods.",
    profile: {
      richness: 5,
      tenderness: 6,
      boldness: 7,
      adventure: 3,
      value: 7,
      precision: 6,
    },
    imps: [
      "184 - Beef Loin, Top Sirloin Butt, Boneless",
      "1184 - Beef Loin, Top Sirloin Butt Steak, Boneless",
    ],
    cooking: {
      method: "Direct grill or cast-iron sear",
      doneness: "Medium-rare to medium",
      temp: "133-142F final internal temperature",
      note: "Dry-brine improves consistency and surface browning.",
    },
  },
  {
    id: "baseball_cut",
    name: "Baseball Sirloin",
    tagline: "Thick center-cut sirloin with improved tenderness perception.",
    rationale:
      "Baseball-cut top sirloin matches users wanting sirloin value with elevated plate format.",
    profile: {
      richness: 5,
      tenderness: 7,
      boldness: 7,
      adventure: 6,
      value: 6,
      precision: 7,
    },
    imps: [
      "184F - Beef Loin, Top Sirloin Butt, Center-Cut, Cap Off, Boneless",
      "1184F - Beef Loin, Top Sirloin Butt Steak, Center-Cut, Boneless",
    ],
    cooking: {
      method: "Sear then finish to target center",
      doneness: "Medium-rare",
      temp: "130-137F final internal temperature",
      note: "Thickness benefits from reverse sear workflow.",
    },
  },
  {
    id: "coulotte",
    name: "Picanha",
    tagline: "Cap-driven richness with strong beef identity.",
    rationale:
      "Coulotte fits exploratory diners who value fat-cap rendering and robust slicing service.",
    profile: {
      richness: 6,
      tenderness: 6,
      boldness: 8,
      adventure: 7,
      value: 6,
      precision: 4,
    },
    imps: [
      "184D - Beef Loin, Top Sirloin Butt, Cap, Boneless",
      "1184D - Beef Loin, Top Sirloin Cap Steak, Boneless",
    ],
    cooking: {
      method: "Skewer/grill or reverse sear whole then slice",
      doneness: "Medium-rare",
      temp: "130-137F final internal temperature",
      note: "Render cap gradually before final high-heat crusting.",
    },
  },
  {
    id: "tri_tip",
    name: "Tri-Tip",
    tagline: "High flavor throughput with excellent serving flexibility.",
    rationale:
      "Tri-tip supports value-performance profiles and large-format sliced service.",
    profile: {
      richness: 5,
      tenderness: 6,
      boldness: 8,
      adventure: 5,
      value: 7,
      precision: 5,
    },
    imps: [
      "185C - Beef Loin, Bottom Sirloin Butt, Tri-Tip, Boneless",
      "1185C - Beef Loin, Bottom Sirloin Butt, Tri-Tip Steak, Boneless",
    ],
    cooking: {
      method: "Reverse sear or Santa Maria-style live fire",
      doneness: "Medium-rare",
      temp: "130-137F final internal temperature",
      note: "Slice across changing grain directions to maintain tenderness.",
    },
  },
  {
    id: "sirloin_flap",
    name: "Bavette",
    tagline: "Underutilized cut with high flavor density.",
    rationale:
      "Sirloin flap is ideal for adventurous users prioritizing flavor intensity and value.",
    profile: {
      richness: 5,
      tenderness: 5,
      boldness: 9,
      adventure: 8,
      value: 7,
      precision: 4,
    },
    imps: ["1185A - Beef Loin, Bottom Sirloin Butt, Flap Steak, Boneless"],
    cooking: {
      method: "Very hot, fast sear with immediate slicing",
      doneness: "Rare to medium-rare",
      temp: "124-132F final internal temperature",
      note: "Mandatory grain-aware slicing for tenderness optimization.",
    },
  },
  {
    id: "ball_tip",
    name: "Ball Tip Steak",
    tagline: "Lean sirloin derivative with solid value utility.",
    rationale:
      "Ball tip matches efficient buyers seeking lower-fat steak format with acceptable chew.",
    profile: {
      richness: 4,
      tenderness: 5,
      boldness: 7,
      adventure: 6,
      value: 8,
      precision: 5,
    },
    imps: ["1185B - Beef Loin, Bottom Sirloin Butt, Ball Tip Steak, Boneless"],
    cooking: {
      method: "Quick sear or marinated grill",
      doneness: "Medium-rare to medium",
      temp: "132-140F final internal temperature",
      note: "Benefits from resting and thin slicing.",
    },
  },
  {
    id: "flat_iron",
    name: "Flat Iron",
    tagline: "High tenderness-to-price ratio with strong flavor.",
    rationale:
      "Flat iron is a high-performing recommendation for users balancing tenderness, flavor, and value.",
    profile: {
      richness: 6,
      tenderness: 8,
      boldness: 8,
      adventure: 6,
      value: 7,
      precision: 5,
    },
    imps: [
      "114D - Beef Chuck, Shoulder Clod, Top Blade",
      "1114D - Beef Chuck, Shoulder Clod, Top Blade Steak",
    ],
    cooking: {
      method: "Fast high-heat sear",
      doneness: "Medium-rare",
      temp: "128-135F final internal temperature",
      note: "Slice across the grain after brief resting.",
    },
  },
  {
    id: "denver",
    name: "Denver Steak",
    tagline: "Chuck-derived secondary steak with rich flavor potential.",
    rationale:
      "Denver is suitable for exploratory users who want substantial flavor and strong value alignment.",
    profile: {
      richness: 6,
      tenderness: 7,
      boldness: 8,
      adventure: 7,
      value: 7,
      precision: 5,
    },
    imps: [
      "116G - Beef Chuck, Under Blade, Center Cut",
      "1116G - Beef Chuck, Under Blade, Center Cut Steak",
    ],
    cooking: {
      method: "Cast-iron or grill over moderate-high heat",
      doneness: "Medium-rare",
      temp: "128-136F final internal temperature",
      note: "Do not overcook to preserve tenderness.",
    },
  },
  {
    id: "chuck_eye",
    name: "Chuck Eye Steak",
    tagline: "Rib-like flavor characteristics at lower cost.",
    rationale:
      "Chuck eye fits value-oriented profiles seeking rib-adjacent flavor expression.",
    profile: {
      richness: 7,
      tenderness: 6,
      boldness: 8,
      adventure: 6,
      value: 6,
      precision: 4,
    },
    imps: [
      "116H - Beef Chuck, Chuck Eye Roll",
      "1116H - Beef Chuck, Chuck Eye Roll Steak",
    ],
    cooking: {
      method: "High-heat sear with short carryover",
      doneness: "Medium-rare",
      temp: "128-135F final internal temperature",
      note: "Trim seam fat as needed for more uniform texture.",
    },
  },
  {
    id: "delmonico",
    name: "Delmonico",
    tagline: "Specialty chuck format with strong butcher-counter identity.",
    rationale:
      "This cut aligns with adventurous traditionalists seeking boutique alternatives to mainstream rib steaks.",
    profile: {
      richness: 7,
      tenderness: 6,
      boldness: 8,
      adventure: 7,
      value: 5,
      precision: 5,
    },
    imps: [
      "116D - Beef Chuck, Chuck Eye Roll (Option 1 commonly sold as Delmonico)",
      "1116D - Beef Chuck, Chuck Eye Roll Steak, Boneless",
    ],
    cooking: {
      method: "Sear hard then rest adequately",
      doneness: "Medium-rare",
      temp: "130-136F final internal temperature",
      note: "Butcher trim quality strongly influences final texture.",
    },
  },
  {
    id: "hanger",
    name: "Hanger Steak",
    tagline: "High-mineral, high-character steak for experienced users.",
    rationale:
      "Hanger is best for adventurous diners who prioritize flavor complexity over maximal tenderness.",
    profile: {
      richness: 5,
      tenderness: 5,
      boldness: 9,
      adventure: 8,
      value: 7,
      precision: 4,
    },
    imps: [
      "140 - Beef Loin, Hanging Tender",
      "1140 - Beef Loin, Hanging Tender Steak",
    ],
    cooking: {
      method: "Very hot, short-duration sear",
      doneness: "Rare to medium-rare",
      temp: "124-132F final internal temperature",
      note: "Remove membrane thoroughly before cooking.",
    },
  },
  {
    id: "flank",
    name: "Flank Steak",
    tagline: "Lean cut with excellent slicing-service versatility.",
    rationale:
      "Flank matches high-value, technique-competent users comfortable with post-cook slicing control.",
    profile: {
      richness: 3,
      tenderness: 4,
      boldness: 8,
      adventure: 6,
      value: 8,
      precision: 6,
    },
    imps: ["193 - Beef Flank, Flank Steak"],
    cooking: {
      method: "High-heat grill or broiler",
      doneness: "Rare to medium-rare",
      temp: "124-132F final internal temperature",
      note: "Slice very thin against grain for best tenderness.",
    },
  },
  {
    id: "outside_skirt",
    name: "Outside Skirt Steak",
    tagline: "Premium skirt expression with intense beef flavor.",
    rationale:
      "Outside skirt suits users who prioritize maximal flavor character and are comfortable with aggressive heat.",
    profile: {
      richness: 6,
      tenderness: 5,
      boldness: 9,
      adventure: 8,
      value: 6,
      precision: 3,
    },
    imps: ["1121E - Beef Plate, Outside Skirt Steak, Skinned"],
    cooking: {
      method: "Hard sear over high radiant heat",
      doneness: "Rare to medium-rare",
      temp: "123-132F final internal temperature",
      note: "Excellent for short marination and slicing service.",
    },
  },
  {
    id: "rump_steak",
    name: "Rump Steak",
    tagline: "Lean, beef-forward round steak with practical value.",
    rationale:
      "Rump steak is suitable for everyday value users prioritizing beef flavor over softness.",
    profile: {
      richness: 3,
      tenderness: 4,
      boldness: 7,
      adventure: 6,
      value: 8,
      precision: 6,
    },
    imps: ["1171G - Beef Round, Outside Round, Rump Steak, Boneless"],
    cooking: {
      method: "High-heat sear with brief carryover",
      doneness: "Medium-rare to medium",
      temp: "132-140F final internal temperature",
      note: "Best served sliced across grain in strips.",
    },
  },
  {
    id: "sierra_steak",
    name: "Sierra Steak",
    tagline: "Underused chuck cut with bold beef flavor.",
    rationale:
      "Sierra steak is a fit for value-conscious users who want big flavor and are comfortable slicing technique.",
    profile: {
      richness: 5,
      tenderness: 5,
      boldness: 9,
      adventure: 8,
      value: 8,
      precision: 4,
    },
    imps: [
      "IMPS Series 100 - Beef Chuck, Under Blade (Sierra-style market cut reference)",
    ],
    cooking: {
      method: "Very hot sear, short cook",
      doneness: "Rare to medium-rare",
      temp: "124-132F final internal temperature",
      note: "Rest briefly and slice thin against grain.",
    },
  },
  {
    id: "eye_round_steak",
    name: "Eye of Round Steak",
    tagline: "Very lean round cut for disciplined value plans.",
    rationale:
      "Eye of round aligns with efficiency-focused users prioritizing lean profile and budget control.",
    profile: {
      richness: 2,
      tenderness: 3,
      boldness: 6,
      adventure: 6,
      value: 9,
      precision: 7,
    },
    imps: [
      "IMPS Series 100 - Beef Round, Eye of Round (steak reference)",
    ],
    cooking: {
      method: "Quick sear or thin-slice applications",
      doneness: "Medium-rare to medium",
      temp: "132-140F final internal temperature",
      note: "Best served sliced thin across grain.",
    },
  },
  {
    id: "london_broil_top_round",
    name: "London Broil",
    tagline: "Lean, shareable cut with broad utility.",
    rationale:
      "Top round works for moderate-to-value users who want larger format service and flexible preparation.",
    profile: {
      richness: 3,
      tenderness: 4,
      boldness: 7,
      adventure: 6,
      value: 8,
      precision: 7,
    },
    imps: [
      "IMPS Series 100 - Beef Round, Top Round (London broil style reference)",
    ],
    cooking: {
      method: "Marinate and broil/grill",
      doneness: "Medium-rare",
      temp: "130-136F final internal temperature",
      note: "Rest and slice thin against grain.",
    },
  },
  {
    id: "plate_short_rib_boneless",
    name: "Boneless Short Rib",
    tagline: "Rich cut suited to grill or braise programs.",
    rationale:
      "Boneless short rib matches bold-flavor users and BBQ-oriented cooking styles with high flavor payoff.",
    profile: {
      richness: 8,
      tenderness: 6,
      boldness: 9,
      adventure: 7,
      value: 6,
      precision: 4,
    },
    imps: [
      "IMPS Series 100 - Beef Plate, Short Rib, Boneless (family reference)",
    ],
    cooking: {
      method: "Slow braise or controlled high-heat grill",
      doneness: "Varies by method",
      temp: "Braise to probe-tender or grill to 130-137F",
      note: "Outstanding for BBQ and high-flavor applications.",
    },
  },
  {
    id: "all_beef_uncured_hot_dog",
    name: "All-Beef Uncured Angus Hot Dog",
    tagline: "Angus beef cookout option for fast, casual service.",
    rationale:
      "All-beef uncured Angus hot dog fits profiles prioritizing speed, familiarity, and value-forward cookout meals.",
    profile: {
      richness: 5,
      tenderness: 7,
      boldness: 6,
      adventure: 1,
      value: 10,
      precision: 1,
    },
    imps: ["All-beef uncured hot dog (processed beef item reference)"],
    cooking: {
      method: "Direct grill or griddle, quick-turn cook",
      doneness: "Heat through with light casing blister",
      temp: "150-160F internal temperature",
      note: "Serve immediately after blistering for best snap and texture.",
    },
  },
];

const COOKING_TIPS_DB = {
  byFamily: {
    Rib: [
      "Use two-zone heat so you can sear first, then finish gently.",
      "Pull slightly early and rest 5-8 minutes to keep rendered fat in the meat.",
      "Salt 30-60 minutes ahead for stronger crust and better interior seasoning.",
      "Flip every 45-60 seconds for more even edge-to-edge doneness.",
    ],
    Loin: [
      "Pat dry before searing to build browning quickly without steaming.",
      "Use high heat for color, then moderate heat to finish without overcooking.",
      "Rest on a rack so the crust stays crisp.",
      "Slice against the grain, especially on larger loin cuts.",
    ],
    Sirloin: [
      "Cook to medium-rare or medium and slice thin across the grain.",
      "A short marinade (30-120 minutes) can improve texture on leaner sirloin cuts.",
      "Use a thermometer to avoid overshooting internal temperature.",
      "For large pieces, reverse sear for better doneness control.",
    ],
    Chuck: [
      "Chuck cuts perform best with either fast high heat plus slicing, or low-and-slow.",
      "If grilling, slice thin against the grain immediately after resting.",
      "Marinades with salt, acid, and oil improve tenderness and flavor carry.",
      "Avoid overcooking lean chuck steaks past medium unless braising.",
    ],
    Plate: [
      "Keep plate cuts hot and fast; they lose texture if held too long.",
      "Trim excess surface fat to reduce flare-ups.",
      "Rest briefly, then slice thin across the grain.",
      "Strong seasoning and citrus finish pair well with plate cuts.",
    ],
    Flank: [
      "Cook flank hot and fast, then rest and slice very thin across the grain.",
      "Marinate at least 30 minutes for deeper flavor and tenderness.",
      "Do not overcook; medium-rare to medium preserves texture.",
      "Cut on a bias for wider, more tender slices.",
    ],
    Round: [
      "Round cuts benefit from marinade and careful temperature control.",
      "Keep doneness in the medium-rare to medium range for better tenderness.",
      "Always slice thin against the grain before serving.",
      "For thicker round cuts, use broil/grill then carryover rest.",
    ],
    Specialty: [
      "Use direct heat for quick browning, then finish based on thickness.",
      "A thermometer and proper rest time prevent dry results.",
      "Slice against the grain whenever muscle fibers are long.",
      "Season early and keep post-cook slicing clean and deliberate.",
    ],
  },
  byCut: {
    ribeye: [
      "Render the fat cap first for 30-60 seconds before laying flat to sear.",
      "Baste with butter in the final minute for deeper crust aroma.",
    ],
    strip: [
      "Score the fat edge lightly to limit curling during sear.",
      "Sear fat-edge side first to improve rendered bite.",
    ],
    filet_mignon: [
      "Wrap with butcher twine for more even shape and doneness.",
      "High-heat sear first, then finish gently to avoid gray bands.",
    ],
    picanha: [
      "Slice with the grain into steaks before cooking, then slice across grain to serve.",
      "Render fat cap thoroughly; that is where most of the flavor payoff sits.",
    ],
    tri_tip: [
      "Track grain direction before cooking; it shifts midway across the roast.",
      "Slice in two sections so each piece is cut against its grain direction.",
    ],
    bavette: [
      "Cook bavette rare to medium-rare and always slice thin on bias.",
      "Rest slightly longer (7-10 minutes) before slicing to reduce purge.",
    ],
    flat_iron: [
      "Cook hot and fast; it behaves best like a thin steakhouse cut.",
      "Do not cook far past medium or texture turns dense.",
    ],
    hanger: [
      "Trim silverskin well; leave some fat for flavor.",
      "Use aggressive sear and pull at medium-rare for best texture.",
    ],
    flank: [
      "Use a tight grain-direction slice pattern; thick slices eat chewy.",
      "Finish with acid (lemon/lime/vinegar) right before serving.",
    ],
    outside_skirt: [
      "Outside skirt needs very little time; prioritize color over prolonged cook.",
      "Cut into manageable lengths before cooking for better pan contact.",
    ],
    london_broil_top_round: [
      "Use a marinade with salt and acid for at least 2 hours.",
      "Broil or grill hard, then rest and slice paper-thin.",
    ],
    all_beef_uncured_hot_dog: [
      "Warm gently first, then blister over direct heat for snap without splitting.",
      "Roll frequently to brown evenly on all sides.",
      "Choose 100% Angus beef franks for fuller beef flavor and better bite.",
      "Toast the bun and apply condiments after the dog is off heat.",
    ],
  },
};

const state = {
  currentQuestion: 0,
  questionSet: [],
  answers: [],
};

const introPanel = document.getElementById("introPanel");
const quizPanel = document.getElementById("quizPanel");
const resultPanel = document.getElementById("resultPanel");

const progressLabel = document.getElementById("progressLabel");
const answeredLabel = document.getElementById("answeredLabel");
const progressFill = document.getElementById("progressFill");

const questionType = document.getElementById("questionType");
const questionPrompt = document.getElementById("questionPrompt");
const questionDetail = document.getElementById("questionDetail");
const optionsWrap = document.getElementById("optionsWrap");
const warningText = document.getElementById("warningText");

const primaryCutName = document.getElementById("primaryCutName");
const primaryCutTagline = document.getElementById("primaryCutTagline");
const executiveSynopsis = document.getElementById("executiveSynopsis");
const executiveHighlights = document.getElementById("executiveHighlights");
const fitNotesList = document.getElementById("fitNotesList");
const cookingList = document.getElementById("cookingList");
const tier1List = document.getElementById("tier1List");
const tier2List = document.getElementById("tier2List");
const tier3List = document.getElementById("tier3List");
const tier4List = document.getElementById("tier4List");
const tipsCutLabel = document.getElementById("tipsCutLabel");
const tipsList = document.getElementById("tipsList");

const startBtn = document.getElementById("startBtn");
const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");

startBtn.addEventListener("click", startAssessment);
backBtn.addEventListener("click", goBack);
nextBtn.addEventListener("click", goNext);
restartBtn.addEventListener("click", resetAssessment);

function initializeAssessmentRun() {
  state.currentQuestion = 0;
  state.questionSet = buildQuestionSet();
  state.answers = Array.from({ length: state.questionSet.length }, () => null);
}

function buildQuestionSet() {
  const history = new Set(readStoredArray(QUESTION_HISTORY_KEY));
  const lastSet = new Set(readStoredArray(QUESTION_LAST_SET_KEY));
  const selected = [];

  QUESTION_GROUPS.forEach((group) => {
    const candidates = QUESTION_POOL.filter((question) => question.group === group);
    const notInLastSet = candidates.filter((question) => !lastSet.has(question.id));
    const unseen = notInLastSet.filter((question) => !history.has(question.id));
    const fallbackUnseen = candidates.filter((question) => !history.has(question.id));

    const pool =
      unseen.length > 0
        ? unseen
        : notInLastSet.length > 0
        ? notInLastSet
        : fallbackUnseen.length > 0
        ? fallbackUnseen
        : candidates;

    const pick = pickRandom(pool) || candidates[0];
    if (pick) {
      selected.push(pick);
    }
  });

  shuffleInPlace(selected);

  const selectedIds = selected.map((question) => question.id);
  const nextHistory = [...history, ...selectedIds];

  writeStoredArray(QUESTION_HISTORY_KEY, [...nextHistory].slice(-QUESTION_POOL.length));
  writeStoredArray(QUESTION_LAST_SET_KEY, selectedIds);

  return selected;
}

function pickRandom(items) {
  if (items.length === 0) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
}

function shuffleInPlace(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
}

function readStoredArray(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredArray(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage failures (private mode, storage-disabled contexts).
  }
}

function startAssessment() {
  introPanel.classList.add("hidden");
  resultPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  initializeAssessmentRun();
  renderQuestion();
}

function resetAssessment() {
  initializeAssessmentRun();
  resultPanel.classList.add("hidden");
  quizPanel.classList.remove("hidden");
  renderQuestion();
}

function goBack() {
  if (state.currentQuestion === 0) {
    return;
  }
  state.currentQuestion -= 1;
  renderQuestion();
}

function goNext() {
  const answer = state.answers[state.currentQuestion];
  if (answer === null) {
    warningText.classList.remove("hidden");
    return;
  }

  warningText.classList.add("hidden");
  if (state.currentQuestion === state.questionSet.length - 1) {
    showResults();
    return;
  }

  state.currentQuestion += 1;
  renderQuestion();
}

function renderQuestion() {
  const index = state.currentQuestion;
  const question = state.questionSet[index];
  if (!question) {
    return;
  }
  const answered = state.answers.filter((answer) => answer !== null).length;
  const totalQuestions = state.questionSet.length || ASSESSMENT_QUESTION_COUNT;
  const progressPct = ((index + 1) / totalQuestions) * 100;

  progressLabel.textContent = `Question ${index + 1} of ${totalQuestions}`;
  answeredLabel.textContent = `${answered} answered`;
  progressFill.style.width = `${progressPct}%`;

  questionType.textContent = question.type;
  questionPrompt.textContent = question.prompt;
  if (!question.detail || question.detail.toLowerCase() === "pick one.") {
    questionDetail.textContent = "";
    questionDetail.classList.add("hidden");
  } else {
    questionDetail.textContent = question.detail;
    questionDetail.classList.remove("hidden");
  }
  nextBtn.textContent = index === totalQuestions - 1 ? "Analyze Profile" : "Next";
  backBtn.disabled = index === 0;
  warningText.classList.add("hidden");

  optionsWrap.innerHTML = "";
  question.options.forEach((option, optionIndex) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "option-card";

    if (state.answers[index] === optionIndex) {
      card.classList.add("selected");
    }

    card.innerHTML = `
      <span class="option-label">${option.label}</span>
    `;

    card.addEventListener("click", () => {
      state.answers[index] = optionIndex;
      warningText.classList.add("hidden");

      if (index === totalQuestions - 1) {
        showResults();
        return;
      }

      state.currentQuestion += 1;
      renderQuestion();
    });

    optionsWrap.appendChild(card);
  });
}

function showResults() {
  const profile = buildProfileVector();
  const signals = buildAssessmentSignals();
  const rankedCuts = rankCuts(profile, signals);
  const primary = rankedCuts[0];
  const second = rankedCuts[1];
  const scoreGap = primary.score - (second?.score ?? primary.score);
  const summary = buildProfileSummary(profile, rankedCuts, signals);
  const tiers = buildTierRecommendations(rankedCuts);
  const topCluster = getTopCluster(rankedCuts, primary.score);
  const hasCloseAlternatives = scoreGap <= 5 && topCluster.length > 1;

  primaryCutName.textContent = primary.cut.name;
  primaryCutTagline.textContent = primary.cut.tagline;

  renderExecutiveBrief(primary.cut, summary, signals, profile, topCluster);

  renderFitNotes(
    profile,
    primary.cut,
    summary,
    signals,
    hasCloseAlternatives,
    topCluster
  );

  cookingList.innerHTML = "";
  cookingList.className = "clean-list kv-list";
  addKeyValueItem(cookingList, "Lead Option", primary.cut.name);
  addKeyValueItem(cookingList, "Method", primary.cut.cooking.method);
  addKeyValueItem(cookingList, "Target Doneness", primary.cut.cooking.doneness);
  addKeyValueItem(cookingList, "Internal Temp", primary.cut.cooking.temp);
  if (hasCloseAlternatives) {
    addKeyValueItem(
      cookingList,
      "Comparison Note",
      "Use Tier 1 to choose availability/price, then follow that cut's cooking profile."
    );
  }
  addKeyValueItem(cookingList, "Tip", primary.cut.cooking.note);

  renderTierList(tier1List, tiers.tier1);
  renderTierList(tier2List, tiers.tier2);
  renderTierList(tier3List, tiers.tier3);
  renderTierList(tier4List, tiers.tier4);
  renderCookingTips(primary.cut);

  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
}

function buildAssessmentSignals() {
  const signals = {};

  state.answers.forEach((selectedOptionIndex, questionIndex) => {
    const option = state.questionSet[questionIndex]?.options[selectedOptionIndex];
    if (!option?.signal) {
      return;
    }

    Object.entries(option.signal).forEach(([key, value]) => {
      signals[key] = value;
    });
  });

  return signals;
}

function buildProfileSummary(profile, rankedCuts, signals) {
  const primaryFit = classifyProgram(rankedCuts[0].cut);
  const secondaryFit = getSecondaryProgram(rankedCuts, primaryFit);

  return {
    primaryFit,
    secondaryFit,
    bestCookingMatch: signals.method || deriveBestMethod(profile),
    budgetOrientation: signals.budget || deriveBudgetOrientation(profile),
    substitutionFlexibility:
      signals.substitution || deriveSubstitutionFlexibility(profile),
    recommendedFamilies: getTopFamilies(rankedCuts, 3).join(", "),
  };
}

function buildTierRecommendations(rankedCuts) {
  const used = new Set();
  const topScore = rankedCuts[0]?.score ?? 0;

  const tier1 = selectTierCuts(
    rankedCuts,
    used,
    (result) => result.score >= topScore - 4,
    3
  );
  fillTierWithBest(rankedCuts, used, tier1, 3);

  const tier2 = selectTierCuts(
    rankedCuts,
    used,
    (result) => result.score >= topScore - 12,
    4
  );
  fillTierWithBest(rankedCuts, used, tier2, 4);

  const tier3 = selectTierCuts(
    rankedCuts,
    used,
    (result) => getCostTier(result.cut) === "Value",
    4
  );
  fillTierWithBest(rankedCuts, used, tier3, 4);

  const tier4 = selectTierCuts(
    rankedCuts,
    used,
    (result) => result.cut.profile.adventure >= 7 || result.cut.profile.boldness >= 9,
    4
  );
  fillTierWithBest(rankedCuts, used, tier4, 4);

  return { tier1, tier2, tier3, tier4 };
}

function selectTierCuts(rankedCuts, used, predicate, count) {
  const picks = [];
  rankedCuts.forEach((result) => {
    if (picks.length >= count || used.has(result.cut.id) || !predicate(result)) {
      return;
    }
    picks.push(result);
    used.add(result.cut.id);
  });
  return picks;
}

function fillTierWithBest(rankedCuts, used, tier, count) {
  rankedCuts.forEach((result) => {
    if (tier.length >= count || used.has(result.cut.id)) {
      return;
    }
    tier.push(result);
    used.add(result.cut.id);
  });
}

function renderTierList(target, tierResults) {
  target.innerHTML = "";
  tierResults.forEach((result) => {
    addListItem(
      target,
      `${result.cut.name} • ${getCutFamily(result.cut)} • ${getCostTier(
        result.cut
      )}`
    );
  });
}

const CUT_ICON_BY_ID = {
  ribeye: "ribeye",
  ribeye_cap: "ribeye_cap",
  strip: "strip",
  bone_in_strip: "strip_bone",
  strip_filet_split: "strip_split",
  filet_mignon: "filet",
  porterhouse: "porterhouse",
  t_bone: "t_bone",
  top_sirloin: "sirloin",
  baseball_cut: "sirloin_round",
  coulotte: "picanha",
  tri_tip: "tri_tip",
  sirloin_flap: "bavette",
  ball_tip: "sirloin_round",
  flat_iron: "flat_iron",
  denver: "denver",
  chuck_eye: "chuck_eye",
  delmonico: "chuck_eye",
  hanger: "hanger",
  flank: "flank",
  outside_skirt: "outside_skirt",
  rump_steak: "round",
  sierra_steak: "chuck_lean",
  eye_round_steak: "eye_round",
  london_broil_top_round: "london_broil",
  plate_short_rib_boneless: "short_rib",
  all_beef_uncured_hot_dog: "hotdog",
};

const CUT_ICON_BY_FAMILY = {
  Rib: "ribeye",
  Loin: "strip",
  Sirloin: "sirloin",
  Chuck: "chuck_lean",
  Plate: "short_rib",
  Flank: "flank",
  Round: "round",
  Specialty: "strip",
};

const CUT_ICON_PRESETS = {
  ribeye: {
    body: "M14 13 C25 6, 44 5, 60 9 C73 12, 83 21, 85 33 C87 44, 80 54, 66 58 C51 62, 32 61, 19 55 C10 50, 7 40, 9 30 C9 23, 11 17, 14 13 Z",
    fat: [
      "M21 18 C31 13, 45 12, 58 15 C68 18, 74 24, 75 32 C76 40, 71 47, 61 50 C49 54, 35 54, 25 50 C17 46, 13 39, 14 31 C15 25, 17 21, 21 18 Z",
    ],
    seams: ["M27 22 C36 19, 48 20, 58 24", "M25 35 C36 33, 48 34, 59 39"],
    marbling: [
      [31, 28, 2.3],
      [41, 26, 2.1],
      [51, 32, 2.2],
      [35, 38, 1.9],
      [57, 27, 1.8],
    ],
  },
  ribeye_cap: {
    body: "M12 21 C20 10, 39 7, 57 10 C71 13, 81 22, 82 34 C83 45, 75 54, 62 58 C48 62, 30 57, 18 48 C31 47, 40 40, 44 31 C48 22, 42 16, 31 16 C23 16, 17 18, 12 21 Z",
    fat: [
      "M22 21 C32 16, 46 16, 58 19 C66 22, 71 27, 72 34 C72 40, 68 45, 61 49 C52 52, 39 52, 29 48 C36 46, 42 41, 45 34 C48 27, 43 22, 35 21 C30 21, 26 21, 22 21 Z",
    ],
    seams: ["M31 27 C39 24, 48 25, 56 30"],
    marbling: [
      [36, 29, 2.1],
      [46, 31, 1.9],
      [52, 36, 1.8],
    ],
  },
  strip: {
    body: "M14 14 C24 8, 42 8, 60 10 C74 12, 84 18, 88 27 C91 36, 88 47, 79 54 C68 61, 50 61, 32 58 C20 55, 11 49, 8 40 C5 31, 7 21, 14 14 Z",
    fat: [
      "M18 15 C31 11, 46 11, 62 13 C73 15, 80 19, 83 25 C73 22, 60 21, 46 22 C33 23, 22 25, 13 29 C12 24, 14 19, 18 15 Z",
    ],
    seams: ["M24 41 C36 37, 50 37, 65 42"],
    marbling: [
      [29, 29, 1.9],
      [39, 30, 2],
      [52, 33, 2.1],
      [61, 28, 1.7],
    ],
  },
  strip_bone: {
    body: "M11 15 C20 10, 37 9, 55 11 C67 13, 75 18, 78 26 C81 34, 78 45, 70 51 C60 57, 44 58, 28 55 C18 53, 10 48, 7 40 C5 32, 6 22, 11 15 Z",
    fat: [
      "M16 17 C28 13, 42 13, 56 15 C66 17, 72 21, 75 26 C67 24, 56 24, 44 25 C32 26, 22 28, 14 32 C12 26, 12 21, 16 17 Z",
    ],
    seams: ["M21 39 C33 36, 46 36, 60 40"],
    marbling: [
      [27, 28, 1.8],
      [38, 31, 1.9],
      [50, 31, 2],
    ],
    bone:
      '<g class="steak-bone"><rect class="steak-bone-fill" x="70" y="22" rx="4" ry="4" width="18" height="10"></rect><circle class="steak-bone-fill" cx="70" cy="27" r="4.5"></circle><circle class="steak-bone-fill" cx="88" cy="27" r="4.5"></circle></g>',
  },
  strip_split: {
    body: "M18 16 C27 10, 42 9, 57 11 C69 13, 77 18, 80 26 C83 34, 80 44, 72 50 C63 56, 49 58, 35 56 C24 54, 15 49, 12 40 C10 32, 12 22, 18 16 Z",
    fat: [
      "M22 17 C33 13, 46 13, 58 15 C66 17, 72 21, 74 25 C65 23, 54 22, 43 23 C32 24, 24 27, 18 31 C17 25, 18 20, 22 17 Z",
    ],
    seams: ["M23 38 C33 34, 46 34, 59 38"],
    marbling: [
      [31, 29, 1.9],
      [41, 30, 1.8],
      [50, 34, 1.9],
    ],
  },
  filet: {
    body: "M28 8 C40 5, 55 7, 65 15 C74 22, 77 34, 72 45 C67 55, 55 60, 42 59 C29 58, 18 51, 14 40 C10 29, 13 18, 21 12 C24 10, 26 9, 28 8 Z",
    fat: [
      "M24 17 C34 11, 49 11, 58 18 C65 24, 68 34, 64 43 C60 50, 51 54, 41 54 C31 53, 23 47, 20 39 C17 30, 19 22, 24 17 Z",
    ],
    seams: ["M31 30 C37 26, 46 26, 53 30"],
    marbling: [
      [34, 33, 1.7],
      [45, 35, 1.7],
    ],
  },
  porterhouse: {
    body: "M10 15 C18 9, 35 7, 55 8 C72 9, 85 16, 89 28 C92 39, 88 51, 77 57 C64 63, 45 63, 26 58 C14 54, 6 46, 5 35 C4 26, 6 19, 10 15 Z",
    fat: [
      "M15 16 C29 12, 46 11, 63 12 C75 14, 83 18, 87 24 C74 20, 58 19, 42 20 C29 21, 19 23, 11 27 C11 22, 12 19, 15 16 Z",
    ],
    seams: ["M49 13 L49 56", "M50 30 C58 27, 67 26, 75 30"],
    marbling: [
      [24, 30, 1.8],
      [32, 34, 1.9],
      [62, 36, 1.7],
      [70, 40, 1.6],
    ],
    bone:
      '<g class="steak-bone"><rect class="steak-bone-fill" x="45" y="12" rx="3" ry="3" width="8" height="43"></rect><rect class="steak-bone-fill" x="39" y="27" rx="3" ry="3" width="20" height="8"></rect></g>',
  },
  t_bone: {
    body: "M11 16 C20 10, 36 8, 54 9 C70 10, 82 17, 86 28 C89 38, 85 49, 75 56 C63 62, 46 62, 28 58 C16 55, 8 47, 6 37 C5 28, 7 20, 11 16 Z",
    fat: [
      "M16 17 C29 13, 45 13, 60 14 C71 16, 79 20, 83 25 C71 22, 56 22, 41 23 C29 24, 18 26, 11 30 C12 24, 13 20, 16 17 Z",
    ],
    seams: ["M46 14 L46 56", "M47 31 C54 29, 62 30, 70 34"],
    marbling: [
      [24, 31, 1.8],
      [33, 35, 1.8],
      [60, 39, 1.6],
    ],
    bone:
      '<g class="steak-bone"><rect class="steak-bone-fill" x="42.5" y="13" rx="3" ry="3" width="7" height="42"></rect><rect class="steak-bone-fill" x="37.5" y="28" rx="3" ry="3" width="17" height="7"></rect></g>',
  },
  sirloin: {
    body: "M14 18 C22 10, 39 8, 56 11 C69 14, 77 23, 78 34 C79 44, 72 52, 60 56 C45 61, 27 59, 16 51 C8 45, 6 35, 9 26 C10 23, 12 20, 14 18 Z",
    fat: [
      "M20 17 C31 13, 44 13, 56 16 C63 18, 68 22, 70 26 C60 24, 49 24, 37 25 C28 26, 20 28, 14 31 C14 25, 16 20, 20 17 Z",
    ],
    seams: ["M23 39 C35 35, 48 36, 60 41"],
    marbling: [
      [30, 30, 1.8],
      [40, 32, 1.8],
      [50, 35, 1.7],
    ],
  },
  sirloin_round: {
    body: "M24 9 C36 5, 52 7, 63 15 C73 22, 77 34, 73 45 C69 55, 57 61, 44 61 C31 61, 19 55, 14 44 C10 33, 12 20, 21 12 C22 11, 23 10, 24 9 Z",
    fat: [
      "M24 18 C33 13, 46 13, 56 18 C63 22, 66 30, 64 38 C61 46, 53 51, 44 52 C34 53, 25 49, 20 42 C16 35, 17 25, 24 18 Z",
    ],
    seams: ["M28 32 C35 28, 46 28, 54 33"],
    marbling: [
      [33, 36, 1.7],
      [44, 37, 1.8],
    ],
  },
  picanha: {
    body: "M12 42 C11 31, 18 21, 31 15 C45 9, 62 9, 75 14 C84 18, 88 25, 88 33 C88 42, 82 50, 72 56 C58 63, 39 64, 24 59 C16 56, 13 50, 12 42 Z",
    fat: [
      "M23 19 C39 13, 57 13, 71 18 C77 20, 81 24, 82 28 C68 24, 51 24, 36 28 C27 30, 20 33, 15 36 C15 29, 18 23, 23 19 Z",
    ],
    seams: ["M33 40 C43 36, 56 37, 67 43"],
    marbling: [
      [39, 34, 1.8],
      [50, 36, 1.9],
      [60, 40, 1.7],
    ],
  },
  tri_tip: {
    body: "M12 44 C10 33, 16 23, 28 17 C44 10, 63 11, 77 19 C85 24, 89 33, 87 43 C85 52, 77 58, 65 61 C47 65, 27 63, 16 56 C13 52, 12 48, 12 44 Z",
    fat: [
      "M20 24 C34 18, 53 18, 69 24 C74 26, 78 29, 80 33 C67 30, 52 30, 37 33 C28 35, 21 39, 15 43 C14 35, 16 29, 20 24 Z",
    ],
    grain: ["M27 27 C39 25, 54 26, 69 30", "M24 33 C38 31, 53 32, 68 37", "M22 39 C37 37, 52 38, 66 43"],
  },
  bavette: {
    body: "M6 31 C8 22, 17 16, 31 14 C49 11, 70 13, 83 18 C90 21, 93 28, 92 35 C91 43, 85 49, 74 52 C57 57, 33 57, 17 53 C10 50, 6 42, 6 31 Z",
    fat: [
      "M11 23 C24 18, 43 17, 63 19 C74 20, 82 24, 88 28 C76 26, 59 26, 42 28 C29 30, 18 33, 10 37 C9 31, 9 27, 11 23 Z",
    ],
    grain: ["M17 27 C31 24, 48 24, 65 27", "M14 33 C31 30, 48 30, 67 34", "M18 39 C35 36, 52 36, 69 40"],
  },
  flat_iron: {
    body: "M10 28 C12 19, 22 14, 36 12 C50 10, 65 12, 77 17 C84 21, 87 28, 86 36 C85 44, 79 50, 69 53 C55 58, 36 58, 22 54 C14 51, 9 44, 10 28 Z",
    fat: [
      "M17 19 C29 15, 46 15, 63 18 C72 20, 78 24, 81 28 C69 25, 54 25, 38 27 C28 29, 19 32, 12 36 C11 29, 13 23, 17 19 Z",
    ],
    seams: ["M17 33 C31 30, 46 30, 61 34 C68 36, 74 39, 79 44"],
    marbling: [
      [28, 35, 1.7],
      [39, 35, 1.8],
      [51, 37, 1.8],
      [62, 40, 1.6],
    ],
  },
  denver: {
    body: "M14 18 C24 12, 40 10, 57 12 C71 14, 81 21, 84 31 C86 39, 83 48, 75 54 C66 60, 52 61, 37 59 C24 57, 14 52, 10 43 C7 36, 8 25, 14 18 Z",
    fat: [
      "M18 19 C31 14, 47 14, 62 16 C72 18, 79 22, 82 27 C72 24, 59 23, 45 24 C33 25, 22 28, 13 32 C12 26, 14 22, 18 19 Z",
    ],
    seams: ["M22 40 C35 36, 49 36, 63 41"],
    marbling: [
      [29, 31, 2],
      [40, 30, 1.8],
      [51, 34, 2.1],
      [61, 37, 1.9],
    ],
  },
  chuck_eye: {
    body: "M16 16 C25 10, 39 8, 53 10 C66 12, 76 20, 79 31 C82 42, 76 52, 65 58 C51 64, 33 63, 21 56 C11 50, 7 39, 10 28 C11 23, 13 19, 16 16 Z",
    fat: [
      "M22 20 C31 15, 44 14, 55 18 C63 21, 68 27, 69 34 C70 41, 66 47, 58 51 C49 55, 37 55, 28 51 C21 47, 18 41, 18 34 C18 28, 19 24, 22 20 Z",
    ],
    seams: ["M27 26 C35 22, 46 22, 55 26", "M28 40 C38 37, 48 37, 57 42"],
    marbling: [
      [32, 31, 1.8],
      [42, 30, 1.7],
      [51, 35, 1.8],
      [37, 40, 1.6],
    ],
  },
  chuck_lean: {
    body: "M12 18 C20 11, 35 9, 50 10 C64 11, 76 17, 82 27 C87 36, 85 47, 76 54 C66 61, 50 62, 33 59 C21 57, 11 51, 7 42 C4 34, 6 24, 12 18 Z",
    fat: [
      "M17 20 C29 16, 44 16, 58 18 C68 20, 75 24, 79 30 C69 27, 56 26, 42 28 C30 29, 20 32, 12 36 C11 30, 13 24, 17 20 Z",
    ],
    grain: ["M20 35 C33 32, 48 32, 63 36", "M23 41 C37 39, 50 40, 63 44"],
    marbling: [
      [30, 29, 1.6],
      [41, 31, 1.7],
      [52, 35, 1.7],
    ],
  },
  hanger: {
    body: "M18 14 C27 10, 41 10, 54 13 C66 16, 75 24, 77 34 C79 44, 73 53, 62 58 C50 62, 35 61, 24 56 C14 51, 9 43, 9 34 C9 25, 12 18, 18 14 Z",
    fat: [
      "M23 19 C33 16, 45 16, 56 19 C64 22, 69 27, 70 33 C61 30, 50 29, 39 30 C30 31, 22 33, 16 37 C15 30, 17 24, 23 19 Z",
    ],
    seams: ["M24 27 C33 24, 44 24, 54 27", "M24 40 C35 37, 46 37, 56 41"],
    marbling: [
      [31, 31, 1.7],
      [41, 33, 1.7],
      [50, 37, 1.6],
    ],
  },
  flank: {
    body: "M6 31 C8 22, 18 16, 33 14 C52 12, 71 14, 84 19 C90 22, 93 28, 92 34 C91 42, 85 48, 73 52 C56 56, 34 57, 17 53 C9 50, 6 42, 6 31 Z",
    fat: [
      "M10 24 C24 19, 43 18, 62 20 C74 21, 82 25, 88 29 C75 27, 58 27, 41 29 C28 31, 17 35, 9 39 C8 33, 8 28, 10 24 Z",
    ],
    grain: ["M16 27 C31 24, 48 24, 67 27", "M13 33 C30 30, 49 30, 69 34", "M17 39 C35 36, 53 36, 72 40"],
  },
  outside_skirt: {
    body: "M5 34 C6 25, 14 18, 29 15 C47 12, 68 13, 82 17 C90 19, 95 24, 95 31 C95 38, 90 43, 80 47 C63 53, 41 54, 22 51 C10 49, 5 43, 5 34 Z",
    fat: [
      "M9 26 C23 21, 42 20, 62 21 C74 22, 83 25, 90 29 C77 27, 59 27, 42 29 C28 31, 16 35, 8 40 C7 34, 7 30, 9 26 Z",
    ],
    grain: ["M16 28 C32 25, 50 25, 70 28", "M13 34 C31 31, 51 31, 72 35", "M18 40 C36 37, 54 37, 74 41"],
  },
  round: {
    body: "M23 10 C36 5, 53 6, 65 15 C75 23, 79 35, 75 46 C71 56, 58 62, 44 62 C30 62, 18 55, 13 44 C8 33, 11 20, 20 13 C21 12, 22 11, 23 10 Z",
    fat: [
      "M24 19 C33 14, 46 14, 56 19 C63 23, 66 31, 64 39 C61 47, 53 52, 44 53 C34 54, 25 50, 20 43 C16 36, 17 26, 24 19 Z",
    ],
    seams: ["M28 34 C35 30, 46 30, 54 35"],
    marbling: [
      [33, 37, 1.4],
      [44, 39, 1.4],
    ],
  },
  eye_round: {
    body: "M26 11 C37 7, 51 8, 61 16 C69 23, 73 33, 70 43 C67 53, 56 59, 44 59 C33 59, 22 54, 17 45 C12 36, 13 24, 21 16 C23 14, 24 12, 26 11 Z",
    fat: [
      "M27 20 C35 16, 45 16, 53 21 C59 25, 61 32, 60 39 C57 46, 50 50, 43 50 C35 50, 28 46, 24 39 C20 31, 22 25, 27 20 Z",
    ],
    seams: ["M29 33 C34 30, 42 30, 48 33"],
    marbling: [[38, 37, 1.2]],
  },
  london_broil: {
    body: "M8 30 C10 21, 19 15, 34 13 C54 11, 74 13, 86 19 C92 22, 95 28, 94 35 C93 43, 87 49, 74 53 C56 57, 33 58, 16 54 C9 51, 6 42, 8 30 Z",
    fat: [
      "M12 23 C26 18, 46 18, 66 20 C78 21, 86 25, 91 30 C78 28, 60 28, 42 30 C28 32, 17 36, 10 41 C9 34, 9 28, 12 23 Z",
    ],
    grain: ["M17 27 C34 24, 53 24, 73 27", "M14 33 C32 30, 52 30, 73 34", "M18 39 C37 36, 56 36, 75 40"],
  },
  short_rib: {
    body: "M10 20 C17 13, 32 10, 50 11 C67 12, 81 18, 87 28 C92 37, 90 48, 81 55 C70 63, 52 64, 33 61 C19 58, 9 51, 5 41 C3 34, 5 26, 10 20 Z",
    fat: [
      "M14 24 C27 19, 43 18, 60 20 C72 22, 80 26, 85 31 C73 28, 58 28, 42 30 C29 31, 18 35, 10 40 C10 34, 11 28, 14 24 Z",
      "M17 39 C29 36, 42 36, 55 38 C65 40, 73 43, 79 47 C69 45, 56 45, 43 46 C32 47, 22 49, 14 52 C14 47, 15 43, 17 39 Z",
    ],
    seams: ["M24 24 L24 55", "M40 22 L40 59", "M56 21 L56 60"],
    marbling: [
      [31, 33, 1.8],
      [48, 35, 1.8],
      [66, 37, 1.7],
    ],
  },
  hotdog: { hotdog: true },
};

function getCutIconMarkup(cut, size = "sm") {
  const sizeClass = size === "lg" ? "cut-icon-lg" : "cut-icon-sm";
  const presetKey = getCutIconPresetKey(cut);
  const preset = CUT_ICON_PRESETS[presetKey] || CUT_ICON_PRESETS.strip;

  if (preset.hotdog) {
    return `
      <svg class="cut-icon ${sizeClass}" viewBox="0 0 96 64" aria-hidden="true" focusable="false">
        <rect class="cut-hotdog-bun" x="10" y="18" rx="12" ry="12" width="76" height="28"></rect>
        <rect class="cut-hotdog-body" x="15" y="24" rx="9" ry="9" width="66" height="16"></rect>
        <path class="cut-hotdog-grill" d="M24 24 L28 40 M38 24 L42 40 M52 24 L56 40 M66 24 L70 40"></path>
      </svg>
    `;
  }

  const fatMarkup = renderIconPaths(preset.fat, "steak-fat");
  const seamMarkup = renderIconPaths(preset.seams, "steak-seam");
  const grainMarkup = renderIconPaths(preset.grain, "steak-grain");
  const marblingMarkup = renderIconCircles(preset.marbling, "steak-marbling");
  const boneMarkup = preset.bone || "";

  return `
    <svg class="cut-icon cut-illustrated ${sizeClass}" viewBox="0 0 96 64" aria-hidden="true" focusable="false">
      <path class="steak-shadow" d="${preset.body}" transform="translate(1.2 1.2)"></path>
      <path class="steak-body" d="${preset.body}"></path>
      ${fatMarkup}
      ${grainMarkup}
      ${seamMarkup}
      ${marblingMarkup}
      ${boneMarkup}
      <path class="steak-outline-secondary" d="${preset.body}" transform="translate(0.7 0.45)"></path>
      <path class="steak-outline" d="${preset.body}"></path>
    </svg>
  `;
}

function getCutIconPresetKey(cut) {
  if (!cut) {
    return "strip";
  }

  const byId = CUT_ICON_BY_ID[cut.id];
  if (byId) {
    return byId;
  }

  const familyPreset = CUT_ICON_BY_FAMILY[getCutFamily(cut)];
  return familyPreset || "strip";
}

function renderIconPaths(paths = [], className) {
  return paths
    .map((pathData) => `<path class="${className}" d="${pathData}"></path>`)
    .join("");
}

function renderIconCircles(circles = [], className) {
  return circles
    .map(
      ([cx, cy, r]) =>
        `<circle class="${className}" cx="${cx}" cy="${cy}" r="${r}"></circle>`
    )
    .join("");
}

function renderExecutiveBrief(cut, summary, signals, profile, topCluster) {
  if (!executiveSynopsis || !executiveHighlights) {
    return;
  }

  const flavorTarget = signals.flavorTarget || deriveFlavorTarget(profile);
  const richnessTarget = signals.richnessTarget || deriveRichnessTarget(profile);
  const textureTarget = signals.textureTarget || deriveTextureTarget(profile);
  const cookWindow = signals.cookWindow || deriveCookWindow(profile);
  const mealFormat = signals.mealFormat || deriveMealFormat(profile);

  executiveSynopsis.textContent = `${cut.name} is your top match for this round. It aligns with your ${flavorTarget.toLowerCase()} flavor target, ${richnessTarget.toLowerCase()} richness preference, and ${textureTarget.toLowerCase()} texture style while staying practical for your cooking lane.`;

  const alternativeText =
    topCluster.length > 1
      ? topCluster
          .slice(1, 3)
          .map((result) => result.cut.name)
          .join(", ")
      : "No close alternatives this round";

  const highlights = [
    `Fit Class: ${summary.primaryFit}.`,
    `Cook Plan: ${summary.bestCookingMatch} (${cookWindow.toLowerCase()}).`,
    `Service Style: ${mealFormat}.`,
    `Bench Strength: ${alternativeText}.`,
  ];

  executiveHighlights.innerHTML = "";
  highlights.forEach((item) => addListItem(executiveHighlights, item));
}

function renderCookingTips(cut) {
  if (!tipsList || !tipsCutLabel) {
    return;
  }

  tipsCutLabel.textContent = `Best practices for ${cut.name}`;
  tipsList.innerHTML = "";

  getTipsForCut(cut).forEach((tip) => addListItem(tipsList, tip));
}

function getTipsForCut(cut) {
  const family = getCutFamily(cut);
  const cutTips = COOKING_TIPS_DB.byCut[cut.id] || [];
  const familyTips =
    COOKING_TIPS_DB.byFamily[family] || COOKING_TIPS_DB.byFamily.Specialty;

  const prioritizedTips = [
    `Method match: ${cut.cooking.method}.`,
    `Target doneness: ${cut.cooking.doneness} (${cut.cooking.temp}).`,
    cut.cooking.note,
    ...cutTips,
    ...familyTips,
  ];

  const uniqueTips = [];
  const seen = new Set();

  prioritizedTips.forEach((tip) => {
    if (!tip || seen.has(tip)) {
      return;
    }
    seen.add(tip);
    uniqueTips.push(tip);
  });

  return uniqueTips.slice(0, 8);
}

function classifyProgram(cut) {
  if (cut.profile.tenderness >= 8 && cut.profile.value <= 4) {
    return "Premium Tender Cuts";
  }
  if (cut.profile.boldness >= 8 && cut.profile.adventure >= 6) {
    return "Flavor-Forward Bistro Cuts";
  }
  if (cut.profile.value >= 7) {
    return "Value / Operational Cuts";
  }
  if (cut.profile.richness >= 8) {
    return "Rich Marbling-Forward Cuts";
  }
  return "Balanced Steakhouse Cuts";
}

function getSecondaryProgram(rankedCuts, primaryProgram) {
  for (const result of rankedCuts.slice(1)) {
    const program = classifyProgram(result.cut);
    if (program !== primaryProgram) {
      return program;
    }
  }
  return primaryProgram;
}

function deriveBestMethod(profile) {
  if (profile.precision >= 8) {
    return "Pan sear + controlled finish";
  }
  if (profile.boldness >= 8) {
    return "High-heat grill + pan sear";
  }
  if (profile.value >= 8) {
    return "Roast / quick-cook adaptable methods";
  }
  return "High-heat grill + pan sear";
}

function deriveBudgetOrientation(profile) {
  if (profile.value >= 8) {
    return "Value-focused";
  }
  if (profile.value >= 6) {
    return "Moderate";
  }
  if (profile.value >= 4) {
    return "Mid-premium";
  }
  return "Selective premium";
}

function deriveSubstitutionFlexibility(profile) {
  if (profile.adventure >= 8) {
    return "High";
  }
  if (profile.adventure >= 5) {
    return "Moderate";
  }
  if (profile.adventure >= 3) {
    return "Limited";
  }
  return "Low (exact cuts preferred)";
}

function deriveFlavorTarget(profile) {
  if (profile.boldness >= 8) {
    return "Bold / savory";
  }
  if (profile.boldness <= 3) {
    return "Clean / mild";
  }
  return "Balanced";
}

function deriveRichnessTarget(profile) {
  if (profile.richness >= 8) {
    return "Very rich";
  }
  if (profile.richness >= 6) {
    return "Rich";
  }
  if (profile.richness <= 3) {
    return "Lean";
  }
  return "Moderate";
}

function deriveTextureTarget(profile) {
  if (profile.tenderness >= 8) {
    return "Very tender";
  }
  if (profile.tenderness <= 4 && profile.boldness >= 7) {
    return "Firmer chew";
  }
  return "Balanced tenderness";
}

function deriveSeasoningStyle(profile) {
  if (profile.precision >= 7 && profile.richness >= 7) {
    return "Butter + herbs";
  }
  if (profile.adventure >= 7 || profile.value >= 7) {
    return "Rub / marinade";
  }
  if (profile.boldness >= 7 && profile.value >= 6) {
    return "Sauce-forward";
  }
  return "Salt + pepper";
}

function derivePortionStyle(profile) {
  if (profile.value >= 9 && profile.precision <= 3) {
    return "Handheld cookout style";
  }
  if (profile.value >= 8) {
    return "Thin-sliced applications";
  }
  if (profile.boldness >= 7 && profile.richness >= 6) {
    return "8-12 oz steakhouse cut";
  }
  if (profile.tenderness >= 8) {
    return "6-8 oz single steak";
  }
  return "Large shareable sliced cut";
}

function deriveCookWindow(profile) {
  if (profile.precision >= 8) {
    return "30-45 minutes";
  }
  if (profile.value >= 8 && profile.precision <= 4) {
    return "10-15 minutes";
  }
  if (profile.boldness >= 8 && profile.adventure >= 7) {
    return "45+ minute project";
  }
  return "20-30 minutes";
}

function deriveMealFormat(profile) {
  if (profile.value >= 9 && profile.precision <= 3) {
    return "Sandwich / bun";
  }
  if (profile.value >= 8) {
    return "Tacos / bowls";
  }
  if (profile.boldness >= 7 && profile.adventure >= 6) {
    return "Sliced board";
  }
  return "Plated steak";
}

function deriveOccasionType(profile) {
  if (profile.value >= 8 && profile.precision <= 5) {
    return "Weeknight dinner";
  }
  if (profile.richness >= 8 && profile.tenderness >= 7) {
    return "Date night";
  }
  if (profile.boldness >= 8 && profile.adventure >= 6) {
    return "Game day / BBQ";
  }
  return "Hosting guests";
}

function derivePriority(profile) {
  if (profile.value >= 8) {
    return "Best value";
  }
  if (profile.precision >= 8) {
    return "Best consistency";
  }
  if (profile.tenderness + profile.richness >= 15) {
    return "Best eating quality";
  }
  return "Best fit for the cooking method";
}

function getTopFamilies(rankedCuts, limit) {
  const familyScores = new Map();

  rankedCuts.slice(0, 10).forEach((result) => {
    const family = getCutFamily(result.cut);
    familyScores.set(family, (familyScores.get(family) || 0) + result.score);
  });

  return [...familyScores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([family]) => family);
}

function getCutFamily(cut) {
  const reference = (cut.imps[0] || "").toLowerCase();

  if (reference.includes("sirloin")) {
    return "Sirloin";
  }
  if (reference.includes("rib")) {
    return "Rib";
  }
  if (reference.includes("chuck")) {
    return "Chuck";
  }
  if (reference.includes("plate")) {
    return "Plate";
  }
  if (reference.includes("flank")) {
    return "Flank";
  }
  if (reference.includes("round")) {
    return "Round";
  }
  if (reference.includes("loin")) {
    return "Loin";
  }
  return "Specialty";
}

function getCostTier(cut) {
  if (cut.profile.value >= 7) {
    return "Value";
  }
  if (cut.profile.value >= 4) {
    return "Mid-Premium";
  }
  return "Premium";
}

function buildProfileVector() {
  const vector = TRAITS.reduce((acc, trait) => {
    acc[trait.key] = 5;
    return acc;
  }, {});

  state.answers.forEach((selectedOptionIndex, questionIndex) => {
    const option = state.questionSet[questionIndex]?.options[selectedOptionIndex];
    if (!option) {
      return;
    }

    Object.entries(option.effects).forEach(([trait, effect]) => {
      vector[trait] = clamp(vector[trait] + effect, 0, 10);
    });
  });

  return vector;
}

function rankCuts(profile, signals = {}) {
  const maxDistance = Math.sqrt(TRAITS.length * Math.pow(10, 2));

  return CUTS.map((cut) => {
    const distance = Math.sqrt(
      TRAITS.reduce((total, trait) => {
        return total + Math.pow(profile[trait.key] - cut.profile[trait.key], 2);
      }, 0)
    );

    const baselineScore = Math.max(
      0,
      Math.round((1 - distance / maxDistance) * 100)
    );
    const adjustedScore = clamp(
      baselineScore +
        getMethodFitAdjustment(cut, signals.method) +
        getBudgetFitAdjustment(cut, signals.budget) +
        getComfortAdjustment(cut, signals.comfort) +
        getPriorityFitAdjustment(cut, signals.priority) +
        getSubstitutionFitAdjustment(cut, signals.substitution) +
        getPortionFitAdjustment(cut, signals.portionStyle) +
        getBoneFitAdjustment(cut, signals.bonePreference) +
        getCookWindowFitAdjustment(cut, signals.cookWindow) +
        getSmokeFitAdjustment(cut, signals.smokeLevel) +
        getFatCapFitAdjustment(cut, signals.fatCapPreference) +
        getMealFormatFitAdjustment(cut, signals.mealFormat) +
        getOccasionFitAdjustment(cut, signals.occasionType),
      0,
      100
    );

    return { cut, score: adjustedScore };
  }).sort((a, b) => {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return getTieBreakerScore(b.cut) - getTieBreakerScore(a.cut);
  });
}

function getTieBreakerScore(cut) {
  const availabilityBias = 10 - cut.profile.adventure;
  const practicalBias = cut.profile.value + cut.profile.precision;
  return availabilityBias + practicalBias;
}

function getMethodFitAdjustment(cut, preferredMethod) {
  if (!preferredMethod) {
    return 0;
  }

  const methodText = cut.cooking.method.toLowerCase();

  if (preferredMethod === "High-heat grill") {
    if (methodText.includes("grill") || methodText.includes("live fire")) {
      return 6;
    }
    if (methodText.includes("sear")) {
      return 2;
    }
    return -3;
  }

  if (preferredMethod === "Pan sear") {
    if (methodText.includes("pan") || methodText.includes("cast-iron")) {
      return 6;
    }
    if (methodText.includes("sear")) {
      return 3;
    }
    return -2;
  }

  if (preferredMethod === "Oven roast + sear") {
    if (methodText.includes("oven") || methodText.includes("reverse")) {
      return 6;
    }
    if (methodText.includes("sear")) {
      return 2;
    }
    return -2;
  }

  if (preferredMethod === "Low-and-slow") {
    if (
      methodText.includes("low") ||
      methodText.includes("smoke") ||
      methodText.includes("marinate")
    ) {
      return 6;
    }
    return -4;
  }

  if (preferredMethod === "Sous vide / precision") {
    if (cut.profile.precision >= 7) {
      return 5;
    }
    if (cut.profile.precision >= 5) {
      return 2;
    }
    return -2;
  }

  return 0;
}

function getBudgetFitAdjustment(cut, budgetOrientation) {
  if (!budgetOrientation) {
    return 0;
  }

  const costTier = getCostTier(cut);

  if (budgetOrientation === "Premium / no strict limit") {
    if (costTier === "Premium") {
      return 5;
    }
    if (costTier === "Mid-Premium") {
      return 2;
    }
    return -2;
  }

  if (budgetOrientation === "Mid-premium") {
    if (costTier === "Mid-Premium") {
      return 4;
    }
    if (costTier === "Premium") {
      return 1;
    }
    return 0;
  }

  if (budgetOrientation === "Moderate") {
    if (costTier === "Mid-Premium") {
      return 3;
    }
    if (costTier === "Value") {
      return 2;
    }
    return -1;
  }

  if (budgetOrientation === "Value-focused") {
    if (costTier === "Value") {
      return 5;
    }
    if (costTier === "Mid-Premium") {
      return 1;
    }
    return -4;
  }

  if (budgetOrientation === "Lowest-cost options first") {
    if (costTier === "Value") {
      return 6;
    }
    if (costTier === "Mid-Premium") {
      return -1;
    }
    return -6;
  }

  return 0;
}

function getComfortAdjustment(cut, comfortLevel) {
  if (!comfortLevel) {
    return 0;
  }

  if (comfortLevel === "Very comfortable") {
    return cut.profile.adventure >= 7 ? 3 : 0;
  }

  if (comfortLevel === "Somewhat comfortable") {
    return cut.profile.adventure >= 7 ? 1 : 0;
  }

  if (comfortLevel === "Neutral") {
    return 0;
  }

  if (comfortLevel === "Prefer familiar cuts only") {
    if (cut.profile.adventure >= 7) {
      return -4;
    }
    if (cut.profile.adventure <= 3) {
      return 1;
    }
    return -1;
  }

  if (comfortLevel === "Need guidance / recipes") {
    if (cut.profile.adventure >= 7) {
      return -5;
    }
    if (cut.profile.adventure <= 4) {
      return 2;
    }
    return -1;
  }

  return 0;
}

function getPriorityFitAdjustment(cut, priority) {
  if (!priority) {
    return 0;
  }

  if (priority === "Best eating quality") {
    if (cut.profile.tenderness >= 8 || cut.profile.richness >= 8) {
      return 3;
    }
    if (cut.profile.value >= 7) {
      return -2;
    }
    return 1;
  }

  if (priority === "Best value") {
    if (cut.profile.value >= 7) {
      return 4;
    }
    if (cut.profile.value <= 3) {
      return -3;
    }
    return 1;
  }

  if (priority === "Best consistency") {
    if (cut.profile.precision >= 7) {
      return 4;
    }
    if (cut.profile.precision >= 5) {
      return 2;
    }
    return -2;
  }

  if (priority === "Best fit for the cooking method") {
    return cut.profile.precision >= 6 ? 2 : 0;
  }

  return 0;
}

function getSubstitutionFitAdjustment(cut, substitutionFlexibility) {
  if (!substitutionFlexibility) {
    return 0;
  }

  if (substitutionFlexibility === "High (cost-based)") {
    if (cut.profile.value >= 7) {
      return 3;
    }
    if (cut.profile.value <= 3) {
      return -2;
    }
    return 1;
  }

  if (substitutionFlexibility === "Moderate (performance-based)") {
    if (cut.profile.precision >= 6) {
      return 2;
    }
    return 0;
  }

  if (substitutionFlexibility === "Limited") {
    if (cut.profile.adventure <= 5) {
      return 2;
    }
    if (cut.profile.adventure >= 8) {
      return -1;
    }
    return 0;
  }

  if (substitutionFlexibility === "Low (exact cuts only)") {
    if (cut.profile.adventure <= 4) {
      return 2;
    }
    if (cut.profile.adventure >= 7) {
      return -2;
    }
    return 0;
  }

  return 0;
}

function getPortionFitAdjustment(cut, portionStyle) {
  if (!portionStyle) {
    return 0;
  }

  const methodText = cut.cooking.method.toLowerCase();
  const family = getCutFamily(cut);

  if (portionStyle === "6-8 oz single steak") {
    if (cut.profile.tenderness >= 8) {
      return 3;
    }
    if (cut.profile.value >= 8) {
      return -1;
    }
    return 1;
  }

  if (portionStyle === "8-12 oz steakhouse cut") {
    if (family === "Rib" || family === "Loin" || family === "Sirloin") {
      return 3;
    }
    if (family === "Round") {
      return -2;
    }
    return 0;
  }

  if (portionStyle === "Large shareable sliced cut") {
    if (
      methodText.includes("slice") ||
      cut.id === "tri_tip" ||
      cut.id === "picanha" ||
      cut.id === "bavette" ||
      cut.id === "london_broil_top_round"
    ) {
      return 4;
    }
    if (cut.profile.tenderness >= 8 && cut.profile.value <= 4) {
      return -2;
    }
    return 1;
  }

  if (portionStyle === "Thin-sliced applications") {
    if (methodText.includes("slice") || methodText.includes("thin")) {
      return 4;
    }
    if (cut.profile.value >= 7 && cut.profile.tenderness <= 6) {
      return 2;
    }
    return -1;
  }

  if (portionStyle === "Handheld cookout style") {
    if (cut.id === "all_beef_uncured_hot_dog") {
      return 9;
    }
    if (methodText.includes("grill") && cut.profile.value >= 7 && cut.profile.adventure <= 4) {
      return 1;
    }
    return -4;
  }

  return 0;
}

const BONE_IN_CUT_IDS = new Set(["bone_in_strip", "porterhouse", "tbone"]);
const SMOKE_FRIENDLY_CUT_IDS = new Set([
  "tri_tip",
  "plate_short_rib_boneless",
  "picanha",
  "bavette",
  "flank",
  "outside_skirt",
  "chuck_eye",
]);
const FAT_CAP_FORWARD_CUT_IDS = new Set(["picanha", "ribeye", "ribeye_cap", "bone_in_strip"]);
const SLICED_BOARD_CUT_IDS = new Set([
  "tri_tip",
  "picanha",
  "bavette",
  "flank",
  "london_broil_top_round",
  "plate_short_rib_boneless",
]);
const PREMIUM_OCCASION_IDS = new Set([
  "filet_mignon",
  "ribeye",
  "ribeye_cap",
  "strip",
  "porterhouse",
  "tbone",
]);
const CASUAL_CROWD_IDS = new Set([
  "all_beef_uncured_hot_dog",
  "tri_tip",
  "plate_short_rib_boneless",
  "bavette",
  "top_sirloin",
]);

function getBoneFitAdjustment(cut, bonePreference) {
  if (!bonePreference || bonePreference === "Either") {
    return 0;
  }

  const isBoneInCut = BONE_IN_CUT_IDS.has(cut.id);

  if (bonePreference === "Bone-in") {
    return isBoneInCut ? 5 : -2;
  }

  if (bonePreference === "Boneless") {
    return isBoneInCut ? -4 : 2;
  }

  return 0;
}

function getCookWindowFitAdjustment(cut, cookWindow) {
  if (!cookWindow) {
    return 0;
  }

  const methodText = cut.cooking.method.toLowerCase();
  const quickFriendly =
    cut.id === "all_beef_uncured_hot_dog" ||
    methodText.includes("quick") ||
    methodText.includes("very hot sear") ||
    (cut.profile.precision <= 4 && cut.profile.value >= 6);

  const projectFriendly =
    methodText.includes("slow") ||
    methodText.includes("braise") ||
    methodText.includes("reverse") ||
    cut.profile.precision >= 7;

  if (cookWindow === "10-15 minutes") {
    return quickFriendly ? 5 : -3;
  }

  if (cookWindow === "20-30 minutes") {
    if (quickFriendly || cut.profile.precision <= 6) {
      return 2;
    }
    return 0;
  }

  if (cookWindow === "30-45 minutes") {
    if (cut.profile.precision >= 6) {
      return 3;
    }
    return -1;
  }

  if (cookWindow === "45+ minute project") {
    return projectFriendly ? 5 : -3;
  }

  return 0;
}

function getSmokeFitAdjustment(cut, smokeLevel) {
  if (!smokeLevel) {
    return 0;
  }

  const methodText = cut.cooking.method.toLowerCase();
  const smokeFriendly =
    SMOKE_FRIENDLY_CUT_IDS.has(cut.id) ||
    methodText.includes("smoke") ||
    methodText.includes("bbq") ||
    methodText.includes("grill");

  if (smokeLevel === "None") {
    return smokeFriendly && cut.profile.adventure >= 6 ? -2 : 1;
  }
  if (smokeLevel === "Light") {
    return smokeFriendly ? 2 : 0;
  }
  if (smokeLevel === "Medium") {
    return smokeFriendly ? 4 : -1;
  }
  if (smokeLevel === "Heavy") {
    return smokeFriendly ? 6 : -3;
  }

  return 0;
}

function getFatCapFitAdjustment(cut, fatCapPreference) {
  if (!fatCapPreference) {
    return 0;
  }

  const fatForward = FAT_CAP_FORWARD_CUT_IDS.has(cut.id) || cut.profile.richness >= 8;

  if (fatCapPreference === "Trimmed lean") {
    return fatForward ? -4 : 2;
  }
  if (fatCapPreference === "Some fat edge") {
    return fatForward ? 1 : 0;
  }
  if (fatCapPreference === "Like fat cap") {
    return fatForward ? 3 : -1;
  }
  if (fatCapPreference === "Love fat cap") {
    return fatForward ? 5 : -2;
  }

  return 0;
}

function getMealFormatFitAdjustment(cut, mealFormat) {
  if (!mealFormat) {
    return 0;
  }

  const methodText = cut.cooking.method.toLowerCase();

  if (mealFormat === "Plated steak") {
    if (getCutFamily(cut) === "Rib" || getCutFamily(cut) === "Loin") {
      return 4;
    }
    if (cut.profile.tenderness >= 8) {
      return 2;
    }
    return -1;
  }

  if (mealFormat === "Sliced board") {
    if (SLICED_BOARD_CUT_IDS.has(cut.id) || methodText.includes("slice")) {
      return 5;
    }
    return -1;
  }

  if (mealFormat === "Tacos / bowls") {
    if (methodText.includes("slice") || cut.profile.value >= 7) {
      return 3;
    }
    return 0;
  }

  if (mealFormat === "Sandwich / bun") {
    if (cut.id === "all_beef_uncured_hot_dog") {
      return 8;
    }
    if (cut.profile.value >= 8 && cut.profile.adventure <= 4) {
      return 1;
    }
    return -3;
  }

  return 0;
}

function getOccasionFitAdjustment(cut, occasionType) {
  if (!occasionType) {
    return 0;
  }

  if (occasionType === "Weeknight dinner") {
    if (cut.profile.value >= 7 && cut.profile.precision <= 6) {
      return 3;
    }
    return 0;
  }

  if (occasionType === "Date night") {
    if (PREMIUM_OCCASION_IDS.has(cut.id)) {
      return 5;
    }
    if (cut.profile.value >= 8) {
      return -2;
    }
    return 1;
  }

  if (occasionType === "Hosting guests") {
    if (SLICED_BOARD_CUT_IDS.has(cut.id) || cut.profile.boldness >= 8) {
      return 3;
    }
    return 0;
  }

  if (occasionType === "Game day / BBQ") {
    if (CASUAL_CROWD_IDS.has(cut.id) || SMOKE_FRIENDLY_CUT_IDS.has(cut.id)) {
      return 4;
    }
    return -1;
  }

  return 0;
}

function getTopCluster(rankedCuts, topScore) {
  return rankedCuts.filter((result) => result.score >= topScore - 5).slice(0, 4);
}

function renderFitNotes(
  profile,
  cut,
  summary,
  signals,
  hasCloseAlternatives,
  topCluster
) {
  fitNotesList.innerHTML = "";
  fitNotesList.className = "clean-list fit-notes";

  const notes = buildFitNotes(
    profile,
    cut,
    summary,
    signals,
    hasCloseAlternatives,
    topCluster
  );
  notes.forEach((note) => addListItem(fitNotesList, note));
}

function buildFitNotes(
  profile,
  cut,
  summary,
  signals,
  hasCloseAlternatives,
  topCluster
) {
  const preferenceSnapshot = buildPreferenceSnapshot(signals, profile);
  const alignmentDrivers = getTopAlignmentReasons(profile, cut, 3);
  const notes = [
    `Preference Match: ${preferenceSnapshot}.`,
    `Core Alignment: ${alignmentDrivers.join(", ")}.`,
    `Best Cooking Lane: ${summary.bestCookingMatch} with ${cut.cooking.doneness.toLowerCase()} finish.`,
    `Business Lens: ${summary.budgetOrientation}; substitutions ${summary.substitutionFlexibility.toLowerCase()}.`,
  ];

  if (hasCloseAlternatives) {
    const alternatives = topCluster
      .slice(1)
      .map((result) => result.cut.name)
      .join(", ");
    notes.push(`Close Alternatives: ${alternatives}.`);
  }

  notes.push(`Recommendation Logic: ${cut.rationale}`);
  return notes;
}

function buildPreferenceSnapshot(signals, profile) {
  const flavor = signals.flavorTarget || deriveFlavorTarget(profile);
  const richness = signals.richnessTarget || deriveRichnessTarget(profile);
  const texture = signals.textureTarget || deriveTextureTarget(profile);
  const method = signals.method || deriveBestMethod(profile);
  return `${flavor} flavor, ${richness.toLowerCase()} richness, ${texture.toLowerCase()} texture, and ${method.toLowerCase()} cooking`;
}

function getTopAlignmentReasons(profile, cut, count = 3) {
  const reasonLabels = {
    richness: "richness level",
    tenderness: "tenderness target",
    boldness: "beef flavor intensity",
    adventure: "cut familiarity comfort",
    value: "value expectations",
    precision: "cooking-control style",
  };

  return TRAITS.map((trait) => {
    const userValue = profile[trait.key];
    const cutValue = cut.profile[trait.key];
    const alignment = 10 - Math.abs(userValue - cutValue);
    const weightedScore = alignment * (0.6 + userValue / 10);
    return {
      key: trait.key,
      score: weightedScore,
    };
  })
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((item) => reasonLabels[item.key]);
}

function addListItem(target, value) {
  const listItem = document.createElement("li");
  listItem.textContent = value;
  target.appendChild(listItem);
}

function addKeyValueItem(target, label, value) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `<span class="kv-key">${label}</span><span class="kv-value">${value}</span>`;
  target.appendChild(listItem);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
