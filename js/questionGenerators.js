/**
 * Procedural Question Generators
 * Generates large volumes of randomized math-fact and verbal-analogy questions
 * with different numbers/words every time the game loads, so Lily can't just
 * memorize a fixed answer key. Runs BEFORE questions.js (see index.html order).
 */

function pgRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pgShuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pgUniqueDistractors(correct, min, max, count) {
  const set = new Set([correct]);
  const out = [];
  let guard = 0;
  while (out.length < count && guard < 200) {
    guard++;
    const delta = pgRandInt(1, 4) * (Math.random() < 0.5 ? -1 : 1);
    const candidate = correct + delta;
    if (candidate >= min && candidate <= max && !set.has(candidate)) {
      set.add(candidate);
      out.push(candidate);
    }
  }
  // Fallback fill if we couldn't find enough unique nearby distractors
  let filler = min;
  while (out.length < count) {
    if (!set.has(filler)) {
      set.add(filler);
      out.push(filler);
    }
    filler++;
    if (filler > max + 50) break;
  }
  return out;
}

function pgBuildNumberOptions(correctValue, min, max) {
  const distractors = pgUniqueDistractors(correctValue, min, max, 3);
  const values = pgShuffle([correctValue, ...distractors]);
  const options = values.map(v => ({ text: String(v), icon: "🔢" }));
  const correctIndex = values.indexOf(correctValue);
  return { options, correctIndex };
}

function generateAdditionFacts(count) {
  const templates = [
    (a, b) => `What is ${a} + ${b}?`,
    (a, b) => `Lily has ${a} stickers and gets ${b} more. How many stickers does she have now?`,
    (a, b) => `There are ${a} kids on the swings and ${b} more run over. How many kids in all?`,
    (a, b) => `${a} birds are in a tree. ${b} more land on it. How many birds now?`
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(1, 15);
    const b = pgRandInt(1, Math.max(1, 20 - a));
    const correct = a + b;
    const difficulty = correct <= 10 ? 1 : correct <= 16 ? 2 : 3;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 24);
    const prompt = templates[pgRandInt(0, templates.length - 1)](a, b);
    out.push({
      id: `gen_add_${i}_${a}_${b}`,
      category: "math_logic",
      standard: "VA SOL 1.5 - Addition Fact Fluency (within 20)",
      difficulty,
      prompt,
      visualType: "math_expression",
      visualData: { items: [String(a), "+", String(b), "=", "?"] },
      options,
      correctIndex,
      hint: `Start at ${a} and count up ${b} more: ${Array.from({ length: b }, (_, k) => a + k + 1).join(", ")}.`,
      explanation: `${a} + ${b} = ${correct}!`
    });
  }
  return out;
}

function generateSubtractionFacts(count) {
  const templates = [
    (a, b) => `What is ${a} - ${b}?`,
    (a, b) => `Lily had ${a} cookies and ate ${b} of them. How many cookies are left?`,
    (a, b) => `${a} ducks were swimming. ${b} swam away. How many ducks are left?`,
    (a, b) => `There were ${a} crayons in the box. ${b} rolled onto the floor. How many crayons are still in the box?`
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(5, 20);
    const b = pgRandInt(1, a);
    const correct = a - b;
    const difficulty = a <= 10 ? 1 : a <= 16 ? 2 : 3;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 20);
    const prompt = templates[pgRandInt(0, templates.length - 1)](a, b);
    out.push({
      id: `gen_sub_${i}_${a}_${b}`,
      category: "math_logic",
      standard: "VA SOL 1.5 - Subtraction Fact Fluency (within 20)",
      difficulty,
      prompt,
      visualType: "math_expression",
      visualData: { items: [String(a), "-", String(b), "=", "?"] },
      options,
      correctIndex,
      hint: `Start at ${a} and count back ${b}: ${Array.from({ length: b }, (_, k) => a - k - 1).join(", ")}.`,
      explanation: `${a} - ${b} = ${correct}!`
    });
  }
  return out;
}

function generateSkipCountingFacts(count) {
  const steps = [2, 5, 10];
  const out = [];
  for (let i = 0; i < count; i++) {
    const step = steps[pgRandInt(0, steps.length - 1)];
    const start = step * pgRandInt(0, 10);
    const seq = [start, start + step, start + step * 2, start + step * 3];
    const correct = start + step * 4;
    const difficulty = step === 10 ? 1 : step === 5 ? 2 : 2;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, correct + 20);
    out.push({
      id: `gen_skip_${i}_${step}_${start}`,
      category: "math_logic",
      standard: "VA SOL 1.3 - Skip Counting Patterns",
      difficulty,
      prompt: `Count by ${step}s: ${seq.join(", ")}, __? What number comes next?`,
      visualType: "math_expression",
      visualData: { items: [...seq.map(String), "?"] },
      options,
      correctIndex,
      hint: `Each step adds ${step}. ${seq[seq.length - 1]} + ${step} = ?`,
      explanation: `Skip counting by ${step}s: ${seq[seq.length - 1]} + ${step} = ${correct}!`
    });
  }
  return out;
}

