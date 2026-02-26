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
    prompt: "How strong do you want the beef flavor?",
    detail: "Pick one.",
    options: [
      {
        label: "Mild, clean beef flavor",
        impact: "Mild",
        effects: { boldness: -2, tenderness: 1, richness: -1, precision: 1 },
        signal: { flavorTarget: "Clean / mild" },
      },
      {
        label: "Balanced beef flavor",
        impact: "Balanced",
        effects: { boldness: 1, tenderness: 1 },
        signal: { flavorTarget: "Balanced" },
      },
      {
        label: "Bold steakhouse flavor",
        impact: "Bold",
        effects: { boldness: 2, richness: 1 },
        signal: { flavorTarget: "Bold / savory" },
      },
      {
        label: "Very bold char-forward flavor",
        impact: "Intense",
        effects: { boldness: 3, adventure: 1, precision: -1 },
        signal: { flavorTarget: "Intense / char-forward" },
      },
    ],
  },
  {
    type: "Marbling",
    prompt: "How much marbling do you want?",
    detail: "Pick one.",
    options: [
      {
        label: "Lean (lower marbling)",
        impact: "Lean",
        effects: { richness: -2, value: 1, precision: 1 },
        signal: { richnessTarget: "Lean" },
      },
      {
        label: "Moderate marbling",
        impact: "Balanced",
        effects: { richness: 1, tenderness: 1 },
        signal: { richnessTarget: "Moderate" },
      },
      {
        label: "Rich marbling",
        impact: "Rich",
        effects: { richness: 2, boldness: 1, value: -1 },
        signal: { richnessTarget: "Rich" },
      },
      {
        label: "Very rich marbling",
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
    type: "Cut Familiarity",
    prompt: "How comfortable are you choosing beef cuts?",
    detail: "Pick one.",
    options: [
      {
        label: "I can buy and cook specialty cuts",
        impact: "Expert",
        effects: { adventure: 3, precision: 2, boldness: 1 },
        signal: {
          comfort: "Expert cut fluency",
          expertiseBand: "Expert",
        },
      },
      {
        label: "I know the main steak cuts well",
        impact: "Comfortable",
        effects: { adventure: 1, precision: 1 },
        signal: {
          comfort: "Comfortable with common cuts",
          expertiseBand: "Intermediate",
        },
      },
      {
        label: "I know a few common cuts",
        impact: "Basic",
        effects: { adventure: -1, precision: 1 },
        signal: {
          comfort: "Familiar basics",
          expertiseBand: "Beginner",
        },
      },
      {
        label: "I want straightforward, familiar cuts",
        impact: "Guided",
        effects: { adventure: -1, precision: -1, value: 1 },
        signal: {
          comfort: "Need guidance / recipes",
          expertiseBand: "Beginner",
        },
      },
    ],
  },
  {
    type: "Cuisine",
    prompt: "What style are you cooking today?",
    detail: "Pick one.",
    options: [
      {
        label: "Steakhouse",
        impact: "Steakhouse",
        effects: { richness: 1, tenderness: 2, precision: 1, value: -1 },
        signal: { cuisineStyle: "Steakhouse" },
      },
      {
        label: "American grill / cookout",
        impact: "Grill",
        effects: { boldness: 1, value: 2, precision: -1 },
        signal: { cuisineStyle: "American grill" },
      },
      {
        label: "Mexican / fajitas",
        impact: "Mexican",
        effects: { boldness: 2, adventure: 1, value: 1 },
        signal: { cuisineStyle: "Mexican / fajitas" },
      },
      {
        label: "Italian / comfort dishes",
        impact: "Italian",
        effects: { tenderness: 1, value: 1, boldness: -1 },
        signal: { cuisineStyle: "Italian / comfort dishes" },
      },
      {
        label: "BBQ / smokehouse",
        impact: "BBQ",
        effects: { boldness: 2, adventure: 1, richness: 1 },
        signal: { cuisineStyle: "BBQ / smokehouse" },
      },
      {
        label: "Asian / quick-cook",
        impact: "Quick-cook",
        effects: { precision: 1, value: 1, adventure: 1 },
        signal: { cuisineStyle: "Asian / quick-cook" },
      },
      {
        label: "No specific cuisine",
        impact: "Open",
        effects: {},
        signal: { cuisineStyle: "No specific cuisine" },
      },
    ],
  },
  {
    type: "Specialty Cuts",
    prompt: "How familiar are you with lesser-known cuts?",
    detail: "Pick one.",
    options: [
      {
        label: "Very familiar",
        impact: "High familiarity",
        effects: { adventure: 2, precision: 1, boldness: 1 },
        signal: { specialtyComfort: "High" },
      },
      {
        label: "Somewhat familiar",
        impact: "Working knowledge",
        effects: { adventure: 1, precision: 1 },
        signal: { specialtyComfort: "Medium" },
      },
      {
        label: "Mostly classic cuts",
        impact: "Classic-first",
        effects: { adventure: -1, precision: 1 },
        signal: { specialtyComfort: "Low" },
      },
      {
        label: "Not familiar",
        impact: "Guided",
        effects: { adventure: -2, value: 1, precision: -1 },
        signal: { specialtyComfort: "Minimal" },
      },
    ],
  },
  {
    type: "Technique Depth",
    prompt: "Which cooking style fits you best?",
    detail: "Pick one.",
    options: [
      {
        label: "Temp-driven reverse sear",
        impact: "Advanced control",
        effects: { precision: 2, tenderness: 1, adventure: 1 },
        signal: { advancedTechnique: "Temp-driven reverse sear" },
      },
      {
        label: "Two-zone grill control",
        impact: "Controlled fire",
        effects: { precision: 1, boldness: 1 },
        signal: { advancedTechnique: "Two-zone heat control" },
      },
      {
        label: "Marinade + hot sear",
        impact: "Flavor-first",
        effects: { boldness: 1, value: 1, adventure: 1 },
        signal: { advancedTechnique: "Marinade and high heat" },
      },
      {
        label: "Simple one-step cook",
        impact: "Simple",
        effects: { tenderness: 1, precision: -1, adventure: -1 },
        signal: { advancedTechnique: "Simple single-step" },
      },
    ],
  },
  {
    type: "Purchase Precision",
    prompt: "How specific are you at the meat case?",
    detail: "Pick one.",
    options: [
      {
        label: "Exact cut and thickness",
        impact: "Spec-driven",
        effects: { precision: 2, adventure: 1 },
        signal: { buyPrecision: "Exact spec" },
      },
      {
        label: "Exact cut, flexible thickness",
        impact: "Cut-specific",
        effects: { precision: 1, adventure: 1 },
        signal: { buyPrecision: "Exact cut flexible thickness" },
      },
      {
        label: "Cut family matters most",
        impact: "Flexible by family",
        effects: { value: 1, precision: 1 },
        signal: { buyPrecision: "Family-level flexibility" },
      },
      {
        label: "I choose what looks best",
        impact: "Open choice",
        effects: { value: 1, adventure: -1, precision: -1 },
        signal: { buyPrecision: "Open with guidance" },
      },
    ],
  },
  {
    type: "Guidance Style",
    prompt: "What kind of recommendation helps most?",
    detail: "Pick one.",
    options: [
      {
        label: "One best cut and simple steps",
        impact: "Direct guidance",
        effects: { precision: 1, adventure: -1 },
        signal: { guidanceLevel: "Single cut + simple steps" },
      },
      {
        label: "Top 3 options with swaps",
        impact: "Option set",
        effects: { value: 1, precision: 1 },
        signal: { guidanceLevel: "Top 3 + swaps" },
      },
      {
        label: "Teach me one new cut each time",
        impact: "Grow skills",
        effects: { adventure: 2, precision: 1 },
        signal: { guidanceLevel: "Learn progressively" },
      },
      {
        label: "Keep it familiar and safe",
        impact: "Familiar-first",
        effects: { adventure: -2, value: 1, precision: 1 },
        signal: { guidanceLevel: "Familiar only" },
      },
    ],
  },
  {
    type: "Doneness",
    prompt: "How done do you like your beef?",
    detail: "Pick one.",
    options: [
      {
        label: "Medium rare",
        impact: "Lower endpoint",
        effects: { boldness: 2, richness: 2, precision: 2, tenderness: 1 },
        signal: { doneness: "Medium rare" },
      },
      {
        label: "Medium",
        impact: "Balanced",
        effects: { tenderness: 1, precision: 1 },
        signal: { doneness: "Medium" },
      },
      {
        label: "Medium well",
        impact: "Higher endpoint",
        effects: { value: 1, boldness: -1, richness: -1 },
        signal: { doneness: "Medium well" },
      },
      {
        label: "Well done",
        impact: "Highest endpoint",
        effects: { value: 1, tenderness: -1, boldness: -2, richness: -2 },
        signal: { doneness: "Well done" },
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
        effects: { precision: 1, tenderness: 1, adventure: -1 },
        signal: {
          seasoningStyle: "Salt + pepper",
          seasoningIntent: "Simple prep",
        },
      },
      {
        label: "Butter + herbs",
        impact: "Baste",
        effects: { richness: 1, precision: 1 },
        signal: {
          seasoningStyle: "Butter + herbs",
          seasoningIntent: "Quality showcase",
        },
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
    type: "Buying Style",
    prompt: "At the meat case, what usually guides your choice?",
    detail: "Pick one.",
    options: [
      {
        label: "Stick with familiar cuts",
        impact: "Familiar-first",
        effects: { adventure: -2, precision: 1, value: 1 },
        signal: {
          comfort: "Need guidance / recipes",
          expertiseBand: "Beginner",
          budget: "Moderate",
          substitution: "Low (exact cuts only)",
        },
      },
      {
        label: "Best quality within budget",
        impact: "Balanced quality",
        effects: { tenderness: 1, richness: 1, value: 1, precision: 1 },
        signal: {
          comfort: "Comfortable with common cuts",
          expertiseBand: "Intermediate",
          budget: "Mid-premium",
          substitution: "Moderate (performance-based)",
        },
      },
      {
        label: "Best value for the meal",
        impact: "Value-first",
        effects: { value: 2, boldness: 1, adventure: 1 },
        signal: {
          comfort: "Comfortable with common cuts",
          budget: "Value-focused",
          substitution: "High (cost-based)",
        },
      },
      {
        label: "Open to premium standouts",
        impact: "Premium-open",
        effects: { value: -1, richness: 1, tenderness: 1, adventure: 1, precision: 1 },
        signal: {
          comfort: "Expert cut fluency",
          expertiseBand: "Intermediate",
          budget: "Premium / no strict limit",
          substitution: "Limited",
        },
      },
    ],
  },
  {
    type: "Bone",
    prompt: "For premium presentation, bone-in or boneless?",
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
        effects: { boldness: 1, richness: 1, adventure: 2, precision: 1 },
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
    type: "Prep Effort",
    prompt: "How much prep effort are you willing to do?",
    detail: "Pick one.",
    options: [
      {
        label: "Minimal prep only",
        impact: "Low effort",
        effects: { value: 1, precision: -1, adventure: -1, tenderness: 1 },
        signal: { prepEffort: "Low", cookWindow: "10-15 minutes" },
      },
      {
        label: "Quick prep is fine",
        impact: "Moderate effort",
        effects: { precision: 1 },
        signal: { prepEffort: "Medium", cookWindow: "20-30 minutes" },
      },
      {
        label: "Marinade/trim prep is fine",
        impact: "Higher effort",
        effects: { precision: 1, boldness: 1, adventure: 1, value: 1 },
        signal: { prepEffort: "High", cookWindow: "30-45 minutes" },
      },
      {
        label: "I enjoy full project cooks",
        impact: "Project cook",
        effects: { precision: 2, adventure: 2, boldness: 1, value: -1 },
        signal: { prepEffort: "Very high", cookWindow: "45+ minute project" },
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
    type: "Core Preference",
    prompt: "Which steak lane sounds most like you?",
    detail: "Pick one.",
    options: [
      {
        label: "Very tender",
        impact: "Tender-first",
        effects: { tenderness: 2, richness: 1, value: -1, precision: 1 },
        signal: { coreLane: "Tender-first", mealFormat: "Plated steak" },
      },
      {
        label: "Rich and juicy",
        impact: "Rich-first",
        effects: { richness: 2, boldness: 1, value: -1 },
        signal: { coreLane: "Rich-first", mealFormat: "Plated steak" },
      },
      {
        label: "Balanced tender + flavor",
        impact: "Balanced",
        effects: { tenderness: 1, boldness: 1, richness: 1, precision: 1 },
        signal: { coreLane: "Balanced", mealFormat: "Sliced board" },
      },
      {
        label: "Beefy flavor + value",
        impact: "Beefy-value",
        effects: { boldness: 2, value: 2, tenderness: -1 },
        signal: { coreLane: "Beefy-value", mealFormat: "Tacos / bowls" },
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
    type: "Meal Context",
    prompt: "What kind of meal is this?",
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
        effects: { richness: 1 },
        signal: { routineStyle: "Special treat" },
      },
    ],
  },
  {
    type: "Side Plan",
    prompt: "What sides are you serving with it?",
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
        label: "Saucy sides",
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
  "cuisine",
  "specialty_cuts",
  "advanced_technique",
  "butcher_precision",
  "guidance_level",
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
    prompt: "How strong do you want the beef flavor?",
    detail: "Pick one.",
  },
  richness: {
    type: "Marbling",
    prompt: "How much marbling do you want?",
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
    type: "Cut Familiarity",
    prompt: "How comfortable are you choosing beef cuts?",
    detail: "Pick one.",
  },
  cuisine: {
    type: "Cuisine",
    prompt: "What style are you cooking today?",
    detail: "Pick one.",
  },
  specialty_cuts: {
    type: "Specialty Cuts",
    prompt: "How familiar are you with lesser-known cuts?",
    detail: "Pick one.",
  },
  advanced_technique: {
    type: "Technique Depth",
    prompt: "Which cooking style fits you best?",
    detail: "Pick one.",
  },
  butcher_precision: {
    type: "Purchase Precision",
    prompt: "How specific are you at the meat case?",
    detail: "Pick one.",
  },
  guidance_level: {
    type: "Guidance Style",
    prompt: "What kind of recommendation helps most?",
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
    type: "Buying Style",
    prompt: "At the meat case, what usually guides your choice?",
    detail: "Pick one.",
  },
  bone: {
    type: "Bone",
    prompt: "Bone-in, boneless, or either?",
    detail: "Pick one.",
  },
  cook_window: {
    type: "Prep Effort",
    prompt: "How much prep effort are you willing to do?",
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
    type: "Core Preference",
    prompt: "Which steak lane sounds most like you?",
    detail: "Pick one.",
  },
  leftovers: {
    type: "Leftovers",
    prompt: "Any leftovers planned?",
    detail: "Pick one.",
  },
  occasion: {
    type: "Meal Context",
    prompt: "What kind of meal is this?",
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
    type: "Side Plan",
    prompt: "What sides are you serving with it?",
    detail: "Pick one.",
  },
};

const ALT_QUESTION_COPY_2 = {
  flavor: {
    type: "Flavor Preference",
    prompt: "How strong should the beef flavor be?",
    detail: "Pick one.",
  },
  richness: {
    type: "Marbling Level",
    prompt: "How much marbling do you want?",
    detail: "Pick one.",
  },
  texture: {
    type: "Texture Preference",
    prompt: "What bite do you want?",
    detail: "Pick one.",
  },
  method: {
    type: "Heat Plan",
    prompt: "How will you cook it?",
    detail: "Pick one.",
  },
  comfort: {
    type: "Cut Knowledge",
    prompt: "How comfortable are you choosing beef cuts?",
    detail: "Pick one.",
  },
  cuisine: {
    type: "Cuisine Style",
    prompt: "Which cooking style best fits this meal?",
    detail: "Pick one.",
  },
  specialty_cuts: {
    type: "Specialty",
    prompt: "How familiar are you with lesser-known cuts?",
    detail: "Pick one.",
  },
  advanced_technique: {
    type: "Technique",
    prompt: "Which cooking style fits you best?",
    detail: "Pick one.",
  },
  butcher_precision: {
    type: "Butcher Ask",
    prompt: "How specific are you at the meat case?",
    detail: "Pick one.",
  },
  guidance_level: {
    type: "Guidance",
    prompt: "What kind of recommendation helps most?",
    detail: "Pick one.",
  },
  doneness: {
    type: "Finish",
    prompt: "How done do you like your beef?",
    detail: "Pick one.",
  },
  seasoning: {
    type: "Seasoning Style",
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
    type: "Case Style",
    prompt: "At the meat case, what usually guides your choice?",
    detail: "Pick one.",
  },
  bone: {
    type: "Bone",
    prompt: "Bone-in, boneless, or either?",
    detail: "Pick one.",
  },
  cook_window: {
    type: "Prep",
    prompt: "How much prep effort are you willing to do?",
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
    type: "Steak Lane",
    prompt: "Which steak lane sounds most like you?",
    detail: "Pick one.",
  },
  leftovers: {
    type: "Leftovers",
    prompt: "Any leftovers planned?",
    detail: "Pick one.",
  },
  occasion: {
    type: "Meal Context",
    prompt: "What kind of meal is this?",
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
    type: "Side Plan",
    prompt: "What sides are you serving with it?",
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

const QUESTION_HISTORY_KEY = "beef_cut_fit_question_history_v2";
const QUESTION_LAST_SET_KEY = "beef_cut_fit_last_set_v2";
const ASSESSMENT_QUESTION_COUNT = 15;
const INTAKE_GROUPS = ["comfort", "cuisine"];
const COMMON_DYNAMIC_GROUPS = [
  "flavor",
  "richness",
  "texture",
  "doneness",
  "seasoning",
  "priority",
  "flexibility",
  "cook_window",
  "meal_format",
];
const EXPERT_DYNAMIC_GROUPS = [
  "specialty_cuts",
  "smoke",
  "fat_cap",
  "crust",
];
const INTERMEDIATE_DYNAMIC_GROUPS = [
  "specialty_cuts",
  "smoke",
  "fat_cap",
  "crust",
];
const BEGINNER_DYNAMIC_GROUPS = [
  "guidance_level",
  "routine",
  "chew",
];
const CUISINE_PRIORITY_GROUPS = {
  Steakhouse: [
    "doneness",
    "richness",
    "meal_format",
    "crust",
    "priority",
    "seasoning",
  ],
  "American grill": [
    "meal_format",
    "cook_window",
    "seasoning",
    "flexibility",
    "priority",
    "smoke",
  ],
  "Mexican / fajitas": [
    "meal_format",
    "seasoning",
    "specialty_cuts",
    "crust",
    "cook_window",
    "priority",
  ],
  "Italian / comfort dishes": [
    "seasoning",
    "guidance_level",
    "cook_window",
    "meal_format",
    "priority",
  ],
  "BBQ / smokehouse": [
    "smoke",
    "cook_window",
    "meal_format",
    "fat_cap",
    "crust",
    "seasoning",
  ],
  "Asian / quick-cook": [
    "cook_window",
    "meal_format",
    "seasoning",
    "specialty_cuts",
    "texture",
    "priority",
    "smoke",
  ],
};
const QUESTION_RELEVANCE_NOTES = {
  flavor:
    "This sets flavor intensity. Lighter answers favor cleaner, easier cuts; bolder answers prioritize deeper beef flavor and char-friendly cuts.",
  richness:
    "This sets marbling (intermuscular fat) preference. More marbling typically improves flavor intensity, juiciness, and perceived tenderness.",
  texture:
    "This sets bite preference. Tender answers lift soft-bite cuts; firmer answers lift meaty, beef-forward muscles.",
  method:
    "This sets heat compatibility. We boost cuts that perform reliably with your cooking method.",
  comfort:
    "This sets complexity range. Higher comfort allows specialty cuts; lower comfort keeps recommendations familiar and easier to execute.",
  cuisine:
    "This sets dish context. Steakhouse favors premium plated cuts; American grill favors cookout/value-friendly cuts and handheld formats.",
  specialty_cuts:
    "This confirms how far to go beyond common cuts. High comfort widens the recommendation pool; low comfort narrows it.",
  advanced_technique:
    "This sets technical fit. We match cuts to the cooking control and prep depth you actually want to use.",
  butcher_precision:
    "This sets purchasing precision. Exact preferences favor spec-sensitive cuts; flexible preferences favor easier substitutions.",
  guidance_level:
    "This sets recommendation format. We tune for simple direction vs exploratory options based on your preference.",
  doneness:
    "This sets finish target. Cuts that hold quality at your preferred doneness are ranked higher.",
  seasoning:
    "This sets seasoning lane. Simple prep favors cleaner high-quality cuts; rub/sauce lanes favor cuts that carry stronger seasoning.",
  portion:
    "This sets service format. We shift between plated steaks, sliced board cuts, tacos/bowls, or handheld options.",
  budget:
    "This sets spend range. Premium answers keep higher-end cuts active; value answers prioritize price-performance options.",
  priority:
    "This sets scoring emphasis. Your priority drives the final tie-break between otherwise similar cuts.",
  flexibility:
    "This captures buying behavior at the meat case. We infer how wide backup options should be across Levels 1-4.",
  bone:
    "This sets bone profile. Bone-in preference elevates bone-in cuts; boneless preference filters toward boneless options.",
  cook_window:
    "This captures prep tolerance. We convert this into a practical cook window to sort fast-turn versus project cuts.",
  smoke:
    "This sets smoke intensity fit. Higher smoke preference boosts cuts that hold up under fire and longer cook paths.",
  fat_cap:
    "This sets fat-edge tolerance. Lean preferences reduce fat-forward cuts; higher tolerance increases them.",
  chew:
    "This sets chew profile. Lower chew favors tender cuts; higher chew allows firmer cuts with stronger beef character.",
  meal_format:
    "This sets your core steak lane. We infer service style (plated, sliced board, tacos/bowls, sandwich/bun) for level placement.",
  leftovers:
    "This sets next-day usability. Leftover-friendly answers boost cuts that reheat and repurpose cleanly.",
  occasion:
    "This sets occasion weighting. Weeknight answers favor practicality; special-event answers favor presentation.",
  crust:
    "This sets sear intensity. High-crust answers elevate cuts that can take aggressive surface heat.",
  routine:
    "This sets purchase cadence. Frequent buyers get consistency/value emphasis; occasional buyers can lean premium.",
  pairing:
    "This sets plate balance. Side choices help us avoid over- or under-rich combinations for the full meal.",
};

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
    id: "tomahawk_ribeye",
    name: "Tomahawk Ribeye",
    tagline: "Bone-in ribeye presentation with premium visual impact.",
    rationale:
      "Tomahawk ribeye fits premium steakhouse intent when the user wants rich flavor, showpiece plating, and controlled high-heat execution.",
    profile: {
      richness: 9,
      tenderness: 7,
      boldness: 9,
      adventure: 5,
      value: 1,
      precision: 6,
    },
    imps: [
      "1103 - Beef Rib, Rib Steak, Bone-In (Tomahawk/Frenched style reference)",
      "11103A - Beef Rib Steak, Bone-In, Frenched (market reference)",
    ],
    cooking: {
      method: "Two-zone grill or reverse sear with indirect finish",
      doneness: "Medium-rare",
      temp: "130-136F final internal temperature",
      note: "Use indirect heat to finish evenly due to thickness and bone mass.",
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
    name: "Bone-In New York Strip",
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
    tagline: "Maximum tenderness with a low-marbling profile.",
    rationale:
      "Tenderloin is indicated when tenderness and precision outrank marbling richness and maximal beef intensity.",
    profile: {
      richness: 2,
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
    id: "filet_medallions",
    name: "Filet Medallions",
    tagline: "Tenderloin medallion format for fast, refined portioned service.",
    rationale:
      "Filet medallions are selected when tenderness, quick cook time, and portion control are prioritized over intense beef flavor.",
    profile: {
      richness: 2,
      tenderness: 9,
      boldness: 4,
      adventure: 3,
      value: 2,
      precision: 8,
    },
    imps: [
      "1190M - Beef Loin, Tenderloin Medallions, Boneless (market reference)",
    ],
    cooking: {
      method: "Fast pan sear with careful carryover control",
      doneness: "Rare to medium-rare",
      temp: "124-132F final internal temperature",
      note: "Because medallions are small, pull early and rest briefly.",
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
    tomahawk_ribeye: [
      "Start with indirect heat, then finish with a hard sear to prevent surface burn.",
      "Rotate away from direct flame when bone side starts shielding one edge.",
    ],
    strip: [
      "Score the fat edge lightly to limit curling during sear.",
      "Sear fat-edge side first to improve rendered bite.",
    ],
    filet_mignon: [
      "Wrap with butcher twine for more even shape and doneness.",
      "High-heat sear first, then finish gently to avoid gray bands.",
    ],
    filet_medallions: [
      "Use a very hot pan and short cook windows on each side.",
      "Rest briefly (2-4 minutes) so juices redistribute without carryover overshoot.",
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
    all_beef_uncured_hot_dog: [
      "Warm gently first, then blister over direct heat for snap without splitting.",
      "Roll frequently to brown evenly on all sides.",
      "Choose 100% Angus beef franks for fuller beef flavor and better bite.",
      "Toast the bun and apply condiments after the dog is off heat.",
    ],
  },
};

const METHOD_COLUMN_CONFIG = [
  { key: "grill", title: "Grill / Open Fire" },
  { key: "pan", title: "Pan Sear" },
  { key: "oven", title: "Oven / Reverse" },
  { key: "slow", title: "Low-and-Slow / Smoke" },
];

const METHOD_TIP_LIBRARY = {
  grill: [
    "Preheat hard, oil lightly, and sear over clean grates for strong crust.",
    "Use direct heat for color and move off-flame to finish temperature.",
    "Flip frequently for more even doneness on thicker cuts.",
  ],
  pan: [
    "Use a heavy pan and let it fully preheat before protein hits the surface.",
    "Keep surface dry and avoid crowding to prevent steaming.",
    "Baste in the final minute when fat content supports it.",
  ],
  oven: [
    "Start low for even internal rise, then sear hard at the end.",
    "Use a probe thermometer for tighter endpoint control.",
    "Rest on a rack to keep the crust from softening.",
  ],
  slow: [
    "Favor steady pit temperature and avoid frequent lid-open checks.",
    "Hold wrapped/rested before slicing so juices reabsorb.",
    "Season in layers for long cooks: base salt first, then finishing accent.",
  ],
};

const state = {
  currentQuestion: 0,
  questionSet: [],
  answers: [],
  dynamicSetBuilt: false,
  questionSelection: null,
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
const quickReadNarrative = document.getElementById("quickReadNarrative");
const executiveSynopsis = document.getElementById("executiveSynopsis");
const executiveHighlights = document.getElementById("executiveHighlights");
const fitNotesList = document.getElementById("fitNotesList");
const cookingList = document.getElementById("cookingList");
const tier1List = document.getElementById("tier1List");
const tier2List = document.getElementById("tier2List");
const tier3List = document.getElementById("tier3List");
const tier4List = document.getElementById("tier4List");
const tier1Title = document.getElementById("tier1Title");
const tier2Title = document.getElementById("tier2Title");
const tier3Title = document.getElementById("tier3Title");
const tier4Title = document.getElementById("tier4Title");
const tipsCutLabel = document.getElementById("tipsCutLabel");
const tipsColumns = document.getElementById("tipsColumns");

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
  state.dynamicSetBuilt = false;
  state.questionSelection = createQuestionSelectionState();
  state.questionSet = selectQuestionsForGroups(INTAKE_GROUPS, state.questionSelection);
  state.answers = Array.from({ length: state.questionSet.length }, () => null);
}

function createQuestionSelectionState() {
  return {
    history: new Set(readStoredArray(QUESTION_HISTORY_KEY)),
    lastSet: new Set(readStoredArray(QUESTION_LAST_SET_KEY)),
    selectedIds: [],
  };
}

function selectQuestionsForGroups(groups, selectionState) {
  const selected = [];

  groups.forEach((group) => {
    const pickedQuestion = pickQuestionForGroup(group, selectionState);
    if (!pickedQuestion) {
      return;
    }

    selected.push(pickedQuestion);
    selectionState.selectedIds.push(pickedQuestion.id);
  });

  return selected;
}

function pickQuestionForGroup(group, selectionState) {
  const candidates = QUESTION_POOL.filter((question) => question.group === group);
  if (candidates.length === 0) {
    return null;
  }

  const selectedIdSet = new Set(selectionState.selectedIds);
  const available = candidates.filter((question) => !selectedIdSet.has(question.id));
  const source = available.length > 0 ? available : candidates;
  const notInLastSet = source.filter((question) => !selectionState.lastSet.has(question.id));
  const unseen = notInLastSet.filter((question) => !selectionState.history.has(question.id));
  const fallbackUnseen = source.filter((question) => !selectionState.history.has(question.id));
  const pool =
    unseen.length > 0
      ? unseen
      : notInLastSet.length > 0
      ? notInLastSet
      : fallbackUnseen.length > 0
      ? fallbackUnseen
      : source;

  return pickRandom(pool) || source[0];
}

function buildDynamicQuestionGroups(signals) {
  const expertiseBand = getExpertiseBand(signals);
  const expertiseGroups =
    expertiseBand === "Expert"
      ? EXPERT_DYNAMIC_GROUPS
      : expertiseBand === "Intermediate"
      ? INTERMEDIATE_DYNAMIC_GROUPS
      : BEGINNER_DYNAMIC_GROUPS;

  const dynamicGroups = [...COMMON_DYNAMIC_GROUPS, ...expertiseGroups];
  const cuisinePriority = CUISINE_PRIORITY_GROUPS[signals.cuisineStyle] || [];

  return prioritizeGroups(dynamicGroups, cuisinePriority);
}

function prioritizeGroups(groups, priorityGroups) {
  const ordered = [];

  priorityGroups.forEach((group) => {
    if (groups.includes(group) && !ordered.includes(group)) {
      ordered.push(group);
    }
  });

  groups.forEach((group) => {
    if (!ordered.includes(group)) {
      ordered.push(group);
    }
  });

  return ordered;
}

function getExpertiseBand(signals) {
  if (signals.expertiseBand) {
    return signals.expertiseBand;
  }
  if (signals.comfort === "Expert cut fluency") {
    return "Expert";
  }
  if (signals.comfort === "Comfortable with common cuts") {
    return "Intermediate";
  }
  return "Beginner";
}

function maybeBuildDynamicQuestionSet() {
  if (state.dynamicSetBuilt) {
    return;
  }

  const intakeAnswers = state.answers.slice(0, INTAKE_GROUPS.length);
  if (intakeAnswers.some((answer) => answer === null)) {
    return;
  }

  const intakeSignals = buildAssessmentSignalsForRange(0, INTAKE_GROUPS.length);
  const dynamicGroups = buildDynamicQuestionGroups(intakeSignals);
  const dynamicQuestions = selectQuestionsForGroups(dynamicGroups, state.questionSelection);

  state.questionSet = [...state.questionSet, ...dynamicQuestions];
  state.answers = [
    ...state.answers,
    ...Array.from({ length: dynamicQuestions.length }, () => null),
  ];
  state.dynamicSetBuilt = true;

  persistQuestionSelectionHistory(state.questionSelection);
}

function persistQuestionSelectionHistory(selectionState) {
  const nextHistory = [...selectionState.history, ...selectionState.selectedIds];
  writeStoredArray(
    QUESTION_HISTORY_KEY,
    [...nextHistory].slice(-QUESTION_POOL.length)
  );
  writeStoredArray(QUESTION_LAST_SET_KEY, selectionState.selectedIds);
}

function pickRandom(items) {
  if (items.length === 0) {
    return null;
  }
  return items[Math.floor(Math.random() * items.length)];
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
  maybeBuildDynamicQuestionSet();
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
  const totalQuestions = state.dynamicSetBuilt
    ? state.questionSet.length
    : ASSESSMENT_QUESTION_COUNT;
  const progressPct = ((index + 1) / totalQuestions) * 100;

  progressLabel.textContent = `Question ${index + 1} of ${totalQuestions}`;
  answeredLabel.textContent = `${answered} answered`;
  progressFill.style.width = `${progressPct}%`;

  questionType.innerHTML = buildQuestionTypeMarkup(question);
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

      maybeBuildDynamicQuestionSet();
      const totalQuestionsNow = state.questionSet.length;

      if (index === totalQuestionsNow - 1) {
        showResults();
        return;
      }

      state.currentQuestion += 1;
      renderQuestion();
    });

    optionsWrap.appendChild(card);
  });
}

function buildQuestionTypeMarkup(question) {
  const typeLabel = escapeHtml(question.type || "Question");
  const relevanceNote = escapeHtml(getQuestionRelevanceNote(question));

  return `
    <span class="question-type-label">${typeLabel}</span>
    <span class="question-info" tabindex="0" role="note" aria-label="Why this question matters">
      <span class="question-info-icon" aria-hidden="true">i</span>
      <span class="question-info-tip">${relevanceNote}</span>
    </span>
  `;
}

function getQuestionRelevanceNote(question) {
  if (!question?.group) {
    return "This question helps improve your cut match based on how you cook and eat beef.";
  }
  return (
    QUESTION_RELEVANCE_NOTES[question.group] ||
    "This answer helps refine your cut recommendation and improve fit."
  );
}

function showResults() {
  const profile = buildProfileVector();
  const rawSignals = buildAssessmentSignals();
  const signals = resolveAssessmentSignals(rawSignals, profile);
  const rankedCuts = rankCuts(profile, signals);
  const primary = rankedCuts[0];
  const second = rankedCuts[1];
  const scoreGap = primary.score - (second?.score ?? primary.score);
  const summary = buildProfileSummary(profile, rankedCuts, signals);
  const tiers = buildTierRecommendations(rankedCuts, signals);
  const topCluster = getTopCluster(rankedCuts, primary.score);
  const hasCloseAlternatives = scoreGap <= 5 && topCluster.length > 1;

  primaryCutName.textContent = primary.cut.name;
  primaryCutTagline.textContent = primary.cut.tagline;

  renderQuickRead(primary.cut, summary, signals, topCluster);
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
  const selectedDoneness = signals.doneness || primary.cut.cooking.doneness;
  addKeyValueItem(cookingList, "Lead Option", primary.cut.name);
  addKeyValueItem(cookingList, "Method", primary.cut.cooking.method);
  addKeyValueItem(cookingList, "Your Doneness Target", selectedDoneness);
  addKeyValueItem(cookingList, "Cut Sweet Spot", primary.cut.cooking.doneness);
  addKeyValueItem(cookingList, "Internal Temp", primary.cut.cooking.temp);
  if (hasCloseAlternatives) {
    addKeyValueItem(
      cookingList,
      "Comparison Note",
      "Use Level 1 to choose availability/price, then follow that cut's cooking profile."
    );
  }
  addKeyValueItem(cookingList, "Tip", primary.cut.cooking.note);

  renderTierTitles(tiers.titles);
  renderTierList(tier1List, tiers.tier1, signals, "tier1");
  renderTierList(tier2List, tiers.tier2, signals, "tier2");
  renderTierList(tier3List, tiers.tier3, signals, "tier3");
  renderTierList(tier4List, tiers.tier4, signals, "tier4");
  renderCookingTips(primary.cut);

  quizPanel.classList.add("hidden");
  resultPanel.classList.remove("hidden");
}

function buildAssessmentSignals() {
  return buildAssessmentSignalsForRange(0, state.questionSet.length);
}

function buildAssessmentSignalsForRange(startIndex, endExclusive) {
  const signals = {};
  const safeStart = Math.max(0, startIndex);
  const safeEnd = Math.min(state.questionSet.length, endExclusive);

  for (let questionIndex = safeStart; questionIndex < safeEnd; questionIndex += 1) {
    const selectedOptionIndex = state.answers[questionIndex];
    const option = state.questionSet[questionIndex]?.options[selectedOptionIndex];
    if (!option?.signal) {
      continue;
    }

    Object.entries(option.signal).forEach(([key, value]) => {
      signals[key] = value;
    });
  }

  return signals;
}

function resolveAssessmentSignals(rawSignals, profile) {
  const signals = { ...rawSignals };

  if (!signals.budget) {
    signals.budget = deriveBudgetSignal(signals, profile);
  }

  if (!signals.substitution) {
    signals.substitution = deriveSubstitutionSignal(signals, profile);
  }

  if (!signals.cookWindow) {
    signals.cookWindow = deriveCookWindowFromSignals(signals, profile);
  }

  if (!signals.mealFormat) {
    signals.mealFormat = deriveMealFormatFromSignals(signals, profile);
  }

  if (!signals.method) {
    signals.method = deriveMethodSignal(signals, profile);
  }

  if (!signals.advancedTechnique) {
    signals.advancedTechnique = deriveTechniqueSignal(signals, profile);
  }

  if (!signals.buyPrecision) {
    signals.buyPrecision = deriveBuyPrecisionSignal(signals, profile);
  }

  if (!signals.occasionType) {
    signals.occasionType = deriveOccasionSignal(signals, profile);
  }

  if (!signals.pairingStyle) {
    signals.pairingStyle = derivePairingStyleSignal(signals, profile);
  }

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

function renderQuickRead(cut, summary, signals, topCluster) {
  if (!quickReadNarrative) {
    return;
  }

  const cutScale = deriveCutExecutionScale(cut);
  const cuisineFit =
    signals.cuisineStyle && signals.cuisineStyle !== "No specific cuisine"
      ? signals.cuisineStyle
      : "Cross-cuisine";
  const mealContext = signals.occasionType || "Flexible meal context";
  const donenessValue = signals.doneness || cut.cooking.doneness;
  const complexity = getDifficultyScaleLabel(cutScale.difficulty);
  const backups =
    topCluster.length > 1
      ? topCluster
          .slice(1, 3)
          .map((result) => result.cut.name)
          .join(" or ")
      : "your Level recommendations";

  quickReadNarrative.textContent = `${cut.name} is your top match for ${cuisineFit} with a ${donenessValue} finish. Cook it with ${summary.bestCookingMatch} and expect ${complexity.toLowerCase()} execution for ${mealContext.toLowerCase()}. If needed, use ${backups} as clean alternatives.`;
}

function buildTierRecommendations(rankedCuts, signals = {}) {
  const used = new Set();
  const scaleModel = buildTierScaleModel(signals);

  const tier1 = selectTierCutsByScale(
    rankedCuts,
    used,
    scaleModel.targets[0],
    3,
    signals,
    "tier1"
  );
  const tier2 = selectTierCutsByScale(
    rankedCuts,
    used,
    scaleModel.targets[1],
    4,
    signals,
    "tier2"
  );
  const tier3 = selectTierCutsByScale(
    rankedCuts,
    used,
    scaleModel.targets[2],
    4,
    signals,
    "tier3"
  );
  const tier4 = selectTierCutsByScale(
    rankedCuts,
    used,
    scaleModel.targets[3],
    4,
    signals,
    "tier4"
  );

  const upgradedTiers = applyTierUpgradeVariants(
    { tier1, tier2, tier3, tier4 },
    rankedCuts
  );

  return {
    tier1: upgradedTiers.tier1,
    tier2: upgradedTiers.tier2,
    tier3: upgradedTiers.tier3,
    tier4: upgradedTiers.tier4,
    titles: scaleModel.titles,
  };
}

function applyTierUpgradeVariants(tiers, rankedCuts) {
  const primary = rankedCuts[0]?.cut;
  if (!primary) {
    return tiers;
  }

  const promotions = getTierUpgradePromotions(primary, rankedCuts);
  const tier3 = mergeTierPromotions(tiers.tier3, promotions.tier3, 4);
  const tier4 = mergeTierPromotions(tiers.tier4, promotions.tier4, 4);

  return {
    tier1: tiers.tier1,
    tier2: tiers.tier2,
    tier3,
    tier4,
  };
}

function getTierUpgradePromotions(primaryCut, rankedCuts) {
  const family = getCutFamily(primaryCut);
  const planByFamily = {
    Rib: {
      tier3: [
        {
          cutId: "ribeye",
          variantName: "Bone-In Ribeye",
          variantMeta: "Bone-upgrade path",
        },
        {
          cutId: "bone_in_strip",
          variantName: "Bone-In New York Strip",
          variantMeta: "Bone-upgrade path",
        },
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Bone-upgrade path",
        },
      ],
      tier4: [
        {
          cutId: "tomahawk_ribeye",
          variantName: "Tomahawk Ribeye",
          variantMeta: "Showpiece long-bone upgrade",
        },
        {
          cutId: "porterhouse",
          variantName: "Porterhouse",
          variantMeta: "Showpiece bone-upgrade path",
        },
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Showpiece bone-upgrade path",
        },
      ],
    },
    Loin: {
      tier3: [
        {
          cutId: "bone_in_strip",
          variantName: "Bone-In New York Strip",
          variantMeta: "Bone-upgrade path",
        },
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Bone-upgrade path",
        },
      ],
      tier4: [
        {
          cutId: "porterhouse",
          variantName: "Porterhouse",
          variantMeta: "Signature split-loin upgrade",
        },
        {
          cutId: "tomahawk_ribeye",
          variantName: "Tomahawk Ribeye",
          variantMeta: "Showpiece long-bone upgrade",
        },
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Bone-upgrade path",
        },
      ],
    },
    Sirloin: {
      tier3: [
        {
          cutId: "bone_in_strip",
          variantName: "Bone-In New York Strip",
          variantMeta: "Steakhouse bone-upgrade step",
        },
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Steakhouse bone-upgrade step",
        },
      ],
      tier4: [
        {
          cutId: "porterhouse",
          variantName: "Porterhouse",
          variantMeta: "Premium bone-upgrade path",
        },
        {
          cutId: "tomahawk_ribeye",
          variantName: "Tomahawk Ribeye",
          variantMeta: "Showpiece long-bone upgrade",
        },
      ],
    },
    Chuck: {
      tier3: [
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Bone-upgrade path",
        },
        {
          cutId: "bone_in_strip",
          variantName: "Bone-In New York Strip",
          variantMeta: "Bone-upgrade path",
        },
      ],
      tier4: [
        {
          cutId: "tomahawk_ribeye",
          variantName: "Tomahawk Ribeye",
          variantMeta: "Showpiece long-bone upgrade",
        },
        {
          cutId: "porterhouse",
          variantName: "Porterhouse",
          variantMeta: "Showpiece bone-upgrade path",
        },
      ],
    },
    Plate: {
      tier3: [
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Bone-upgrade path",
        },
        {
          cutId: "bone_in_strip",
          variantName: "Bone-In New York Strip",
          variantMeta: "Bone-upgrade path",
        },
      ],
      tier4: [
        {
          cutId: "tomahawk_ribeye",
          variantName: "Tomahawk Ribeye",
          variantMeta: "Showpiece long-bone upgrade",
        },
        {
          cutId: "porterhouse",
          variantName: "Porterhouse",
          variantMeta: "Showpiece bone-upgrade path",
        },
      ],
    },
    Flank: {
      tier3: [
        {
          cutId: "t_bone",
          variantName: "T-Bone",
          variantMeta: "Bone-upgrade path",
        },
        {
          cutId: "bone_in_strip",
          variantName: "Bone-In New York Strip",
          variantMeta: "Bone-upgrade path",
        },
      ],
      tier4: [
        {
          cutId: "tomahawk_ribeye",
          variantName: "Tomahawk Ribeye",
          variantMeta: "Showpiece long-bone upgrade",
        },
        {
          cutId: "porterhouse",
          variantName: "Porterhouse",
          variantMeta: "Showpiece bone-upgrade path",
        },
      ],
    },
  };

  const fallbackPlan = {
    tier3: [
      {
        cutId: "bone_in_strip",
        variantName: "Bone-In New York Strip",
        variantMeta: "Bone-upgrade path",
      },
      {
        cutId: "t_bone",
        variantName: "T-Bone",
        variantMeta: "Bone-upgrade path",
      },
    ],
    tier4: [
      {
        cutId: "tomahawk_ribeye",
        variantName: "Tomahawk Ribeye",
        variantMeta: "Showpiece long-bone upgrade",
      },
      {
        cutId: "porterhouse",
        variantName: "Porterhouse",
        variantMeta: "Showpiece bone-upgrade path",
      },
    ],
  };

  const familyPlan = planByFamily[family] || fallbackPlan;
  return {
    tier3: selectTierVariantPromotion(primaryCut, rankedCuts, familyPlan.tier3),
    tier4: selectTierVariantPromotion(primaryCut, rankedCuts, familyPlan.tier4),
  };
}

