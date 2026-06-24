export const HEALTH_GOALS = [
  { id: 'muscle_gain', label: 'Muscle Gain' },
  { id: 'fat_loss', label: 'Fat Loss' },
  { id: 'general_health', label: 'General Health' },
  { id: 'diabetes', label: 'Diabetes Management' }
];

export const GOAL_PROMPT_MODIFIERS = {
  muscle_gain: "The user's goal is Muscle Gain. Focus heavily on protein quality (e.g., whey vs. soy), protein-to-calorie ratio, and presence of muscle-building ingredients. Highlight if the product falsely inflates protein claims.",
  fat_loss: "The user's goal is Fat Loss. Focus on hidden calories, added sugars, misleading serving sizes, and true satiety value. Highlight if the product claims to be 'diet' or 'low fat' but compensates with sugar.",
  general_health: "The user's goal is General Health and wellness. Focus on whole food ingredients vs. ultra-processed additives, preservatives, and misleading 'natural' claims.",
  diabetes: "The user's goal is Diabetes Management. Focus extremely critically on added sugars, hidden sugars (like maltodextrin, jaggery, date syrup), refined carbs, and glycemic impact."
};