function generateComparisonFacts(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(1, 120);
    let b = pgRandInt(1, 120);
    if (Math.random() < 0.15) b = a; // occasionally equal
    let correctText, correctSymbol;
    if (a > b) { correctText = `${a} is GREATER than ${b}`; correctSymbol = ">"; }
    else if (a < b) { correctText = `${a} is LESS than ${b}`; correctSymbol = "<"; }
    else { correctText = `${a} is EQUAL to ${b}`; correctSymbol = "="; }

    const allOptions = [
      { text: `${a} is GREATER than ${b}`, symbol: ">" },
      { text: `${a} is LESS than ${b}`, symbol: "<" },
      { text: `${a} is EQUAL to ${b}`, symbol: "=" }
    ];
    // Add a silly 4th distractor option
    allOptions.push({ text: `${a} and ${b} are both odd numbers`, symbol: "odd" });

    const shuffled = pgShuffle(allOptions);
    const correctIndex = shuffled.findIndex(o => o.symbol === correctSymbol && o.text === correctText);
    const options = shuffled.map(o => ({ text: o.text, icon: "🔢" }));

    out.push({
      id: `gen_cmp_${i}_${a}_${b}`,
      category: "math_logic",
      standard: "VA SOL 1.1 - Comparing Numbers to 120",
      difficulty: a > 20 || b > 20 ? 3 : 2,
      prompt: `Compare the two numbers: ${a} and ${b}. Which statement is true?`,
      visualType: "math_expression",
      visualData: { items: [String(a), "?", String(b)] },
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      hint: `Which number would you count to first: ${a} or ${b}?`,
      explanation: `${correctText}!`
    });
  }
  return out;
}

function generateMoneyFacts(count) {
  const coinTypes = [
    { name: "Penny", value: 1 },
    { name: "Nickel", value: 5 },
    { name: "Dime", value: 10 },
    { name: "Quarter", value: 25 }
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const numCoins = pgRandInt(2, 4);
    const picked = [];
    for (let c = 0; c < numCoins; c++) {
      picked.push(coinTypes[pgRandInt(0, coinTypes.length - 1)]);
    }
    const correct = picked.reduce((sum, c) => sum + c.value, 0);
    const { options, correctIndex } = pgBuildNumberOptions(correct, 1, 100);
    const optionsWithCents = options.map(o => ({ text: `${o.text}¢`, icon: "🪙" }));
    out.push({
      id: `gen_money_${i}_${correct}_${numCoins}`,
      category: "math_logic",
      standard: "VA SOL 1.13 - Identifying Coin Values",
      difficulty: numCoins <= 2 ? 2 : 3,
      prompt: `Lily has ${picked.map(c => c.name).join(", ")}. How many cents does she have in total?`,
      visualType: "coins",
      visualData: { coins: picked.map(c => `${c.name} (${c.value}¢)`) },
      options: optionsWithCents,
      correctIndex,
      hint: `Add up each coin's value: ${picked.map(c => c.value).join(" + ")}.`,
      explanation: `${picked.map(c => c.value).join(" + ")} = ${correct}¢!`
    });
  }
  return out;
}

function generatePlaceValueFacts(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const tens = pgRandInt(1, 9);
    const ones = pgRandInt(0, 9);
    const correct = tens * 10 + ones;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 99);
    out.push({
      id: `gen_place_${i}_${tens}_${ones}`,
      category: "math_logic",
      standard: "VA SOL 1.1 - Tens and Ones Place Value",
      difficulty: 2,
      prompt: `Lily has ${tens} bundle${tens > 1 ? "s" : ""} of 10 craft sticks and ${ones} single stick${ones !== 1 ? "s" : ""}. What number is that?`,
      visualType: "math_expression",
      visualData: { items: [`${tens} Ten${tens > 1 ? "s" : ""}`, "+", `${ones} One${ones !== 1 ? "s" : ""}`, "=", "?"] },
      options,
      correctIndex,
      hint: `${tens} tens = ${tens * 10}. Now add the ${ones} ones.`,
      explanation: `${tens} tens (${tens * 10}) + ${ones} ones = ${correct}!`
    });
  }
  return out;
}