function selectTierVariantPromotion(primaryCut, rankedCuts, candidates = []) {
  for (const candidate of candidates) {
    if (!candidate?.cutId) {
      continue;
    }
    if (candidate.cutId === primaryCut.id) {
      continue;
    }

    const promotion = createTierVariantResult(
      rankedCuts,
      candidate.cutId,
      candidate.variantName,
      candidate.variantMeta
    );
    if (promotion) {
      return promotion;
    }
  }

  return null;
}

function createTierVariantResult(rankedCuts, cutId, variantName, variantMeta) {
  const ranked = rankedCuts.find((entry) => entry.cut.id === cutId);
  if (ranked) {
    return {
      ...ranked,
      variantName,
      variantMeta,
      isVariant: true,
    };
  }

  const cut = CUTS.find((entry) => entry.id === cutId);
  if (!cut) {
    return null;
  }

  return {
    cut,
    score: 0,
    variantName,
    variantMeta,
    isVariant: true,
  };
}

function mergeTierPromotions(baseTier, promotion, limit) {
  const merged = [...baseTier];
  if (!promotion) {
    return merged.slice(0, limit);
  }

  const deduped = merged.filter((entry) => entry.cut.id !== promotion.cut.id);
  deduped.unshift(promotion);
  return deduped.slice(0, limit);
}

