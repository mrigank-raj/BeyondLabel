export const DEMO_FOODS = [
  {
    id: 'oreo',
    name: 'Oreo Cookies',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 
    verdictData: {
      verdict: 'Avoid',
      healthScore: 15,
      why: 'Extremely high in added sugars, processed flour, and contains controversial seed oils and artificial flavors.',
      suggestion: 'Swap for a cleaner cookie alternative or dark chocolate.',
      goalNote: 'Directly conflicts with your general health and fat loss goals due to massive sugar spikes.',
      pros: ['No trans fats'],
      cons: ['High added sugar', 'Highly processed', 'Artificial flavors'],
      hiddenNasties: ['High Fructose Corn Syrup', 'Soy Lecithin', 'Artificial Flavors'],
      macros: {
        Carbs: { value: '25g', status: 'High' },
        Protein: { value: '1g', status: 'Low' },
        Fats: { value: '7g', status: 'Moderate' },
        Sugar: { value: '14g', status: 'High' },
        Sodium: { value: '90mg', status: 'Moderate' }
      },
      ingredients: [
        { name: 'Sugar', function: 'Sweetener', safety_status: 'Avoid' },
        { name: 'Unbleached Enriched Flour', function: 'Base', safety_status: 'Caution' },
        { name: 'High Oleic Canola Oil', function: 'Fat', safety_status: 'Caution' },
        { name: 'Cocoa', function: 'Flavor', safety_status: 'Optimal' },
        { name: 'High Fructose Corn Syrup', function: 'Sweetener', safety_status: 'Avoid' },
        { name: 'Soy Lecithin', function: 'Emulsifier', safety_status: 'Caution' },
        { name: 'Artificial Flavor', function: 'Flavor', safety_status: 'Avoid' }
      ],
      alternatives: [
        { name: 'Simple Mills Cocoa Cookies', reason: 'Made with nut flour and sweetened with coconut sugar.', score: 85 },
        { name: 'Catalina Crunch Keto Cookies', reason: 'Zero sugar, high protein and fiber.', score: 90 }
      ]
    }
  },
  {
    id: 'chobani',
    name: 'Chobani Strawberry Greek Yogurt',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1574768341680-77983669145f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    verdictData: {
      verdict: 'Good',
      healthScore: 78,
      why: 'High in quality protein and probiotics, though flavored versions contain some added sugar.',
      suggestion: 'A solid daily staple for muscle gain and gut health.',
      goalNote: 'Properly aligns with muscle gain goals due to high casein protein content.',
      pros: ['High Protein', 'Probiotics', 'No Artificial Dyes'],
      cons: ['Some Added Sugar'],
      hiddenNasties: [],
      macros: {
        Carbs: { value: '11g', status: 'Moderate' },
        Protein: { value: '12g', status: 'Optimal' },
        Fats: { value: '0g', status: 'Low' },
        Sugar: { value: '9g', status: 'Moderate' },
        Sodium: { value: '45mg', status: 'Optimal' }
      },
      ingredients: [
        { name: 'Cultured Lowfat Milk', function: 'Base', safety_status: 'Optimal' },
        { name: 'Strawberries', function: 'Flavor', safety_status: 'Optimal' },
        { name: 'Cane Sugar', function: 'Sweetener', safety_status: 'Caution' },
        { name: 'Fruit Pectin', function: 'Thickener', safety_status: 'Optimal' },
        { name: 'Live Active Cultures', function: 'Probiotics', safety_status: 'Optimal' }
      ],
      alternatives: [
        { name: 'Chobani Plain Greek Yogurt', reason: 'Zero added sugar, add your own fresh fruit.', score: 98 }
      ]
    }
  },
  {
    id: 'kind_bar',
    name: 'KIND Dark Choc Nuts & Sea Salt',
    category: 'Snacks',
    image: 'https://images.unsplash.com/photo-1622484211148-5226487e3d16?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80', 
    verdictData: {
      verdict: 'Moderate',
      healthScore: 65,
      why: 'Good source of healthy fats and protein from nuts, but contains multiple forms of added sugar acting as binders.',
      suggestion: 'A decent on-the-go snack, but watch your total daily sugar intake.',
      goalNote: 'Okay for general health in moderation, but not optimal for strict low-carb goals.',
      pros: ['Heart-Healthy Fats', 'High Fiber', 'Whole Nuts'],
      cons: ['Multiple Sugars', 'Sticky Binders'],
      hiddenNasties: ['Glucose Syrup'],
      macros: {
        Carbs: { value: '16g', status: 'Moderate' },
        Protein: { value: '6g', status: 'Moderate' },
        Fats: { value: '15g', status: 'High' },
        Sugar: { value: '5g', status: 'Moderate' },
        Sodium: { value: '140mg', status: 'Moderate' }
      },
      ingredients: [
        { name: 'Almonds', function: 'Base', safety_status: 'Optimal' },
        { name: 'Peanuts', function: 'Base', safety_status: 'Optimal' },
        { name: 'Chicory Root Fiber', function: 'Fiber', safety_status: 'Optimal' },
        { name: 'Honey', function: 'Sweetener', safety_status: 'Caution' },
        { name: 'Glucose Syrup', function: 'Sweetener/Binder', safety_status: 'Avoid' },
        { name: 'Rice Flour', function: 'Texture', safety_status: 'Caution' }
      ],
      alternatives: [
        { name: 'RXBAR', reason: 'Zero added sugar, sweetened only with dates, higher protein.', score: 88 },
        { name: 'Raw Mixed Nuts', reason: 'Zero processing, pure healthy fats.', score: 100 }
      ]
    }
  }
];