function generateBalanceFacts(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const total = pgRandInt(6, 20);
    const known = pgRandInt(1, total - 1);
    const missing = total - known;
    const { options, correctIndex } = pgBuildNumberOptions(missing, 0, 20);
    out.push({
      id: `gen_balance_${i}_${known}_${total}`,
      category: "math_logic",
      standard: "VA SOL 1.6 - Equality & Missing Addend Balance",
      difficulty: total <= 10 ? 2 : 3,
      prompt: `The scale must balance! ${known} + 🌟 = ${total}. What number is the Star?`,
      visualType: "balance_scale",
      visualData: { left: `${known} + 🌟`, right: `${total}` },
      options,
      correctIndex,
      hint: `Count up from ${known} to ${total}. How many did you count?`,
      explanation: `${known} + ${missing} = ${total}! The Star is worth ${missing}.`
    });
  }
  return out;
}

// ==========================================
// Verbal Analogy Pool (for procedural sampling)
// ==========================================
const VERBAL_ANALOGY_POOL = [
  { pair1: "Puppy ➔ Dog", pair2: "Kitten ➔ ?", correct: "Cat", correctIcon: "🐱 Cat", distractors: [{ text: "Bunny", icon: "🐰 Bunny" }, { text: "Bird", icon: "🐦 Bird" }, { text: "Horse", icon: "🐴 Horse" }], hint: "A puppy grows up to become a dog. What does a kitten grow up to become?" },
  { pair1: "Calf ➔ Cow", pair2: "Piglet ➔ ?", correct: "Pig", correctIcon: "🐷 Pig", distractors: [{ text: "Goat", icon: "🐐 Goat" }, { text: "Sheep", icon: "🐑 Sheep" }, { text: "Duck", icon: "🦆 Duck" }], hint: "A calf grows up into a cow. What does a piglet grow up into?" },
  { pair1: "Joey ➔ Kangaroo", pair2: "Cub ➔ ?", correct: "Bear", correctIcon: "🐻 Bear", distractors: [{ text: "Fox", icon: "🦊 Fox" }, { text: "Deer", icon: "🦌 Deer" }, { text: "Wolf", icon: "🐺 Wolf" }], hint: "A joey is a baby kangaroo. A cub is a baby...?" },
  { pair1: "Foal ➔ Horse", pair2: "Chick ➔ ?", correct: "Chicken", correctIcon: "🐔 Chicken", distractors: [{ text: "Duck", icon: "🦆 Duck" }, { text: "Goose", icon: "🪿 Goose" }, { text: "Turkey", icon: "🦃 Turkey" }], hint: "A foal is a baby horse. A chick is a baby...?" },
  { pair1: "Bird ➔ Nest", pair2: "Bee ➔ ?", correct: "Beehive", correctIcon: "🐝 Beehive", distractors: [{ text: "Flower", icon: "🌸 Flower" }, { text: "Pond", icon: "💧 Pond" }, { text: "Cave", icon: "🪨 Cave" }], hint: "A nest is where a bird lives. Where do bees live?" },
  { pair1: "Fish ➔ Water", pair2: "Bird ➔ ?", correct: "Sky/Air", correctIcon: "🌤️ Sky", distractors: [{ text: "Ground", icon: "🟫 Ground" }, { text: "Sand", icon: "🏖️ Sand" }, { text: "Ice", icon: "🧊 Ice" }], hint: "Fish swim in water. Where do birds mostly fly?" },
  { pair1: "Bear ➔ Cave", pair2: "Spider ➔ ?", correct: "Web", correctIcon: "🕸️ Web", distractors: [{ text: "Burrow", icon: "🕳️ Burrow" }, { text: "Shell", icon: "🐚 Shell" }, { text: "Barn", icon: "🏚️ Barn" }], hint: "A bear lives in a cave. A spider builds and lives in a...?" },
  { pair1: "Rabbit ➔ Burrow", pair2: "Beaver ➔ ?", correct: "Dam/Lodge", correctIcon: "🦫 Dam", distractors: [{ text: "Nest", icon: "🪺 Nest" }, { text: "Web", icon: "🕸️ Web" }, { text: "Hive", icon: "🐝 Hive" }], hint: "A rabbit lives in a burrow. A beaver builds a...?" },
  { pair1: "Dog ➔ Bark", pair2: "Cat ➔ ?", correct: "Meow", correctIcon: "🐱 Meow", distractors: [{ text: "Moo", icon: "🐄 Moo" }, { text: "Oink", icon: "🐷 Oink" }, { text: "Quack", icon: "🦆 Quack" }], hint: "A dog barks. What sound does a cat make?" },
  { pair1: "Cow ➔ Moo", pair2: "Duck ➔ ?", correct: "Quack", correctIcon: "🦆 Quack", distractors: [{ text: "Bark", icon: "🐕 Bark" }, { text: "Roar", icon: "🦁 Roar" }, { text: "Neigh", icon: "🐴 Neigh" }], hint: "A cow says moo. A duck says...?" },
  { pair1: "Lion ➔ Roar", pair2: "Snake ➔ ?", correct: "Hiss", correctIcon: "🐍 Hiss", distractors: [{ text: "Chirp", icon: "🐦 Chirp" }, { text: "Buzz", icon: "🐝 Buzz" }, { text: "Growl", icon: "🐻 Growl" }], hint: "A lion roars. A snake makes a hissing sound." },
  { pair1: "Doctor ➔ Hospital", pair2: "Teacher ➔ ?", correct: "School", correctIcon: "🏫 School", distractors: [{ text: "Store", icon: "🏬 Store" }, { text: "Farm", icon: "🚜 Farm" }, { text: "Kitchen", icon: "🍳 Kitchen" }], hint: "A doctor works at a hospital. A teacher works at a...?" },
  { pair1: "Chef ➔ Kitchen", pair2: "Farmer ➔ ?", correct: "Farm", correctIcon: "🚜 Farm", distractors: [{ text: "Office", icon: "🏢 Office" }, { text: "Library", icon: "📚 Library" }, { text: "Store", icon: "🏬 Store" }], hint: "A chef cooks in a kitchen. A farmer grows crops on a...?" },
  { pair1: "Firefighter ➔ Fire Truck", pair2: "Pilot ➔ ?", correct: "Airplane", correctIcon: "✈️ Airplane", distractors: [{ text: "Boat", icon: "⛵ Boat" }, { text: "Train", icon: "🚂 Train" }, { text: "Bicycle", icon: "🚲 Bicycle" }], hint: "A firefighter drives a fire truck. A pilot flies an...?" },
  { pair1: "Hot ➔ Cold", pair2: "Whisper ➔ ?", correct: "Shout", correctIcon: "📢 Shout", distractors: [{ text: "Talk", icon: "🗣️ Talk" }, { text: "Listen", icon: "👂 Listen" }, { text: "Quiet", icon: "🤫 Quiet" }], hint: "Hot and cold are complete opposites. What is the opposite of whispering quietly?" },
  { pair1: "Big ➔ Small", pair2: "Fast ➔ ?", correct: "Slow", correctIcon: "🐢 Slow", distractors: [{ text: "Loud", icon: "🔊 Loud" }, { text: "Happy", icon: "😀 Happy" }, { text: "Tall", icon: "📏 Tall" }], hint: "Big is the opposite of small. What is the opposite of fast?" },
  { pair1: "Up ➔ Down", pair2: "Day ➔ ?", correct: "Night", correctIcon: "🌙 Night", distractors: [{ text: "Sun", icon: "☀️ Sun" }, { text: "Morning", icon: "🌅 Morning" }, { text: "Cloud", icon: "☁️ Cloud" }], hint: "Up and down are opposites. What is the opposite of day?" },
  { pair1: "Happy ➔ Sad", pair2: "Full ➔ ?", correct: "Empty", correctIcon: "📦 Empty", distractors: [{ text: "Heavy", icon: "🏋️ Heavy" }, { text: "Round", icon: "⚪ Round" }, { text: "Wet", icon: "💧 Wet" }], hint: "Happy is the opposite of sad. What is the opposite of full?" },
  { pair1: "Open ➔ Closed", pair2: "Wet ➔ ?", correct: "Dry", correctIcon: "☀️ Dry", distractors: [{ text: "Cold", icon: "🥶 Cold" }, { text: "Soft", icon: "🧸 Soft" }, { text: "Loud", icon: "🔊 Loud" }], hint: "Open and closed are opposites. What is the opposite of wet?" },
  { pair1: "Apple ➔ Fruit", pair2: "Carrot ➔ ?", correct: "Vegetable", correctIcon: "🥕 Vegetable", distractors: [{ text: "Meat", icon: "🍖 Meat" }, { text: "Dessert", icon: "🍰 Dessert" }, { text: "Drink", icon: "🥤 Drink" }], hint: "An apple belongs to the fruit family. What family does a carrot belong to?" },
  { pair1: "Circle ➔ Round", pair2: "Square ➔ ?", correct: "4 Straight Sides", correctIcon: "🟩 4 Sides", distractors: [{ text: "3 Sides", icon: "🔺 3 Sides" }, { text: "No Sides", icon: "⭕ No Sides" }, { text: "5 Sides", icon: "🔷 5 Sides" }], hint: "A circle is round. A square has how many straight sides?" },
  { pair1: "Finger ➔ Hand", pair2: "Toe ➔ ?", correct: "Foot", correctIcon: "🦶 Foot", distractors: [{ text: "Arm", icon: "💪 Arm" }, { text: "Head", icon: "🗣️ Head" }, { text: "Knee", icon: "🦵 Knee" }], hint: "A finger is part of a hand. A toe is part of a...?" },
  { pair1: "Petal ➔ Flower", pair2: "Leaf ➔ ?", correct: "Tree/Plant", correctIcon: "🌳 Tree", distractors: [{ text: "Rock", icon: "🪨 Rock" }, { text: "Cloud", icon: "☁️ Cloud" }, { text: "River", icon: "🏞️ River" }], hint: "A petal is part of a flower. A leaf is part of a...?" },
  { pair1: "Winter ➔ Snow", pair2: "Summer ➔ ?", correct: "Sunshine/Heat", correctIcon: "☀️ Sunshine", distractors: [{ text: "Falling Leaves", icon: "🍂 Leaves" }, { text: "Blooming Flowers", icon: "🌷 Flowers" }, { text: "Ice", icon: "🧊 Ice" }], hint: "Winter often has snow. What does summer usually have?" },
  { pair1: "Book ➔ Read", pair2: "Song ➔ ?", correct: "Sing/Listen", correctIcon: "🎵 Sing", distractors: [{ text: "Draw", icon: "🎨 Draw" }, { text: "Build", icon: "🧱 Build" }, { text: "Count", icon: "🔢 Count" }], hint: "You read a book. What do you do with a song?" },
  { pair1: "Scissors ➔ Cut", pair2: "Pencil ➔ ?", correct: "Write/Draw", correctIcon: "✏️ Write", distractors: [{ text: "Cook", icon: "🍳 Cook" }, { text: "Fly", icon: "🕊️ Fly" }, { text: "Swim", icon: "🏊 Swim" }], hint: "Scissors are used to cut. A pencil is used to...?" },
  { pair1: "Umbrella ➔ Rain", pair2: "Sunglasses ➔ ?", correct: "Sun", correctIcon: "☀️ Sun", distractors: [{ text: "Snow", icon: "❄️ Snow" }, { text: "Wind", icon: "💨 Wind" }, { text: "Fog", icon: "🌫️ Fog" }], hint: "An umbrella protects you from rain. Sunglasses protect your eyes from the...?" }
];