function buildTierScaleModel(signals) {
  const expertiseAnchor = getExpertiseScaleAnchor(signals);
  const cuisineBias = getCuisineScaleBias(signals.cuisineStyle);
  const levelOffsets = [-1.15, -0.25, 0.85, 1.9];

  const targets = levelOffsets.map((offset) => ({
    difficulty: clamp(expertiseAnchor + cuisineBias.difficulty + offset, 1, 4),
    familiarity: clamp(expertiseAnchor + cuisineBias.familiarity + offset, 1, 4),
    equipment: clamp(expertiseAnchor + cuisineBias.equipment + offset, 1, 4),
  }));

  return {
    targets,
    titles: {
      tier1: buildScaleTierTitle(1, targets[0]),
      tier2: buildScaleTierTitle(2, targets[1]),
      tier3: buildScaleTierTitle(3, targets[2]),
      tier4: buildScaleTierTitle(4, targets[3]),
    },
  };
}

function getExpertiseScaleAnchor(signals) {
  const expertiseBand = getExpertiseBand(signals);
  if (expertiseBand === "Expert") {
    return 3.2;
  }
  if (expertiseBand === "Intermediate") {
    return 2.4;
  }
  return 1.6;
}

function getCuisineScaleBias(cuisineStyle) {
  if (cuisineStyle === "BBQ / smokehouse") {
    return { difficulty: 0.65, familiarity: 0.25, equipment: 1.05 };
  }
  if (cuisineStyle === "Steakhouse") {
    return { difficulty: 0.45, familiarity: 0.2, equipment: 0.65 };
  }
  if (cuisineStyle === "American grill") {
    return { difficulty: -0.1, familiarity: -0.25, equipment: 0.25 };
  }
  if (cuisineStyle === "Mexican / fajitas") {
    return { difficulty: 0.2, familiarity: 0.45, equipment: 0.25 };
  }
  if (cuisineStyle === "Asian / quick-cook") {
    return { difficulty: 0.1, familiarity: 0.35, equipment: 0.1 };
  }
  if (cuisineStyle === "Italian / comfort dishes") {
    return { difficulty: -0.2, familiarity: -0.1, equipment: -0.2 };
  }
  return { difficulty: 0, familiarity: 0, equipment: 0 };
}

