/**
 * Comprehensive Question Bank for Grade 1 GATE & Virginia SOL Prep
 * Aligned with Stafford County Public Schools (SCPS) Gifted / FOCUS Identification
 */

const QUESTION_BANK = [
  // ==========================================
  // 1. MATRIX & NONVERBAL REASONING (CogAT / NNAT3)
  // ==========================================
  {
    id: "mat_01",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - 2x2 Matrix",
    difficulty: 1,
    prompt: "Look at the pattern box. What shape completes the puzzle?",
    visualType: "matrix_2x2",
    visualData: {
      tl: { shape: "circle", color: "#FF6B6B" },
      tr: { shape: "square", color: "#FF6B6B" },
      bl: { shape: "circle", color: "#3B82F6" },
      br: "?"
    },
    options: [
      { text: "Blue Square", icon: "🟦", visual: { shape: "square", color: "#3B82F6" } },
      { text: "Red Circle", icon: "🔴", visual: { shape: "circle", color: "#FF6B6B" } },
      { text: "Blue Triangle", icon: "🔺", visual: { shape: "triangle", color: "#3B82F6" } },
      { text: "Yellow Star", icon: "⭐", visual: { shape: "star", color: "#FBBF24" } }
    ],
    correctIndex: 0,
    hint: "Top row changes from Circle to Square in Red. Bottom row changes from Circle to Square in Blue!",
    explanation: "The top row has a red circle and a red square. The bottom row has a blue circle, so it needs a blue square to match!"
  },
  {
    id: "mat_02",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - Size & Color Transform",
    difficulty: 2,
    prompt: "Look at how the top shapes change. What comes in the bottom right corner?",
    visualType: "matrix_2x2",
    visualData: {
      tl: { shape: "triangle", size: "large", color: "#10B981" },
      tr: { shape: "triangle", size: "small", color: "#10B981" },
      bl: { shape: "star", size: "large", color: "#8B5CF6" },
      br: "?"
    },
    options: [
      { text: "Small Purple Star", icon: "✨", visual: { shape: "star", size: "small", color: "#8B5CF6" } },
      { text: "Large Purple Star", icon: "🌟", visual: { shape: "star", size: "large", color: "#8B5CF6" } },
      { text: "Small Green Triangle", icon: "🔺", visual: { shape: "triangle", size: "small", color: "#10B981" } },
      { text: "Small Blue Circle", icon: "🔵", visual: { shape: "circle", size: "small", color: "#3B82F6" } }
    ],
    correctIndex: 0,
    hint: "The rule is: Large shape turns into a Small shape of the same color!",
    explanation: "The large green triangle becomes a small green triangle. So the large purple star becomes a small purple star!"
  },
  {
    id: "mat_03",
    category: "matrix_reasoning",
    standard: "NNAT3 - Pattern Series Progression",
    difficulty: 2,
    prompt: "What comes next in this growing dot pattern?",
    visualType: "sequence",
    visualData: {
      items: ["🔵 (1)", "🔵🔵 (2)", "🔵🔵🔵 (3)", "❓"]
    },
    options: [
      { text: "4 Blue Dots", icon: "🔵🔵🔵🔵" },
      { text: "5 Blue Dots", icon: "🔵🔵🔵🔵🔵" },
      { text: "3 Red Dots", icon: "🔴🔴🔴" },
      { text: "2 Blue Dots", icon: "🔵🔵" }
    ],
    correctIndex: 0,
    hint: "Count the dots: 1, then 2, then 3... how many come next?",
    explanation: "Each step adds 1 more dot! 1 + 1 = 2, 2 + 1 = 3, 3 + 1 = 4 dots!"
  },
  {
    id: "mat_04",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - Figure Classification",
    difficulty: 3,
    prompt: "Which shape does NOT belong with the others?",
    visualType: "classification",
    visualData: {
      shapes: ["Triangle (3 sides)", "Square (4 sides)", "Pentagon (5 sides)", "Circle (0 straight sides)"]
    },
    options: [
      { text: "Circle (round with no straight sides)", icon: "⭕" },
      { text: "Triangle (3 straight sides)", icon: "🔺" },
      { text: "Square (4 straight sides)", icon: "🟩" },
      { text: "Rectangle (4 straight sides)", icon: "🟧" }
    ],
    correctIndex: 0,
    hint: "Look at the edges. Triangles, squares, and rectangles have straight sides and corners. What about a circle?",
    explanation: "The triangle, square, and rectangle all have straight sides and sharp corners. A circle is completely round with no straight sides!"
  },
  {
    id: "mat_05",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - 2x2 Fill & Inversion",
    difficulty: 3,
    prompt: "Look at the pattern: Solid becomes Striped. What goes in the question mark?",
    visualType: "matrix_2x2",
    visualData: {
      tl: { shape: "heart", fill: "solid", color: "#EC4899" },
      tr: { shape: "heart", fill: "striped", color: "#EC4899" },
      bl: { shape: "diamond", fill: "solid", color: "#06B6D4" },
      br: "?"
    },
    options: [
      { text: "Striped Cyan Diamond", icon: "💠", visual: { shape: "diamond", fill: "striped", color: "#06B6D4" } },
      { text: "Solid Cyan Diamond", icon: "🔷", visual: { shape: "diamond", fill: "solid", color: "#06B6D4" } },
      { text: "Striped Pink Heart", icon: "💖", visual: { shape: "heart", fill: "striped", color: "#EC4899" } },
      { text: "Solid Yellow Star", icon: "⭐", visual: { shape: "star", fill: "solid", color: "#FBBF24" } }
    ],
    correctIndex: 0,
    hint: "Across the row, solid fills change to striped patterns while keeping their shape!",
    explanation: "The pink heart became a striped pink heart. So the solid cyan diamond becomes a striped cyan diamond!"
  },
  {
    id: "mat_06",
    category: "matrix_reasoning",
    standard: "NNAT3 - Spatial Rotation",
    difficulty: 4,
    prompt: "The arrow turns like the hands of a clock (pointing UP, then RIGHT, then DOWN). Where will it point next?",
    visualType: "rotation_sequence",
    visualData: {
      steps: ["⬆️ (Up)", "➡️ (Right)", "⬇️ (Down)", "❓"]
    },
    options: [
      { text: "Left ⬅️", icon: "⬅️" },
      { text: "Up ⬆️", icon: "⬆️" },
      { text: "Right ➡️", icon: "➡️" },
      { text: "Down-Right ↘️", icon: "↘️" }
    ],
    correctIndex: 0,
    hint: "Follow the circle clock: Top -> Right -> Bottom -> ...",
    explanation: "The arrow is rotating clockwise a quarter turn each time: Up, Right, Down, and next is Left ⬅️!"
  },
  {
    id: "mat_07",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - Shape Inside Shape",
    difficulty: 4,
    prompt: "Look closely at the rule: The small shape inside JUMPS outside! What completes the puzzle?",
    visualType: "matrix_2x2",
    visualData: {
      tl: { desc: "Circle with small dot inside" },
      tr: { desc: "Small dot alone" },
      bl: { desc: "Square with small star inside" },
      br: "?"
    },
    options: [
      { text: "Small Star alone ⭐", icon: "⭐" },
      { text: "Square with dot inside", icon: "⊡" },
      { text: "Big Star inside Circle", icon: "🌟" },
      { text: "Empty Square", icon: "⬜" }
    ],
    correctIndex: 0,
    hint: "The outside shape disappears, leaving only the tiny inner shape!",
    explanation: "In the top row, the outer circle goes away, leaving just the dot. In the bottom row, the outer square goes away, leaving just the small star!"
  },

  // ==========================================
  // 2. MATH & QUANTITATIVE REASONING (VA SOL Math 1.1-1.15 & CogAT Quant)
  // ==========================================
  {
    id: "math_01",
    category: "math_logic",
    standard: "VA SOL 1.3 - Skip Counting Patterns",
    difficulty: 1,
    prompt: "Lily is jumping down number stepping stones: 5, 10, 15, 20, __? Which number is next?",
    visualType: "stones",
    visualData: { values: [5, 10, 15, 20, "?"] },
    options: [
      { text: "25", icon: "🌸 25" },
      { text: "21", icon: "🌸 21" },
      { text: "30", icon: "🌸 30" },
      { text: "22", icon: "🌸 22" }
    ],
    correctIndex: 0,
    hint: "Count by 5s like the fingers on your hand! 5, 10, 15, 20...",
    explanation: "We are skip counting by 5s! 20 + 5 = 25!"
  },
  {
    id: "math_02",
    category: "math_logic",
    standard: "VA SOL 1.6 & CogAT Quant - Balance Scale Mystery",
    difficulty: 2,
    prompt: "Look at the balance scale. Both sides must be EQUAL. 4 + 🌟 = 10. What number is the Star?",
    visualType: "balance_scale",
    visualData: { left: "4 + 🌟", right: "10", balanced: true },
    options: [
      { text: "6 (because 4 + 6 = 10)", icon: "⭐ 6" },
      { text: "5 (because 4 + 5 = 9)", icon: "⭐ 5" },
      { text: "7 (because 4 + 7 = 11)", icon: "⭐ 7" },
      { text: "14 (because 10 + 4 = 14)", icon: "⭐ 14" }
    ],
    correctIndex: 0,
    hint: "Start at 4 and count up to 10: 5, 6, 7, 8, 9, 10. How many fingers did you count?",
    explanation: "4 + 6 = 10! The Star is worth 6 so both sides of the scale balance perfectly!"
  },
  {
    id: "math_03",
    category: "math_logic",
    standard: "VA SOL 1.1 - Tens and Ones Place Value",
    difficulty: 2,
    prompt: "Lily has 3 bundles of 10 craft sticks, plus 7 single sticks. What number does she have?",
    visualType: "place_value",
    visualData: { tens: 3, ones: 7 },
    options: [
      { text: "37 (3 Tens and 7 Ones)", icon: "📦 37" },
      { text: "73 (7 Tens and 3 Ones)", icon: "📦 73" },
      { text: "10 (3 + 7)", icon: "📦 10" },
      { text: "30 (3 Tens)", icon: "📦 30" }
    ],
    correctIndex: 0,
    hint: "3 bundles of ten is 30. Then add the 7 single sticks: 30 + 7!",
    explanation: "3 tens = 30, and 7 ones = 7. Put them together: 30 + 7 = 37!"
  },
  {
    id: "math_04",
    category: "math_logic",
    standard: "VA SOL 1.13 - Money Value Detective",
    difficulty: 3,
    prompt: "Lily has 1 Dime (10¢) and 3 Nickels (5¢ each). How many cents does she have in total?",
    visualType: "coins",
    visualData: { coins: ["Dime (10¢)", "Nickel (5¢)", "Nickel (5¢)", "Nickel (5¢)"] },
    options: [
      { text: "25¢ (a Quarter!)", icon: "🪙 25¢" },
      { text: "15¢", icon: "🪙 15¢" },
      { text: "20¢", icon: "🪙 20¢" },
      { text: "30¢", icon: "🪙 30¢" }
    ],
    correctIndex: 0,
    hint: "Start with 10¢ for the dime. Count by 5s for the 3 nickels: 10... 15... 20... 25!",
    explanation: "10¢ + 5¢ + 5¢ + 5¢ = 25¢! That equals one whole quarter!"
  },
  {
    id: "math_05",
    category: "math_logic",
    standard: "CogAT Quant - Relational Number Analogy",
    difficulty: 3,
    prompt: "Look at the magic number machine: [ 2 ➔ 4 ], [ 5 ➔ 10 ], [ 8 ➔ ? ]. What comes out when 8 goes in?",
    visualType: "number_machine",
    visualData: { rule: "Double the number" },
    options: [
      { text: "16 (Double of 8)", icon: "⚡ 16" },
      { text: "10 (8 + 2)", icon: "⚡ 10" },
      { text: "14", icon: "⚡ 14" },
      { text: "18", icon: "⚡ 18" }
    ],
    correctIndex: 0,
    hint: "What did the machine do to 2 to make 4? (2 + 2 = 4). What did it do to 5 to make 10? (5 + 5 = 10). It doubles!",
    explanation: "The magic rule is DOUBLING (adding the number to itself). 8 + 8 = 16!"
  },
  {
    id: "math_06",
    category: "math_logic",
    standard: "VA SOL 1.5 & SCPS Gifted - Multi-Step Word Mystery",
    difficulty: 4,
    prompt: "At Winding Creek Elementary, Maya baked 14 cookies. She gave 4 cookies to Noah and 3 cookies to Lily. How many cookies does Maya have left?",
    visualType: "word_problem",
    visualData: { start: 14, gave: "4 + 3" },
    options: [
      { text: "7 cookies left", icon: "🍪 7" },
      { text: "8 cookies left", icon: "🍪 8" },
      { text: "10 cookies left", icon: "🍪 10" },
      { text: "6 cookies left", icon: "🍪 6" }
    ],
    correctIndex: 0,
    hint: "First find how many cookies Maya gave away in total (4 + 3 = 7). Then subtract that from 14!",
    explanation: "Maya gave away 4 + 3 = 7 cookies. 14 minus 7 equals 7 cookies left!"
  },
  {
    id: "math_07",
    category: "math_logic",
    standard: "VA SOL 1.2 - Fractions & Fair Shares",
    difficulty: 3,
    prompt: "Lily and 3 friends want to share a big round pizza equally so all 4 kids get the exact same amount. What fraction does Lily get?",
    visualType: "pizza_fraction",
    visualData: { slices: 4, people: 4 },
    options: [
      { text: "One Fourth (1/4)", icon: "🍕 1/4" },
      { text: "One Half (1/2)", icon: "🍕 1/2" },
      { text: "One Whole (1)", icon: "🍕 1" },
      { text: "One Third (1/3)", icon: "🍕 1/3" }
    ],
    correctIndex: 0,
    hint: "There are 4 people sharing equally. When something is split into 4 equal pieces, each piece is called a fourth!",
    explanation: "Lily plus 3 friends = 4 kids total. 1 pizza split into 4 equal parts gives each child one fourth (1/4)!"
  },

  // ==========================================
  // 3. WORD DETECTIVE & VERBAL REASONING (CogAT Verbal & VA SOL Reading)
  // ==========================================
  {
    id: "verb_01",
    category: "verbal_detective",
    standard: "CogAT Verbal - Word Analogy (Animals)",
    difficulty: 1,
    prompt: "Puppy is to Dog as Kitten is to ___?",
    visualType: "analogy",
    visualData: { pair1: "Puppy ➔ Dog", pair2: "Kitten ➔ ?" },
    options: [
      { text: "Cat", icon: "🐱 Cat" },
      { text: "Bunny", icon: "🐰 Bunny" },
      { text: "Bird", icon: "🐦 Bird" },
      { text: "Horse", icon: "🐴 Horse" }
    ],
    correctIndex: 0,
    hint: "A puppy grows up to be a dog. What does a kitten grow up to be?",
    explanation: "A puppy is a baby dog, and a kitten is a baby cat!"
  },
  {
    id: "verb_02",
    category: "verbal_detective",
    standard: "CogAT Verbal - Word Analogy (Habitat)",
    difficulty: 2,
    prompt: "Bird is to Nest as Bee is to ___?",
    visualType: "analogy",
    visualData: { pair1: "Bird ➔ Nest", pair2: "Bee ➔ ?" },
    options: [
      { text: "Beehive", icon: "🐝 Beehive" },
      { text: "Flower", icon: "🌸 Flower" },
      { text: "Pond", icon: "💧 Pond" },
      { text: "Cave", icon: "🪨 Cave" }
    ],
    correctIndex: 0,
    hint: "A nest is the home where a bird lives. Where do bees build their home?",
    explanation: "A bird builds and lives in a nest. Bees build and live in a beehive!"
  },
  {
    id: "verb_03",
    category: "verbal_detective",
    standard: "CogAT Verbal - Category Exclusion",
    difficulty: 2,
    prompt: "Which word does NOT belong with the others?",
    visualType: "word_group",
    visualData: { words: ["Apple", "Banana", "Strawberry", "Carrot"] },
    options: [
      { text: "Carrot (It's a vegetable, the others are fruits!)", icon: "🥕 Carrot" },
      { text: "Apple", icon: "🍎 Apple" },
      { text: "Banana", icon: "🍌 Banana" },
      { text: "Strawberry", icon: "🍓 Strawberry" }
    ],
    correctIndex: 0,
    hint: "Apples, bananas, and strawberries are sweet fruits that grow on trees or bushes. What is a carrot?",
    explanation: "Carrot is a root vegetable, while apples, bananas, and strawberries are all fruits!"
  },
  {
    id: "verb_04",
    category: "verbal_detective",
    standard: "VA SOL 1.8 - Context Clue Riddle",
    difficulty: 3,
    prompt: "Riddle: 'I have hands but cannot clap. I have a face but cannot smile. I tell you when school starts.' What am I?",
    visualType: "riddle",
    visualData: { clues: ["Has hands", "Has a face", "Tells time"] },
    options: [
      { text: "A Clock", icon: "⏰ Clock" },
      { text: "A Robot", icon: "🤖 Robot" },
      { text: "A Doll", icon: "🪆 Doll" },
      { text: "A Book", icon: "📖 Book" }
    ],
    correctIndex: 0,
    hint: "Think about things in your classroom on the wall that have an hour hand and a minute hand!",
    explanation: "A clock has an hour and minute hand and a clock face that tells what time it is!"
  },
  {
    id: "verb_05",
    category: "verbal_detective",
    standard: "CogAT Verbal - Antonym / Opposite Logic",
    difficulty: 3,
    prompt: "Hot is to Cold as Whisper is to ___?",
    visualType: "analogy",
    visualData: { pair1: "Hot ➔ Cold (Opposites)", pair2: "Whisper ➔ ?" },
    options: [
      { text: "Shout / Yell", icon: "📢 Shout" },
      { text: "Talk", icon: "🗣️ Talk" },
      { text: "Listen", icon: "👂 Listen" },
      { text: "Quiet", icon: "🤫 Quiet" }
    ],
    correctIndex: 0,
    hint: "Hot and Cold are complete opposites. What is the opposite of whispering very quietly?",
    explanation: "Hot is the opposite of cold. The opposite of whispering very quietly is shouting loudly!"
  },
  {
    id: "verb_06",
    category: "verbal_detective",
    standard: "VA SOL 1.5 - Phonics & Rhyme Deductions",
    difficulty: 4,
    prompt: "I rhyme with 'BRIGHT', I shine at night in the sky, and I start with the /l/ sound like Lily. What word am I?",
    visualType: "phonics_mystery",
    visualData: { rhyme: "bright", startsWith: "L" },
    options: [
      { text: "Light", icon: "💡 Light" },
      { text: "Night", icon: "🌙 Night" },
      { text: "Star", icon: "⭐ Star" },
      { text: "Moon", icon: "🌕 Moon" }
    ],
    correctIndex: 0,
    hint: "Blend the /l/ sound with -ight: L + ight = ?",
    explanation: "L + ight = LIGHT! It rhymes with bright and begins with L like Lily!"
  },

  // ==========================================
  // 4. SPATIAL & VISUAL REASONING (NNAT3 / Spatial Geometry)
  // ==========================================
  {
    id: "spat_01",
    category: "spatial_folding",
    standard: "NNAT3 - Paper Folding & Hole Punch",
    difficulty: 2,
    prompt: "A square paper is folded in HALF. A hole is punched in the middle. When unfolded, what does it look like?",
    visualType: "paper_folding",
    visualData: { folds: 1, punches: 1 },
    options: [
      { text: "2 Holes across the paper", icon: "📄 🕳️ 🕳️" },
      { text: "1 Hole only", icon: "📄 🕳️" },
      { text: "4 Holes", icon: "📄 🕳️🕳️🕳️🕳️" },
      { text: "No Holes", icon: "📄" }
    ],
    correctIndex: 0,
    hint: "Because the paper was folded in 2 layers, one punch goes through BOTH layers!",
    explanation: "When you fold paper in half and punch 1 hole through both layers, opening it reveals 2 mirror-image holes!"
  },
  {
    id: "spat_02",
    category: "spatial_folding",
    standard: "Spatial - 3D Hidden Block Counting",
    difficulty: 3,
    prompt: "Look at the 3D block tower. There is a column of 2 blocks, and one single block next to it. How many total blocks are used in this structure?",
    visualType: "blocks_3d",
    visualData: { layers: [[1, 2]] },
    options: [
      { text: "3 blocks total", icon: "🧱 3 Blocks" },
      { text: "2 blocks total", icon: "🧱 2 Blocks" },
      { text: "4 blocks total", icon: "🧱 4 Blocks" },
      { text: "5 blocks total", icon: "🧱 5 Blocks" }
    ],
    correctIndex: 0,
    hint: "The tall stack has 2 blocks (one on bottom, one on top). The short stack has 1 block. 2 + 1 = ?",
    explanation: "The taller column has 2 blocks stacked up, plus 1 block on the side: 2 + 1 = 3 total blocks!"
  },
  {
    id: "spat_03",
    category: "spatial_folding",
    standard: "Spatial - Mirror Reflection Symmetry",
    difficulty: 2,
    prompt: "If you look at the letter 'b' in a mirror, what does its reflection look like?",
    visualType: "mirror",
    visualData: { original: "b" },
    options: [
      { text: "d (flipped horizontally)", icon: "🪞 d" },
      { text: "p (flipped vertically)", icon: "🪞 p" },
      { text: "q", icon: "🪞 q" },
      { text: "b (stays same)", icon: "🪞 b" }
    ],
    correctIndex: 0,
    hint: "Hold your left thumb up (like a 'b'). In a mirror facing you, it flips sideways to look like a 'd'!",
    explanation: "A mirror flips things horizontally from left to right, so the letter 'b' reflects into 'd'!"
  },
  {
    id: "spat_04",
    category: "spatial_folding",
    standard: "VA SOL 1.11 & Spatial - Tangram Shape Combine",
    difficulty: 3,
    prompt: "If you put two equal right triangles together along their longest slanted sides, what single shape can they make?",
    visualType: "tangram",
    visualData: { parts: ["triangle", "triangle"] },
    options: [
      { text: "A Square (or Rectangle)", icon: "🟩 Square" },
      { text: "A Circle", icon: "⚪ Circle" },
      { text: "An Oval", icon: "🥚 Oval" },
      { text: "A Star", icon: "⭐ Star" }
    ],
    correctIndex: 0,
    hint: "Two flat triangular building blocks can snap together to make 4 straight sides and 4 square corners!",
    explanation: "Combining two right triangles along their slanted diagonal forms a perfect square or rectangle!"
  },
  {
    id: "spat_05",
    category: "spatial_folding",
    standard: "NNAT3 - Double Paper Fold",
    difficulty: 4,
    prompt: "A paper is folded in half once (left to right), and in half again (top to bottom). Then 1 hole is punched in the corner. When completely unfolded, how many holes are there?",
    visualType: "paper_folding",
    visualData: { folds: 2, punches: 1 },
    options: [
      { text: "4 Holes", icon: "📄 4 Holes" },
      { text: "2 Holes", icon: "📄 2 Holes" },
      { text: "1 Hole", icon: "📄 1 Hole" },
      { text: "8 Holes", icon: "📄 8 Holes" }
    ],
    correctIndex: 0,
    hint: "First fold makes 2 layers. Second fold makes 4 layers! 1 hole through 4 layers = ?",
    explanation: "Folding twice creates 4 layers of paper. Punching through all 4 layers leaves 4 holes when fully opened!"
  },

  // ==========================================
  // 5. DEDUCTIVE LOGIC MYSTERIES (SCPS FOCUS Gifted Identification)
  // ==========================================
  {
    id: "log_01",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Pet Deduction Mystery",
    difficulty: 2,
    prompt: "Lily, Noah, and Maya each have one pet: a Cat, a Dog, or a Bunny.\n• Clue 1: Lily does NOT have a Dog.\n• Clue 2: Noah has a Bunny.\n• Clue 3: Who has the Cat?",
    visualType: "logic_grid",
    visualData: { people: ["Lily", "Noah", "Maya"], items: ["Cat", "Dog", "Bunny"] },
    options: [
      { text: "Lily has the Cat!", icon: "🐱 Lily" },
      { text: "Maya has the Cat!", icon: "🐱 Maya" },
      { text: "Noah has the Cat!", icon: "🐱 Noah" },
      { text: "No one has a Cat", icon: "❌" }
    ],
    correctIndex: 0,
    hint: "Noah has the Bunny. Lily doesn't have the Dog, so Lily MUST have the...?",
    explanation: "Noah has the Bunny. That leaves the Cat and Dog. Since Lily cannot have the Dog, Lily must have the Cat (and Maya has the Dog)!"
  },
  {
    id: "log_02",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Race Finish Line Logic",
    difficulty: 2,
    prompt: "Three runners finished the playground race: Red, Blue, and Gold.\n• Clue 1: Gold finished in 1st Place.\n• Clue 2: Blue finished AFTER Red.\nWho came in 2nd Place?",
    visualType: "race_order",
    visualData: { runners: ["Gold (1st)", "❓ (2nd)", "❓ (3rd)"] },
    options: [
      { text: "Red finished 2nd", icon: "🔴 Red" },
      { text: "Blue finished 2nd", icon: "🔵 Blue" },
      { text: "Gold finished 2nd", icon: "🟡 Gold" },
      { text: "They tied", icon: "🤝" }
    ],
    correctIndex: 0,
    hint: "Gold is 1st. Between Red and Blue, Blue finished behind Red. So Red is 2nd and Blue is 3rd!",
    explanation: "1st is Gold. Since Blue finished after Red, Red is 2nd place and Blue is 3rd place!"
  },
  {
    id: "log_03",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Favorite Color Deduction",
    difficulty: 3,
    prompt: "Four friends wear backpacks: Pink, Purple, Teal, and Yellow.\n• Clue 1: Lily's backpack is NOT Yellow or Teal.\n• Clue 2: Maya loves Pink and is wearing the Pink backpack.\nWhat color is Lily's backpack?",
    visualType: "backpack_logic",
    visualData: { colors: ["Pink", "Purple", "Teal", "Yellow"] },
    options: [
      { text: "Purple Backpack", icon: "🎒 Purple" },
      { text: "Yellow Backpack", icon: "🎒 Yellow" },
      { text: "Teal Backpack", icon: "🎒 Teal" },
      { text: "Pink Backpack", icon: "🎒 Pink" }
    ],
    correctIndex: 0,
    hint: "Eliminate choices: Maya has Pink. Lily does NOT have Yellow or Teal. What is the only color left for Lily?",
    explanation: "Maya has Pink. Lily's is not Yellow and not Teal. The only color left for Lily is Purple!"
  },
  {
    id: "log_04",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Height Ordering Clue",
    difficulty: 3,
    prompt: "Look at the height clues:\n• Clue 1: The Giraffe is taller than the Zebra.\n• Clue 2: The Elephant is taller than the Giraffe.\nWho is the TALLEST animal of all three?",
    visualType: "height_order",
    visualData: { animals: ["Elephant", "Giraffe", "Zebra"] },
    options: [
      { text: "The Elephant is the tallest! 🐘", icon: "🐘 Elephant" },
      { text: "The Giraffe 🦒", icon: "🦒 Giraffe" },
      { text: "The Zebra 🦓", icon: "🦓 Zebra" },
      { text: "They are all the same height", icon: "📏" }
    ],
    correctIndex: 0,
    hint: "Elephant > Giraffe > Zebra. Who is at the very top?",
    explanation: "The Giraffe is taller than the Zebra, and the Elephant is taller than the Giraffe! So Elephant is the tallest!"
  },
  {
    id: "log_05",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Truth & Mystery Box",
    difficulty: 4,
    prompt: "There are 2 treasure chests: Gold and Silver. ONE has a prize, ONE is empty.\n• Sign on Gold Chest says: 'The prize is in here!'\n• Sign on Silver Chest says: 'One sign is TRUE, and one sign is FALSE.'\nIf the Gold sign is telling the truth, where is the prize?",
    visualType: "treasure_chests",
    visualData: { gold: "Prize is in here", silver: "One sign is true" },
    options: [
      { text: "Inside the Gold Chest! 🏆", icon: "🪙 Gold Chest" },
      { text: "Inside the Silver Chest", icon: "🥈 Silver Chest" },
      { text: "Under the floor", icon: "🪵 Floor" },
      { text: "Both chests have prizes", icon: "🎁" }
    ],
    correctIndex: 0,
    hint: "If the sign on the Gold chest is true, and it says 'The prize is in here', then the prize is right inside it!",
    explanation: "Since the Gold sign is telling the truth and says the prize is in the Gold chest, the prize is in the Gold chest!"
  },

  // ==========================================
  // 6. SCIENCE EXPLORER & INQUIRY (VA Science SOL 1.1-1.7)
  // ==========================================
  {
    id: "sci_01",
    category: "science_inquiry",
    standard: "VA SOL 1.4 - Plant Needs & Life Cycles",
    difficulty: 1,
    prompt: "Lily is growing a sunflower in her garden at Winding Creek. What THREE things does her plant need to grow big and strong?",
    visualType: "plant_needs",
    visualData: { plant: "Sunflower" },
    options: [
      { text: "Sunlight, Water, and Soil", icon: "☀️💧🌱" },
      { text: "Juice, Candy, and Toys", icon: "🧃🍬🧸" },
      { text: "Darkness, Cold, and Ice", icon: "🌑❄️🧊" },
      { text: "Rocks, Wind, and Milk", icon: "🪨💨🥛" }
    ],
    correctIndex: 0,
    hint: "Plants use the sun for energy, drink water through roots, and stand in healthy dirt!",
    explanation: "Plants need sunlight to make food, water to drink, and soil to anchor their roots and get nutrients!"
  },
  {
    id: "sci_02",
    category: "science_inquiry",
    standard: "VA SOL 1.6 - Sun & Shadow Science",
    difficulty: 2,
    prompt: "When the bright sun is shining behind Lily on the playground, where will her shadow appear?",
    visualType: "shadow_science",
    visualData: { sunPosition: "Behind Lily" },
    options: [
      { text: "In FRONT of Lily", icon: "🏃‍♀️ 👤 In Front" },
      { text: "Behind Lily", icon: "👤 🏃‍♀️ Behind" },
      { text: "High in the clouds", icon: "☁️ Clouds" },
      { text: "Shadows only appear at midnight", icon: "🌙" }
    ],
    correctIndex: 0,
    hint: "Lily's body blocks the sunlight coming from behind her, casting a shadow on the ground in front!",
    explanation: "Light travels in straight lines. When the sun is behind you, your body blocks the light and casts a shadow in FRONT of you!"
  },
  {
    id: "sci_03",
    category: "science_inquiry",
    standard: "VA SOL 1.7 - States of Matter & Temperature",
    difficulty: 2,
    prompt: "What happens to a solid ice cube when it gets warm on a sunny Virginia summer day?",
    visualType: "matter_change",
    visualData: { from: "Solid Ice", heat: "Warm Sun" },
    options: [
      { text: "It melts into liquid water", icon: "🧊 ➔ 💧 Melts" },
      { text: "It turns into a solid rock", icon: "🧊 ➔ 🪨 Rock" },
      { text: "It freezes harder", icon: "🧊 ➔ 🥶" },
      { text: "It turns into wood", icon: "🧊 ➔ 🪵" }
    ],
    correctIndex: 0,
    hint: "Warm temperatures make solid ice change its state of matter into liquid water!",
    explanation: "Heat causes ice (solid) to melt into liquid water!"
  },
  {
    id: "sci_04",
    category: "science_inquiry",
    standard: "VA SOL 1.4 - Butterfly Metamorphosis",
    difficulty: 3,
    prompt: "Put the stages of a Butterfly's life cycle in the correct order:",
    visualType: "life_cycle",
    visualData: { stages: ["Egg", "Caterpillar", "Chrysalis", "Butterfly"] },
    options: [
      { text: "1. Egg ➔ 2. Caterpillar ➔ 3. Chrysalis ➔ 4. Butterfly", icon: "🥚 ➔ 🐛 ➔ 🛖 ➔ 🦋" },
      { text: "1. Butterfly ➔ 2. Chrysalis ➔ 3. Egg ➔ 4. Caterpillar", icon: "🦋 ➔ 🛖 ➔ 🥚 ➔ 🐛" },
      { text: "1. Caterpillar ➔ 2. Egg ➔ 3. Butterfly ➔ 4. Chrysalis", icon: "🐛 ➔ 🥚 ➔ 🦋 ➔ 🛖" },
      { text: "1. Chrysalis ➔ 2. Butterfly ➔ 3. Caterpillar ➔ 4. Egg", icon: "🛖 ➔ 🦋 ➔ 🐛 ➔ 🥚" }
    ],
    correctIndex: 0,
    hint: "It begins as a tiny egg on a leaf, hatches into a hungry caterpillar, sleeps in a chrysalis, and emerges with wings!",
    explanation: "The butterfly life cycle goes: Egg ➔ Caterpillar (larva) ➔ Chrysalis (pupa) ➔ Adult Butterfly!"
  },
  {
    id: "sci_05",
    category: "science_inquiry",
    standard: "VA SOL 1.7 - Sink or Float Prediction",
    difficulty: 3,
    prompt: "Lily tests objects in a water tub: A metal coin SINKS to the bottom, but a wooden craft block FLOATS on top. Why does the wooden block float?",
    visualType: "sink_float",
    visualData: { objects: ["Metal Coin (Sinks)", "Wood Block (Floats)"] },
    options: [
      { text: "Wood is lighter/less dense than water", icon: "🪵 Floats" },
      { text: "Wood is heavier than metal", icon: "⚖️" },
      { text: "Water is afraid of wood", icon: "💧" },
      { text: "The coin is filled with air", icon: "🪙" }
    ],
    correctIndex: 0,
    hint: "Things that are less dense (lighter for their size) float on water, while heavy dense things sink!",
    explanation: "The wood block is less dense than water so it floats, while the heavy metal coin is denser and sinks!"
  },
  {
    id: "sci_06",
    category: "science_inquiry",
    standard: "VA SOL 1.4 & Inquiry - Animal Habitats & Camouflage",
    difficulty: 4,
    prompt: "In winter in snowy places, why does an Arctic Hare's fur change from brown to pure white?",
    visualType: "camouflage",
    visualData: { season: "Winter Snow" },
    options: [
      { text: "To camouflage (blend in) with the white snow to hide from predators", icon: "🐇 ❄️ Camouflage" },
      { text: "Because it loves white paint", icon: "🎨 Paint" },
      { text: "To help it run 10 times faster", icon: "⚡ Speed" },
      { text: "So it can see better in the dark", icon: "👀 Sight" }
    ],
    correctIndex: 0,
    hint: "White fur matches the white snow so other animals cannot easily spot the bunny!",
    explanation: "White fur is an amazing adaptation called camouflage! It helps the bunny blend into the snowy background to stay safe!"
  },

  // ==========================================
  // 7. ADDITIONAL MATRIX & NONVERBAL REASONING
  // ==========================================
  {
    id: "mat_08",
    category: "matrix_reasoning",
    standard: "NNAT3 - ABAB Repeating Pattern",
    difficulty: 1,
    prompt: "Look at the pattern: Red, Blue, Red, Blue, Red, ___? What color comes next?",
    visualType: "sequence",
    visualData: { items: ["🔴", "🔵", "🔴", "🔵", "🔴", "❓"] },
    options: [
      { text: "Blue", icon: "🔵 Blue" },
      { text: "Red", icon: "🔴 Red" },
      { text: "Green", icon: "🟢 Green" },
      { text: "Yellow", icon: "🟡 Yellow" }
    ],
    correctIndex: 0,
    hint: "The pattern alternates back and forth: Red, Blue, Red, Blue...",
    explanation: "It's an ABAB pattern! After Red always comes Blue!"
  },
  {
    id: "mat_09",
    category: "matrix_reasoning",
    standard: "Spatial - Size Alternation Pattern",
    difficulty: 1,
    prompt: "Look at the sizes: Big, Small, Big, Small, Big, ___? What size comes next?",
    visualType: "sequence",
    visualData: { items: ["🔵 (Big)", "🔹 (Small)", "🔵 (Big)", "🔹 (Small)", "🔵 (Big)", "❓"] },
    options: [
      { text: "Small Circle", icon: "🔹 Small" },
      { text: "Big Circle", icon: "🔵 Big" },
      { text: "Medium Circle", icon: "⚪ Medium" },
      { text: "Big Square", icon: "🟦 Big Square" }
    ],
    correctIndex: 0,
    hint: "Big and small keep taking turns, just like the ABAB color pattern!",
    explanation: "Since Big just appeared, the pattern flips back to Small next!"
  },
  {
    id: "mat_10",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - 3-Color Rotation Pattern",
    difficulty: 2,
    prompt: "Watch the color wheel rotate: Red, Blue, Green, Red, Blue, ___? What color comes next?",
    visualType: "sequence",
    visualData: { items: ["🔴", "🔵", "🟢", "🔴", "🔵", "❓"] },
    options: [
      { text: "Green", icon: "🟢 Green" },
      { text: "Red", icon: "🔴 Red" },
      { text: "Blue", icon: "🔵 Blue" },
      { text: "Purple", icon: "🟣 Purple" }
    ],
    correctIndex: 0,
    hint: "The 3 colors take turns in the same order over and over: Red, Blue, Green...",
    explanation: "The cycle repeats every 3 steps: Red, Blue, Green, Red, Blue, and now Green again!"
  },
  {
    id: "mat_11",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - Odd One Out (Color)",
    difficulty: 2,
    prompt: "Four circles are shown. Which one does NOT belong with the group?",
    visualType: "classification",
    visualData: { shapes: ["Red Circle", "Red Circle", "Red Circle", "Blue Circle"] },
    options: [
      { text: "The Blue Circle (different color)", icon: "🔵 Blue Circle" },
      { text: "The 1st Red Circle", icon: "🔴 Circle" },
      { text: "The 2nd Red Circle", icon: "🔴 Circle" },
      { text: "The 3rd Red Circle", icon: "🔴 Circle" }
    ],
    correctIndex: 0,
    hint: "Three circles share the same color. Only one circle is a different color!",
    explanation: "Three circles are red, but one circle is blue, so the blue circle does not belong!"
  },
  {
    id: "mat_12",
    category: "matrix_reasoning",
    standard: "Spatial - Line of Symmetry Detection",
    difficulty: 2,
    prompt: "Which letter can be folded exactly in half so both sides match perfectly (has a line of symmetry)?",
    visualType: "classification",
    visualData: { shapes: ["A", "F", "R", "G"] },
    options: [
      { text: "The letter A", icon: "🅰️ A" },
      { text: "The letter F", icon: "🇫 F" },
      { text: "The letter R", icon: "🇷 R" },
      { text: "The letter G", icon: "🇬 G" }
    ],
    correctIndex: 0,
    hint: "Imagine drawing a line straight down the middle of each letter. Which one looks the same on both sides?",
    explanation: "The letter A has a line of symmetry right down the middle - both sides match! F, R, and G do not."
  },
  {
    id: "mat_13",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - 2x2 Matrix Shape & Fill Combo",
    difficulty: 3,
    prompt: "Look at the pattern box. What shape completes the puzzle?",
    visualType: "matrix_2x2",
    visualData: {
      tl: { shape: "star", color: "#FBBF24" },
      tr: { shape: "star", color: "#8B5CF6" },
      bl: { shape: "circle", color: "#FBBF24" },
      br: "?"
    },
    options: [
      { text: "Purple Circle", icon: "🟣", visual: { shape: "circle", color: "#8B5CF6" } },
      { text: "Yellow Star", icon: "⭐", visual: { shape: "star", color: "#FBBF24" } },
      { text: "Yellow Circle", icon: "🟡", visual: { shape: "circle", color: "#FBBF24" } },
      { text: "Purple Star", icon: "💜", visual: { shape: "star", color: "#8B5CF6" } }
    ],
    correctIndex: 0,
    hint: "The top row changes color from Yellow to Purple. The bottom row should follow the same color change!",
    explanation: "Yellow star becomes purple star, so yellow circle becomes purple circle!"
  },
  {
    id: "mat_14",
    category: "matrix_reasoning",
    standard: "NNAT3 - Growing Odd-Number Dot Pattern",
    difficulty: 3,
    prompt: "Count the growing dot groups: 1 dot, 3 dots, 5 dots, ___? How many dots come next?",
    visualType: "sequence",
    visualData: { items: ["🔵 (1)", "🔵🔵🔵 (3)", "🔵🔵🔵🔵🔵 (5)", "❓"] },
    options: [
      { text: "7 Dots", icon: "🔵🔵🔵🔵🔵🔵🔵" },
      { text: "6 Dots", icon: "🔵🔵🔵🔵🔵🔵" },
      { text: "9 Dots", icon: "🔵🔵🔵🔵🔵🔵🔵🔵🔵" },
      { text: "4 Dots", icon: "🔵🔵🔵🔵" }
    ],
    correctIndex: 0,
    hint: "Each group adds 2 more dots than the last one: 1, then 1+2=3, then 3+2=5...",
    explanation: "The pattern adds 2 each time (odd numbers): 1, 3, 5, and next is 5+2=7!"
  },
  {
    id: "mat_15",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - Rotation & Color Combined",
    difficulty: 4,
    prompt: "The triangle rotates AND changes color each step: Red pointing up, Blue pointing right, Green pointing down, ___? What comes next?",
    visualType: "sequence",
    visualData: { items: ["🔺 Red Up", "🔻 Blue Right", "🔺 Green Down", "❓"] },
    options: [
      { text: "Yellow Triangle Pointing Left", icon: "🔺 Yellow Left" },
      { text: "Red Triangle Pointing Up", icon: "🔺 Red Up" },
      { text: "Blue Triangle Pointing Right", icon: "🔻 Blue Right" },
      { text: "Green Triangle Pointing Down", icon: "🔺 Green Down" }
    ],
    correctIndex: 0,
    hint: "Both the color AND the direction change every single step in a repeating 4-step cycle!",
    explanation: "After 3 unique color/direction combos, the 4th introduces the final new color (Yellow) pointing the next direction (Left) before the cycle repeats!"
  },
  {
    id: "mat_16",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - Sides Counting Analogy",
    difficulty: 3,
    prompt: "A Triangle has 3 sides. A Square has 4 sides. A Pentagon has how many sides?",
    visualType: "analogy",
    visualData: { pair1: "Triangle ➔ 3 Sides", pair2: "Pentagon ➔ ?" },
    options: [
      { text: "5 Sides", icon: "🔷 5 Sides" },
      { text: "4 Sides", icon: "🟦 4 Sides" },
      { text: "6 Sides", icon: "⬡ 6 Sides" },
      { text: "3 Sides", icon: "🔺 3 Sides" }
    ],
    correctIndex: 0,
    hint: "Count the letters that give clues: TRI means 3, and PENTA means 5!",
    explanation: "A pentagon always has 5 straight sides - that's why it's called a PENTA-gon!"
  },
  {
    id: "mat_17",
    category: "matrix_reasoning",
    standard: "Spatial - Large-Medium-Small Sequence",
    difficulty: 2,
    prompt: "Look at the sizes shrinking: Large, Medium, Small, Large, Medium, ___? What size comes next?",
    visualType: "sequence",
    visualData: { items: ["🔵 Large", "🔹 Medium", "▪️ Small", "🔵 Large", "🔹 Medium", "❓"] },
    options: [
      { text: "Small", icon: "▪️ Small" },
      { text: "Large", icon: "🔵 Large" },
      { text: "Medium", icon: "🔹 Medium" },
      { text: "Extra Large", icon: "⚫ Extra Large" }
    ],
    correctIndex: 0,
    hint: "The 3-size cycle repeats: Large, Medium, Small, Large, Medium...",
    explanation: "After Large and Medium repeat, the pattern always returns to Small next!"
  },
  {
    id: "mat_18",
    category: "matrix_reasoning",
    standard: "NNAT3 - Mirror Image Matching",
    difficulty: 3,
    prompt: "Look at the shape on the left. Which shape on the right is its exact mirror image (flipped left-right)?",
    visualType: "classification",
    visualData: { shapes: ["Original: P shape", "Option: q shape", "Option: b shape", "Option: d shape"] },
    options: [
      { text: "The 'q' shape (mirrors 'p')", icon: "🪞 q" },
      { text: "The 'b' shape", icon: "🪞 b" },
      { text: "The 'd' shape", icon: "🪞 d" },
      { text: "The 'p' shape (same, not flipped)", icon: "🪞 p" }
    ],
    correctIndex: 0,
    hint: "A mirror flips things left-to-right. The letter 'p' flipped becomes...?",
    explanation: "When 'p' is flipped horizontally in a mirror, it becomes 'q'!"
  },
  {
    id: "mat_19",
    category: "matrix_reasoning",
    standard: "CogAT Nonverbal - 2x2 Matrix Star Count",
    difficulty: 4,
    prompt: "Look at the pattern box. What completes the puzzle?",
    visualType: "matrix_2x2",
    visualData: {
      tl: { desc: "1 Star" },
      tr: { desc: "2 Stars" },
      bl: { desc: "3 Stars" },
      br: "?"
    },
    options: [
      { text: "4 Stars", icon: "⭐⭐⭐⭐" },
      { text: "2 Stars", icon: "⭐⭐" },
      { text: "6 Stars", icon: "⭐⭐⭐⭐⭐⭐" },
      { text: "1 Star", icon: "⭐" }
    ],
    correctIndex: 0,
    hint: "Look at how the star count increases by exactly 1 from box to box, left to right, then top row to bottom row!",
    explanation: "The stars increase by 1 each time: 1, 2, 3, and then 4!"
  },
  {
    id: "mat_20",
    category: "matrix_reasoning",
    standard: "Spatial - Quantity Comparison",
    difficulty: 1,
    prompt: "Look at the two groups. Which group has MORE stars?",
    visualType: "classification",
    visualData: { shapes: ["Group A: ⭐⭐⭐", "Group B: ⭐⭐⭐⭐⭐"] },
    options: [
      { text: "Group B (5 stars)", icon: "⭐⭐⭐⭐⭐" },
      { text: "Group A (3 stars)", icon: "⭐⭐⭐" },
      { text: "Both groups are equal", icon: "🟰" },
      { text: "Cannot tell", icon: "❓" }
    ],
    correctIndex: 0,
    hint: "Count each group carefully: Group A has 3 stars, Group B has 5 stars. Which number is bigger?",
    explanation: "5 is more than 3, so Group B has more stars!"
  },

  // ==========================================
  // 8. ADDITIONAL WORD DETECTIVE & VERBAL REASONING
  // ==========================================
  {
    id: "verb_07",
    category: "verbal_detective",
    standard: "VA SOL 1.9 - Word Classification & Categories",
    difficulty: 2,
    prompt: "Which word does NOT belong with the others?",
    visualType: "word_group",
    visualData: { words: ["Red", "Blue", "Green", "Happy"] },
    options: [
      { text: "Happy (it's a feeling, not a color!)", icon: "😊 Happy" },
      { text: "Red", icon: "🔴 Red" },
      { text: "Blue", icon: "🔵 Blue" },
      { text: "Green", icon: "🟢 Green" }
    ],
    correctIndex: 0,
    hint: "Red, Blue, and Green are all colors. What kind of word is 'Happy'?",
    explanation: "Red, Blue, and Green are colors, but Happy describes a feeling - it doesn't belong!"
  },
  {
    id: "verb_08",
    category: "verbal_detective",
    standard: "VA SOL 1.8 - Context Clue Riddle",
    difficulty: 2,
    prompt: "Riddle: 'I am cold and white. I fall from the sky in winter. Kids like to make me into a snowman.' What am I?",
    visualType: "riddle",
    visualData: { clues: ["Cold and white", "Falls in winter", "Used for snowmen"] },
    options: [
      { text: "Snow", icon: "❄️ Snow" },
      { text: "Rain", icon: "🌧️ Rain" },
      { text: "Sand", icon: "🏖️ Sand" },
      { text: "Ice Cream", icon: "🍦 Ice Cream" }
    ],
    correctIndex: 0,
    hint: "Think about what falls from the clouds in the winter and covers the ground in white!",
    explanation: "Snow is cold, white, falls in winter, and is perfect for building a snowman!"
  },
  {
    id: "verb_09",
    category: "verbal_detective",
    standard: "CogAT Verbal - Category Membership Puzzle",
    difficulty: 3,
    prompt: "Which of these is a TYPE of vehicle that can FLY?",
    visualType: "word_group",
    visualData: { words: ["Airplane", "Bicycle", "Boat", "Skateboard"] },
    options: [
      { text: "Airplane", icon: "✈️ Airplane" },
      { text: "Bicycle", icon: "🚲 Bicycle" },
      { text: "Boat", icon: "⛵ Boat" },
      { text: "Skateboard", icon: "🛹 Skateboard" }
    ],
    correctIndex: 0,
    hint: "Think about which of these vehicles has wings and travels through the sky!",
    explanation: "An airplane flies through the sky using its wings and engines. The others travel on land or water!"
  },
  {
    id: "verb_10",
    category: "verbal_detective",
    standard: "VA SOL 1.5 - Rhyming Word Family Detective",
    difficulty: 2,
    prompt: "Which word rhymes with 'CAT'?",
    visualType: "phonics_mystery",
    visualData: { rhyme: "cat" },
    options: [
      { text: "Hat", icon: "🎩 Hat" },
      { text: "Dog", icon: "🐕 Dog" },
      { text: "Sun", icon: "☀️ Sun" },
      { text: "Tree", icon: "🌳 Tree" }
    ],
    correctIndex: 0,
    hint: "Listen to the ending sound: c-AT. Which word ends the same way?",
    explanation: "Hat and Cat both end with the -AT sound, so they rhyme!"
  },
  {
    id: "verb_11",
    category: "verbal_detective",
    standard: "CogAT Verbal - Multi-Meaning Word Deduction",
    difficulty: 4,
    prompt: "This word can mean a place to keep money OR the side of a river. What word is it?",
    visualType: "riddle",
    visualData: { clues: ["Place to keep money", "Side of a river"] },
    options: [
      { text: "Bank", icon: "🏦 Bank" },
      { text: "Wallet", icon: "👛 Wallet" },
      { text: "Shore", icon: "🏖️ Shore" },
      { text: "Coin", icon: "🪙 Coin" }
    ],
    correctIndex: 0,
    hint: "Think of a building where you put your savings, and also the edge of a river with the same name!",
    explanation: "'Bank' can mean a place that keeps money safe, or the land alongside a river!"
  },
  {
    id: "verb_12",
    category: "verbal_detective",
    standard: "VA SOL 1.6 - Synonym Matching",
    difficulty: 3,
    prompt: "Which word means almost the SAME as 'Happy'?",
    visualType: "word_group",
    visualData: { words: ["Joyful", "Angry", "Tired", "Scared"] },
    options: [
      { text: "Joyful", icon: "😄 Joyful" },
      { text: "Angry", icon: "😠 Angry" },
      { text: "Tired", icon: "😴 Tired" },
      { text: "Scared", icon: "😨 Scared" }
    ],
    correctIndex: 0,
    hint: "A synonym is a word that means almost the same thing. Which feeling is close to being happy?",
    explanation: "Joyful means full of joy, which is very similar to feeling happy!"
  },
  {
    id: "verb_13",
    category: "verbal_detective",
    standard: "VA SOL 1.8 - Sequencing Story Events",
    difficulty: 3,
    prompt: "Put these steps in the correct order: 'Water the seed', 'Plant the seed in soil', 'The seed grows into a flower', 'Buy seeds from the store'.",
    visualType: "riddle",
    visualData: { clues: ["Buy", "Plant", "Water", "Grow"] },
    options: [
      { text: "1. Buy seeds ➔ 2. Plant seed ➔ 3. Water it ➔ 4. It grows", icon: "🛒➔🌱➔💧➔🌷" },
      { text: "1. It grows ➔ 2. Water it ➔ 3. Plant seed ➔ 4. Buy seeds", icon: "🌷➔💧➔🌱➔🛒" },
      { text: "1. Water it ➔ 2. Buy seeds ➔ 3. It grows ➔ 4. Plant seed", icon: "💧➔🛒➔🌷➔🌱" },
      { text: "1. Plant seed ➔ 2. It grows ➔ 3. Buy seeds ➔ 4. Water it", icon: "🌱➔🌷➔🛒➔💧" }
    ],
    correctIndex: 0,
    hint: "You must first get the seeds before you can plant them, and plant them before you can water them!",
    explanation: "The logical order is: Buy the seeds, plant them in soil, water them, and then they grow into a flower!"
  },
  {
    id: "verb_14",
    category: "verbal_detective",
    standard: "CogAT Verbal - Idiom & Figurative Language Intro",
    difficulty: 4,
    prompt: "When someone says 'It's raining cats and dogs', what do they really mean?",
    visualType: "riddle",
    visualData: { clues: ["Not real animals falling", "Weather expression"] },
    options: [
      { text: "It is raining very hard", icon: "🌧️ Heavy Rain" },
      { text: "Cats and dogs are falling from the sky", icon: "🐱🐶 Falling" },
      { text: "It is sunny outside", icon: "☀️ Sunny" },
      { text: "Pets are playing outside", icon: "🐾 Playing" }
    ],
    correctIndex: 0,
    hint: "This is a fun saying (idiom) that doesn't mean animals are really falling - it describes heavy weather!",
    explanation: "'Raining cats and dogs' is an expression that simply means it's raining really hard!"
  },

  // ==========================================
  // 9. ADDITIONAL SPATIAL & VISUAL REASONING
  // ==========================================
  {
    id: "spat_06",
    category: "spatial_folding",
    standard: "NNAT3 - Triple Fold Paper Punch",
    difficulty: 4,
    prompt: "A paper is folded in half 3 times, then 1 hole is punched through all the layers. How many holes appear when fully unfolded?",
    visualType: "paper_folding",
    visualData: { folds: 3, punches: 1 },
    options: [
      { text: "8 Holes", icon: "📄 8 Holes" },
      { text: "6 Holes", icon: "📄 6 Holes" },
      { text: "4 Holes", icon: "📄 4 Holes" },
      { text: "3 Holes", icon: "📄 3 Holes" }
    ],
    correctIndex: 0,
    hint: "Each fold doubles the number of layers: 1 fold = 2 layers, 2 folds = 4 layers, 3 folds = 8 layers!",
    explanation: "Folding 3 times creates 8 layers of paper (2×2×2=8), so punching once makes 8 holes when unfolded!"
  },
  {
    id: "spat_07",
    category: "spatial_folding",
    standard: "Spatial - 3D Block Tower Counting",
    difficulty: 3,
    prompt: "A tower has 3 blocks stacked straight up, and a second tower next to it has 1 block. How many blocks total?",
    visualType: "blocks_3d",
    visualData: { layers: [[3, 1]] },
    options: [
      { text: "4 blocks total", icon: "🧱 4 Blocks" },
      { text: "3 blocks total", icon: "🧱 3 Blocks" },
      { text: "5 blocks total", icon: "🧱 5 Blocks" },
      { text: "6 blocks total", icon: "🧱 6 Blocks" }
    ],
    correctIndex: 0,
    hint: "One tower has 3 blocks, the other has 1 block. Add them together: 3 + 1 = ?",
    explanation: "3 blocks plus 1 block equals 4 blocks total!"
  },
  {
    id: "spat_08",
    category: "spatial_folding",
    standard: "Spatial - Mirror Reflection of Numbers",
    difficulty: 3,
    prompt: "If you look at the number '2' in a mirror, which way does it appear to face?",
    visualType: "mirror",
    visualData: { original: "2" },
    options: [
      { text: "Backwards / flipped horizontally", icon: "🪞 Flipped 2" },
      { text: "Exactly the same as normal", icon: "🪞 2" },
      { text: "Upside down", icon: "🪞 Upside Down" },
      { text: "It disappears", icon: "🪞 Gone" }
    ],
    correctIndex: 0,
    hint: "A mirror flips images left-to-right, so numbers and letters usually look backwards!",
    explanation: "Mirrors flip images horizontally, making the number 2 look backwards/flipped!"
  },
  {
    id: "spat_09",
    category: "spatial_folding",
    standard: "VA SOL 1.11 & Spatial - Shape Decomposition",
    difficulty: 3,
    prompt: "If you cut a rectangle in half diagonally (corner to corner), what two shapes do you get?",
    visualType: "tangram",
    visualData: { parts: ["rectangle"] },
    options: [
      { text: "Two matching triangles", icon: "🔺🔻 Two Triangles" },
      { text: "Two squares", icon: "🟩🟩 Two Squares" },
      { text: "A circle and a triangle", icon: "⚪🔺" },
      { text: "Four small rectangles", icon: "🟦🟦🟦🟦" }
    ],
    correctIndex: 0,
    hint: "Cutting corner to corner creates a diagonal line, splitting the rectangle into 2 equal triangle halves!",
    explanation: "A diagonal cut through a rectangle always creates two identical (congruent) triangles!"
  },
  {
    id: "spat_10",
    category: "spatial_folding",
    standard: "NNAT3 - Perspective / Viewpoint Reasoning",
    difficulty: 4,
    prompt: "Lily looks at a cube from directly above (bird's eye view). What shape does she see?",
    visualType: "classification",
    visualData: { shapes: ["Cube viewed from above"] },
    options: [
      { text: "A Square", icon: "🟩 Square" },
      { text: "A Circle", icon: "⚪ Circle" },
      { text: "A Triangle", icon: "🔺 Triangle" },
      { text: "A Cube (3D)", icon: "🧊 Cube" }
    ],
    correctIndex: 0,
    hint: "Looking straight down at a cube, you only see its flat top face, which has 4 equal sides!",
    explanation: "From directly above, only the flat top face of the cube is visible, and that face is a square!"
  },
  {
    id: "spat_11",
    category: "spatial_folding",
    standard: "Spatial - Shape Rotation Recognition",
    difficulty: 2,
    prompt: "If you turn a triangle pointing UP by rotating it a half turn (180°), which way will it point?",
    visualType: "rotation_sequence",
    visualData: { steps: ["🔺 (Up)", "❓"] },
    options: [
      { text: "Down 🔻", icon: "🔻 Down" },
      { text: "Up 🔺 (same)", icon: "🔺 Up" },
      { text: "Left ◀️", icon: "◀️ Left" },
      { text: "Right ▶️", icon: "▶️ Right" }
    ],
    correctIndex: 0,
    hint: "A half turn (180 degrees) flips the shape completely upside down!",
    explanation: "Rotating a triangle by a half turn (180°) flips it so it points straight down!"
  },
  {
    id: "spat_12",
    category: "spatial_folding",
    standard: "Spatial - Counting Hidden Cube Layers",
    difficulty: 4,
    prompt: "A structure has 2 layers: the bottom layer has 4 blocks in a row, and the top layer has 2 blocks stacked on top of the middle. How many blocks in total?",
    visualType: "blocks_3d",
    visualData: { layers: [[4], [2]] },
    options: [
      { text: "6 blocks total", icon: "🧱 6 Blocks" },
      { text: "4 blocks total", icon: "🧱 4 Blocks" },
      { text: "8 blocks total", icon: "🧱 8 Blocks" },
      { text: "2 blocks total", icon: "🧱 2 Blocks" }
    ],
    correctIndex: 0,
    hint: "Add the bottom layer (4 blocks) and the top layer (2 blocks): 4 + 2 = ?",
    explanation: "4 blocks on the bottom plus 2 blocks on top equals 6 blocks total!"
  },

  // ==========================================
  // 10. ADDITIONAL DEDUCTIVE LOGIC MYSTERIES
  // ==========================================
  {
    id: "log_06",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Favorite Fruit Deduction",
    difficulty: 2,
    prompt: "Three friends each like a different fruit: Apple, Banana, or Grape.\n• Clue 1: Sam does not like Apple.\n• Clue 2: Mia likes Banana.\nWhat fruit does Sam like?",
    visualType: "logic_grid",
    visualData: { people: ["Sam", "Mia", "Theo"], items: ["Apple", "Banana", "Grape"] },
    options: [
      { text: "Sam likes Grape!", icon: "🍇 Sam" },
      { text: "Sam likes Apple!", icon: "🍎 Sam" },
      { text: "Sam likes Banana!", icon: "🍌 Sam" },
      { text: "Sam likes nothing", icon: "❌" }
    ],
    correctIndex: 0,
    hint: "Mia has the Banana. Sam does not like Apple, so Sam must like...?",
    explanation: "Mia has Banana. Since Sam cannot have Apple, Sam must have Grape (and Theo has Apple)!"
  },
  {
    id: "log_07",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Line Up Order Clue",
    difficulty: 3,
    prompt: "Four kids are lining up for recess: Ana, Ben, Cora, and Dez.\n• Clue 1: Ana is first in line.\n• Clue 2: Ben is right behind Ana.\n• Clue 3: Dez is last in line.\nWho is 3rd in line?",
    visualType: "race_order",
    visualData: { runners: ["Ana (1st)", "Ben (2nd)", "❓ (3rd)", "Dez (4th)"] },
    options: [
      { text: "Cora is 3rd", icon: "🥉 Cora" },
      { text: "Ana is 3rd", icon: "🥉 Ana" },
      { text: "Ben is 3rd", icon: "🥉 Ben" },
      { text: "Dez is 3rd", icon: "🥉 Dez" }
    ],
    correctIndex: 0,
    hint: "Ana is 1st, Ben is 2nd, Dez is 4th (last). Who is the only kid left for 3rd place?",
    explanation: "Ana=1st, Ben=2nd, Dez=4th. The only person left for 3rd place is Cora!"
  },
  {
    id: "log_08",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Shape Sorting Deduction",
    difficulty: 2,
    prompt: "Lily sorts 3 shapes into 3 boxes by color: Box A, B, and C.\n• Clue 1: The Red shape is NOT in Box A.\n• Clue 2: The Red shape is NOT in Box C.\nWhich box holds the Red shape?",
    visualType: "backpack_logic", 
    visualData: { colors: ["Box A", "Box B", "Box C"] },
    options: [
      { text: "Box B", icon: "🟥 Box B" },
      { text: "Box A", icon: "🟥 Box A" },
      { text: "Box C", icon: "🟥 Box C" },
      { text: "None of the boxes", icon: "❌" }
    ],
    correctIndex: 0,
    hint: "It's not in A, and it's not in C. What's the only box left?",
    explanation: "Since the Red shape is not in Box A or Box C, it must be in Box B!"
  },
  {
    id: "log_09",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Weight Balance Ordering",
    difficulty: 3,
    prompt: "Look at the weight clues:\n• Clue 1: The apple is heavier than the grape.\n• Clue 2: The watermelon is heavier than the apple.\nWhich fruit is the LIGHTEST?",
    visualType: "height_order",
    visualData: { animals: ["Watermelon", "Apple", "Grape"] },
    options: [
      { text: "The Grape is lightest! 🍇", icon: "🍇 Grape" },
      { text: "The Apple 🍎", icon: "🍎 Apple" },
      { text: "The Watermelon 🍉", icon: "🍉 Watermelon" },
      { text: "They all weigh the same", icon: "⚖️" }
    ],
    correctIndex: 0,
    hint: "Watermelon > Apple > Grape in weight. Which one is at the very bottom?",
    explanation: "Since the watermelon is heaviest and the apple is in the middle, the grape must be the lightest!"
  },
  {
    id: "log_10",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - If-Then Conditional Logic",
    difficulty: 4,
    prompt: "Rule: 'IF it is raining, THEN Lily wears her raincoat.' Today Lily is wearing her raincoat. Can we be sure it is raining?",
    visualType: "riddle",
    visualData: { clues: ["If raining, wear raincoat", "Lily is wearing raincoat"] },
    options: [
      { text: "No - she might wear it even if it's not raining (for other reasons)", icon: "🤔 Not Sure" },
      { text: "Yes - it must definitely be raining", icon: "🌧️ Definitely" },
      { text: "It means it is sunny", icon: "☀️ Sunny" },
      { text: "It means it is snowing", icon: "❄️ Snowing" }
    ],
    correctIndex: 0,
    hint: "The rule only tells us what happens WHEN it rains. It doesn't say raincoats are ONLY worn in the rain!",
    explanation: "This is a tricky logic idea: just because she's wearing a raincoat doesn't guarantee it's raining - she could be wearing it for a costume, to stay warm, or practicing!"
  },
  {
    id: "log_11",
    category: "logic_mysteries",
    standard: "SCPS FOCUS - Seating Arrangement Clue",
    difficulty: 3,
    prompt: "Three friends sit at a lunch table in a row: Zoe, Kai, and Wren.\n• Clue 1: Zoe sits between Kai and Wren.\n• Clue 2: Kai sits on the far left.\nWho sits on the far right?",
    visualType: "logic_grid",
    visualData: { people: ["Kai", "Zoe", "Wren"], items: ["Left", "Middle", "Right"] },
    options: [
      { text: "Wren sits on the far right", icon: "➡️ Wren" },
      { text: "Zoe sits on the far right", icon: "➡️ Zoe" },
      { text: "Kai sits on the far right", icon: "➡️ Kai" },
      { text: "No one sits there", icon: "❌" }
    ],
    correctIndex: 0,
    hint: "Kai is on the far left, and Zoe is in the middle (between Kai and Wren). Who is left for the far right seat?",
    explanation: "Kai is on the left, Zoe is in the middle (since she's between the other two), so Wren must be on the far right!"
  },

  // ==========================================
  // 11. ADDITIONAL SCIENCE EXPLORER & INQUIRY
  // ==========================================
  {
    id: "sci_07",
    category: "science_inquiry",
    standard: "VA SOL 1.1 - Classifying Living vs Non-Living",
    difficulty: 1,
    prompt: "Which of these is a LIVING thing?",
    visualType: "classification",
    visualData: { shapes: ["Tree", "Rock", "Toy Car", "Chair"] },
    options: [
      { text: "Tree (it grows and needs water!)", icon: "🌳 Tree" },
      { text: "Rock", icon: "🪨 Rock" },
      { text: "Toy Car", icon: "🚗 Toy Car" },
      { text: "Chair", icon: "🪑 Chair" }
    ],
    correctIndex: 0,
    hint: "Living things grow, need food/water, and can reproduce. Which of these fits that description?",
    explanation: "A tree is alive - it grows, needs water and sunlight, and can make new trees! Rocks, toy cars, and chairs are non-living."
  },
  {
    id: "sci_08",
    category: "science_inquiry",
    standard: "VA SOL 1.6 - Weather Pattern Observation",
    difficulty: 2,
    prompt: "Lily sees dark gray clouds forming in the sky. What kind of weather might happen soon?",
    visualType: "riddle",
    visualData: { clues: ["Dark gray clouds"] },
    options: [
      { text: "Rain", icon: "🌧️ Rain" },
      { text: "A sunny clear day", icon: "☀️ Sunny" },
      { text: "A rainbow with no rain", icon: "🌈 Rainbow" },
      { text: "Nothing changes", icon: "➖ Nothing" }
    ],
    correctIndex: 0,
    hint: "Dark, heavy-looking clouds usually carry a lot of water. What falls from clouds full of water?",
    explanation: "Dark gray clouds are usually full of water droplets, which often means rain is coming soon!"
  },
  {
    id: "sci_09",
    category: "science_inquiry",
    standard: "VA SOL 1.7 - Solid, Liquid, or Gas Sorting",
    difficulty: 2,
    prompt: "Which of these is an example of a LIQUID?",
    visualType: "classification",
    visualData: { shapes: ["Milk", "Rock", "Ice Cube", "Wooden Block"] },
    options: [
      { text: "Milk (it pours and takes the shape of its container!)", icon: "🥛 Milk" },
      { text: "Rock", icon: "🪨 Rock" },
      { text: "Ice Cube", icon: "🧊 Ice Cube" },
      { text: "Wooden Block", icon: "🪵 Wood" }
    ],
    correctIndex: 0,
    hint: "Liquids flow and pour, taking the shape of whatever container holds them. Which one does that?",
    explanation: "Milk is a liquid - it pours and takes the shape of its cup or glass! Rocks, ice cubes, and wood are solids."
  },
  {
    id: "sci_10",
    category: "science_inquiry",
    standard: "VA SOL 1.4 - Animal Needs for Survival",
    difficulty: 1,
    prompt: "What does a dog need to stay healthy and alive?",
    visualType: "plant_needs",
    visualData: { plant: "Dog" },
    options: [
      { text: "Food, Water, and Shelter", icon: "🍖💧🏠" },
      { text: "Only Toys", icon: "🧸" },
      { text: "Only Sunlight", icon: "☀️" },
      { text: "Nothing, dogs don't need anything", icon: "❌" }
    ],
    correctIndex: 0,
    hint: "Just like people, animals need food to eat, water to drink, and a safe place to live!",
    explanation: "Dogs (and all animals) need food, water, and shelter to survive and stay healthy!"
  },
  {
    id: "sci_11",
    category: "science_inquiry",
    standard: "VA SOL 1.6 - Day and Night Cycle",
    difficulty: 2,
    prompt: "Why does it become dark and turn into night time?",
    visualType: "shadow_science",
    visualData: { sunPosition: "Earth rotates" },
    options: [
      { text: "The Earth spins, turning our side away from the Sun", icon: "🌍 Earth Spins" },
      { text: "The Sun turns off like a light switch", icon: "💡 Turns Off" },
      { text: "Clouds cover the whole sky every night", icon: "☁️ Clouds" },
      { text: "The moon pushes the sun away", icon: "🌙 Pushes" }
    ],
    correctIndex: 0,
    hint: "The Earth is always slowly spinning like a top. When our side faces away from the sun, it becomes night!",
    explanation: "As the Earth rotates (spins), the side facing away from the sun experiences night time!"
  },
  {
    id: "sci_12",
    category: "science_inquiry",
    standard: "VA SOL 1.4 - Frog Life Cycle Sequencing",
    difficulty: 3,
    prompt: "Put the frog life cycle stages in the correct order:",
    visualType: "life_cycle",
    visualData: { stages: ["Egg", "Tadpole", "Froglet", "Frog"] },
    options: [
      { text: "1. Egg ➔ 2. Tadpole ➔ 3. Froglet ➔ 4. Frog", icon: "🥚➔🐟➔🐸➔🐸" },
      { text: "1. Frog ➔ 2. Froglet ➔ 3. Tadpole ➔ 4. Egg", icon: "🐸➔🐸➔🐟➔🥚" },
      { text: "1. Tadpole ➔ 2. Egg ➔ 3. Frog ➔ 4. Froglet", icon: "🐟➔🥚➔🐸➔🐸" },
      { text: "1. Froglet ➔ 2. Frog ➔ 3. Egg ➔ 4. Tadpole", icon: "🐸➔🐸➔🥚➔🐟" }
    ],
    correctIndex: 0,
    hint: "It starts as a tiny egg in water, hatches into a swimming tadpole, grows legs as a froglet, then becomes a full frog!",
    explanation: "The frog life cycle goes: Egg ➔ Tadpole ➔ Froglet (grows legs) ➔ Adult Frog!"
  },
  {
    id: "sci_13",
    category: "science_inquiry",
    standard: "VA SOL 1.7 - Simple Cause and Effect (Heat)",
    difficulty: 3,
    prompt: "What happens to a chocolate bar if you leave it in a hot car on a sunny day?",
    visualType: "matter_change",
    visualData: { from: "Solid Chocolate", heat: "Hot Car" },
    options: [
      { text: "It melts into a gooey liquid", icon: "🍫 ➔ 🟤 Melts" },
      { text: "It turns into ice", icon: "🍫 ➔ 🧊" },
      { text: "It grows bigger", icon: "🍫 ➔ 📈" },
      { text: "Nothing happens at all", icon: "➖" }
    ],
    correctIndex: 0,
    hint: "Chocolate is a solid that is sensitive to heat - what happens to solids like chocolate or ice when they get warm?",
    explanation: "Heat causes solid chocolate to melt into a soft, gooey liquid, just like ice melting into water!"
  }
];

// Merge in procedurally generated math-fact and verbal-analogy questions for maximum variety
if (typeof generateAllProceduralQuestions === "function") {
  QUESTION_BANK.push(...generateAllProceduralQuestions());
}