function generateVerbalAnalogies(count) {
  const pool = pgShuffle(VERBAL_ANALOGY_POOL);
  const chosen = pool.slice(0, Math.min(count, pool.length));
  return chosen.map((item, i) => {
    const allOptions = pgShuffle([
      { text: item.correct, icon: item.correctIcon },
      ...item.distractors
    ]);
    const correctIndex = allOptions.findIndex(o => o.text === item.correct);
    return {
      id: `gen_verbal_${i}_${item.correct.replace(/\s/g, "")}`,
      category: "verbal_detective",
      standard: "CogAT Verbal - Word Analogy Reasoning",
      difficulty: pgRandInt(1, 3),
      prompt: `${item.pair1.split("➔")[0].trim()} is to ${item.pair1.split("➔")[1].trim()} as ${item.pair2.split("➔")[0].trim()} is to ___?`,
      visualType: "analogy",
      visualData: { pair1: item.pair1, pair2: item.pair2 },
      options: allOptions,
      correctIndex,
      hint: item.hint,
      explanation: `${item.pair1.replace("➔", "is to")}, and in the same way, ${item.pair2.split("➔")[0].trim()} is to ${item.correct}!`
    };
  });
}

function generateAllProceduralQuestions() {
  return [
    ...generateAdditionFacts(18),
    ...generateSubtractionFacts(18),
    ...generateSkipCountingFacts(10),
    ...generateComparisonFacts(10),
    ...generateMoneyFacts(10),
    ...generatePlaceValueFacts(8),
    ...generateBalanceFacts(10),
    ...generateVerbalAnalogies(VERBAL_ANALOGY_POOL.length)
  ];
}