function buildScaleTierTitle(level, targetScale) {
  if (level === 1) {
    return "Level 1: Primary Recommendation";
  }
  if (level === 2) {
    return "Level 2: Strong Alternatives";
  }
  if (level === 3) {
    return "Level 3: Specialty Upgrades";
  }
  if (level === 4) {
    return "Level 4: Explorer / Exotic Cuts";
  }
  return `Level ${level}`;
}

function selectTierCutsByScale(rankedCuts, used, targetScale, count, signals, tierKey) {
  const ordered = rankedCuts
    .filter((result) => !used.has(result.cut.id))
    .map((result) => ({
      result,
      tierFitScore: getTierScaleFitScore(result, targetScale, signals, tierKey),
    }))
    .sort((a, b) => {
      if (b.tierFitScore !== a.tierFitScore) {
        return b.tierFitScore - a.tierFitScore;
      }
      return b.result.score - a.result.score;
    });

  const picks = ordered.slice(0, count).map((entry) => entry.result);
  picks.forEach((entry) => used.add(entry.cut.id));

  if (picks.length >= count) {
    return picks;
  }

  rankedCuts.forEach((result) => {
    if (picks.length >= count || used.has(result.cut.id)) {
      return;
    }
    picks.push(result);
    used.add(result.cut.id);
  });

  return picks;
}

