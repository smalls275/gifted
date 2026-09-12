/**
 * Application Configuration & Assets Registry
 */

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

const EXTRA_STICKER_STYLES = [
  'Sparkly', 'Rainbow', 'Golden', 'Silly', 'Brave',
  'Happy', 'Super', 'Magic', 'Dancing', 'Cosmic'
];

const EXTRA_STICKER_THEMES = [
  { name: 'Apple', emoji: '🍎' },
  { name: 'Bee', emoji: '🐝' },
  { name: 'Dolphin', emoji: '🐬' },
  { name: 'Flower', emoji: '🌼' },
  { name: 'Ladybug', emoji: '🐞' },
  { name: 'Moon', emoji: '🌙' },
  { name: 'Pencil', emoji: '✏️' },
  { name: 'Pizza', emoji: '🍕' },
  { name: 'Robot', emoji: '🤖' },
  { name: 'Sun', emoji: '☀️' }
];

const EXTRA_STICKERS = EXTRA_STICKER_STYLES.flatMap((style, styleIndex) =>
  EXTRA_STICKER_THEMES.map((theme, themeIndex) => ({
    id: `s${13 + (styleIndex * EXTRA_STICKER_THEMES.length) + themeIndex}`,
    name: `${style} ${theme.name}`,
    emoji: theme.emoji,
    costCents: 50 + (((styleIndex + themeIndex) % 7) * 25)
  }))
);

const CATEGORY_BADGE_DEFS = [
  { category: "matrix_reasoning", label: "Matrix" },
  { category: "math_logic", label: "Math" },
  { category: "verbal_detective", label: "Word" },
  { category: "spatial_folding", label: "Spatial" },
  { category: "logic_mysteries", label: "Mystery" },
  { category: "science_inquiry", label: "Science" }
];
const CATEGORY_BADGE_TIERS = [
  { count: 10, suffix: "Apprentice", icon: "🥉" },
  { count: 20, suffix: "Adept", icon: "🥈" },
  { count: 35, suffix: "Expert", icon: "🥇" },
  { count: 50, suffix: "Master", icon: "💎" },
  { count: 75, suffix: "Legend", icon: "👑" }
];
const EXTRA_CATEGORY_BADGES = CATEGORY_BADGE_DEFS.flatMap(def =>
  CATEGORY_BADGE_TIERS.map(tier => ({
    id: `${def.category}_${tier.count}`,
    name: `${def.label} ${tier.suffix}`,
    icon: tier.icon,
    desc: `Solved ${tier.count} ${def.label} puzzles correctly!`,
    condition: { type: "category", category: def.category, count: tier.count }
  }))
);

const SOLVED_MILESTONES = [
  { count: 75, icon: "📈" }, { count: 100, icon: "📈" },
  { count: 150, icon: "🎯" }, { count: 200, icon: "🎯" },
  { count: 300, icon: "🏆" }, { count: 400, icon: "🏆" },
  { count: 500, icon: "💫" }, { count: 750, icon: "💫" }, { count: 1000, icon: "💫" }
];
const EXTRA_SOLVED_BADGES = SOLVED_MILESTONES.map(m => ({
  id: `solved_${m.count}`,
  name: `${m.count} Puzzles Solved!`,
  icon: m.icon,
  desc: `Reached ${m.count} total correct puzzles!`,
  condition: { type: "solved", count: m.count }
}));

const STREAK_MILESTONES = [15, 20, 25, 30, 40];
const EXTRA_STREAK_BADGES = STREAK_MILESTONES.map(count => ({
  id: `streak_${count}`,
  name: `Streak Master ${count}!`,
  icon: "🔥",
  desc: `Got ${count} puzzles right in a row!`,
  condition: { type: "streak", count }
}));

const DANCE_MILESTONES = [10, 15, 20, 25];
const EXTRA_DANCE_BADGES = DANCE_MILESTONES.map(count => ({
  id: `dance_${count}`,
  name: `Dance Party x${count}!`,
  icon: "🎶",
  desc: `Completed ${count} Danny Go dance parties!`,
  condition: { type: "dance", count }
}));

