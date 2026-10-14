// Single source of truth for health goals: onboarding, Profile, the client and the API all use these ids.
export const HEALTH_GOALS = [
  { id: 'general_health', label: 'General Health', desc: 'Balanced nutrition and ingredient transparency', icon: 'favorite', emoji: '🌿' },
  { id: 'heart_health', label: 'Heart Health', desc: 'Low sodium, heart-healthy fats, and cholesterol tracking', icon: 'monitor_heart', emoji: '❤️' },
  { id: 'vegan', label: 'Vegan', desc: 'Strictly plant-based, cruelty-free ingredient checking', icon: 'spa', emoji: '🌱' },
  { id: 'keto', label: 'Keto / Low-Carb', desc: 'Minimal sugars and net-carb optimization', icon: 'bolt', emoji: '🥑' },
  { id: 'gluten_free', label: 'Gluten-Free', desc: 'Detect hidden wheat, gluten, and cross-contamination risks', icon: 'grain', emoji: '🌾' },
  { id: 'clean_eating', label: 'Clean Eating', desc: 'Avoid artificial dyes, preservatives, and emulsifiers', icon: 'eco', emoji: '✨' },
  { id: 'muscle_gain', label: 'Muscle Gain', desc: 'Protein quality and protein-to-calorie ratio', icon: 'fitness_center', emoji: '💪' },
  { id: 'fat_loss', label: 'Fat Loss', desc: 'Hidden calories, added sugars, and satiety', icon: 'local_fire_department', emoji: '🔥' },
  { id: 'diabetes', label: 'Diabetes Management', desc: 'Hidden sugars, refined carbs, and glycemic impact', icon: 'bloodtype', emoji: '🩺' },
];

export const DEFAULT_GOAL = 'general_health';

/** Accepts a goal id or a legacy display name (older builds saved/sent names) and returns a valid id. */
export const resolveGoalId = (value) => {
  const v = String(value || '').trim().toLowerCase();
  const goal = HEALTH_GOALS.find((g) => g.id === v || g.label.toLowerCase() === v);
  return goal ? goal.id : DEFAULT_GOAL;
};

export const GOAL_PROMPT_MODIFIERS = {
  muscle_gain: "The user's goal is Muscle Gain. Focus heavily on protein quality (e.g., whey vs. soy), protein-to-calorie ratio, and presence of muscle-building ingredients. Highlight if the product falsely inflates protein claims.",
  fat_loss: "The user's goal is Fat Loss. Focus on hidden calories, added sugars, misleading serving sizes, and true satiety value. Highlight if the product claims to be 'diet' or 'low fat' but compensates with sugar.",
  general_health: "The user's goal is General Health and wellness. Focus on whole food ingredients vs. ultra-processed additives, preservatives, and misleading 'natural' claims.",
  diabetes: "The user's goal is Diabetes Management. Focus extremely critically on added sugars, hidden sugars (like maltodextrin, jaggery, date syrup), refined carbs, and glycemic impact.",
  heart_health: "The user's goal is Heart Health. Focus on sodium, saturated and trans fats (including hydrogenated, interesterified and palm oils), and refined carbs. Credit fibre and unsaturated fats.",
  vegan: "The user is Vegan. Flag every animal-derived ingredient, including hidden ones (milk solids, whey, casein, ghee, butter, egg, honey, gelatin, carmine/E120, shellac, E441, E542, E904), and say when an additive's source is ambiguous.",
  keto: "The user's goal is Keto / Low-Carb. Focus on net carbs per serving and every sugar or starch source (maltodextrin, dextrose, glucose syrup, starches, flours). Favour high-fat, low-carb whole ingredients.",
  gluten_free: "The user must eat Gluten-Free. Flag wheat, barley, rye, malt, maida, atta, sooji, semolina, oats not certified gluten-free, hydrolysed wheat protein, and any 'may contain gluten' cross-contamination warning.",
  clean_eating: "The user's goal is Clean Eating. Focus critically on artificial colours, preservatives, emulsifiers, flavour enhancers, artificial sweeteners and other ultra-processed additives. Prefer short lists of recognisable whole foods."
};