function getTierScaleFitScore(result, targetScale, signals, tierKey) {
  const cutScale = deriveCutExecutionScale(result.cut);
  const targetDistance = getTierTargetDistance(cutScale, targetScale);
  const distanceScore = clamp(16 - targetDistance * 4.25, -10, 16);
  const cuisineBonus =
    getCuisineFitAdjustment(result.cut, signals.cuisineStyle, signals.mealFormat, null) * 0.55;
  const operationalBonus = getTierOperationalBonus(result.cut, signals, tierKey);
  const intentBoost = getTierIntentBoost(result.cut, signals, tierKey);
  const baseWeight =
    tierKey === "tier1" ? 0.62 : tierKey === "tier2" ? 0.54 : tierKey === "tier3" ? 0.46 : 0.38;

  return result.score * baseWeight + distanceScore + cuisineBonus + operationalBonus + intentBoost;
}

function getTierOperationalBonus(cut, signals, tierKey) {
  const substitutionFit = getSubstitutionFitAdjustment(cut, signals.substitution);
  const cookWindowFit = getCookWindowFitAdjustment(cut, signals.cookWindow);
  const formatFit = getMealFormatFitAdjustment(cut, signals.mealFormat);
  const budgetFit = getBudgetFitAdjustment(cut, signals.budget);

  if (tierKey === "tier1") {
    return (
      cookWindowFit * 0.9 +
      formatFit * 1.05 +
      substitutionFit * 0.45 +
      budgetFit * 0.95
    );
  }
  if (tierKey === "tier2") {
    return substitutionFit + cookWindowFit * 0.55 + formatFit * 0.65 + budgetFit * 0.7;
  }
  if (tierKey === "tier3") {
    return (
      substitutionFit * 0.45 +
      cookWindowFit * 0.35 +
      formatFit * 0.55 +
      budgetFit * 0.4
    );
  }
  return (
    substitutionFit * 0.35 +
    cookWindowFit * 0.25 +
    formatFit * 0.45 +
    budgetFit * 0.25
  );
}

function getTierIntentBoost(cut, signals, tierKey) {
  const isCore = CORE_HEAVYWEIGHT_IDS.has(cut.id);
  const isSpecialty = SPECIALTY_CUT_IDS.has(cut.id) || cut.profile.adventure >= 7;
  const isExotic = cut.profile.adventure >= 8 || isSpecialty;

  if (tierKey === "tier1") {
    let boost = 0;
    if (CLASSIC_CUT_IDS.has(cut.id)) {
      boost += 2.2;
    }
    if (cut.profile.adventure >= 8) {
      boost -= 2.4;
    }
    if (signals.mealFormat === "Sandwich / bun" && cut.id === "all_beef_uncured_hot_dog") {
      boost += 5;
    }
    return boost;
  }

  if (tierKey === "tier2") {
    let boost = 0;
    if (cut.profile.value >= 6) {
      boost += 1.6;
    }
    if (cut.profile.adventure >= 5 && cut.profile.adventure <= 8) {
      boost += 1.3;
    }
    if (isCore) {
      boost -= 0.5;
    }
    return boost;
  }

  if (tierKey === "tier3") {
    let boost = 0;
    if (isSpecialty) {
      boost += 4.2;
    }
    if (isCore) {
      boost -= 2.6;
    }
    if (signals.cuisineStyle === "Mexican / fajitas" && MEXICAN_FOCUS_IDS.has(cut.id)) {
      boost += 1.2;
    }
    if (signals.cuisineStyle === "BBQ / smokehouse" && BBQ_FOCUS_IDS.has(cut.id)) {
      boost += 1.2;
    }
    if (signals.cuisineStyle === "Asian / quick-cook" && ASIAN_QUICK_COOK_IDS.has(cut.id)) {
      boost += 1.2;
    }
    return boost;
  }

  let boost = 0;
  if (isSpecialty) {
    boost += 5;
  }
  if (isExotic) {
    boost += 2.2;
  }
  if (isCore) {
    boost -= 4.4;
  }
  if (cut.profile.adventure <= 5) {
    boost -= 2;
  }
  if (signals.comfort === "Expert cut fluency" || signals.specialtyComfort === "High") {
    boost += 1.5;
  }
  return boost;
}

function getTierTargetDistance(cutScale, targetScale) {
  return (
    Math.abs(cutScale.difficulty - targetScale.difficulty) +
    Math.abs(cutScale.familiarity - targetScale.familiarity) +
    Math.abs(cutScale.equipment - targetScale.equipment)
  );
}

function deriveCutExecutionScale(cut) {
  const methodText = cut.cooking.method.toLowerCase();

  let difficulty = 1;
  if (cut.profile.precision >= 7) {
    difficulty += 1;
  } else if (cut.profile.precision >= 5) {
    difficulty += 0.5;
  }
  if (cut.profile.adventure >= 8) {
    difficulty += 1;
  } else if (cut.profile.adventure >= 6) {
    difficulty += 0.5;
  }
  difficulty += getMethodComplexityBoost(methodText);

  let familiarity = 1;
  if (cut.profile.adventure <= 4) {
    familiarity = 1;
  } else if (cut.profile.adventure <= 6) {
    familiarity = 2;
  } else if (cut.profile.adventure <= 8) {
    familiarity = 3;
  } else {
    familiarity = 4;
  }

  let equipment = 1;
  if (
    methodText.includes("grill") ||
    methodText.includes("pan") ||
    methodText.includes("cast-iron")
  ) {
    equipment = 2;
  }
  if (methodText.includes("oven") || methodText.includes("reverse")) {
    equipment = Math.max(equipment, 3);
  }
  if (
    methodText.includes("smoke") ||
    methodText.includes("sous vide") ||
    methodText.includes("live fire") ||
    methodText.includes("low-and-slow")
  ) {
    equipment = Math.max(equipment, 4);
  }

  if (cut.id === "all_beef_uncured_hot_dog") {
    difficulty = 1;
    familiarity = 1;
    equipment = 1;
  }

  return {
    difficulty: clamp(difficulty, 1, 4),
    familiarity: clamp(familiarity, 1, 4),
    equipment: clamp(equipment, 1, 4),
  };
}

function getMethodComplexityBoost(methodText) {
  if (
    methodText.includes("sous vide") ||
    methodText.includes("reverse") ||
    methodText.includes("smoke")
  ) {
    return 1;
  }
  if (methodText.includes("low") || methodText.includes("marinate")) {
    return 0.5;
  }
  return 0;
}

function toScaleBand(value) {
  if (value < 1.75) {
    return 1;
  }
  if (value < 2.5) {
    return 2;
  }
  if (value < 3.25) {
    return 3;
  }
  return 4;
}

function getDifficultyScaleLabel(value) {
  const band = toScaleBand(value);
  if (band === 1) {
    return "Easy";
  }
  if (band === 2) {
    return "Moderate";
  }
  if (band === 3) {
    return "Skilled";
  }
  return "Advanced";
}

function getFamiliarityScaleLabel(value) {
  const band = toScaleBand(value);
  if (band === 1) {
    return "Familiar";
  }
  if (band === 2) {
    return "Familiar-Plus";
  }
  if (band === 3) {
    return "Specialty";
  }
  return "Deep Specialty";
}

function getEquipmentScaleLabel(value) {
  const band = toScaleBand(value);
  if (band === 1) {
    return "Basic setup";
  }
  if (band === 2) {
    return "Standard setup";
  }
  if (band === 3) {
    return "Extended setup";
  }
  return "Advanced setup";
}

function renderTierTitles(titles) {
  if (tier1Title) {
    tier1Title.textContent = titles?.tier1 || "Level 1: Primary Recommendation";
  }
  if (tier2Title) {
    tier2Title.textContent = titles?.tier2 || "Level 2: Strong Alternatives";
  }
  if (tier3Title) {
    tier3Title.textContent = titles?.tier3 || "Level 3: Specialty Upgrades";
  }
  if (tier4Title) {
    tier4Title.textContent = titles?.tier4 || "Level 4: Explorer / Exotic Cuts";
  }
}