const STICKER_MILESTONES = [25, 75];
const EXTRA_STICKER_BADGES = STICKER_MILESTONES.map(count => ({
  id: `stickers_${count}`,
  name: `Sticker Collector ${count}!`,
  icon: "🎨",
  desc: `Collected ${count} stickers in the Sticker Studio!`,
  condition: { type: "stickers", count }
}));

const CONFIG = {
  appName: "Lily's GATE Adventure",
  subtitle: "Winding Creek Elementary • Stafford County Gifted Prep",
  defaultStudent: {
    name: "Lily",
    age: 6,
    grade: "1st Grade",
    school: "Winding Creek Elementary School",
    district: "Stafford County Public Schools, VA",
    pet: "unicorn",
    petName: "Sparkle",
    stars: 10,
    moneyCents: 125,
    streak: 1,
    level: 1,
    dannyGoThreshold: 20 // Stars required to unlock a Danny Go! dance party break
  },
  
  categories: [
    {
      id: "matrix_reasoning",
      name: "Matrix & Patterns",
      icon: "🧩",
      color: "#FF6B6B",
      gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
      desc: "CogAT Nonverbal & NNAT3 Matrix puzzles and shape logic.",
      standard: "CogAT Nonverbal / NNAT3"
    },
    {
      id: "math_logic",
      name: "Math & Quant Logic",
      icon: "🔢",
      color: "#4ECDC4",
      gradient: "linear-gradient(135deg, #4ECDC4, #556270)",
      desc: "Virginia SOL Math 1.1-1.15 & Quantitative balance equations.",
      standard: "VA SOL Math & CogAT Quant"
    },
    {
      id: "verbal_detective",
      name: "Word Detective",
      icon: "🔍",
      color: "#A06CD5",
      gradient: "linear-gradient(135deg, #A06CD5, #E1BEE7)",
      desc: "Verbal analogies, phonics mysteries, and context deductions.",
      standard: "CogAT Verbal & VA SOL Reading"
    },
    {
      id: "spatial_folding",
      name: "Spatial & Shapes",
      icon: "📐",
      color: "#FFB03B",
      gradient: "linear-gradient(135deg, #FFB03B, #F8CA00)",
      desc: "Paper folding, symmetry, 3D cube counting & mirror views.",
      standard: "Spatial Abilities & Geometry"
    },
    {
      id: "logic_mysteries",
      name: "Deductive Mysteries",
      icon: "🕵️‍♀️",
      color: "#45B649",
      gradient: "linear-gradient(135deg, #45B649, #96C93D)",
      desc: "SCPS FOCUS logic grids, ordering clues, and truth riddles.",
      standard: "SCPS Gifted / Deductive"
    },
    {
      id: "science_inquiry",
      name: "Science Explorer",
      icon: "🔬",
      color: "#3B82F6",
      gradient: "linear-gradient(135deg, #3B82F6, #2DD4BF)",
      desc: "VA Science SOL 1.1-1.7, life cycles, patterns, and cause & effect.",
      standard: "VA SOL Science & Inquiry"
    }
  ],

  dannyGoVideos: [
    {
      id: "floor_is_lava",
      title: "The Floor Is Lava! 🌋",
      youtubeId: "nEUTY8n2iZo", // "The Floor is Lava Dance!" /// Danny Go! Kids Brain Break Activity
      duration: "3:30",
      thumbnail: "https://img.youtube.com/vi/nEUTY8n2iZo/hqdefault.jpg",
      desc: "Jump on the couch, jump on the pillow! Don't touch the floor!",
      actionPrompt: "Get up and JUMP! The floor is lava! 🌋"
    },
    {
      id: "gorilla_smash",
      title: "Gorilla Smash! 🦍",
      youtubeId: "nXUQxgQHX8E", // "Gorilla Smash!" Drum-Along Dance Brain Break /// Danny Go!
      duration: "3:15",
      thumbnail: "https://img.youtube.com/vi/nXUQxgQHX8E/hqdefault.jpg",
      desc: "Beat your chest and stomp your feet with Danny Go!",
      actionPrompt: "Stomp your feet and beat your chest like a happy gorilla! 🦍"
    },
    {
      id: "freeze_dance",
      title: "The Ice King Freeze Dance! ❄️",
      youtubeId: "c9YiakkdS8k", // "The Ice King Freeze Dance!" /// Danny Go! Brain Break
      duration: "3:45",
      thumbnail: "https://img.youtube.com/vi/c9YiakkdS8k/hqdefault.jpg",
      desc: "Dance like crazy until the music FREEZES! Can you freeze like an ice statue?",
      actionPrompt: "Dance, dance, dance... and FREEZE! 🧊"
    },
    {
      id: "wiggle_dance",
      title: "The Wiggle Dance! 🐛",
      youtubeId: "DsUPVERZFlI", // "The Wiggle Dance!" /// Danny Go! Brain Break Songs for Kids
      duration: "3:00",
      thumbnail: "https://img.youtube.com/vi/DsUPVERZFlI/hqdefault.jpg",
      desc: "Wiggle your arms, wiggle your hips, shake all that energy out!",
      actionPrompt: "Wiggle your whole body and shake off all the sitting down! 💃"
    },
    {
      id: "fire_and_ice",
      title: "Fire and Ice Freeze Dance! 🔥❄️",
      youtubeId: "XYEjLXxT2xg", // "Fire & Ice FREEZE Dance!" /// Danny Go! Brain Break
      duration: "3:40",
      thumbnail: "https://img.youtube.com/vi/XYEjLXxT2xg/hqdefault.jpg",
      desc: "Run super fast in the fire, then slow freeze in the ice!",
      actionPrompt: "Run fast when it's hot, freeze slow when it turns to ice! 🏃‍♀️"
    },
    {
      id: "robot_dance",
      title: "The Robot Dance! 🤖",
      youtubeId: "T8Df3VZCKUc", // "The Robot Dance!" /// Danny Go! Brain Break Songs for Kids
      duration: "3:10",
      thumbnail: "https://img.youtube.com/vi/T8Df3VZCKUc/hqdefault.jpg",
      desc: "Beep boop! Turn on your robot circuits and do the mechanical dance!",
      actionPrompt: "Beep Boop! Move like a robot genius! 🤖"
    },
    {
      id: "dino_dance",
      title: "The Dinosaur Dance! 🦖",
      youtubeId: "qSkVgH-4PKw", // "The Dinosaur Dance!" /// Danny Go! Brain Break Songs for Kids
      duration: "3:50",
      thumbnail: "https://img.youtube.com/vi/qSkVgH-4PKw/hqdefault.jpg",
      desc: "Grab your shovel and dig up giant T-Rex bones!",
      actionPrompt: "Dig down low, roar up high like a dinosaur! 🦖"
    },
    {
      id: "space_party",
      title: "Space Race! Planet Dance 🚀",
      youtubeId: "9Sv-CXY2soo", // "Space Race!" Planet Dance Song Solar System Brain Break | Danny Go!
      duration: "3:25",
      thumbnail: "https://img.youtube.com/vi/9Sv-CXY2soo/hqdefault.jpg",
      desc: "Blast off into outer space and float in zero gravity!",
      actionPrompt: "3... 2... 1... BLAST OFF! Jump to the moon! 🌙"
    }
  ],

  badges: [
    { id: "first_step", name: "First Adventure!", icon: "🌟", desc: "Completed your first puzzle!", condition: { type: "solved", count: 1 } },
    { id: "matrix_whiz", name: "Matrix Wizard", icon: "🧩", desc: "Solved 5 Nonverbal Matrix puzzles!", condition: { type: "category", category: "matrix_reasoning", count: 5 } },
    { id: "math_magician", name: "Math Magician", icon: "✨", desc: "Mastered 5 Math Logic challenges!", condition: { type: "category", category: "math_logic", count: 5 } },
    { id: "word_detective", name: "Word Sherlock", icon: "🔎", desc: "Cracked 5 Verbal Analogies & Clues!", condition: { type: "category", category: "verbal_detective", count: 5 } },
    { id: "spatial_genius", name: "Spatial Star", icon: "📐", desc: "Folded and unfolded 5 Spatial shapes!", condition: { type: "category", category: "spatial_folding", count: 5 } },
    { id: "logic_champion", name: "Mystery Master", icon: "🕵️", desc: "Solved 5 Deductive Logic Grid mysteries!", condition: { type: "category", category: "logic_mysteries", count: 5 } },
    { id: "science_hero", name: "Nature Explorer", icon: "🌱", desc: "Discovered 5 Science Inquiry secrets!", condition: { type: "category", category: "science_inquiry", count: 5 } },
    { id: "streak_master", name: "Super Streak 5!", icon: "🔥", desc: "Got 5 puzzles right in a row!", condition: { type: "streak", count: 5 } },
    { id: "streak_legend", name: "Streak Legend 10!", icon: "⚡", desc: "Got 10 puzzles right in a row! Unstoppable!", condition: { type: "streak", count: 10 } },
    { id: "danny_go_dancer", name: "Danny Go! Dancer", icon: "💃", desc: "Completed a full Danny Go dance break!", condition: { type: "dance", count: 1 } },
    { id: "danny_go_rockstar", name: "Dance Rockstar", icon: "🕺", desc: "Completed 5 Danny Go dance parties!", condition: { type: "dance", count: 5 } },
    { id: "stafford_scholar", name: "Stafford Scholar", icon: "🎓", desc: "Reached 25 total correct puzzles!", condition: { type: "solved", count: 25 } },
    { id: "winding_creek_pride", name: "Winding Creek Hero", icon: "🏫", desc: "Reached 50 total correct puzzles!", condition: { type: "solved", count: 50 } },
    { id: "gate_superstar", name: "GATE Superstar", icon: "👑", desc: "Achieved Master Level in all 6 domains!", condition: { type: "all_mastery" } },
    ...EXTRA_CATEGORY_BADGES,
    ...EXTRA_SOLVED_BADGES,
    ...EXTRA_STREAK_BADGES,
    ...EXTRA_DANCE_BADGES,
    ...EXTRA_STICKER_BADGES
  ],

  pets: [
    { id: "unicorn", name: "Sparkle the Unicorn", emoji: "🦄", sound: "neigh", intro: "Sparkle believes in your brilliant brain!" },
    { id: "puppy", name: "Bowie the Star Pup", emoji: "🐶", sound: "woof", intro: "Bowie wags his tail whenever you solve a clue!" },
    { id: "bunny", name: "Pip the Hop Bunny", emoji: "🐰", sound: "squeak", intro: "Pip hops with joy when you do Danny Go dances!" },
    { id: "kitty", name: "Luna the Star Cat", emoji: "🐱", sound: "purr", intro: "Luna gives you lucky high-paws!" },
    { id: "dragon", name: "Nova the Baby Dragon", emoji: "🐲", sound: "roar", intro: "Nova breathes sparkles of genius!" }
  ],

  stickers: [
    { id: "s1", name: "Rainbow Star", emoji: "🌈", costCents: 75 },
    { id: "s2", name: "Cupcake Crown", emoji: "🧁", costCents: 75 },
    { id: "s3", name: "Magic Wand", emoji: "🪄", costCents: 100 },
    { id: "s4", name: "Super Diamond", emoji: "💎", costCents: 125 },
    { id: "s5", name: "Glowing Rocket", emoji: "🚀", costCents: 100 },
    { id: "s6", name: "Dancing Butterfly", emoji: "🦋", costCents: 75 },
    { id: "s7", name: "Golden Trophy", emoji: "🏆", costCents: 150 },
    { id: "s8", name: "Flower Crown", emoji: "🌸", costCents: 75 },
    { id: "s9", name: "Stafford Star Owl", emoji: "🦉", costCents: 125 },
    { id: "s10", name: "Danny Go Lava Stone", emoji: "🌋", costCents: 100 },
    { id: "s11", name: "Music Heart", emoji: "💖", costCents: 75 },
    { id: "s12", name: "Genius Lightbulb", emoji: "💡", costCents: 100 },
    ...EXTRA_STICKERS
  ]
};
