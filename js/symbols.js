// DreamWeaver — dream symbol lexicon
// Each symbol has: keywords (aliases used for detection), a short meaning,
// an emoji glyph, a category, and "links" (other symbols it resonates with).
// Interpretations are inspired by common cross-cultural dream symbolism and
// are meant for reflection/entertainment — not clinical or predictive advice.

const DREAM_SYMBOLS = {
  water: {
    label: "Water",
    glyph: "🌊",
    category: "nature",
    keywords: ["water", "sea", "ocean", "river", "lake", "wave", "waves", "flood", "rain", "tide", "stream", "pond", "drown", "drowning", "swim", "swimming"],
    meaning: "Emotions and the unconscious. Calm water reflects inner peace; turbulent water hints at overwhelming or unprocessed feelings.",
    links: ["fear", "transformation", "moon"],
  },
  flying: {
    label: "Flying",
    glyph: "🕊️",
    category: "action",
    keywords: ["fly", "flying", "flew", "soar", "soaring", "float", "floating", "levitate", "hover"],
    meaning: "Freedom, ambition, and rising above limits. It can express a longing for control or escape from pressure.",
    links: ["freedom", "sky", "fear"],
  },
  falling: {
    label: "Falling",
    glyph: "🪂",
    category: "action",
    keywords: ["fall", "falling", "fell", "plummet", "tripping", "slip", "slipping", "dropped"],
    meaning: "Loss of control, insecurity, or anxiety about failure. Often a release of tension you carry while awake.",
    links: ["fear", "water"],
  },
  teeth: {
    label: "Teeth",
    glyph: "🦷",
    category: "body",
    keywords: ["teeth", "tooth", "teethfalling", "gums", "dentist"],
    meaning: "Self-image, communication, and fear of loss. Teeth falling out commonly mirrors worry about appearance or power.",
    links: ["fear", "mirror"],
  },
  snake: {
    label: "Snake",
    glyph: "🐍",
    category: "animal",
    keywords: ["snake", "snakes", "serpent", "cobra", "python", "viper"],
    meaning: "Hidden fears, temptation, or healing transformation. The snake sheds its skin — a sign of renewal and change.",
    links: ["transformation", "fear", "shadow"],
  },
  death: {
    label: "Death",
    glyph: "💀",
    category: "theme",
    keywords: ["death", "dying", "die", "died", "dead", "funeral", "grave", "corpse"],
    meaning: "Endings and rebirth. Rarely literal — usually a chapter of life closing to make space for something new.",
    links: ["transformation", "shadow"],
  },
  chase: {
    label: "Being Chased",
    glyph: "🏃",
    category: "action",
    keywords: ["chase", "chased", "chasing", "pursued", "running from", "escape", "escaping", "hunted"],
    meaning: "Avoidance. Something you're not ready to face — a person, emotion, or responsibility — is following you.",
    links: ["fear", "shadow"],
  },
  house: {
    label: "House",
    glyph: "🏠",
    category: "place",
    keywords: ["house", "home", "room", "rooms", "building", "apartment", "mansion", "door", "doors", "hallway", "attic", "basement"],
    meaning: "The self and the mind. Different rooms can represent different parts of your identity or memory.",
    links: ["door", "mirror", "childhood"],
  },
  door: {
    label: "Door",
    glyph: "🚪",
    category: "place",
    keywords: ["door", "doorway", "gate", "entrance", "threshold", "portal"],
    meaning: "Opportunity, transition, and choice. An open door invites change; a locked one suggests a blocked path.",
    links: ["house", "transformation"],
  },
  fire: {
    label: "Fire",
    glyph: "🔥",
    category: "nature",
    keywords: ["fire", "flame", "flames", "burning", "burn", "burnt", "blaze", "smoke", "ash"],
    meaning: "Passion, anger, or purification. Fire destroys but also clears the way for new growth.",
    links: ["transformation", "fear"],
  },
  flight_stairs: {
    label: "Stairs",
    glyph: "🪜",
    category: "place",
    keywords: ["stairs", "stairway", "staircase", "steps", "ladder", "climbing", "ascend", "descend"],
    meaning: "Progress and effort. Going up signals growth or aspiration; going down can mean revisiting the past or the subconscious.",
    links: ["house", "transformation"],
  },
  baby: {
    label: "Baby",
    glyph: "👶",
    category: "people",
    keywords: ["baby", "babies", "infant", "newborn", "pregnant", "pregnancy", "birth"],
    meaning: "New beginnings, vulnerability, and untapped potential. A project or idea may be 'being born' in your life.",
    links: ["transformation", "childhood"],
  },
  mirror: {
    label: "Mirror",
    glyph: "🪞",
    category: "object",
    keywords: ["mirror", "reflection", "reflections", "glass"],
    meaning: "Self-perception and truth. What you see in the mirror is how you really view yourself, flaws and all.",
    links: ["shadow", "teeth"],
  },
  car: {
    label: "Car / Vehicle",
    glyph: "🚗",
    category: "object",
    keywords: ["car", "driving", "drive", "vehicle", "truck", "bus", "train", "wheel", "brakes", "crash", "accident"],
    meaning: "Direction and control over your life's path. Losing control of the vehicle mirrors feeling steered by others.",
    links: ["fear", "freedom"],
  },
  money: {
    label: "Money",
    glyph: "💰",
    category: "object",
    keywords: ["money", "cash", "coins", "gold", "wallet", "rich", "wealth", "treasure", "lottery"],
    meaning: "Self-worth, energy, and value. Finding money can signal recognizing your own resources or talents.",
    links: ["freedom", "transformation"],
  },
  school: {
    label: "School / Exam",
    glyph: "📚",
    category: "place",
    keywords: ["school", "exam", "exams", "test", "classroom", "teacher", "homework", "late for class", "studying"],
    meaning: "Being tested or judged. Often tied to performance anxiety and the fear of not measuring up.",
    links: ["fear", "childhood"],
  },
  baby_animal: {
    label: "Dog",
    glyph: "🐕",
    category: "animal",
    keywords: ["dog", "dogs", "puppy", "puppies", "wolf", "wolves"],
    meaning: "Loyalty, friendship, and protection. An aggressive dog may reflect a conflict with someone you trust.",
    links: ["fear", "freedom"],
  },
  cat: {
    label: "Cat",
    glyph: "🐈",
    category: "animal",
    keywords: ["cat", "cats", "kitten", "feline", "lion", "tiger"],
    meaning: "Independence, intuition, and the feminine. Cats often point to a part of you that resists being tamed.",
    links: ["shadow", "moon"],
  },
  bird: {
    label: "Bird",
    glyph: "🐦",
    category: "animal",
    keywords: ["bird", "birds", "eagle", "owl", "crow", "raven", "dove", "wings"],
    meaning: "Aspirations and perspective. Birds carry messages between the conscious mind and a higher point of view.",
    links: ["flying", "sky", "freedom"],
  },
  moon: {
    label: "Moon",
    glyph: "🌙",
    category: "nature",
    keywords: ["moon", "moonlight", "lunar", "eclipse"],
    meaning: "Intuition, cycles, and the hidden self. The moon lights what the daytime mind keeps in shadow.",
    links: ["water", "shadow", "night"],
  },
  sky: {
    label: "Sky",
    glyph: "☁️",
    category: "nature",
    keywords: ["sky", "clouds", "cloud", "heaven", "stars", "star", "space", "sun", "sunrise", "sunset"],
    meaning: "Possibility and the boundless mind. A clear sky suggests clarity; storm clouds, looming worry.",
    links: ["flying", "freedom", "bird"],
  },
  forest: {
    label: "Forest",
    glyph: "🌲",
    category: "place",
    keywords: ["forest", "woods", "trees", "tree", "jungle", "wilderness", "leaves"],
    meaning: "The unknown and the unconscious. Getting lost in the forest mirrors searching for direction in life.",
    links: ["shadow", "transformation", "night"],
  },
  // Abstract / thematic nodes used mainly as connective tissue
  fear: {
    label: "Fear",
    glyph: "😨",
    category: "theme",
    keywords: ["afraid", "scared", "terrified", "fear", "panic", "anxious", "anxiety", "nightmare", "dread", "horror"],
    meaning: "An emotion asking for attention. Naming the fear in a dream is the first step to disarming it awake.",
    links: ["shadow"],
  },
  freedom: {
    label: "Freedom",
    glyph: "🕯️",
    category: "theme",
    keywords: ["free", "freedom", "liberated", "released", "open", "escape", "wide"],
    meaning: "A pull toward autonomy and release from constraint. You may be craving more space to be yourself.",
    links: ["flying", "sky"],
  },
  transformation: {
    label: "Transformation",
    glyph: "🦋",
    category: "theme",
    keywords: ["change", "changing", "transform", "transforming", "becoming", "metamorphosis", "grew", "growing", "evolve"],
    meaning: "Personal growth in motion. Something in you is shedding an old form and taking on a new one.",
    links: ["death", "door"],
  },
  shadow: {
    label: "Shadow",
    glyph: "🌑",
    category: "theme",
    keywords: ["shadow", "dark", "darkness", "stranger", "figure", "silhouette", "hidden", "unknown person"],
    meaning: "The disowned self — traits you hide or deny. Meeting the shadow invites you to integrate what you reject.",
    links: ["fear", "mirror", "night"],
  },
  childhood: {
    label: "Childhood",
    glyph: "🧸",
    category: "theme",
    keywords: ["childhood", "child", "young", "kid", "school", "old house", "parents", "mother", "father", "family"],
    meaning: "Roots, memory, and formative experiences. The past is surfacing to inform something happening now.",
    links: ["house", "transformation"],
  },
  night: {
    label: "Night",
    glyph: "🌌",
    category: "theme",
    keywords: ["night", "midnight", "evening", "dusk", "nighttime", "asleep", "bed", "sleeping"],
    meaning: "Rest, mystery, and the threshold of the unconscious. Night sets the stage where dreams speak freely.",
    links: ["moon", "shadow"],
  },
};

// Build a fast keyword -> symbolKey lookup map (longest keywords first so that
// multi-word phrases win over single words).
const KEYWORD_INDEX = (() => {
  const entries = [];
  for (const [key, sym] of Object.entries(DREAM_SYMBOLS)) {
    for (const kw of sym.keywords) {
      entries.push({ kw: kw.toLowerCase(), key });
    }
  }
  entries.sort((a, b) => b.kw.length - a.kw.length);
  return entries;
})();

if (typeof window !== "undefined") {
  window.DREAM_SYMBOLS = DREAM_SYMBOLS;
  window.KEYWORD_INDEX = KEYWORD_INDEX;
}