function renderTierList(target, tierResults, signals, tierKey) {
  target.innerHTML = "";
  tierResults.forEach((result) => {
    const contextMeta = getTierContextMeta(result.cut, signals, tierKey);
    const techniqueTag = getTechniqueTierTag(result.cut, signals);
    const detailParts = [
      getCostTier(result.cut),
      result.variantMeta || null,
      techniqueTag,
      contextMeta,
    ].filter(Boolean);
    const metaLine = detailParts.join(" • ");
    const displayName = result.variantName || result.cut.name;

    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span class="tier-cut-name">${escapeHtml(displayName)}</span>
      <span class="tier-cut-meta">
        ${escapeHtml(metaLine)}
      </span>
    `;
    target.appendChild(listItem);
  });
}

function getTierContextMeta(cut, signals, tierKey) {
  const cuisineTag = getCuisineTierTag(cut, signals.cuisineStyle);
  const formatTag = getFormatTierTag(cut, signals.mealFormat);
  const timeTag = getCookWindowTierTag(cut, signals.cookWindow);
  const planBTag = getPlanBTierTag(cut, signals.substitution);
  const methodTag = getMethodTierTag(cut, signals.method);
  const explorationTag = getExplorationTierTag(cut);

  if (tierKey === "tier1") {
    return [cuisineTag, timeTag, formatTag].filter(Boolean).join(" • ");
  }
  if (tierKey === "tier2") {
    return [planBTag, methodTag, timeTag].filter(Boolean).join(" • ");
  }
  if (tierKey === "tier3") {
    return [explorationTag, methodTag, cuisineTag].filter(Boolean).join(" • ");
  }
  return [explorationTag, methodTag, planBTag].filter(Boolean).join(" • ");
}

function getCuisineTierTag(cut, cuisineStyle) {
  if (!cuisineStyle || cuisineStyle === "No specific cuisine") {
    return "Cross-cuisine";
  }

  const fit = getCuisineFitAdjustment(cut, cuisineStyle, null, null);
  if (fit >= 4) {
    return `${cuisineStyle} ready`;
  }
  if (fit >= 1) {
    return `${cuisineStyle} workable`;
  }
  return "Alt-cuisine lane";
}

function getFormatTierTag(cut, mealFormat) {
  if (!mealFormat) {
    return null;
  }

  const fit = getMealFormatFitAdjustment(cut, mealFormat);
  if (fit >= 4) {
    return `${mealFormat} ready`;
  }
  if (fit >= 1) {
    return `${mealFormat} fit`;
  }
  return "Alternate service";
}

function getCookWindowTierTag(cut, cookWindow) {
  if (!cookWindow) {
    return null;
  }

  const fit = getCookWindowFitAdjustment(cut, cookWindow);
  if (fit >= 4) {
    return `${cookWindow} fit`;
  }
  if (fit >= 1) {
    return "Flexible time fit";
  }
  return "Longer cook path";
}

function getPlanBTierTag(cut, substitution) {
  if (!substitution) {
    return null;
  }

  const fit = getSubstitutionFitAdjustment(cut, substitution);
  if (fit >= 3) {
    return "Strong plan B";
  }
  if (fit >= 1) {
    return "Backup-ready";
  }
  if (fit <= -2) {
    return "Primary-first";
  }
  return "Limited backup";
}

function getExplorationTierTag(cut) {
  if (cut.profile.adventure <= 4) {
    return "Familiar lane";
  }
  if (cut.profile.adventure <= 6) {
    return "Step-up lane";
  }
  if (cut.profile.adventure <= 8) {
    return "Specialty lane";
  }
  return "Exotic lane";
}

function getMethodTierTag(cut, methodSignal) {
  const methodText = cut.cooking.method.toLowerCase();
  if (!methodSignal) {
    if (methodText.includes("smoke") || methodText.includes("low")) {
      return "Low-and-slow lane";
    }
    if (methodText.includes("sous vide") || methodText.includes("reverse")) {
      return "Precision lane";
    }
    return "High-heat lane";
  }

  if (methodSignal === "Low-and-slow") {
    return methodText.includes("smoke") || methodText.includes("low")
      ? "Low-and-slow ready"
      : "Alt low-and-slow";
  }
  if (methodSignal === "Pan sear") {
    return methodText.includes("pan") || methodText.includes("cast-iron")
      ? "Pan-sear ready"
      : "Alt pan-sear";
  }
  if (methodSignal === "Oven roast + sear") {
    return methodText.includes("oven") || methodText.includes("reverse")
      ? "Oven + sear ready"
      : "Alt oven + sear";
  }
  if (methodSignal === "Sous vide / precision") {
    return methodText.includes("sous vide") || cut.profile.precision >= 7
      ? "Precision ready"
      : "Precision-compatible";
  }
  return methodText.includes("grill") ? "Grill ready" : "High-heat ready";
}

function getTechniqueTierTag(cut, signals) {
  const methodText = cut.cooking.method.toLowerCase();
  const technique = signals.advancedTechnique;

  if (technique === "Temp-driven reverse sear") {
    if (methodText.includes("reverse") || methodText.includes("oven") || cut.profile.precision >= 7) {
      return "Reverse-sear ready";
    }
    return "Temp-control lane";
  }
  if (technique === "Two-zone heat control") {
    return methodText.includes("grill") || methodText.includes("sear")
      ? "Two-zone ready"
      : "Two-zone compatible";
  }
  if (technique === "Marinade and high heat") {
    return methodText.includes("marinate") || methodText.includes("grill")
      ? "Marinade + sear"
      : "Marinade-compatible";
  }
  if (technique === "Simple single-step") {
    return cut.profile.precision <= 5 ? "One-step friendly" : "Simple-with-guidance";
  }

  if (methodText.includes("sous vide") || methodText.includes("reverse")) {
    return "Precision technique";
  }
  if (methodText.includes("smoke") || methodText.includes("low")) {
    return "Project technique";
  }
  return "Direct-heat technique";
}

const CUT_ICON_BY_ID = {
  ribeye: "ribeye",
  tomahawk_ribeye: "ribeye",
  ribeye_cap: "ribeye_cap",
  strip: "strip",
  bone_in_strip: "strip_bone",
  strip_filet_split: "strip_split",
  filet_mignon: "filet",
  filet_medallions: "filet",
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
  hanger: "hanger",
  flank: "flank",
  outside_skirt: "outside_skirt",
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
  const skillFitText = getSkillFitText(signals);

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
    signals.cuisineStyle && signals.cuisineStyle !== "No specific cuisine"
      ? `Cuisine Fit: ${signals.cuisineStyle}.`
      : "Cuisine Fit: Cross-cuisine flexibility.",
    skillFitText.technique,
    skillFitText.purchase,
    `Service Style: ${mealFormat}.`,
    `Bench Strength: ${alternativeText}.`,
  ];

  executiveHighlights.innerHTML = "";
  highlights.forEach((item) => addListItem(executiveHighlights, item));
}

function getSkillFitText(signals) {
  const techniqueText = signals.advancedTechnique
    ? `Technique Fit: ${signals.advancedTechnique}.`
    : "Technique Fit: Straightforward high-heat execution.";

  const purchaseText = signals.buyPrecision
    ? `Case Strategy: ${signals.buyPrecision}.`
    : "Case Strategy: Flexible cut-family substitution.";

  return {
    technique: techniqueText,
    purchase: purchaseText,
  };
}

function renderCookingTips(cut) {
  if (!tipsColumns || !tipsCutLabel) {
    return;
  }

  tipsCutLabel.textContent = `Method-specific tips for ${cut.name}`;
  tipsColumns.innerHTML = "";

  buildMethodTipCards(cut).forEach((card) => {
    const cardElement = document.createElement("article");
    cardElement.className = "tips-method-card";
    const listMarkup = card.tips
      .map((tip) => `<li>${escapeHtml(tip)}</li>`)
      .join("");

    cardElement.innerHTML = `
      <div class="tips-method-head">
        <h4 class="tips-method-title">${escapeHtml(card.title)}</h4>
        <span class="tips-method-fit">${escapeHtml(card.fitLabel)}</span>
      </div>
      <ul class="tips-method-list">
        ${listMarkup}
      </ul>
    `;

    tipsColumns.appendChild(cardElement);
  });
}

function buildMethodTipCards(cut) {
  return METHOD_COLUMN_CONFIG.map((column) => {
    const fitScore = getMethodColumnFitScore(cut, column.key);
    return {
      title: column.title,
      fitLabel: getMethodFitLabel(fitScore),
      tips: getMethodColumnTips(cut, column.key, fitScore),
    };
  });
}

function getMethodColumnFitScore(cut, methodKey) {
  const methodText = (cut.cooking.method || "").toLowerCase();
  let score = 0;

  if (methodKey === "grill") {
    if (
      methodText.includes("grill") ||
      methodText.includes("live fire") ||
      methodText.includes("direct")
    ) {
      score += 2;
    }
    if (methodText.includes("sear")) {
      score += 1;
    }
    if (cut.id === "all_beef_uncured_hot_dog") {
      score += 1;
    }
  } else if (methodKey === "pan") {
    if (
      methodText.includes("pan") ||
      methodText.includes("cast-iron") ||
      methodText.includes("griddle")
    ) {
      score += 2;
    }
    if (methodText.includes("sear")) {
      score += 1;
    }
  } else if (methodKey === "oven") {
    if (
      methodText.includes("oven") ||
      methodText.includes("reverse") ||
      methodText.includes("broil") ||
      methodText.includes("roast")
    ) {
      score += 2;
    }
    if (methodText.includes("finish")) {
      score += 1;
    }
  } else if (methodKey === "slow") {
    if (
      methodText.includes("slow") ||
      methodText.includes("smoke") ||
      methodText.includes("braise") ||
      methodText.includes("low-and-slow")
    ) {
      score += 2;
    }
    if (methodText.includes("controlled")) {
      score += 1;
    }
    if (cut.id === "all_beef_uncured_hot_dog") {
      score = 0;
    }
  }

  return clamp(score, 0, 3);
}

function getMethodFitLabel(score) {
  if (score >= 2) {
    return "Primary";
  }
  if (score === 1) {
    return "Alternate";
  }
  return "Optional";
}

function getMethodColumnTips(cut, methodKey, fitScore) {
  const family = getCutFamily(cut);
  const cutTips = COOKING_TIPS_DB.byCut[cut.id] || [];
  const familyTips =
    COOKING_TIPS_DB.byFamily[family] || COOKING_TIPS_DB.byFamily.Specialty;
  const methodTips = METHOD_TIP_LIBRARY[methodKey] || [];
  const methodIndex = METHOD_COLUMN_CONFIG.findIndex((column) => column.key === methodKey);
  const normalizedIndex = methodIndex >= 0 ? methodIndex : 0;
  const cutTip = cutTips.length > 0 ? cutTips[normalizedIndex % cutTips.length] : null;
  const familyTip =
    familyTips.length > 0 ? familyTips[(normalizedIndex + 1) % familyTips.length] : null;

  const prioritizedTips = [];
  if (fitScore >= 2) {
    prioritizedTips.push(`Target endpoint: ${cut.cooking.doneness} (${cut.cooking.temp}).`);
  } else if (fitScore === 1) {
    prioritizedTips.push(
      `Works well for ${cut.name} with tighter carryover control and clean slicing.`
    );
  } else {
    prioritizedTips.push("Use this as an alternate method and verify internal temperature.");
  }
  prioritizedTips.push(...methodTips.slice(0, 2));
  if (cutTip) {
    prioritizedTips.push(cutTip);
  }
  if (familyTip) {
    prioritizedTips.push(familyTip);
  }
  if (fitScore >= 2) {
    prioritizedTips.push(cut.cooking.note);
  }

  const uniqueTips = [];
  const seen = new Set();

  prioritizedTips.forEach((tip) => {
    if (!tip || seen.has(tip)) {
      return;
    }
    seen.add(tip);
    uniqueTips.push(tip);
  });

  return uniqueTips.slice(0, 4);
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

function deriveBudgetSignal(signals, profile) {
  let premiumScore = 0;
  let valueScore = 0;

  if (signals.coreLane === "Tender-first") {
    premiumScore += 3;
  } else if (signals.coreLane === "Rich-first") {
    premiumScore += 3;
  } else if (signals.coreLane === "Balanced") {
    premiumScore += 1;
    valueScore += 1;
  } else if (signals.coreLane === "Beefy-value") {
    valueScore += 4;
  }

  if (signals.richnessTarget === "Very rich") {
    premiumScore += 3;
  } else if (signals.richnessTarget === "Rich") {
    premiumScore += 2;
  } else if (signals.richnessTarget === "Lean") {
    valueScore += 2;
  }

  if (signals.textureTarget === "Very tender") {
    premiumScore += 1;
  } else if (signals.textureTarget === "Firmer chew") {
    valueScore += 1;
  }

  if (signals.doneness === "Medium rare") {
    premiumScore += 1;
  } else if (signals.doneness === "Medium well") {
    valueScore += 1;
  } else if (signals.doneness === "Well done") {
    valueScore += 2;
  }

  if (signals.seasoningStyle === "Butter + herbs") {
    premiumScore += 2;
  } else if (signals.seasoningStyle === "Sauce-forward") {
    valueScore += 2;
  } else if (signals.seasoningStyle === "Rub / marinade") {
    valueScore += 1;
  } else if (signals.seasoningStyle === "Salt + pepper") {
    premiumScore += 1;
  }

  if (signals.guidanceLevel === "Familiar only") {
    valueScore += 2;
  } else if (signals.guidanceLevel === "Single cut + simple steps") {
    valueScore += 1;
  } else if (signals.guidanceLevel === "Learn progressively") {
    premiumScore += 1;
  }

  if (signals.comfort === "Expert cut fluency" || signals.specialtyComfort === "High") {
    premiumScore += 1;
  } else if (signals.comfort === "Need guidance / recipes") {
    valueScore += 1;
  }

  if (signals.cuisineStyle === "Steakhouse") {
    premiumScore += 3;
  } else if (signals.cuisineStyle === "American grill") {
    valueScore += 2;
  } else if (signals.cuisineStyle === "Mexican / fajitas") {
    valueScore += 2;
  } else if (signals.cuisineStyle === "BBQ / smokehouse") {
    valueScore += 2;
  } else if (signals.cuisineStyle === "Asian / quick-cook") {
    valueScore += 1;
  } else if (signals.cuisineStyle === "Italian / comfort dishes") {
    premiumScore += 1;
  }

  if (signals.mealFormat === "Plated steak") {
    premiumScore += 2;
  } else if (signals.mealFormat === "Sliced board") {
    valueScore += 1;
  } else if (signals.mealFormat === "Tacos / bowls") {
    valueScore += 2;
  } else if (signals.mealFormat === "Sandwich / bun") {
    valueScore += 4;
  }

  if (signals.cookWindow === "10-15 minutes") {
    valueScore += 2;
  } else if (signals.cookWindow === "45+ minute project") {
    premiumScore += 1;
  }

  if (profile.value >= 9) {
    valueScore += 4;
  } else if (profile.value >= 8) {
    valueScore += 3;
  } else if (profile.value >= 7) {
    valueScore += 2;
  } else if (profile.value <= 3) {
    premiumScore += 3;
  }

  if (profile.richness >= 8) {
    premiumScore += 2;
  } else if (profile.richness <= 4) {
    valueScore += 1;
  }

  if (profile.tenderness >= 8) {
    premiumScore += 1;
  }

  if (valueScore >= premiumScore + 4) {
    return valueScore >= 10 ? "Lowest-cost options first" : "Value-focused";
  }

  if (premiumScore >= valueScore + 4) {
    return premiumScore >= 9 ? "Premium / no strict limit" : "Mid-premium";
  }

  if (premiumScore >= valueScore + 2) {
    return "Mid-premium";
  }

  if (valueScore >= premiumScore + 2) {
    return "Value-focused";
  }

  return "Moderate";
}

function deriveSubstitutionFlexibility(profile) {
  if (profile.value >= 8) {
    return "High (cost-based)";
  }
  if (profile.adventure >= 7) {
    return "Moderate (performance-based)";
  }
  if (profile.adventure >= 5) {
    return "Limited";
  }
  return "Low (exact cuts only)";
}

function deriveSubstitutionSignal(signals, profile) {
  if (signals.buyPrecision === "Exact spec") {
    return "Low (exact cuts only)";
  }
  if (signals.buyPrecision === "Family-level flexibility") {
    return "High (cost-based)";
  }
  if (signals.guidanceLevel === "Top 3 + swaps") {
    return "Moderate (performance-based)";
  }
  if (signals.guidanceLevel === "Familiar only") {
    return "Low (exact cuts only)";
  }
  if (signals.budget === "Value-focused" || signals.budget === "Lowest-cost options first") {
    return "High (cost-based)";
  }
  if (signals.comfort === "Need guidance / recipes") {
    return "Low (exact cuts only)";
  }
  if (signals.specialtyComfort === "High" || profile.adventure >= 7) {
    return "Moderate (performance-based)";
  }
  return deriveSubstitutionFlexibility(profile);
}

function deriveOccasionSignal(signals, profile) {
  if (signals.cuisineStyle === "Steakhouse") {
    return "Date night";
  }
  if (signals.cuisineStyle === "BBQ / smokehouse") {
    return "Game day / BBQ";
  }
  if (signals.budget === "Premium / no strict limit" || profile.richness >= 8) {
    return "Hosting guests";
  }
  return deriveOccasionType(profile);
}

function derivePairingStyleSignal(signals, profile) {
  if (signals.cuisineStyle === "Italian / comfort dishes") {
    return "Sauce-heavy sides";
  }
  if (signals.cuisineStyle === "Mexican / fajitas") {
    return "Light sides";
  }
  if (signals.richnessTarget === "Very rich" || profile.richness >= 8) {
    return "Light sides";
  }
  if (signals.richnessTarget === "Lean" || profile.richness <= 4) {
    return "Rich sides";
  }
  if (signals.cuisineStyle === "American grill" || signals.cuisineStyle === "BBQ / smokehouse") {
    return "Minimal sides";
  }
  return "Sauce-heavy sides";
}

function deriveMethodSignal(signals, profile) {
  if (signals.cuisineStyle === "BBQ / smokehouse") {
    return "Low-and-slow";
  }
  if (signals.cuisineStyle === "Steakhouse") {
    return "Pan sear";
  }
  if (
    signals.cuisineStyle === "Mexican / fajitas" ||
    signals.cuisineStyle === "American grill"
  ) {
    return "High-heat grill";
  }
  if (signals.cuisineStyle === "Asian / quick-cook") {
    return "Pan sear";
  }
  if (profile.precision >= 8) {
    return "Sous vide / precision";
  }
  if (profile.boldness >= 8) {
    return "High-heat grill";
  }
  if (signals.cookWindow === "45+ minute project") {
    return "Oven roast + sear";
  }
  return "Pan sear";
}

function deriveTechniqueSignal(signals, profile) {
  if (signals.prepEffort === "Very high" || profile.precision >= 8) {
    return "Temp-driven reverse sear";
  }
  if (signals.prepEffort === "High" || signals.method === "Oven roast + sear") {
    return "Two-zone heat control";
  }
  if (
    signals.cuisineStyle === "Mexican / fajitas" ||
    signals.cuisineStyle === "Asian / quick-cook" ||
    signals.seasoningStyle === "Rub / marinade"
  ) {
    return "Marinade and high heat";
  }
  return "Simple single-step";
}

function deriveBuyPrecisionSignal(signals, profile) {
  if (signals.substitution === "Low (exact cuts only)") {
    return "Exact spec";
  }
  if (signals.substitution === "Moderate (performance-based)") {
    return "Exact cut flexible thickness";
  }
  if (signals.substitution === "High (cost-based)") {
    return "Family-level flexibility";
  }
  if (profile.precision >= 7) {
    return "Exact cut flexible thickness";
  }
  return "Open with guidance";
}

function deriveCookWindowFromSignals(signals, profile) {
  if (signals.prepEffort === "Low") {
    return "10-15 minutes";
  }
  if (signals.prepEffort === "Medium") {
    return "20-30 minutes";
  }
  if (signals.prepEffort === "High") {
    return "30-45 minutes";
  }
  if (signals.prepEffort === "Very high") {
    return "45+ minute project";
  }

  if (signals.method === "Low-and-slow" || signals.smokeLevel === "Heavy") {
    return "45+ minute project";
  }
  if (signals.method === "Sous vide / precision") {
    return "30-45 minutes";
  }
  if (signals.method === "High-heat grill") {
    return "20-30 minutes";
  }

  return deriveCookWindow(profile);
}

function deriveMealFormatFromSignals(signals, profile) {
  if (signals.portionStyle === "6-8 oz single steak" || signals.portionStyle === "8-12 oz steakhouse cut") {
    return "Plated steak";
  }
  if (signals.portionStyle === "Large shareable sliced cut") {
    return "Sliced board";
  }
  if (signals.portionStyle === "Thin-sliced applications") {
    return "Tacos / bowls";
  }
  if (signals.portionStyle === "Handheld cookout style") {
    return "Sandwich / bun";
  }

  if (signals.cuisineStyle === "Mexican / fajitas" || signals.cuisineStyle === "Asian / quick-cook") {
    return "Tacos / bowls";
  }
  if (signals.cuisineStyle === "BBQ / smokehouse") {
    return "Sliced board";
  }
  if (signals.cuisineStyle === "American grill") {
    if (signals.coreLane === "Beefy-value" || signals.budget === "Value-focused") {
      return "Sandwich / bun";
    }
    return "Sliced board";
  }

  if (signals.coreLane === "Tender-first" || signals.coreLane === "Rich-first") {
    return "Plated steak";
  }
  if (signals.coreLane === "Balanced") {
    return "Sliced board";
  }
  if (signals.coreLane === "Beefy-value") {
    return profile.value >= 8 ? "Sandwich / bun" : "Tacos / bowls";
  }

  return deriveMealFormat(profile);
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
        getSpecialtyFitAdjustment(cut, signals.specialtyComfort) +
        getTechniqueFitAdjustment(cut, signals.advancedTechnique) +
        getBuyPrecisionFitAdjustment(cut, signals.buyPrecision) +
        getGuidanceFitAdjustment(cut, signals.guidanceLevel) +
        getPriorityFitAdjustment(cut, signals.priority) +
        getSubstitutionFitAdjustment(cut, signals.substitution) +
        getPortionFitAdjustment(cut, signals.portionStyle) +
        getBoneFitAdjustment(cut, signals.bonePreference) +
        getCookWindowFitAdjustment(cut, signals.cookWindow) +
        getSmokeFitAdjustment(cut, signals.smokeLevel) +
        getFatCapFitAdjustment(cut, signals.fatCapPreference) +
        getSeasoningIntentAdjustment(cut, signals.seasoningIntent) +
        getPairingFitAdjustment(cut, signals.pairingStyle) +
        getMealFormatFitAdjustment(cut, signals.mealFormat) +
        getDonenessFitAdjustment(cut, signals.doneness) +
        getCuisineFitAdjustment(
          cut,
          signals.cuisineStyle,
          signals.mealFormat,
          signals.seasoningStyle
        ) +
        getOccasionFitAdjustment(cut, signals.occasionType) +
        getMainstreamWeightAdjustment(cut, signals, profile),
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

function getDivergenceIntensity(signals, profile) {
  let intensity = 0;
  const cuisineStyle = signals.cuisineStyle;

  if (
    cuisineStyle === "Mexican / fajitas" ||
    cuisineStyle === "BBQ / smokehouse" ||
    cuisineStyle === "Asian / quick-cook"
  ) {
    intensity += 2;
  } else if (cuisineStyle === "American grill") {
    intensity += 1;
  }

  if (signals.mealFormat && signals.mealFormat !== "Plated steak") {
    intensity += 1;
  }
  if (signals.mealFormat === "Sandwich / bun" || signals.mealFormat === "Tacos / bowls") {
    intensity += 1;
  }

  if (signals.specialtyComfort === "High" || signals.comfort === "Expert cut fluency") {
    intensity += 2;
  } else if (
    signals.specialtyComfort === "Medium" ||
    signals.comfort === "Comfortable with common cuts"
  ) {
    intensity += 1;
  }

  if (signals.advancedTechnique && signals.advancedTechnique !== "Simple single-step") {
    intensity += 1;
  }
  if (signals.smokeLevel === "Medium" || signals.smokeLevel === "Heavy") {
    intensity += 1;
  }
  if (signals.method === "Low-and-slow") {
    intensity += 1;
  }

  if (signals.budget === "Value-focused" || signals.budget === "Lowest-cost options first") {
    intensity += 1;
  }
  if (signals.priority === "Best value" || signals.priority === "Best fit for the cooking method") {
    intensity += 1;
  }

  if (profile.adventure >= 7) {
    intensity += 1;
  }
  if (profile.boldness >= 8) {
    intensity += 1;
  }

  return clamp(intensity, 0, 6);
}

function getMainstreamWeightAdjustment(cut, signals, profile) {
  const isCore = CORE_HEAVYWEIGHT_IDS.has(cut.id);
  const divergence = getDivergenceIntensity(signals, profile);

  // Default behavior favors mainstream "heavyweight" steak choices.
  let adjustment = isCore ? 8 : -5;

  // Strongly divergent answers should move users away from mainstream picks.
  if (isCore) {
    adjustment -= Math.min(10, divergence * 2);
  } else {
    adjustment += Math.min(8, divergence * 2);
  }

  if (
    signals.guidanceLevel === "Single cut + simple steps" ||
    signals.comfort === "Need guidance / recipes"
  ) {
    adjustment += isCore ? 2 : -2;
  }

  if (signals.budget === "Value-focused" || signals.budget === "Lowest-cost options first") {
    if (cut.id === "top_sirloin" || cut.id === "baseball_cut") {
      adjustment += 2;
    }
    if (cut.id === "filet_mignon" || cut.id === "filet_medallions" || cut.id === "tomahawk_ribeye") {
      adjustment -= 2;
    }
  }

  return adjustment;
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
      return 7;
    }
    if (costTier === "Mid-Premium") {
      return 2;
    }
    return -5;
  }

  if (budgetOrientation === "Mid-premium") {
    if (costTier === "Mid-Premium") {
      return 5;
    }
    if (costTier === "Premium") {
      return 2;
    }
    return -2;
  }

  if (budgetOrientation === "Moderate") {
    if (costTier === "Mid-Premium") {
      return 4;
    }
    if (costTier === "Value") {
      return 3;
    }
    return -2;
  }

  if (budgetOrientation === "Value-focused") {
    if (costTier === "Value") {
      return 6;
    }
    if (costTier === "Mid-Premium") {
      return 0;
    }
    return -6;
  }

  if (budgetOrientation === "Lowest-cost options first") {
    if (costTier === "Value") {
      return 8;
    }
    if (costTier === "Mid-Premium") {
      return -2;
    }
    return -8;
  }

  return 0;
}

function getComfortAdjustment(cut, comfortLevel) {
  if (!comfortLevel) {
    return 0;
  }

  if (comfortLevel === "Expert cut fluency" || comfortLevel === "Very comfortable") {
    if (cut.profile.adventure >= 7) {
      return 5;
    }
    if (cut.profile.adventure >= 5) {
      return 2;
    }
    return 0;
  }

  if (
    comfortLevel === "Comfortable with common cuts" ||
    comfortLevel === "Somewhat comfortable" ||
    comfortLevel === "Neutral"
  ) {
    if (cut.profile.adventure >= 7) {
      return -1;
    }
    if (cut.profile.adventure >= 5) {
      return 1;
    }
    return 0;
  }

  if (
    comfortLevel === "Familiar basics" ||
    comfortLevel === "Prefer familiar cuts only"
  ) {
    if (cut.profile.adventure >= 7) {
      return -4;
    }
    if (cut.profile.adventure <= 4) {
      return 2;
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

function getSpecialtyFitAdjustment(cut, specialtyComfort) {
  if (!specialtyComfort) {
    return 0;
  }

  const isSpecialtyCut = SPECIALTY_CUT_IDS.has(cut.id) || cut.profile.adventure >= 7;

  if (specialtyComfort === "High") {
    return isSpecialtyCut ? 4 : -1;
  }

  if (specialtyComfort === "Medium") {
    if (isSpecialtyCut) {
      return 2;
    }
    return CLASSIC_CUT_IDS.has(cut.id) ? 1 : 0;
  }

  if (specialtyComfort === "Low") {
    if (isSpecialtyCut) {
      return -2;
    }
    return cut.profile.adventure <= 5 ? 2 : 0;
  }

  if (specialtyComfort === "Minimal") {
    if (isSpecialtyCut) {
      return -4;
    }
    return CLASSIC_CUT_IDS.has(cut.id) ? 3 : 1;
  }

  return 0;
}

function getTechniqueFitAdjustment(cut, advancedTechnique) {
  if (!advancedTechnique) {
    return 0;
  }

  const methodText = cut.cooking.method.toLowerCase();

  if (advancedTechnique === "Temp-driven reverse sear") {
    if (HIGH_PRECISION_CUT_IDS.has(cut.id) || cut.profile.precision >= 7) {
      return 5;
    }
    if (cut.profile.precision >= 5) {
      return 2;
    }
    return -2;
  }

  if (advancedTechnique === "Two-zone heat control") {
    if (
      methodText.includes("grill") ||
      methodText.includes("live fire") ||
      methodText.includes("sear")
    ) {
      return 3;
    }
    return cut.profile.precision >= 6 ? 1 : -1;
  }

  if (advancedTechnique === "Marinade and high heat") {
    if (methodText.includes("marinate") || methodText.includes("slice")) {
      return 3;
    }
    if (cut.profile.value >= 6 && cut.profile.boldness >= 6) {
      return 2;
    }
    return 0;
  }

  if (advancedTechnique === "Simple single-step") {
    if (cut.profile.precision <= 5) {
      return 3;
    }
    if (cut.profile.precision >= 8) {
      return -2;
    }
    return 1;
  }

  return 0;
}

function getBuyPrecisionFitAdjustment(cut, buyPrecision) {
  if (!buyPrecision) {
    return 0;
  }

  if (buyPrecision === "Exact spec") {
    if (HIGH_PRECISION_CUT_IDS.has(cut.id) || cut.profile.precision >= 7) {
      return 4;
    }
    return cut.profile.precision >= 5 ? 1 : -2;
  }

  if (buyPrecision === "Exact cut flexible thickness") {
    if (cut.profile.precision >= 6) {
      return 3;
    }
    return 1;
  }

  if (buyPrecision === "Family-level flexibility") {
    if (cut.profile.value >= 6) {
      return 2;
    }
    if (cut.profile.precision >= 8) {
      return -1;
    }
    return 1;
  }

  if (buyPrecision === "Open with guidance") {
    if (CLASSIC_CUT_IDS.has(cut.id) || cut.profile.adventure <= 5) {
      return 2;
    }
    return -1;
  }

  return 0;
}

function getGuidanceFitAdjustment(cut, guidanceLevel) {
  if (!guidanceLevel) {
    return 0;
  }

  if (guidanceLevel === "Single cut + simple steps") {
    if (CLASSIC_CUT_IDS.has(cut.id) || cut.profile.adventure <= 4) {
      return 3;
    }
    return -2;
  }

  if (guidanceLevel === "Top 3 + swaps") {
    if (cut.profile.value >= 5) {
      return 2;
    }
    if (cut.profile.adventure >= 8) {
      return -1;
    }
    return 1;
  }

  if (guidanceLevel === "Learn progressively") {
    if (cut.profile.adventure >= 5 && cut.profile.adventure <= 8) {
      return 3;
    }
    if (cut.profile.adventure >= 9) {
      return 1;
    }
    return 0;
  }

  if (guidanceLevel === "Familiar only") {
    if (cut.profile.adventure <= 4) {
      return 3;
    }
    return cut.profile.adventure >= 7 ? -3 : 0;
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
      cut.id === "coulotte" ||
      cut.id === "sirloin_flap"
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

const SPECIALTY_CUT_IDS = new Set([
  "coulotte",
  "sirloin_flap",
  "hanger",
  "outside_skirt",
  "denver",
  "ball_tip",
  "flank",
]);
const CORE_HEAVYWEIGHT_IDS = new Set([
  "filet_mignon",
  "filet_medallions",
  "ribeye",
  "tomahawk_ribeye",
  "strip",
  "bone_in_strip",
  "top_sirloin",
  "baseball_cut",
]);
const CLASSIC_CUT_IDS = new Set([
  "ribeye",
  "tomahawk_ribeye",
  "strip",
  "bone_in_strip",
  "filet_mignon",
  "filet_medallions",
  "top_sirloin",
  "porterhouse",
  "t_bone",
  "all_beef_uncured_hot_dog",
]);
const HIGH_PRECISION_CUT_IDS = new Set([
  "filet_mignon",
  "filet_medallions",
  "ribeye_cap",
  "tomahawk_ribeye",
  "strip_filet_split",
  "porterhouse",
  "t_bone",
  "bone_in_strip",
  "ribeye",
]);
const BONE_IN_CUT_IDS = new Set([
  "bone_in_strip",
  "porterhouse",
  "t_bone",
  "tomahawk_ribeye",
]);
const SMOKE_FRIENDLY_CUT_IDS = new Set([
  "tri_tip",
  "plate_short_rib_boneless",
  "coulotte",
  "sirloin_flap",
  "flank",
  "outside_skirt",
  "chuck_eye",
]);
const FAT_CAP_FORWARD_CUT_IDS = new Set([
  "coulotte",
  "ribeye",
  "tomahawk_ribeye",
  "ribeye_cap",
  "bone_in_strip",
]);
const SLICED_BOARD_CUT_IDS = new Set([
  "tri_tip",
  "coulotte",
  "sirloin_flap",
  "flank",
  "plate_short_rib_boneless",
]);
const PREMIUM_OCCASION_IDS = new Set([
  "filet_mignon",
  "filet_medallions",
  "ribeye",
  "tomahawk_ribeye",
  "ribeye_cap",
  "strip",
  "porterhouse",
  "t_bone",
]);
const CASUAL_CROWD_IDS = new Set([
  "all_beef_uncured_hot_dog",
  "tri_tip",
  "plate_short_rib_boneless",
  "sirloin_flap",
  "top_sirloin",
]);
const MEXICAN_FOCUS_IDS = new Set([
  "outside_skirt",
  "sirloin_flap",
  "flank",
  "flat_iron",
  "tri_tip",
]);
const ITALIAN_FOCUS_IDS = new Set([
  "filet_mignon",
  "top_sirloin",
  "strip",
  "plate_short_rib_boneless",
]);
const STEAKHOUSE_FOCUS_IDS = new Set([
  "ribeye",
  "tomahawk_ribeye",
  "ribeye_cap",
  "strip",
  "bone_in_strip",
  "porterhouse",
  "t_bone",
  "filet_mignon",
  "filet_medallions",
]);
const AMERICAN_GRILL_FOCUS_IDS = new Set([
  "all_beef_uncured_hot_dog",
  "top_sirloin",
  "baseball_cut",
  "tri_tip",
  "flat_iron",
  "denver",
  "ball_tip",
  "outside_skirt",
]);
const BBQ_FOCUS_IDS = new Set([
  "plate_short_rib_boneless",
  "tri_tip",
  "chuck_eye",
  "denver",
  "coulotte",
  "outside_skirt",
]);
const ASIAN_QUICK_COOK_IDS = new Set([
  "outside_skirt",
  "sirloin_flap",
  "flank",
  "flat_iron",
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

function getSeasoningIntentAdjustment(cut, seasoningIntent) {
  if (!seasoningIntent) {
    return 0;
  }

  if (seasoningIntent === "Simple prep") {
    if (cut.profile.precision <= 5 && cut.profile.adventure <= 5) {
      return 4;
    }
    if (cut.profile.value >= 7 && cut.profile.adventure <= 6) {
      return 2;
    }
    if (cut.profile.precision >= 8 && cut.profile.adventure >= 7) {
      return -2;
    }
    return 1;
  }

  if (seasoningIntent === "Quality showcase") {
    if (getCostTier(cut) === "Premium" || cut.profile.tenderness >= 8) {
      return 5;
    }
    if (getCostTier(cut) === "Mid-Premium") {
      return 2;
    }
    if (cut.profile.value >= 8 && cut.profile.tenderness <= 6) {
      return -2;
    }
    return 0;
  }

  return 0;
}

function getPairingFitAdjustment(cut, pairingStyle) {
  if (!pairingStyle) {
    return 0;
  }

  if (pairingStyle === "Rich sides") {
    if (cut.profile.richness <= 6) {
      return 3;
    }
    if (cut.profile.richness >= 9) {
      return -3;
    }
    return 0;
  }

  if (pairingStyle === "Light sides") {
    if (cut.profile.richness >= 7 || cut.profile.boldness >= 8) {
      return 3;
    }
    return 0;
  }

  if (pairingStyle === "Sauce-heavy sides") {
    if (cut.profile.boldness >= 7 || cut.profile.value >= 6) {
      return 2;
    }
    if (cut.profile.richness >= 9) {
      return -1;
    }
    return 0;
  }

  if (pairingStyle === "Minimal sides") {
    if (cut.profile.richness >= 7 || cut.profile.boldness >= 8) {
      return 3;
    }
    if (cut.profile.boldness <= 5 && cut.profile.richness <= 5) {
      return -1;
    }
    return 1;
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

function getDonenessFitAdjustment(cut, selectedDoneness) {
  if (!selectedDoneness) {
    return 0;
  }

  const donenessText = (cut.cooking.doneness || "").toLowerCase();
  const hasMediumRare =
    donenessText.includes("medium-rare") || donenessText.includes("medium rare");
  const hasMedium = /\bmedium\b/.test(donenessText);
  const hasRare = /\brare\b/.test(donenessText);
  const hasWell = /\bwell\b/.test(donenessText);
  const heatThrough = donenessText.includes("heat through");
  const varies = donenessText.includes("varies");

  if (selectedDoneness === "Medium rare") {
    if (hasMediumRare) {
      return 8;
    }
    if (hasRare) {
      return 4;
    }
    if (hasMedium || varies) {
      return 1;
    }
    return -3;
  }

  if (selectedDoneness === "Medium") {
    if (hasMedium && hasMediumRare) {
      return 4;
    }
    if (hasMedium) {
      return 3;
    }
    if (varies) {
      return 1;
    }
    return -1;
  }

  if (selectedDoneness === "Medium well") {
    if (hasWell || heatThrough) {
      return 4;
    }
    if (hasMedium || varies) {
      return 1;
    }
    return -2;
  }

  if (selectedDoneness === "Well done") {
    if (hasWell || heatThrough) {
      return 5;
    }
    if (varies) {
      return 1;
    }
    return -3;
  }

  return 0;
}

function getCuisineFitAdjustment(cut, cuisineStyle, mealFormat, seasoningStyle) {
  if (!cuisineStyle || cuisineStyle === "No specific cuisine") {
    return 0;
  }

  let score = 0;

  if (cuisineStyle === "Mexican / fajitas") {
    if (MEXICAN_FOCUS_IDS.has(cut.id)) {
      score += 6;
    } else if (cut.profile.value >= 7) {
      score += 1;
    } else {
      score -= 2;
    }

    if (mealFormat === "Tacos / bowls") {
      score += 2;
    }
    if (seasoningStyle === "Rub / marinade") {
      score += 1;
    }
  }

  if (cuisineStyle === "Italian / comfort dishes") {
    if (ITALIAN_FOCUS_IDS.has(cut.id)) {
      score += 4;
    } else if (cut.profile.tenderness >= 8) {
      score += 2;
    } else if (cut.profile.adventure >= 8) {
      score -= 2;
    }

    if (seasoningStyle === "Sauce-forward") {
      score += 2;
    }
  }

  if (cuisineStyle === "Steakhouse") {
    if (STEAKHOUSE_FOCUS_IDS.has(cut.id)) {
      score += 6;
      if (
        cut.id === "ribeye" ||
        cut.id === "tomahawk_ribeye" ||
        cut.id === "ribeye_cap"
      ) {
        score += 2;
      }
    } else if (cut.profile.tenderness >= 7) {
      score += 1;
    } else {
      score -= 2;
    }

    if (mealFormat === "Plated steak") {
      score += 2;
    }
    if (seasoningStyle === "Salt + pepper") {
      score += 1;
    }
  }

  if (cuisineStyle === "American grill") {
    if (AMERICAN_GRILL_FOCUS_IDS.has(cut.id)) {
      score += 6;
    } else if (cut.profile.value >= 7) {
      score += 2;
    } else if (cut.profile.value <= 3 && cut.profile.tenderness >= 8) {
      score -= 3;
    }

    if (mealFormat === "Sandwich / bun") {
      score += 3;
    } else if (mealFormat === "Tacos / bowls") {
      score += 1;
    }
    if (seasoningStyle === "Rub / marinade" || seasoningStyle === "Sauce-forward") {
      score += 1;
    }
  }

  if (cuisineStyle === "BBQ / smokehouse") {
    if (BBQ_FOCUS_IDS.has(cut.id) || SMOKE_FRIENDLY_CUT_IDS.has(cut.id)) {
      score += 6;
    } else if (cut.profile.boldness >= 7) {
      score += 1;
    } else {
      score -= 2;
    }

    if (
      cut.id === "ribeye" ||
      cut.id === "tomahawk_ribeye" ||
      cut.id === "ribeye_cap"
    ) {
      score -= 3;
    }
  }

  if (cuisineStyle === "Asian / quick-cook") {
    if (ASIAN_QUICK_COOK_IDS.has(cut.id)) {
      score += 5;
    } else if (cut.profile.value >= 7) {
      score += 1;
    } else {
      score -= 2;
    }

    if (mealFormat === "Tacos / bowls" || mealFormat === "Sliced board") {
      score += 1;
    }
  }

  return clamp(score, -8, 10);
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
    adventure: "cut comfort level",
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

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
