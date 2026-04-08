// EduStack — js/data/qb_registry.js
// Registry of all subjects, classes, boards — acts as the master catalogue
// Actual question data is loaded per class/subject

window.QB_REGISTRY = {
  boards: ["CBSE","ICSE","State Board","IB","IGCSE"],

  subjects: {
    "CBSE": {
      "Class 9":  ["Physics","Chemistry","Biology","Maths","Social Science","English","Hindi"],
      "Class 10": ["Physics","Chemistry","Biology","Maths","Social Science","English","Hindi"],
      "Class 11": ["Physics","Chemistry","Biology","Maths","Accountancy","Business Studies","Economics","History","Political Science","Geography"],
      "Class 12": ["Physics","Chemistry","Biology","Maths","Accountancy","Business Studies","Economics","History","Political Science","Geography"],
      "Class 8":  ["Science","Maths","Social Science","English","Hindi"],
      "Class 7":  ["Science","Maths","Social Science","English","Hindi"],
      "Class 6":  ["Science","Maths","Social Science","English","Hindi"],
    },
    "ICSE": {
      "Class 9":  ["Physics","Chemistry","Biology","Maths","History & Civics","Geography","English","Second Language"],
      "Class 10": ["Physics","Chemistry","Biology","Maths","History & Civics","Geography","English","Second Language"],
    },
    "State Board": {
      "Class 9":  ["Physics","Chemistry","Biology","Maths","Social Studies","English","Telugu/Hindi"],
      "Class 10": ["Physics","Chemistry","Biology","Maths","Social Studies","English","Telugu/Hindi"],
    }
  },

  // Maps to which QB data key is available
  // Format: "class_board_subject" → data key in window.QB
  available: {
    "9_CBSE_Physics":   true,
    "9_CBSE_Chemistry": true,
    "9_CBSE_Biology":   true,
    "9_CBSE_Maths":     true,
    "9_CBSE_Social Science": true,
  },

  // Subject icons
  icons: {
    "Physics":    "⚡",
    "Chemistry":  "🧪",
    "Biology":    "🌿",
    "Maths":      "📐",
    "Social Science": "🌍",
    "History & Civics": "📜",
    "Geography":  "🗺️",
    "English":    "📖",
    "Hindi":      "🔤",
    "Accountancy":"💰",
    "Business Studies": "💼",
    "Economics":  "📊",
    "Science":    "🔬",
    "Social Studies": "🌏",
    "Political Science": "🏛️",
    "Telugu/Hindi": "🔤",
    "Second Language": "🔤"
  }
};
