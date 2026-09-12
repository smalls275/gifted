/**
 * Procedural Question Generators
 * Generates HUGE volumes of randomized questions across every domain (math, verbal,
 * matrix/nonverbal, spatial, logic mysteries, science) with different numbers, names,
 * shapes, and wording every time the game loads, so Lily can't memorize a fixed
 * answer key or a fixed "the answer is always option B" pattern.
 * Runs BEFORE questions.js (see index.html order).
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

function pgPick(arr) {
  return arr[pgRandInt(0, arr.length - 1)];
}

function pgPickN(arr, n) {
  return pgShuffle(arr).slice(0, Math.min(n, arr.length));
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

// ==========================================
// MATH FACT GENERATORS (math_logic)
// ==========================================

function generateAdditionFacts(count) {
  const templates = [
    (a, b) => `What is ${a} + ${b}?`,
    (a, b) => `Lily has ${a} stickers and gets ${b} more. How many stickers does she have now?`,
    (a, b) => `There are ${a} kids on the swings and ${b} more run over. How many kids in all?`,
    (a, b) => `${a} birds are in a tree. ${b} more land on it. How many birds now?`,
    (a, b) => `A basket has ${a} apples. Someone adds ${b} more apples. How many apples total?`,
    (a, b) => `Lily collects ${a} seashells at the beach, then finds ${b} more. How many seashells now?`,
    (a, b) => `Lily plants ${a} flowers in the garden, then plants ${b} more. How many flowers are planted now?`,
    (a, b) => `There are ${a} fish in the tank. ${b} more fish are added. How many fish are in the tank now?`
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(1, 15);
    const b = pgRandInt(1, Math.max(1, 20 - a));
    const correct = a + b;
    const difficulty = correct <= 10 ? 1 : correct <= 16 ? 2 : 3;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 24);
    const prompt = pgPick(templates)(a, b);
    out.push({
      id: `gen_add_${i}_${a}_${b}_${Date.now()}_${Math.random()}`,
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
    (a, b) => `There were ${a} crayons in the box. ${b} rolled onto the floor. How many crayons are still in the box?`,
    (a, b) => `${a} balloons floated in the sky. ${b} popped. How many balloons are left?`,
    (a, b) => `Lily had ${a} dollars. She spent ${b} dollars on a toy. How much money is left?`,
    (a, b) => `There were ${a} pencils in a cup. Lily gave away ${b} pencils. How many pencils are left in the cup?`,
    (a, b) => `${a} frogs sat on a log. ${b} frogs hopped away. How many frogs are left?`
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(5, 20);
    const b = pgRandInt(1, a);
    const correct = a - b;
    const difficulty = a <= 10 ? 1 : a <= 16 ? 2 : 3;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 20);
    const prompt = pgPick(templates)(a, b);
    out.push({
      id: `gen_sub_${i}_${a}_${b}_${Date.now()}_${Math.random()}`,
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

function generateDoublesFacts(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const n = pgRandInt(1, 10);
    const correct = n + n;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 24);
    out.push({
      id: `gen_double_${i}_${n}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.5 - Doubles Fact Strategy",
      difficulty: n <= 5 ? 1 : 2,
      prompt: `What is double ${n}? (${n} + ${n})`,
      visualType: "math_expression",
      visualData: { items: [String(n), "+", String(n), "=", "?"] },
      options,
      correctIndex,
      hint: `Doubling means adding a number to itself: ${n} + ${n}.`,
      explanation: `Double ${n} is ${correct}, because ${n} + ${n} = ${correct}!`
    });
  }
  return out;
}

function generateNearDoublesFacts(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const n = pgRandInt(2, 10);
    const b = n + 1;
    const correct = n + b;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 24);
    out.push({
      id: `gen_neardouble_${i}_${n}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.5 - Near-Doubles Strategy",
      difficulty: 2,
      prompt: `What is ${n} + ${b}? (Hint: it's a near-double!)`,
      visualType: "math_expression",
      visualData: { items: [String(n), "+", String(b), "=", "?"] },
      options,
      correctIndex,
      hint: `${n} + ${b} is just double ${n} plus 1 more: ${n}+${n}=${n + n}, then +1.`,
      explanation: `${n} + ${b} = ${correct}!`
    });
  }
  return out;
}

function generateMissingAddendWordProblems(count) {
  const templates = [
    (have, need) => `Lily needs ${need} stars to earn a prize. She already has ${have}. How many more does she need?`,
    (have, need) => `A puzzle has ${need} pieces. Lily has already placed ${have} pieces. How many pieces are left?`,
    (have, need) => `Lily wants to read ${need} books this month. She already read ${have}. How many more must she read?`
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const total = pgRandInt(8, 20);
    const have = pgRandInt(1, total - 1);
    const correct = total - have;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 20);
    const prompt = pgPick(templates)(have, total);
    out.push({
      id: `gen_missing_${i}_${have}_${total}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.6 - Missing Addend Word Problems",
      difficulty: total <= 12 ? 2 : 3,
      prompt,
      visualType: "math_expression",
      visualData: { items: [String(have), "+", "?", "=", String(total)] },
      options,
      correctIndex,
      hint: `Count up from ${have} until you reach ${total}.`,
      explanation: `${have} + ${correct} = ${total}!`
    });
  }
  return out;
}

function generateTwoDigitAddition(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(10, 80);
    const onesOfA = a % 10;
    const b = pgRandInt(1, Math.max(1, 9 - onesOfA)); // avoid regrouping for 1st grade
    const correct = a + b;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 10, 99);
    out.push({
      id: `gen_2digit_${i}_${a}_${b}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.5 - Two-Digit Plus One-Digit Addition",
      difficulty: 3,
      prompt: `What is ${a} + ${b}?`,
      visualType: "math_expression",
      visualData: { items: [String(a), "+", String(b), "=", "?"] },
      options,
      correctIndex,
      hint: `Only the ones place changes: ${onesOfA} + ${b} = ${onesOfA + b}. Keep the ${Math.floor(a / 10)} tens the same.`,
      explanation: `${a} + ${b} = ${correct}!`
    });
  }
  return out;
}

function generateSkipCountingFacts(count) {
  const steps = [2, 5, 10];
  const out = [];
  for (let i = 0; i < count; i++) {
    const step = pgPick(steps);
    const start = step * pgRandInt(0, 10);
    const len = pgRandInt(3, 5);
    const seq = Array.from({ length: len }, (_, k) => start + step * k);
    const correct = start + step * len;
    const difficulty = step === 10 ? 1 : 2;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, correct + 20);
    out.push({
      id: `gen_skip_${i}_${step}_${start}_${len}_${Math.random()}`,
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
    allOptions.push({ text: `${a} and ${b} are both odd numbers`, symbol: "odd" });

    const shuffled = pgShuffle(allOptions);
    const correctIndex = shuffled.findIndex(o => o.symbol === correctSymbol && o.text === correctText);
    const options = shuffled.map(o => ({ text: o.text, icon: "🔢" }));

    out.push({
      id: `gen_cmp_${i}_${a}_${b}_${Math.random()}`,
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

function generateThreeNumberOrdering(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    // Shuffle a full 1-40 range and take the first 3 so distinctness is guaranteed (no retry loop needed)
    const nums = pgShuffle(Array.from({ length: 40 }, (_, k) => k + 1)).slice(0, 3);
    const ascending = [...nums].sort((x, y) => x - y);
    const correctText = ascending.join(", ");
    const wrong1 = [...ascending].reverse().join(", ");
    const wrong2 = pgShuffle(ascending).join(", ");
    let wrong3 = pgShuffle(ascending).join(", ");
    let guard = 0;
    while ((wrong3 === correctText || wrong3 === wrong2) && guard < 20) {
      wrong3 = pgShuffle(ascending).join(", ");
      guard++;
    }
    const optionTexts = pgShuffle([...new Set([correctText, wrong1, wrong2, wrong3])]);
    while (optionTexts.length < 4) optionTexts.push(pgShuffle(ascending).join(", "));
    const options = optionTexts.slice(0, 4).map(t => ({ text: t, icon: "🔢" }));
    const correctIndex = options.findIndex(o => o.text === correctText);
    out.push({
      id: `gen_order3_${i}_${nums.join("_")}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.1 - Ordering Numbers Smallest to Largest",
      difficulty: 2,
      prompt: `Put these numbers in order from SMALLEST to LARGEST: ${nums.join(", ")}`,
      visualType: "math_expression",
      visualData: { items: nums.map(String) },
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      hint: `Which number is the smallest? Which is the biggest? Put the smallest first.`,
      explanation: `From smallest to largest: ${correctText}!`
    });
  }
  return out;
}

function generateOrdinalFacts(count) {
  const ordinals = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
  const out = [];
  for (let i = 0; i < count; i++) {
    const pos = pgRandInt(1, 10);
    const correct = ordinals[pos - 1];
    const distractorPool = ordinals.filter(o => o !== correct);
    const distractors = pgPickN(distractorPool, 3);
    const options = pgShuffle([correct, ...distractors]).map(o => ({ text: o.charAt(0).toUpperCase() + o.slice(1), icon: "🏅" }));
    const correctIndex = options.findIndex(o => o.text.toLowerCase() === correct);
    out.push({
      id: `gen_ordinal_${i}_${pos}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.2 - Ordinal Numbers (1st-10th)",
      difficulty: 1,
      prompt: `Lily finished in position number ${pos} in the class race. What ordinal word describes position ${pos}?`,
      visualType: "math_expression",
      visualData: { items: [`Position ${pos}`, "=", "?"] },
      options,
      correctIndex,
      hint: `Count the ordinal words in order: first, second, third... up to position ${pos}.`,
      explanation: `Position ${pos} is called "${correct}"!`
    });
  }
  return out;
}

function generateTimeTellingFacts(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const hour = pgRandInt(1, 12);
    const isHalf = Math.random() < 0.5;
    const correct = isHalf ? `${hour}:30` : `${hour}:00`;
    const wrongHour = ((hour + pgRandInt(1, 5) - 1) % 12) + 1;
    const distractors = new Set([
      isHalf ? `${hour}:00` : `${hour}:30`,
      `${wrongHour}:00`,
      `${wrongHour}:30`
    ]);
    const distractorArr = [...distractors].slice(0, 3);
    const options = pgShuffle([correct, ...distractorArr]).map(t => ({ text: t, icon: "🕐" }));
    const correctIndex = options.findIndex(o => o.text === correct);
    out.push({
      id: `gen_time_${i}_${hour}_${isHalf}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.13 - Telling Time to Hour & Half-Hour",
      difficulty: isHalf ? 3 : 2,
      prompt: isHalf
        ? `The clock's hour hand is halfway between ${hour} and ${hour === 12 ? 1 : hour + 1}, and the minute hand points to the 6. What time is it?`
        : `The clock's hour hand points to ${hour}, and the minute hand points straight up to the 12. What time is it?`,
      visualType: "math_expression",
      visualData: { items: [`🕐 ${correct}`] },
      options,
      correctIndex,
      hint: isHalf ? `When the minute hand is on the 6, it means 30 minutes past the hour.` : `When the minute hand points to 12, it's exactly on the hour.`,
      explanation: `The time shown is ${correct}!`
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
      picked.push(pgPick(coinTypes));
    }
    const correct = picked.reduce((sum, c) => sum + c.value, 0);
    const { options, correctIndex } = pgBuildNumberOptions(correct, 1, 100);
    const optionsWithCents = options.map(o => ({ text: `${o.text}¢`, icon: "🪙" }));
    out.push({
      id: `gen_money_${i}_${correct}_${numCoins}_${Math.random()}`,
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
      id: `gen_place_${i}_${tens}_${ones}_${Math.random()}`,
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
      id: `gen_balance_${i}_${known}_${total}_${Math.random()}`,
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
// VERBAL ANALOGY POOL (verbal_detective)
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
  { pair1: "Sheep ➔ Baa", pair2: "Pig ➔ ?", correct: "Oink", correctIcon: "🐷 Oink", distractors: [{ text: "Moo", icon: "🐄 Moo" }, { text: "Neigh", icon: "🐴 Neigh" }, { text: "Hiss", icon: "🐍 Hiss" }], hint: "A sheep says baa. A pig says...?" },
  { pair1: "Horse ➔ Neigh", pair2: "Owl ➔ ?", correct: "Hoot", correctIcon: "🦉 Hoot", distractors: [{ text: "Quack", icon: "🦆 Quack" }, { text: "Baa", icon: "🐑 Baa" }, { text: "Moo", icon: "🐄 Moo" }], hint: "A horse neighs. An owl says...?" },
  { pair1: "Doctor ➔ Hospital", pair2: "Teacher ➔ ?", correct: "School", correctIcon: "🏫 School", distractors: [{ text: "Store", icon: "🏬 Store" }, { text: "Farm", icon: "🚜 Farm" }, { text: "Kitchen", icon: "🍳 Kitchen" }], hint: "A doctor works at a hospital. A teacher works at a...?" },
  { pair1: "Chef ➔ Kitchen", pair2: "Farmer ➔ ?", correct: "Farm", correctIcon: "🚜 Farm", distractors: [{ text: "Office", icon: "🏢 Office" }, { text: "Library", icon: "📚 Library" }, { text: "Store", icon: "🏬 Store" }], hint: "A chef cooks in a kitchen. A farmer grows crops on a...?" },
  { pair1: "Firefighter ➔ Fire Truck", pair2: "Pilot ➔ ?", correct: "Airplane", correctIcon: "✈️ Airplane", distractors: [{ text: "Boat", icon: "⛵ Boat" }, { text: "Train", icon: "🚂 Train" }, { text: "Bicycle", icon: "🚲 Bicycle" }], hint: "A firefighter drives a fire truck. A pilot flies an...?" },
  { pair1: "Dentist ➔ Teeth", pair2: "Librarian ➔ ?", correct: "Books", correctIcon: "📚 Books", distractors: [{ text: "Cars", icon: "🚗 Cars" }, { text: "Animals", icon: "🐾 Animals" }, { text: "Food", icon: "🍎 Food" }], hint: "A dentist takes care of teeth. A librarian takes care of...?" },
  { pair1: "Mailman ➔ Letters", pair2: "Waiter ➔ ?", correct: "Food", correctIcon: "🍽️ Food", distractors: [{ text: "Books", icon: "📚 Books" }, { text: "Tools", icon: "🔧 Tools" }, { text: "Clothes", icon: "👕 Clothes" }], hint: "A mailman delivers letters. A waiter delivers...?" },
  { pair1: "Hot ➔ Cold", pair2: "Whisper ➔ ?", correct: "Shout", correctIcon: "📢 Shout", distractors: [{ text: "Talk", icon: "🗣️ Talk" }, { text: "Listen", icon: "👂 Listen" }, { text: "Quiet", icon: "🤫 Quiet" }], hint: "Hot and cold are complete opposites. What is the opposite of whispering quietly?" },
  { pair1: "Big ➔ Small", pair2: "Fast ➔ ?", correct: "Slow", correctIcon: "🐢 Slow", distractors: [{ text: "Loud", icon: "🔊 Loud" }, { text: "Happy", icon: "😀 Happy" }, { text: "Tall", icon: "📏 Tall" }], hint: "Big is the opposite of small. What is the opposite of fast?" },
  { pair1: "Up ➔ Down", pair2: "Day ➔ ?", correct: "Night", correctIcon: "🌙 Night", distractors: [{ text: "Sun", icon: "☀️ Sun" }, { text: "Morning", icon: "🌅 Morning" }, { text: "Cloud", icon: "☁️ Cloud" }], hint: "Up and down are opposites. What is the opposite of day?" },
  { pair1: "Happy ➔ Sad", pair2: "Full ➔ ?", correct: "Empty", correctIcon: "📦 Empty", distractors: [{ text: "Heavy", icon: "🏋️ Heavy" }, { text: "Round", icon: "⚪ Round" }, { text: "Wet", icon: "💧 Wet" }], hint: "Happy is the opposite of sad. What is the opposite of full?" },
  { pair1: "Open ➔ Closed", pair2: "Wet ➔ ?", correct: "Dry", correctIcon: "☀️ Dry", distractors: [{ text: "Cold", icon: "🥶 Cold" }, { text: "Soft", icon: "🧸 Soft" }, { text: "Loud", icon: "🔊 Loud" }], hint: "Open and closed are opposites. What is the opposite of wet?" },
  { pair1: "Old ➔ New", pair2: "Clean ➔ ?", correct: "Dirty", correctIcon: "🟤 Dirty", distractors: [{ text: "Shiny", icon: "✨ Shiny" }, { text: "Bright", icon: "💡 Bright" }, { text: "Soft", icon: "🧸 Soft" }], hint: "Old is the opposite of new. What is the opposite of clean?" },
  { pair1: "Hard ➔ Soft", pair2: "Light ➔ ?", correct: "Heavy", correctIcon: "🏋️ Heavy", distractors: [{ text: "Bright", icon: "💡 Bright" }, { text: "Fast", icon: "⚡ Fast" }, { text: "Small", icon: "🔹 Small" }], hint: "Hard is the opposite of soft. What is the opposite of light (in weight)?" },
  { pair1: "Above ➔ Below", pair2: "Front ➔ ?", correct: "Back", correctIcon: "🔙 Back", distractors: [{ text: "Side", icon: "↔️ Side" }, { text: "Top", icon: "⬆️ Top" }, { text: "Inside", icon: "📦 Inside" }], hint: "Above is the opposite of below. What is the opposite of front?" },
  { pair1: "Apple ➔ Fruit", pair2: "Carrot ➔ ?", correct: "Vegetable", correctIcon: "🥕 Vegetable", distractors: [{ text: "Meat", icon: "🍖 Meat" }, { text: "Dessert", icon: "🍰 Dessert" }, { text: "Drink", icon: "🥤 Drink" }], hint: "An apple belongs to the fruit family. What family does a carrot belong to?" },
  { pair1: "Circle ➔ Round", pair2: "Square ➔ ?", correct: "4 Straight Sides", correctIcon: "🟩 4 Sides", distractors: [{ text: "3 Sides", icon: "🔺 3 Sides" }, { text: "No Sides", icon: "⭕ No Sides" }, { text: "5 Sides", icon: "🔷 5 Sides" }], hint: "A circle is round. A square has how many straight sides?" },
  { pair1: "Finger ➔ Hand", pair2: "Toe ➔ ?", correct: "Foot", correctIcon: "🦶 Foot", distractors: [{ text: "Arm", icon: "💪 Arm" }, { text: "Head", icon: "🗣️ Head" }, { text: "Knee", icon: "🦵 Knee" }], hint: "A finger is part of a hand. A toe is part of a...?" },
  { pair1: "Petal ➔ Flower", pair2: "Leaf ➔ ?", correct: "Tree/Plant", correctIcon: "🌳 Tree", distractors: [{ text: "Rock", icon: "🪨 Rock" }, { text: "Cloud", icon: "☁️ Cloud" }, { text: "River", icon: "🏞️ River" }], hint: "A petal is part of a flower. A leaf is part of a...?" },
  { pair1: "Winter ➔ Snow", pair2: "Summer ➔ ?", correct: "Sunshine/Heat", correctIcon: "☀️ Sunshine", distractors: [{ text: "Falling Leaves", icon: "🍂 Leaves" }, { text: "Blooming Flowers", icon: "🌷 Flowers" }, { text: "Ice", icon: "🧊 Ice" }], hint: "Winter often has snow. What does summer usually have?" },
  { pair1: "Book ➔ Read", pair2: "Song ➔ ?", correct: "Sing/Listen", correctIcon: "🎵 Sing", distractors: [{ text: "Draw", icon: "🎨 Draw" }, { text: "Build", icon: "🧱 Build" }, { text: "Count", icon: "🔢 Count" }], hint: "You read a book. What do you do with a song?" },
  { pair1: "Scissors ➔ Cut", pair2: "Pencil ➔ ?", correct: "Write/Draw", correctIcon: "✏️ Write", distractors: [{ text: "Cook", icon: "🍳 Cook" }, { text: "Fly", icon: "🕊️ Fly" }, { text: "Swim", icon: "🏊 Swim" }], hint: "Scissors are used to cut. A pencil is used to...?" },
  { pair1: "Umbrella ➔ Rain", pair2: "Sunglasses ➔ ?", correct: "Sun", correctIcon: "☀️ Sun", distractors: [{ text: "Snow", icon: "❄️ Snow" }, { text: "Wind", icon: "💨 Wind" }, { text: "Fog", icon: "🌫️ Fog" }], hint: "An umbrella protects you from rain. Sunglasses protect your eyes from the...?" },
  { pair1: "Oven ➔ Bake", pair2: "Freezer ➔ ?", correct: "Freeze", correctIcon: "🧊 Freeze", distractors: [{ text: "Boil", icon: "♨️ Boil" }, { text: "Wash", icon: "🧼 Wash" }, { text: "Dry", icon: "☀️ Dry" }], hint: "An oven bakes food. A freezer makes food...?" },
  { pair1: "Key ➔ Lock", pair2: "Password ➔ ?", correct: "Computer", correctIcon: "💻 Computer", distractors: [{ text: "Book", icon: "📚 Book" }, { text: "Door", icon: "🚪 Door" }, { text: "Window", icon: "🪟 Window" }], hint: "A key opens a lock. A password opens (unlocks) a...?" },
  { pair1: "Brush ➔ Paint", pair2: "Fork ➔ ?", correct: "Eat", correctIcon: "🍽️ Eat", distractors: [{ text: "Write", icon: "✏️ Write" }, { text: "Cut Hair", icon: "✂️ Cut Hair" }, { text: "Clean", icon: "🧼 Clean" }], hint: "A brush is used to paint. A fork is used to...?" },
  { pair1: "Caterpillar ➔ Butterfly", pair2: "Tadpole ➔ ?", correct: "Frog", correctIcon: "🐸 Frog", distractors: [{ text: "Fish", icon: "🐟 Fish" }, { text: "Turtle", icon: "🐢 Turtle" }, { text: "Snake", icon: "🐍 Snake" }], hint: "A caterpillar transforms into a butterfly. A tadpole transforms into a...?" },
  { pair1: "Seed ➔ Plant", pair2: "Egg ➔ ?", correct: "Baby Animal", correctIcon: "🐣 Baby Animal", distractors: [{ text: "Rock", icon: "🪨 Rock" }, { text: "Water", icon: "💧 Water" }, { text: "Cloud", icon: "☁️ Cloud" }], hint: "A seed grows into a plant. An egg hatches into a...?" },
  { pair1: "Ice ➔ Cold", pair2: "Fire ➔ ?", correct: "Hot", correctIcon: "🔥 Hot", distractors: [{ text: "Wet", icon: "💧 Wet" }, { text: "Soft", icon: "🧸 Soft" }, { text: "Dark", icon: "🌑 Dark" }], hint: "Ice feels cold. Fire feels...?" },
  { pair1: "Bicycle ➔ Pedal", pair2: "Car ➔ ?", correct: "Steering Wheel", correctIcon: "🚗 Steering Wheel", distractors: [{ text: "Wing", icon: "🪽 Wing" }, { text: "Sail", icon: "⛵ Sail" }, { text: "Paddle", icon: "🛶 Paddle" }], hint: "You pedal a bicycle to move it. What do you turn to steer a car?" },
  { pair1: "Ocean ➔ Salty Water", pair2: "Lake ➔ ?", correct: "Fresh Water", correctIcon: "💧 Fresh Water", distractors: [{ text: "Ice Cream", icon: "🍦 Ice Cream" }, { text: "Sand", icon: "🏖️ Sand" }, { text: "Rocks", icon: "🪨 Rocks" }], hint: "The ocean has salty water. A lake usually has...?" },
  { pair1: "Ant ➔ Tiny", pair2: "Elephant ➔ ?", correct: "Huge", correctIcon: "🐘 Huge", distractors: [{ text: "Fast", icon: "⚡ Fast" }, { text: "Loud", icon: "🔊 Loud" }, { text: "Colorful", icon: "🌈 Colorful" }], hint: "An ant is tiny. An elephant is...?" },
  { pair1: "Snail ➔ Slow", pair2: "Cheetah ➔ ?", correct: "Fast", correctIcon: "⚡ Fast", distractors: [{ text: "Quiet", icon: "🤫 Quiet" }, { text: "Sleepy", icon: "😴 Sleepy" }, { text: "Tiny", icon: "🔹 Tiny" }], hint: "A snail moves slowly. A cheetah runs...?" },
  { pair1: "North Pole ➔ Cold", pair2: "Desert ➔ ?", correct: "Hot", correctIcon: "🌵 Hot", distractors: [{ text: "Wet", icon: "💧 Wet" }, { text: "Snowy", icon: "❄️ Snowy" }, { text: "Icy", icon: "🧊 Icy" }], hint: "The North Pole is very cold. A desert is usually very...?" },
  { pair1: "Piano ➔ Keys", pair2: "Guitar ➔ ?", correct: "Strings", correctIcon: "🎸 Strings", distractors: [{ text: "Drums", icon: "🥁 Drums" }, { text: "Reeds", icon: "🎷 Reeds" }, { text: "Buttons", icon: "🔘 Buttons" }], hint: "A piano is played using keys. A guitar is played using...?" },
  { pair1: "Bicycle ➔ Two Wheels", pair2: "Tricycle ➔ ?", correct: "Three Wheels", correctIcon: "🚲 Three Wheels", distractors: [{ text: "One Wheel", icon: "🎡 One Wheel" }, { text: "Four Wheels", icon: "🚗 Four Wheels" }, { text: "No Wheels", icon: "🚫 No Wheels" }], hint: "'Bi' means two, like bicycle has 2 wheels. 'Tri' means three, so a tricycle has...?" },
  { pair1: "Square ➔ 4 Corners", pair2: "Triangle ➔ ?", correct: "3 Corners", correctIcon: "🔺 3 Corners", distractors: [{ text: "5 Corners", icon: "🔷 5 Corners" }, { text: "0 Corners", icon: "⭕ 0 Corners" }, { text: "6 Corners", icon: "⬡ 6 Corners" }], hint: "A square has 4 corners. A triangle has...?" },
  { pair1: "Morning ➔ Breakfast", pair2: "Night ➔ ?", correct: "Dinner/Sleep", correctIcon: "🌙 Dinner", distractors: [{ text: "Lunch", icon: "🥪 Lunch" }, { text: "Snack Time Only", icon: "🍿 Snack" }, { text: "Recess", icon: "⚽ Recess" }], hint: "We eat breakfast in the morning. We eat dinner and sleep at...?" },
  { pair1: "Spring ➔ Flowers Bloom", pair2: "Fall ➔ ?", correct: "Leaves Change Color", correctIcon: "🍂 Leaves Change", distractors: [{ text: "Snow Falls Everywhere", icon: "❄️ Snow" }, { text: "It Never Gets Cold", icon: "☀️ Hot" }, { text: "Flowers Never Grow", icon: "🚫 No Flowers" }], hint: "In spring, flowers bloom. In fall (autumn), what happens to leaves?" },
  { pair1: "Whale ➔ Ocean", pair2: "Camel ➔ ?", correct: "Desert", correctIcon: "🐪 Desert", distractors: [{ text: "Ocean", icon: "🌊 Ocean" }, { text: "Arctic", icon: "❄️ Arctic" }, { text: "Rainforest", icon: "🌴 Rainforest" }], hint: "A whale lives in the ocean. A camel lives in the...?" },
  { pair1: "Penguin ➔ Cannot Fly", pair2: "Eagle ➔ ?", correct: "Can Fly", correctIcon: "🦅 Can Fly", distractors: [{ text: "Cannot Fly", icon: "🚫 Cannot Fly" }, { text: "Swims Only", icon: "🏊 Swims Only" }, { text: "Cannot Walk", icon: "🚫 Cannot Walk" }], hint: "A penguin is a bird that cannot fly. An eagle is a bird that...?" },
  { pair1: "Spider ➔ 8 Legs", pair2: "Insect ➔ ?", correct: "6 Legs", correctIcon: "🐜 6 Legs", distractors: [{ text: "4 Legs", icon: "🐕 4 Legs" }, { text: "10 Legs", icon: "🦞 10 Legs" }, { text: "2 Legs", icon: "🐦 2 Legs" }], hint: "A spider has 8 legs. Most insects (like ants) have...?" },
  { pair1: "Sun ➔ Day", pair2: "Moon ➔ ?", correct: "Night", correctIcon: "🌙 Night", distractors: [{ text: "Star", icon: "⭐ Star" }, { text: "Cloud", icon: "☁️ Cloud" }, { text: "Rain", icon: "🌧️ Rain" }], hint: "The sun shines during the day. The moon shines during the...?" },
  { pair1: "Bird ➔ Feathers", pair2: "Fish ➔ ?", correct: "Scales", correctIcon: "🐟 Scales", distractors: [{ text: "Fur", icon: "🐻 Fur" }, { text: "Shell", icon: "🐚 Shell" }, { text: "Feathers", icon: "🐦 Feathers" }], hint: "A bird's body is covered in feathers. A fish's body is covered in...?" },
  { pair1: "Baker ➔ Bread", pair2: "Butcher ➔ ?", correct: "Meat", correctIcon: "🥩 Meat", distractors: [{ text: "Books", icon: "📚 Books" }, { text: "Vegetables", icon: "🥕 Vegetables" }, { text: "Shoes", icon: "👟 Shoes" }], hint: "A baker sells bread. A butcher sells...?" },
  { pair1: "Painter ➔ Paintbrush", pair2: "Writer ➔ ?", correct: "Pencil", correctIcon: "✏️ Pencil", distractors: [{ text: "Hammer", icon: "🔨 Hammer" }, { text: "Spoon", icon: "🥄 Spoon" }, { text: "Camera", icon: "📷 Camera" }], hint: "A painter uses a paintbrush. A writer uses a...?" },
  { pair1: "Rain ➔ Umbrella", pair2: "Cold Weather ➔ ?", correct: "Coat", correctIcon: "🧥 Coat", distractors: [{ text: "Swimsuit", icon: "🩱 Swimsuit" }, { text: "Sunglasses", icon: "🕶️ Sunglasses" }, { text: "Sandals", icon: "👡 Sandals" }], hint: "An umbrella keeps you dry in the rain. A coat keeps you warm in...?" },
  { pair1: "Bee ➔ Honey", pair2: "Cow ➔ ?", correct: "Milk", correctIcon: "🥛 Milk", distractors: [{ text: "Eggs", icon: "🥚 Eggs" }, { text: "Wool", icon: "🧶 Wool" }, { text: "Honey", icon: "🍯 Honey" }], hint: "A bee makes honey. A cow makes...?" },
  { pair1: "Chicken ➔ Eggs", pair2: "Sheep ➔ ?", correct: "Wool", correctIcon: "🧶 Wool", distractors: [{ text: "Milk", icon: "🥛 Milk", }, { text: "Honey", icon: "🍯 Honey" }, { text: "Eggs", icon: "🥚 Eggs" }], hint: "A chicken gives us eggs. A sheep gives us...?" },
  { pair1: "Artist ➔ Paint", pair2: "Musician ➔ ?", correct: "Music", correctIcon: "🎵 Music", distractors: [{ text: "Food", icon: "🍎 Food" }, { text: "Books", icon: "📚 Books" }, { text: "Clothes", icon: "👕 Clothes" }], hint: "An artist makes paintings. A musician makes...?" },
  { pair1: "Astronaut ➔ Spaceship", pair2: "Sailor ➔ ?", correct: "Ship", correctIcon: "🚢 Ship", distractors: [{ text: "Airplane", icon: "✈️ Airplane" }, { text: "Car", icon: "🚗 Car" }, { text: "Train", icon: "🚂 Train" }], hint: "An astronaut travels in a spaceship. A sailor travels on a...?" },
  { pair1: "Banana ➔ Yellow", pair2: "Grape ➔ ?", correct: "Purple", correctIcon: "🍇 Purple", distractors: [{ text: "Red", icon: "🔴 Red" }, { text: "Orange", icon: "🟠 Orange" }, { text: "Blue", icon: "🔵 Blue" }], hint: "A banana is usually yellow. A grape is usually...?" },
  { pair1: "Strawberry ➔ Red", pair2: "Broccoli ➔ ?", correct: "Green", correctIcon: "🥦 Green", distractors: [{ text: "Yellow", icon: "🟡 Yellow" }, { text: "Purple", icon: "🟣 Purple" }, { text: "Brown", icon: "🟤 Brown" }], hint: "A strawberry is red. Broccoli is...?" },
  { pair1: "Hammer ➔ Nail", pair2: "Screwdriver ➔ ?", correct: "Screw", correctIcon: "🔩 Screw", distractors: [{ text: "Nail", icon: "🔨 Nail" }, { text: "Rope", icon: "🪢 Rope" }, { text: "Glue", icon: "🧴 Glue" }], hint: "A hammer is used to hit a nail. A screwdriver is used to turn a...?" },
  { pair1: "Shovel ➔ Dig", pair2: "Broom ➔ ?", correct: "Sweep", correctIcon: "🧹 Sweep", distractors: [{ text: "Cut", icon: "✂️ Cut" }, { text: "Paint", icon: "🎨 Paint" }, { text: "Wash", icon: "🧼 Wash" }], hint: "A shovel is used to dig. A broom is used to...?" },
  { pair1: "Thermometer ➔ Temperature", pair2: "Clock ➔ ?", correct: "Time", correctIcon: "⏰ Time", distractors: [{ text: "Weight", icon: "⚖️ Weight" }, { text: "Distance", icon: "📏 Distance" }, { text: "Sound", icon: "🔊 Sound" }], hint: "A thermometer measures temperature. A clock measures...?" },
  { pair1: "Ear ➔ Hear", pair2: "Eye ➔ ?", correct: "See", correctIcon: "👀 See", distractors: [{ text: "Smell", icon: "👃 Smell" }, { text: "Taste", icon: "👅 Taste" }, { text: "Touch", icon: "✋ Touch" }], hint: "You use your ear to hear. You use your eye to...?" },
  { pair1: "Nose ➔ Smell", pair2: "Tongue ➔ ?", correct: "Taste", correctIcon: "👅 Taste", distractors: [{ text: "Hear", icon: "👂 Hear" }, { text: "See", icon: "👀 See" }, { text: "Touch", icon: "✋ Touch" }], hint: "You use your nose to smell. You use your tongue to...?" },
  { pair1: "Bat ➔ Cave", pair2: "Squirrel ➔ ?", correct: "Tree", correctIcon: "🌳 Tree", distractors: [{ text: "Pond", icon: "💧 Pond" }, { text: "Burrow", icon: "🕳️ Burrow" }, { text: "Web", icon: "🕸️ Web" }], hint: "A bat lives in a cave. A squirrel lives in a...?" },
  { pair1: "Puzzle ➔ Pieces", pair2: "Book ➔ ?", correct: "Pages", correctIcon: "📄 Pages", distractors: [{ text: "Wheels", icon: "🛞 Wheels" }, { text: "Petals", icon: "🌸 Petals" }, { text: "Branches", icon: "🌿 Branches" }], hint: "A puzzle is made of pieces. A book is made of...?" },
  { pair1: "Snowflake ➔ Cold", pair2: "Campfire ➔ ?", correct: "Hot", correctIcon: "🔥 Hot", distractors: [{ text: "Wet", icon: "💧 Wet" }, { text: "Soft", icon: "🧸 Soft" }, { text: "Quiet", icon: "🤫 Quiet" }], hint: "A snowflake feels cold. A campfire feels...?" },
  { pair1: "Baby ➔ Crawl", pair2: "Bird ➔ ?", correct: "Fly", correctIcon: "🐦 Fly", distractors: [{ text: "Swim", icon: "🏊 Swim" }, { text: "Hop", icon: "🐇 Hop" }, { text: "Slither", icon: "🐍 Slither" }], hint: "A baby moves by crawling. A bird moves through the sky by...?" }
];

function generateVerbalAnalogies(count) {
  const pool = pgShuffle(VERBAL_ANALOGY_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const allOptions = pgShuffle([
      { text: item.correct, icon: item.correctIcon },
      ...item.distractors
    ]);
    const correctIndex = allOptions.findIndex(o => o.text === item.correct);
    return {
      id: `gen_verbal_${i}_${item.correct.replace(/\s/g, "")}_${Math.random()}`,
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

// Riddle pool (verbal_detective)
const RIDDLE_POOL = [
  { clues: "I have hands but cannot clap. I have a face but cannot smile. I tell you when school starts.", correct: "A Clock", correctIcon: "⏰ Clock", distractors: [{ text: "A Robot", icon: "🤖 Robot" }, { text: "A Doll", icon: "🪆 Doll" }, { text: "A Book", icon: "📖 Book" }], hint: "Think of something on the wall with an hour hand and a minute hand." },
  { clues: "I am cold and white. I fall from the sky in winter. Kids make me into a snowman.", correct: "Snow", correctIcon: "❄️ Snow", distractors: [{ text: "Rain", icon: "🌧️ Rain" }, { text: "Sand", icon: "🏖️ Sand" }, { text: "Ice Cream", icon: "🍦 Ice Cream" }], hint: "What falls from clouds in winter and covers the ground in white?" },
  { clues: "I have a trunk but I am not a tree. I have big ears and I am very big and gray.", correct: "An Elephant", correctIcon: "🐘 Elephant", distractors: [{ text: "A Mouse", icon: "🐭 Mouse" }, { text: "A Tree", icon: "🌳 Tree" }, { text: "A Suitcase", icon: "🧳 Suitcase" }], hint: "Which giant gray animal uses its trunk like a hand?" },
  { clues: "I have keys but no locks. I have space but no rooms. You can type on me.", correct: "A Keyboard", correctIcon: "⌨️ Keyboard", distractors: [{ text: "A Piano", icon: "🎹 Piano" }, { text: "A Door", icon: "🚪 Door" }, { text: "A House", icon: "🏠 House" }], hint: "What has keys and a space bar, and connects to a computer?" },
  { clues: "I go up but never come down. The older I get, the higher I am.", correct: "Your Age", correctIcon: "🎂 Age", distractors: [{ text: "A Balloon", icon: "🎈 Balloon" }, { text: "A Kite", icon: "🪁 Kite" }, { text: "A Rocket", icon: "🚀 Rocket" }], hint: "Every year on your birthday, this number gets bigger and bigger, and it never goes back down!" },
  { clues: "I have a bed but I never sleep. I have a mouth but I never eat. I flow to the ocean.", correct: "A River", correctIcon: "🏞️ River", distractors: [{ text: "A Bathtub", icon: "🛁 Bathtub" }, { text: "A Person", icon: "🧑 Person" }, { text: "A Cup", icon: "🥤 Cup" }], hint: "Water flows through me on the way to the sea, and I have a 'bed' at the bottom." },
  { clues: "I have a spine but no bones. I have pages but I am not a diary. You read me.", correct: "A Book", correctIcon: "📖 Book", distractors: [{ text: "A Skeleton", icon: "💀 Skeleton" }, { text: "A Newspaper", icon: "📰 Newspaper" }, { text: "A Notebook", icon: "📓 Notebook" }], hint: "This has a spine (the folded edge) and pages you turn to read a story." },
  { clues: "I have a face and two hands, but no arms or legs. I hang on the wall.", correct: "A Clock", correctIcon: "⏰ Clock", distractors: [{ text: "A Mirror", icon: "🪞 Mirror" }, { text: "A Painting", icon: "🖼️ Painting" }, { text: "A Calendar", icon: "📅 Calendar" }], hint: "It has an hour hand and minute hand, but it's not alive!" },
  { clues: "The more you take from me, the bigger I get. What am I?", correct: "A Hole", correctIcon: "🕳️ Hole", distractors: [{ text: "A Pizza", icon: "🍕 Pizza" }, { text: "A Balloon", icon: "🎈 Balloon" }, { text: "A Cake", icon: "🎂 Cake" }], hint: "Think about digging in the sand - what happens as you remove more sand?" },
  { clues: "I have branches but no leaves, no fruit, and no flowers. Where am I?", correct: "A Bank", correctIcon: "🏦 Bank", distractors: [{ text: "A Tree", icon: "🌳 Tree" }, { text: "A Forest", icon: "🌲 Forest" }, { text: "A Garden", icon: "🌷 Garden" }], hint: "A bank has different branch locations, but they aren't the kind on a tree!" },
  { clues: "I can be cracked, made, told, and played. What am I?", correct: "A Joke", correctIcon: "😂 Joke", distractors: [{ text: "An Egg", icon: "🥚 Egg" }, { text: "A Game", icon: "🎮 Game" }, { text: "A Song", icon: "🎵 Song" }], hint: "Something funny that makes people laugh - you can crack one, make one up, tell it, or play a practical one!" },
  { clues: "I follow you all day but disappear at night. I get bigger or smaller depending on the sun.", correct: "Your Shadow", correctIcon: "👤 Shadow", distractors: [{ text: "Your Reflection", icon: "🪞 Reflection" }, { text: "A Ghost", icon: "👻 Ghost" }, { text: "A Cloud", icon: "☁️ Cloud" }], hint: "The sun makes this dark shape follow you on the ground, but it vanishes when it's dark outside." },
  { clues: "I have teeth but cannot bite. I help fix your hair.", correct: "A Comb", correctIcon: "💇 Comb", distractors: [{ text: "A Shark", icon: "🦈 Shark" }, { text: "A Saw", icon: "🪚 Saw" }, { text: "A Zipper", icon: "🤐 Zipper" }], hint: "You run this through your hair every morning - it has little 'teeth' but doesn't bite!" },
  { clues: "I have a tail and a head, but no body at all. What am I?", correct: "A Coin", correctIcon: "🪙 Coin", distractors: [{ text: "A Snake", icon: "🐍 Snake" }, { text: "A Dog", icon: "🐶 Dog" }, { text: "A Key", icon: "🔑 Key" }], hint: "Flip me and I might land on 'heads' or 'tails'!" },
  { clues: "I am tall when I am young, and I get shorter the longer I live.", correct: "A Candle", correctIcon: "🕯️ Candle", distractors: [{ text: "A Tree", icon: "🌳 Tree" }, { text: "A Person", icon: "🧑 Person" }, { text: "A Pencil", icon: "✏️ Pencil" }], hint: "As I burn, I slowly get shorter and shorter." },
  { clues: "I have a neck but no head, and I wear a little cap.", correct: "A Bottle", correctIcon: "🍼 Bottle", distractors: [{ text: "A Shirt", icon: "👕 Shirt" }, { text: "A Giraffe", icon: "🦒 Giraffe" }, { text: "A Jacket", icon: "🧥 Jacket" }], hint: "You twist my cap off to drink what's inside me." },
  { clues: "The more you feed me, the bigger I grow. But give me water, and I will disappear.", correct: "Fire", correctIcon: "🔥 Fire", distractors: [{ text: "A Plant", icon: "🌱 Plant" }, { text: "A Balloon", icon: "🎈 Balloon" }, { text: "A Fish", icon: "🐟 Fish" }], hint: "I am hot, bright, and I need to be put out with water." },
  { clues: "I must be cracked open before you can use me for breakfast.", correct: "An Egg", correctIcon: "🥚 Egg", distractors: [{ text: "A Toy", icon: "🧸 Toy" }, { text: "A Window", icon: "🪟 Window" }, { text: "A Rule", icon: "📜 Rule" }], hint: "Chickens lay me, and I have a shell you crack open." },
  { clues: "I am full of tiny holes, but I can still soak up water.", correct: "A Sponge", correctIcon: "🧽 Sponge", distractors: [{ text: "A Net", icon: "🥅 Net" }, { text: "A Bucket", icon: "🪣 Bucket" }, { text: "A Cup", icon: "🥤 Cup" }], hint: "You use me to clean dishes and wipe up spills." },
  { clues: "What gets wetter and wetter the more it dries things off?", correct: "A Towel", correctIcon: "🧻 Towel", distractors: [{ text: "A Sponge", icon: "🧽 Sponge" }, { text: "Rain", icon: "🌧️ Rain" }, { text: "Soap", icon: "🧼 Soap" }], hint: "You dry your hands and body with me after a bath." },
  { clues: "I have pages and a spine, but I am not alive. What has a thumb and four fingers, but is not a hand?", correct: "A Glove", correctIcon: "🧤 Glove", distractors: [{ text: "A Hand", icon: "✋ Hand" }, { text: "A Puppet", icon: "🧦 Puppet" }, { text: "A Sock", icon: "🧦 Sock" }], hint: "You wear me on a cold day to keep your fingers warm." },
  { clues: "I can fly high without wings, and I can cry without eyes.", correct: "A Cloud", correctIcon: "☁️ Cloud", distractors: [{ text: "A Bird", icon: "🐦 Bird" }, { text: "A Kite", icon: "🪁 Kite" }, { text: "An Airplane", icon: "✈️ Airplane" }], hint: "I float in the sky, and sometimes rain falls from me." },
  { clues: "What kind of room has no doors and no windows at all?", correct: "A Mushroom", correctIcon: "🍄 Mushroom", distractors: [{ text: "A Tent", icon: "⛺ Tent" }, { text: "A Cave", icon: "🪨 Cave" }, { text: "A Box", icon: "📦 Box" }], hint: "Listen closely to the word - it has 'room' hiding inside it!" },
  { clues: "I have a ring, but I have no finger to wear it on.", correct: "A Telephone", correctIcon: "☎️ Telephone", distractors: [{ text: "A Tree", icon: "🌳 Tree" }, { text: "A Bell", icon: "🔔 Bell" }, { text: "A Crown", icon: "👑 Crown" }], hint: "When I 'ring', someone wants to talk to you!" },
  { clues: "I have one eye, but I cannot see anything at all.", correct: "A Needle", correctIcon: "🪡 Needle", distractors: [{ text: "A Potato", icon: "🥔 Potato" }, { text: "A Storm", icon: "🌀 Storm" }, { text: "A Doll", icon: "🪆 Doll" }], hint: "You thread string through my tiny 'eye' to sew." }
];

function generateRiddleQuestions(count) {
  const pool = pgShuffle(RIDDLE_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const allOptions = pgShuffle([{ text: item.correct, icon: item.correctIcon }, ...item.distractors]);
    const correctIndex = allOptions.findIndex(o => o.text === item.correct);
    return {
      id: `gen_riddle_${i}_${item.correct.replace(/\s/g, "")}_${Math.random()}`,
      category: "verbal_detective",
      standard: "VA SOL 1.8 - Context Clue Riddles & Inference",
      difficulty: pgRandInt(2, 4),
      prompt: `Riddle: "${item.clues}" What am I?`,
      visualType: "riddle",
      visualData: { clues: item.clues.split(". ") },
      options: allOptions,
      correctIndex,
      hint: item.hint,
      explanation: `The answer is ${item.correct}! ${item.hint}`
    };
  });
}

// Rhyming word family pool (verbal_detective)
const RHYME_FAMILY_POOL = [
  { family: "at", target: "Cat", rhymes: ["Hat", "Bat", "Mat"], nonRhymes: ["Dog", "Sun", "Tree"] },
  { family: "og", target: "Frog", rhymes: ["Log", "Dog", "Jog"], nonRhymes: ["Cat", "Star", "Book"] },
  { family: "ig", target: "Pig", rhymes: ["Big", "Wig", "Dig"], nonRhymes: ["Sun", "Boat", "Cup"] },
  { family: "un", target: "Sun", rhymes: ["Fun", "Run", "Bun"], nonRhymes: ["Moon", "Frog", "Chair"] },
  { family: "ee", target: "Bee", rhymes: ["Tree", "See", "Knee"], nonRhymes: ["Star", "Cup", "Book"] },
  { family: "ake", target: "Cake", rhymes: ["Lake", "Snake", "Rake"], nonRhymes: ["Dog", "Sun", "Chair"] },
  { family: "ing", target: "King", rhymes: ["Ring", "Sing", "Wing"], nonRhymes: ["Cat", "Boat", "Star"] },
  { family: "oon", target: "Moon", rhymes: ["Spoon", "Balloon", "Raccoon"], nonRhymes: ["Cake", "Frog", "Chair"] },
  { family: "ight", target: "Light", rhymes: ["Night", "Bright", "Kite"], nonRhymes: ["Sun", "Frog", "Cup"] },
  { family: "an", target: "Fan", rhymes: ["Can", "Man", "Pan"], nonRhymes: ["Book", "Star", "Moon"] },
  { family: "op", target: "Top", rhymes: ["Hop", "Mop", "Pop"], nonRhymes: ["Sun", "Cat", "Tree"] },
  { family: "ell", target: "Bell", rhymes: ["Shell", "Well", "Smell"], nonRhymes: ["Frog", "Star", "Book"] },
  { family: "ug", target: "Bug", rhymes: ["Rug", "Hug", "Mug"], nonRhymes: ["Cake", "Moon", "Fan"] },
  { family: "ap", target: "Cap", rhymes: ["Map", "Nap", "Tap"], nonRhymes: ["Dog", "Star", "Ring"] },
  { family: "ot", target: "Pot", rhymes: ["Hot", "Dot", "Not"], nonRhymes: ["Bee", "Cake", "King"] },
  { family: "ail", target: "Snail", rhymes: ["Tail", "Mail", "Sail"], nonRhymes: ["Frog", "Sun", "Moon"] },
  { family: "ock", target: "Sock", rhymes: ["Rock", "Clock", "Lock"], nonRhymes: ["Cake", "Bee", "Fan"] },
  { family: "ish", target: "Fish", rhymes: ["Dish", "Wish", "Swish"], nonRhymes: ["Cat", "Sun", "Star"] },
  { family: "ow", target: "Cow", rhymes: ["Wow", "How", "Now"], nonRhymes: ["Bee", "Cake", "Ring"] },
  { family: "ine", target: "Nine", rhymes: ["Line", "Pine", "Shine"], nonRhymes: ["Sun", "Frog", "Cap"] }
];

function generateRhymeQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const fam = pgPick(RHYME_FAMILY_POOL);
    const correct = pgPick(fam.rhymes);
    const distractors = pgPickN(fam.nonRhymes, 3);
    const options = pgShuffle([correct, ...distractors]).map(w => ({ text: w, icon: "🔤" }));
    const correctIndex = options.findIndex(o => o.text === correct);
    out.push({
      id: `gen_rhyme_${i}_${fam.family}_${correct}_${Math.random()}`,
      category: "verbal_detective",
      standard: "VA SOL 1.5 - Phonics & Rhyming Word Families",
      difficulty: 2,
      prompt: `Which word rhymes with "${fam.target}"?`,
      visualType: "phonics_mystery",
      visualData: { rhyme: fam.target.toLowerCase() },
      options,
      correctIndex,
      hint: `Listen to the ending sound of "${fam.target}": -${fam.family}. Which word ends the same way?`,
      explanation: `"${correct}" rhymes with "${fam.target}" because they both end with the "-${fam.family}" sound!`
    });
  }
  return out;
}

// ==========================================
// MATRIX & NONVERBAL REASONING GENERATORS (matrix_reasoning)
// ==========================================
const MATRIX_COLORS = [
  { name: "Red", emoji: "🔴", hex: "#EF4444" }, { name: "Blue", emoji: "🔵", hex: "#3B82F6" },
  { name: "Green", emoji: "🟢", hex: "#10B981" }, { name: "Yellow", emoji: "🟡", hex: "#FBBF24" },
  { name: "Purple", emoji: "🟣", hex: "#8B5CF6" }, { name: "Orange", emoji: "🟠", hex: "#F97316" },
  { name: "Pink", emoji: "🌸", hex: "#EC4899" }, { name: "Black", emoji: "⚫", hex: "#1F2937" },
  { name: "Brown", emoji: "🟤", hex: "#92400E" }, { name: "White", emoji: "⚪", hex: "#E5E7EB" }
];
const MATRIX_SHAPES = ["circle", "square", "triangle", "star", "diamond", "heart"];

function generateColorCycleQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const cycleLen = pgRandInt(2, 3);
    const colors = pgPickN(MATRIX_COLORS, cycleLen);
    const shownLen = pgRandInt(4, 6);
    const seq = Array.from({ length: shownLen }, (_, k) => colors[k % cycleLen]);
    const correctColor = colors[shownLen % cycleLen];
    const distractorColors = pgPickN(MATRIX_COLORS.filter(c => c.name !== correctColor.name), 3);
    const options = pgShuffle([correctColor, ...distractorColors]).map(c => ({ text: c.name, icon: c.emoji }));
    const correctIndex = options.findIndex(o => o.text === correctColor.name);
    out.push({
      id: `gen_colorcycle_${i}_${cycleLen}_${shownLen}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "NNAT3 - Repeating Color Pattern Cycle",
      difficulty: cycleLen === 2 ? 1 : 2,
      prompt: `Look at the pattern: ${seq.map(c => c.name).join(", ")}, ___? What color comes next?`,
      visualType: "sequence",
      visualData: { items: [...seq.map(c => c.emoji), "❓"] },
      options,
      correctIndex,
      hint: `The colors repeat in a cycle of ${cycleLen}: ${colors.map(c => c.name).join(", ")}...`,
      explanation: `The pattern repeats every ${cycleLen} colors, so the next one is ${correctColor.name}!`
    });
  }
  return out;
}

function generateSizeCycleQuestions(count) {
  const sizeSets = [["Big", "Small"], ["Large", "Medium", "Small"]];
  const out = [];
  for (let i = 0; i < count; i++) {
    const sizes = pgPick(sizeSets);
    const shape = pgPick(MATRIX_SHAPES);
    const shownLen = pgRandInt(4, 6);
    const seq = Array.from({ length: shownLen }, (_, k) => sizes[k % sizes.length]);
    const correctSize = sizes[shownLen % sizes.length];
    const distractors = sizes.filter(s => s !== correctSize).concat(["Extra Large", "Tiny"]).slice(0, 3);
    const options = pgShuffle([correctSize, ...distractors]).map(s => ({ text: s, icon: "📏" }));
    const correctIndex = options.findIndex(o => o.text === correctSize);
    out.push({
      id: `gen_sizecycle_${i}_${shape}_${shownLen}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "Spatial - Repeating Size Pattern Cycle",
      difficulty: sizes.length === 2 ? 1 : 2,
      prompt: `Look at the sizes: ${seq.join(", ")}, ___? What size comes next?`,
      visualType: "sequence",
      visualData: { items: [...seq.map(s => `${s}`), "❓"] },
      options,
      correctIndex,
      hint: `The sizes repeat in a cycle: ${sizes.join(", ")}...`,
      explanation: `The pattern repeats every ${sizes.length} sizes, so the next one is ${correctSize}!`
    });
  }
  return out;
}

function generateOddOneOutQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const useColor = Math.random() < 0.5;
    if (useColor) {
      const shared = pgPick(MATRIX_COLORS);
      const oddOne = pgPick(MATRIX_COLORS.filter(c => c.name !== shared.name));
      const shape = pgPick(MATRIX_SHAPES);
      const items = pgShuffle([
        { text: `${shared.name} ${shape}`, icon: shared.emoji, isOdd: false },
        { text: `${shared.name} ${shape} `, icon: shared.emoji, isOdd: false },
        { text: `${shared.name} ${shape}  `, icon: shared.emoji, isOdd: false },
        { text: `${oddOne.name} ${shape}`, icon: oddOne.emoji, isOdd: true }
      ]);
      const correctIndex = items.findIndex(o => o.isOdd);
      out.push({
        id: `gen_oddcolor_${i}_${shared.name}_${oddOne.name}_${Math.random()}`,
        category: "matrix_reasoning",
        standard: "CogAT Nonverbal - Odd One Out (Attribute Match)",
        difficulty: 2,
        prompt: `Four ${shape}s are shown. Three are the same color, one is different. Which one does NOT belong?`,
        visualType: "classification",
        visualData: { shapes: items.map(o => o.text) },
        options: items.map(o => ({ text: o.text, icon: o.icon })),
        correctIndex,
        hint: `Three shapes share the same color. Only one shape is a different color!`,
        explanation: `Three ${shape}s are ${shared.name}, but one is ${oddOne.name}, so it doesn't belong!`
      });
    } else {
      const color = pgPick(MATRIX_COLORS);
      const shared = pgPick(MATRIX_SHAPES);
      const oddShape = pgPick(MATRIX_SHAPES.filter(s => s !== shared));
      const items = pgShuffle([
        { text: `${color.name} ${shared}`, icon: color.emoji, isOdd: false },
        { text: `${color.name} ${shared} `, icon: color.emoji, isOdd: false },
        { text: `${color.name} ${shared}  `, icon: color.emoji, isOdd: false },
        { text: `${color.name} ${oddShape}`, icon: color.emoji, isOdd: true }
      ]);
      const correctIndex = items.findIndex(o => o.isOdd);
      out.push({
        id: `gen_oddshape_${i}_${shared}_${oddShape}_${Math.random()}`,
        category: "matrix_reasoning",
        standard: "CogAT Nonverbal - Odd One Out (Shape Match)",
        difficulty: 2,
        prompt: `Four ${color.name} shapes are shown. Three are the same shape, one is different. Which one does NOT belong?`,
        visualType: "classification",
        visualData: { shapes: items.map(o => o.text) },
        options: items.map(o => ({ text: o.text, icon: o.icon })),
        correctIndex,
        hint: `Three shapes are the same. Only one shape is a different type!`,
        explanation: `Three shapes are ${shared}s, but one is a ${oddShape}, so it doesn't belong!`
      });
    }
  }
  return out;
}

const SIDES_MAP = [
  { name: "Triangle", sides: 3, icon: "🔺" }, { name: "Square", sides: 4, icon: "🟩" },
  { name: "Pentagon", sides: 5, icon: "🔷" }, { name: "Hexagon", sides: 6, icon: "⬡" },
  { name: "Heptagon", sides: 7, icon: "🔶" }, { name: "Octagon", sides: 8, icon: "🛑" },
  { name: "Nonagon", sides: 9, icon: "9️⃣" }, { name: "Decagon", sides: 10, icon: "🔟" }
];

function generateSidesAnalogyQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [known, target] = pgPickN(SIDES_MAP, 2);
    const distractors = pgUniqueDistractors(target.sides, 3, 10, 3);
    const options = pgShuffle([target.sides, ...distractors]).map(s => ({ text: `${s} Sides`, icon: "🔷" }));
    const correctIndex = options.findIndex(o => o.text === `${target.sides} Sides`);
    out.push({
      id: `gen_sides_${i}_${known.name}_${target.name}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "CogAT Nonverbal - Shape Sides Analogy",
      difficulty: 3,
      prompt: `A ${known.name} has ${known.sides} sides. A ${target.name} has how many sides?`,
      visualType: "analogy",
      visualData: { pair1: `${known.name} ➔ ${known.sides} Sides`, pair2: `${target.name} ➔ ?` },
      options,
      correctIndex,
      hint: `Count the sides of a ${target.name} carefully - it's a well-known shape!`,
      explanation: `A ${target.name} always has ${target.sides} straight sides!`
    });
  }
  return out;
}

function generateGrowingDotsQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const start = pgRandInt(1, 3);
    const diff = pgRandInt(1, 3);
    const terms = [start, start + diff, start + diff * 2];
    const correct = start + diff * 3;
    const distractors = pgUniqueDistractors(correct, 1, correct + 10, 3);
    const options = pgShuffle([correct, ...distractors]).map(n => ({ text: `${n} Dots`, icon: "🔵".repeat(Math.min(n, 6)) }));
    const correctIndex = options.findIndex(o => o.text === `${correct} Dots`);
    out.push({
      id: `gen_growdots_${i}_${start}_${diff}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "NNAT3 - Growing Numeric Dot Pattern",
      difficulty: diff === 1 ? 2 : 3,
      prompt: `Count the growing dot groups: ${terms.map(t => `${t} dot${t > 1 ? "s" : ""}`).join(", ")}, ___? How many dots come next?`,
      visualType: "sequence",
      visualData: { items: [...terms.map(t => `🔵`.repeat(t) + ` (${t})`), "❓"] },
      options,
      correctIndex,
      hint: `Each group adds ${diff} more dot${diff > 1 ? "s" : ""} than the last one.`,
      explanation: `The pattern adds ${diff} each time, so ${terms[2]} + ${diff} = ${correct}!`
    });
  }
  return out;
}

function generateMatrix2x2Questions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [shapeA, shapeB] = pgPickN(MATRIX_SHAPES, 2);
    const [colorA, colorB] = pgPickN(MATRIX_COLORS, 2);
    const tl = { shape: shapeA, color: colorA.hex };
    const tr = { shape: shapeB, color: colorA.hex };
    const bl = { shape: shapeA, color: colorB.hex };
    const correctBr = { shape: shapeB, color: colorB.hex };

    const wrong1 = { shape: shapeA, color: colorB.hex }; // same as bl (shape didn't change)
    const wrong2 = { shape: shapeB, color: colorA.hex }; // same as tr (color didn't change)
    const wrong3 = { shape: shapeA, color: colorA.hex }; // same as tl (nothing changed)

    const optionDefs = pgShuffle([
      { visual: correctBr, isCorrect: true },
      { visual: wrong1, isCorrect: false },
      { visual: wrong2, isCorrect: false },
      { visual: wrong3, isCorrect: false }
    ]);
    const options = optionDefs.map(o => ({
      text: `${colorNameFromHex(o.visual.color)} ${o.visual.shape}`,
      icon: "🔷",
      visual: o.visual
    }));
    const correctIndex = optionDefs.findIndex(o => o.isCorrect);

    out.push({
      id: `gen_matrix2x2_${i}_${shapeA}_${shapeB}_${colorA.name}_${colorB.name}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "CogAT Nonverbal - 2x2 Matrix Shape & Color Transform",
      difficulty: 3,
      prompt: `Look at the pattern box. What shape completes the puzzle?`,
      visualType: "matrix_2x2",
      visualData: { tl, tr, bl, br: "?" },
      options,
      correctIndex,
      hint: `Look at how shapes change left-to-right, and colors change top-to-bottom.`,
      explanation: `The shape changes across the row (${shapeA}➔${shapeB}), and the color changes down the column (${colorA.name}➔${colorB.name}), so the answer is a ${colorB.name} ${shapeB}!`
    });
  }
  return out;
}

function colorNameFromHex(hex) {
  const found = MATRIX_COLORS.find(c => c.hex === hex);
  return found ? found.name : "Colored";
}

// ==========================================
// SPATIAL & VISUAL REASONING GENERATORS (spatial_folding)
// ==========================================
function generatePaperFoldQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const folds = pgRandInt(1, 3);
    const punches = pgRandInt(1, 2);
    const correct = punches * Math.pow(2, folds);
    const { options, correctIndex } = pgBuildNumberOptions(correct, 1, 20);
    const optionsLabeled = options.map(o => ({ text: `${o.text} Hole${o.text === "1" ? "" : "s"}`, icon: "📄" }));
    out.push({
      id: `gen_paperfold_${i}_${folds}_${punches}_${Math.random()}`,
      category: "spatial_folding",
      standard: "NNAT3 - Paper Folding & Hole Punch Prediction",
      difficulty: folds >= 2 ? 4 : 2,
      prompt: `A paper is folded in half ${folds} time${folds > 1 ? "s" : ""}, then ${punches} hole${punches > 1 ? "s are" : " is"} punched through all the layers. How many holes appear when fully unfolded?`,
      visualType: "paper_folding",
      visualData: { folds, punches },
      options: optionsLabeled,
      correctIndex,
      hint: `Each fold doubles the layers of paper. ${folds} fold${folds > 1 ? "s" : ""} makes ${Math.pow(2, folds)} layers.`,
      explanation: `${punches} punch${punches > 1 ? "es" : ""} through ${Math.pow(2, folds)} layers makes ${correct} holes total!`
    });
  }
  return out;
}

function generateBlockCountQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const numGroups = pgRandInt(2, 3);
    const groups = Array.from({ length: numGroups }, () => pgRandInt(1, 4));
    const correct = groups.reduce((a, b) => a + b, 0);
    const { options, correctIndex } = pgBuildNumberOptions(correct, 1, 15);
    const optionsLabeled = options.map(o => ({ text: `${o.text} Blocks`, icon: "🧱" }));
    out.push({
      id: `gen_blocks_${i}_${groups.join("_")}_${Math.random()}`,
      category: "spatial_folding",
      standard: "Spatial - 3D Block Structure Counting",
      difficulty: numGroups === 3 ? 3 : 2,
      prompt: `A structure has ${numGroups} stacks with ${groups.join(", ")} block${groups[groups.length - 1] > 1 ? "s" : ""} each. How many total blocks are used?`,
      visualType: "blocks_3d",
      visualData: { layers: [groups] },
      options: optionsLabeled,
      correctIndex,
      hint: `Add up all the stacks: ${groups.join(" + ")}.`,
      explanation: `${groups.join(" + ")} = ${correct} total blocks!`
    });
  }
  return out;
}

const MIRROR_FLIP_PAIRS = { b: "d", d: "b", p: "q", q: "p", "2": "backwards 2", "3": "backwards 3", "5": "backwards 5", "7": "backwards 7" };
const MIRROR_SAME_LETTERS = ["A", "H", "I", "M", "O", "T", "U", "V", "W", "X", "Y"];

function generateMirrorQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const useFlip = Math.random() < 0.6;
    if (useFlip) {
      const keys = Object.keys(MIRROR_FLIP_PAIRS);
      const letter = pgPick(keys);
      const correct = MIRROR_FLIP_PAIRS[letter];
      const distractorPool = [...new Set(Object.values(MIRROR_FLIP_PAIRS))].filter(v => v !== correct);
      const distractors = pgPickN(distractorPool, 3);
      const options = pgShuffle([correct, ...distractors]).map(t => ({ text: t, icon: "🪞" }));
      const correctIndex = options.findIndex(o => o.text === correct);
      out.push({
        id: `gen_mirror_flip_${i}_${letter}_${Math.random()}`,
        category: "spatial_folding",
        standard: "Spatial - Mirror Reflection of Letters/Numbers",
        difficulty: 3,
        prompt: `If you look at "${letter}" in a mirror, what does its reflection look like?`,
        visualType: "mirror",
        visualData: { original: letter },
        options,
        correctIndex,
        hint: `A mirror flips things left-to-right (horizontally).`,
        explanation: `A mirror flips "${letter}" horizontally, so it looks like "${correct}"!`
      });
    } else {
      const letter = pgPick(MIRROR_SAME_LETTERS);
      const wrongLetter = pgPick(MIRROR_SAME_LETTERS.filter(l => l !== letter));
      const options = pgShuffle([
        { text: `Looks exactly the same (${letter})`, correct: true },
        { text: `Looks backwards`, correct: false },
        { text: `Looks like "${wrongLetter}"`, correct: false },
        { text: `Disappears completely`, correct: false }
      ]);
      const correctIndex = options.findIndex(o => o.correct);
      out.push({
        id: `gen_mirror_same_${i}_${letter}_${Math.random()}`,
        category: "spatial_folding",
        standard: "Spatial - Line of Symmetry Recognition",
        difficulty: 3,
        prompt: `If you look at the letter "${letter}" in a mirror, what happens to it?`,
        visualType: "mirror",
        visualData: { original: letter },
        options: options.map(o => ({ text: o.text, icon: "🪞" })),
        correctIndex,
        hint: `Some letters have a line of symmetry straight down the middle, so they look the same flipped!`,
        explanation: `"${letter}" has a line of symmetry, so its mirror reflection looks exactly the same!`
      });
    }
  }
  return out;
}

function generateRotationQuestions(count) {
  const directions = [
    { name: "Up", icon: "⬆️" }, { name: "Right", icon: "➡️" },
    { name: "Down", icon: "⬇️" }, { name: "Left", icon: "⬅️" }
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const startIdx = pgRandInt(0, 3);
    const turns = pgRandInt(1, 3);
    const endIdx = (startIdx + turns) % 4;
    const steps = [directions[startIdx].name + " " + directions[startIdx].icon];
    for (let t = 1; t <= turns; t++) {
      steps.push(directions[(startIdx + t) % 4].name + " " + directions[(startIdx + t) % 4].icon);
    }
    const shown = steps.slice(0, -1);
    const correct = directions[endIdx];
    const distractors = directions.filter(d => d.name !== correct.name);
    const options = pgShuffle([correct, ...distractors]).map(d => ({ text: d.name, icon: d.icon }));
    const correctIndex = options.findIndex(o => o.text === correct.name);
    out.push({
      id: `gen_rotate_${i}_${startIdx}_${turns}_${Math.random()}`,
      category: "spatial_folding",
      standard: "NNAT3 - Clockwise Rotation Sequence",
      difficulty: turns >= 2 ? 3 : 2,
      prompt: `An arrow rotates clockwise a quarter turn each step: ${shown.join(", ")}, ___? Where will it point next?`,
      visualType: "rotation_sequence",
      visualData: { steps: [...shown, "❓"] },
      options,
      correctIndex,
      hint: `Follow the clock direction: Up ➔ Right ➔ Down ➔ Left ➔ Up...`,
      explanation: `Rotating clockwise from ${shown[shown.length - 1]}, the arrow now points ${correct.name}!`
    });
  }
  return out;
}

// ==========================================
// DEDUCTIVE LOGIC MYSTERY GENERATORS (logic_mysteries)
// ==========================================
const KID_NAME_POOL = ["Lily", "Noah", "Maya", "Sam", "Mia", "Theo", "Ana", "Ben", "Cora", "Dez", "Zoe", "Kai", "Wren", "Ivy", "Leo", "Nora", "Eli", "Ruby", "Max", "Grace", "Owen", "Luna", "Jax", "Ellie", "Finn", "Aria", "Milo", "Vera", "Rex", "Nia", "Hank", "Piper", "Cruz", "Skye", "Beau"];
const LOGIC_ITEM_SETS = [
  { category: "pets", items: [{ name: "Cat", icon: "🐱" }, { name: "Dog", icon: "🐶" }, { name: "Bunny", icon: "🐰" }] },
  { category: "fruits", items: [{ name: "Apple", icon: "🍎" }, { name: "Banana", icon: "🍌" }, { name: "Grape", icon: "🍇" }] },
  { category: "colors", items: [{ name: "Red", icon: "🔴" }, { name: "Blue", icon: "🔵" }, { name: "Green", icon: "🟢" }] },
  { category: "shapes", items: [{ name: "Circle", icon: "⭕" }, { name: "Square", icon: "🟩" }, { name: "Triangle", icon: "🔺" }] },
  { category: "sports", items: [{ name: "Soccer", icon: "⚽" }, { name: "Swimming", icon: "🏊" }, { name: "Dancing", icon: "💃" }] },
  { category: "ice cream flavors", items: [{ name: "Chocolate", icon: "🍫" }, { name: "Vanilla", icon: "🍦" }, { name: "Strawberry", icon: "🍓" }] },
  { category: "backpacks", items: [{ name: "Pink", icon: "🎒" }, { name: "Purple", icon: "🎒" }, { name: "Yellow", icon: "🎒" }] },
  { category: "vehicles", items: [{ name: "Car", icon: "🚗" }, { name: "Bike", icon: "🚲" }, { name: "Boat", icon: "⛵" }] },
  { category: "hats", items: [{ name: "Cap", icon: "🧢" }, { name: "Crown", icon: "👑" }, { name: "Top Hat", icon: "🎩" }] },
  { category: "musical instruments", items: [{ name: "Piano", icon: "🎹" }, { name: "Guitar", icon: "🎸" }, { name: "Drum", icon: "🥁" }] },
  { category: "school supplies", items: [{ name: "Pencil", icon: "✏️" }, { name: "Crayon", icon: "🖍️" }, { name: "Scissors", icon: "✂️" }] },
  { category: "weather", items: [{ name: "Sunny", icon: "☀️" }, { name: "Rainy", icon: "🌧️" }, { name: "Snowy", icon: "❄️" }] }
];

function generateLogicGridQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const names = pgPickN(KID_NAME_POOL, 3);
    const itemSet = pgPick(LOGIC_ITEM_SETS);
    const items = pgShuffle(itemSet.items);
    const [personA, personB, personC] = names; // A = target, B = other1, C = other2
    const [itemA, itemB, itemC] = items;

    const clue1 = `${personA} does NOT have the ${itemC.name}.`;
    const clue2 = `${personB} has the ${itemB.name}.`;
    const extraItemPool = LOGIC_ITEM_SETS.filter(s => s.category !== itemSet.category).flatMap(s => s.items);
    const extraDistractor = pgPick(extraItemPool);

    const optionDefs = pgShuffle([
      { text: itemA.name, icon: itemA.icon, correct: true },
      { text: itemB.name, icon: itemB.icon, correct: false },
      { text: itemC.name, icon: itemC.icon, correct: false },
      { text: extraDistractor.name, icon: extraDistractor.icon, correct: false }
    ]);
    const correctIndex = optionDefs.findIndex(o => o.correct);

    out.push({
      id: `gen_logicgrid_${i}_${personA}_${itemA.name}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - Elimination Logic Grid Mystery",
      difficulty: pgRandInt(2, 3),
      prompt: `${personA}, ${personB}, and ${personC} each have a different ${itemSet.category.slice(0, -1)}: ${items.map(it => it.name).join(", ")}.\n• Clue 1: ${clue1}\n• Clue 2: ${clue2}\nWhat does ${personA} have?`,
      visualType: "logic_grid",
      visualData: { people: [personA, personB, personC], items: items.map(it => it.name) },
      options: optionDefs.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `${personB} has the ${itemB.name}. ${personA} doesn't have the ${itemC.name}, so ${personA} must have the...?`,
      explanation: `${personB} has the ${itemB.name}. Since ${personA} can't have the ${itemC.name}, ${personA} must have the ${itemA.name} (and ${personC} has the ${itemC.name})!`
    });
  }
  return out;
}

function generateOrderSequenceQuestions(count) {
  const raceThemes = [
    { verb: "finished the race", place: "place" },
    { verb: "arrived at school", place: "position" },
    { verb: "finished eating lunch", place: "order" }
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const n = pgRandInt(3, 4);
    const names = pgPickN(KID_NAME_POOL, n);
    const theme = pgPick(raceThemes);
    const ordinalWords = ["1st", "2nd", "3rd", "4th"];
    const clueLines = [];
    for (let k = 0; k < n - 1; k++) {
      clueLines.push(`${names[k]} ${theme.verb} before ${names[k + 1]}.`);
    }
    const askIdx = pgRandInt(0, n - 1);
    const correctName = names[askIdx];
    const distractors = names.filter(nm => nm !== correctName);
    const options = pgShuffle([correctName, ...distractors]).map(nm => ({ text: nm, icon: "🏁" }));
    const correctIndex = options.findIndex(o => o.text === correctName);

    out.push({
      id: `gen_order_${i}_${names.join("_")}_${askIdx}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - Sequential Ordering Clues",
      difficulty: n === 4 ? 3 : 2,
      prompt: `${n} friends ${theme.verb}: ${names.join(", ")}.\n${clueLines.map((l, idx) => `• Clue ${idx + 1}: ${l}`).join("\n")}\nWho was in ${ordinalWords[askIdx]} place?`,
      visualType: "race_order",
      visualData: { runners: names.map((nm, idx) => `${nm} (${ordinalWords[idx]})`) },
      options,
      correctIndex,
      hint: `Follow the clues in order to line everyone up from first to last.`,
      explanation: `Putting the clues together in order: ${names.join(" ➔ ")}. So ${ordinalWords[askIdx]} place is ${correctName}!`
    });
  }
  return out;
}

const COMPARE_OBJECT_SETS = [
  { objects: [{ name: "Elephant", icon: "🐘" }, { name: "Giraffe", icon: "🦒" }, { name: "Mouse", icon: "🐭" }], attribute: "heavy" },
  { objects: [{ name: "Watermelon", icon: "🍉" }, { name: "Apple", icon: "🍎" }, { name: "Grape", icon: "🍇" }], attribute: "heavy" },
  { objects: [{ name: "Skyscraper", icon: "🏙️" }, { name: "House", icon: "🏠" }, { name: "Doghouse", icon: "🐕‍🦺" }], attribute: "tall" },
  { objects: [{ name: "Giraffe", icon: "🦒" }, { name: "Horse", icon: "🐴" }, { name: "Rabbit", icon: "🐇" }], attribute: "tall" },
  { objects: [{ name: "Truck", icon: "🚚" }, { name: "Bicycle", icon: "🚲" }, { name: "Skateboard", icon: "🛹" }], attribute: "heavy" },
  { objects: [{ name: "Mountain", icon: "⛰️" }, { name: "Hill", icon: "🌄" }, { name: "Anthill", icon: "🐜" }], attribute: "tall" },
  { objects: [{ name: "Whale", icon: "🐋" }, { name: "Shark", icon: "🦈" }, { name: "Goldfish", icon: "🐠" }], attribute: "heavy" },
  { objects: [{ name: "Adult", icon: "🧑" }, { name: "Child", icon: "🧒" }, { name: "Baby", icon: "👶" }], attribute: "tall" },
  { objects: [{ name: "Bus", icon: "🚌" }, { name: "Car", icon: "🚗" }, { name: "Scooter", icon: "🛴️" }], attribute: "heavy" },
  { objects: [{ name: "Redwood Tree", icon: "🌲" }, { name: "Bush", icon: "🌳" }, { name: "Flower", icon: "🌷" }], attribute: "tall" }
];

function generateComparativeOrderQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const set = pgPick(COMPARE_OBJECT_SETS);
    // Objects are listed most-to-least in real life; NEVER shuffle this real-world fact order.
    const order = set.objects;
    const clueLines = [];
    for (let k = 0; k < order.length - 1; k++) {
      clueLines.push(`The ${order[k].name} is ${set.attribute === "heavy" ? "heavier" : "taller"} than the ${order[k + 1].name}.`);
    }
    const askMost = Math.random() < 0.5;
    const correctObj = askMost ? order[0] : order[order.length - 1];
    const distractors = order.filter(o => o.name !== correctObj.name);
    const options = pgShuffle([correctObj, ...distractors]).map(o => ({ text: o.name, icon: o.icon }));
    const correctIndex = options.findIndex(o => o.text === correctObj.name);
    const questionWord = set.attribute === "heavy" ? (askMost ? "HEAVIEST" : "LIGHTEST") : (askMost ? "TALLEST" : "SHORTEST");

    out.push({
      id: `gen_compare_${i}_${order.map(o => o.name).join("_")}_${askMost}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - Comparative Attribute Ordering",
      difficulty: 3,
      prompt: `Look at the clues:\n${clueLines.map((l, idx) => `• Clue ${idx + 1}: ${l}`).join("\n")}\nWhich one is the ${questionWord}?`,
      visualType: "height_order",
      visualData: { animals: order.map(o => o.name) },
      options,
      correctIndex,
      hint: `Line them up in order from most to least: ${order.map(o => o.name).join(" > ")}.`,
      explanation: `In order: ${order.map(o => o.name).join(" > ")}. The ${questionWord.toLowerCase()} is the ${correctObj.name}!`
    });
  }
  return out;
}

// ==========================================
// SCIENCE EXPLORER GENERATORS (science_inquiry)
// ==========================================
const LIVING_POOL = [
  { name: "Tree", icon: "🌳" }, { name: "Dog", icon: "🐶" }, { name: "Flower", icon: "🌷" }, { name: "Fish", icon: "🐟" },
  { name: "Bird", icon: "🐦" }, { name: "Butterfly", icon: "🦋" }, { name: "Grass", icon: "🌱" }, { name: "Cat", icon: "🐱" },
  { name: "Mushroom", icon: "🍄" }, { name: "Turtle", icon: "🐢" }, { name: "Spider", icon: "🕷️" }, { name: "Snail", icon: "🐌" },
  { name: "Ant", icon: "🐜" }, { name: "Frog", icon: "🐸" }, { name: "Bee", icon: "🐝" }, { name: "Squirrel", icon: "🐿️" },
  { name: "Cactus", icon: "🌵" }, { name: "Mouse", icon: "🐭" }
];
const NONLIVING_POOL = [
  { name: "Rock", icon: "🪨" }, { name: "Chair", icon: "🪑" }, { name: "Car", icon: "🚗" }, { name: "Cup", icon: "🥤" },
  { name: "Pencil", icon: "✏️" }, { name: "Cloud", icon: "☁️" }, { name: "Computer", icon: "💻" }, { name: "Ball", icon: "⚽" },
  { name: "Table", icon: "🪵" }, { name: "Book", icon: "📖" }, { name: "Balloon", icon: "🎈" }, { name: "Umbrella", icon: "☂️" },
  { name: "Bicycle", icon: "🚲" }, { name: "Backpack", icon: "🎒" }, { name: "Lamp", icon: "💡" }, { name: "Key", icon: "🔑" },
  { name: "Teddy Bear", icon: "🧸" }, { name: "Clock", icon: "🕐" }
];

function generateLivingNonlivingQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const askLiving = Math.random() < 0.5;
    if (askLiving) {
      const correct = pgPick(LIVING_POOL);
      const distractors = pgPickN(NONLIVING_POOL, 3);
      const options = pgShuffle([correct, ...distractors]).map(o => ({ text: o.name, icon: o.icon }));
      const correctIndex = options.findIndex(o => o.text === correct.name);
      out.push({
        id: `gen_living_${i}_${correct.name}_${Math.random()}`,
        category: "science_inquiry",
        standard: "VA SOL 1.1 - Classifying Living vs Non-Living",
        difficulty: 1,
        prompt: `Which of these is a LIVING thing?`,
        visualType: "classification",
        visualData: { shapes: options.map(o => o.text) },
        options,
        correctIndex,
        hint: `Living things grow, need food/water, and can reproduce.`,
        explanation: `A ${correct.name} is alive - it grows and needs food or water! The others are non-living.`
      });
    } else {
      const correct = pgPick(NONLIVING_POOL);
      const distractors = pgPickN(LIVING_POOL, 3);
      const options = pgShuffle([correct, ...distractors]).map(o => ({ text: o.name, icon: o.icon }));
      const correctIndex = options.findIndex(o => o.text === correct.name);
      out.push({
        id: `gen_nonliving_${i}_${correct.name}_${Math.random()}`,
        category: "science_inquiry",
        standard: "VA SOL 1.1 - Classifying Living vs Non-Living",
        difficulty: 1,
        prompt: `Which of these is NOT a living thing?`,
        visualType: "classification",
        visualData: { shapes: options.map(o => o.text) },
        options,
        correctIndex,
        hint: `Non-living things don't grow, eat, or reproduce on their own.`,
        explanation: `A ${correct.name} is non-living - it doesn't grow or need food! The others are alive.`
      });
    }
  }
  return out;
}

const MATTER_POOL = [
  { name: "Milk", icon: "🥛", state: "liquid" }, { name: "Juice", icon: "🧃", state: "liquid" }, { name: "Water", icon: "💧", state: "liquid" },
  { name: "Soup", icon: "🍲", state: "liquid" }, { name: "Honey", icon: "🍯", state: "liquid" },
  { name: "Rock", icon: "🪨", state: "solid" }, { name: "Ice Cube", icon: "🧊", state: "solid" }, { name: "Wooden Block", icon: "🪵", state: "solid" }, { name: "Book", icon: "📖", state: "solid" },
  { name: "Chair", icon: "🪑", state: "solid" }, { name: "Apple", icon: "🍎", state: "solid" },
  { name: "Steam", icon: "💨", state: "gas" }, { name: "Air in a Balloon", icon: "🎈", state: "gas" }, { name: "Bubbles", icon: "🫧", state: "gas" },
  { name: "Smoke", icon: "💨", state: "gas" }, { name: "Helium in a Party Balloon", icon: "🎈", state: "gas" }
];

function generateStateOfMatterQuestions(count) {
  const out = [];
  const states = ["solid", "liquid", "gas"];
  for (let i = 0; i < count; i++) {
    const targetState = pgPick(states);
    const candidates = MATTER_POOL.filter(m => m.state === targetState);
    const correct = pgPick(candidates);
    const others = MATTER_POOL.filter(m => m.state !== targetState);
    const distractors = pgPickN(others, 3);
    const options = pgShuffle([correct, ...distractors]).map(o => ({ text: o.name, icon: o.icon }));
    const correctIndex = options.findIndex(o => o.text === correct.name);
    out.push({
      id: `gen_matter_${i}_${targetState}_${correct.name}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.7 - Solid, Liquid & Gas Sorting",
      difficulty: 2,
      prompt: `Which of these is an example of a ${targetState.toUpperCase()}?`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: targetState === "liquid" ? "Liquids flow and pour, taking the shape of their container." : targetState === "solid" ? "Solids keep their own shape and don't flow." : "Gases spread out and can't be held in your hand.",
      explanation: `${correct.name} is a ${targetState}!`
    });
  }
  return out;
}

const LIFE_CYCLES = [
  { animal: "Butterfly", stages: [{ name: "Egg", icon: "🥚" }, { name: "Caterpillar", icon: "🐛" }, { name: "Chrysalis", icon: "🛖" }, { name: "Butterfly", icon: "🦋" }] },
  { animal: "Frog", stages: [{ name: "Egg", icon: "🥚" }, { name: "Tadpole", icon: "🐟" }, { name: "Froglet", icon: "🐸" }, { name: "Frog", icon: "🐸" }] },
  { animal: "Chicken", stages: [{ name: "Egg", icon: "🥚" }, { name: "Chick", icon: "🐣" }, { name: "Young Hen/Rooster", icon: "🐓" }, { name: "Adult Chicken", icon: "🐔" }] },
  { animal: "Ladybug", stages: [{ name: "Egg", icon: "🥚" }, { name: "Larva", icon: "🐛" }, { name: "Pupa", icon: "🛖" }, { name: "Ladybug", icon: "🐞" }] },
  { animal: "Plant", stages: [{ name: "Seed", icon: "🌰" }, { name: "Sprout", icon: "🌱" }, { name: "Seedling", icon: "🌿" }, { name: "Full Grown Plant", icon: "🌳" }] },
  { animal: "Bee", stages: [{ name: "Egg", icon: "🥚" }, { name: "Larva", icon: "🐛" }, { name: "Pupa", icon: "🛖" }, { name: "Bee", icon: "🐝" }] },
  { animal: "Ant", stages: [{ name: "Egg", icon: "🥚" }, { name: "Larva", icon: "🐛" }, { name: "Pupa", icon: "🛖" }, { name: "Ant", icon: "🐜" }] }
];

function generateLifeCycleQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const cycle = pgPick(LIFE_CYCLES);
    const correctOrder = cycle.stages.map(s => s.name);
    const correctText = correctOrder.map((s, idx) => `${idx + 1}. ${s}`).join(" ➔ ");
    const wrongOrders = new Set();
    let guard = 0;
    while (wrongOrders.size < 3 && guard < 30) {
      guard++;
      const shuffled = pgShuffle(correctOrder);
      const text = shuffled.map((s, idx) => `${idx + 1}. ${s}`).join(" ➔ ");
      if (text !== correctText) wrongOrders.add(text);
    }
    const optionTexts = pgShuffle([correctText, ...wrongOrders]);
    const options = optionTexts.map(t => ({ text: t, icon: "🔄" }));
    const correctIndex = options.findIndex(o => o.text === correctText);
    out.push({
      id: `gen_lifecycle_${i}_${cycle.animal}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.4 - Animal & Plant Life Cycle Sequencing",
      difficulty: 3,
      prompt: `Put the ${cycle.animal.toLowerCase()} life cycle stages in the correct order:`,
      visualType: "life_cycle",
      visualData: { stages: correctOrder },
      options,
      correctIndex,
      hint: `Think about how a ${cycle.animal.toLowerCase()} starts as a ${correctOrder[0].toLowerCase()} and grows step by step.`,
      explanation: `The correct order is: ${correctText}!`
    });
  }
  return out;
}

const ANIMAL_NEEDS_POOL = ["Dog", "Cat", "Bird", "Fish", "Rabbit", "Hamster", "Horse", "Cow", "Turtle", "Duck", "Sheep", "Goat", "Pig", "Chicken"];
const SILLY_NEED_DISTRACTORS = [
  "Only Toys and Video Games", "Only Sunlight and No Food", "Nothing At All", "Only Music and Candy",
  "Only Ice and Snow", "Only Bright Lights"
];

function generateAnimalNeedsQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const animal = pgPick(ANIMAL_NEEDS_POOL);
    const distractors = pgPickN(SILLY_NEED_DISTRACTORS, 3);
    const options = pgShuffle(["Food, Water, and Shelter", ...distractors]).map(t => ({ text: t, icon: t === "Food, Water, and Shelter" ? "🍖💧🏠" : "❌" }));
    const correctIndex = options.findIndex(o => o.text === "Food, Water, and Shelter");
    out.push({
      id: `gen_needs_${i}_${animal}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.4 - Animal Needs for Survival",
      difficulty: 1,
      prompt: `What does a ${animal.toLowerCase()} need to stay healthy and alive?`,
      visualType: "plant_needs",
      visualData: { plant: animal },
      options,
      correctIndex,
      hint: `Just like people, animals need food to eat, water to drink, and a safe place to live.`,
      explanation: `${animal}s (and all animals) need food, water, and shelter to survive and stay healthy!`
    });
  }
  return out;
}

const SEASON_POOL = [
  { name: "Winter", correct: "Snow falls and it feels very cold", icon: "❄️", wrong: ["Flowers bloom everywhere", "It is always hot and sunny", "Leaves turn orange and fall"] },
  { name: "Summer", correct: "It feels hot and sunny", icon: "☀️", wrong: ["Snow covers the ground", "Leaves fall off the trees", "It is freezing cold"] },
  { name: "Fall (Autumn)", correct: "Leaves turn orange and fall off trees", icon: "🍂", wrong: ["Flowers bloom in spring colors", "Snowmen are built everywhere", "It is the hottest time of year"] },
  { name: "Spring", correct: "Flowers bloom and baby animals are born", icon: "🌷", wrong: ["Snow covers everything", "Leaves turn brown and fall", "It is the coldest season"] }
];

function generateSeasonQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const season = pgPick(SEASON_POOL);
    const options = pgShuffle([season.correct, ...season.wrong]).map(t => ({ text: t, icon: season.icon }));
    const correctIndex = options.findIndex(o => o.text === season.correct);
    out.push({
      id: `gen_season_${i}_${season.name}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.6 - Seasonal Weather Patterns",
      difficulty: 2,
      prompt: `What usually happens during ${season.name}?`,
      visualType: "shadow_science",
      visualData: { sunPosition: season.name },
      options,
      correctIndex,
      hint: `Think about the weather and what you see outside during ${season.name.toLowerCase()}.`,
      explanation: `During ${season.name}, ${season.correct.toLowerCase()}!`
    });
  }
  return out;
}

const SINK_FLOAT_POOL = [
  { name: "Metal Spoon", icon: "🥄", sinks: true }, { name: "Rubber Duck", icon: "🦆", sinks: false },
  { name: "Rock", icon: "🪨", sinks: true }, { name: "Wooden Block", icon: "🪵", sinks: false },
  { name: "Coin", icon: "🪙", sinks: true }, { name: "Leaf", icon: "🍃", sinks: false },
  { name: "Feather", icon: "🪶", sinks: false }, { name: "Key", icon: "🔑", sinks: true },
  { name: "Balloon (air-filled)", icon: "🎈", sinks: false }, { name: "Marble", icon: "⚪", sinks: true },
  { name: "Plastic Toy Boat", icon: "🚤", sinks: false }, { name: "Ice Cube", icon: "🧊", sinks: false },
  { name: "Paperclip", icon: "📎", sinks: true }, { name: "Cotton Ball", icon: "☁️", sinks: false },
  { name: "Brick", icon: "🧱", sinks: true }, { name: "Golf Ball", icon: "⚪", sinks: true }
];

function generateSinkFloatQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const item = pgPick(SINK_FLOAT_POOL);
    const correctText = item.sinks ? `${item.name} SINKS (it is denser/heavier than water)` : `${item.name} FLOATS (it is less dense/lighter than water)`;
    const wrongText = item.sinks ? `${item.name} FLOATS (it is less dense than water)` : `${item.name} SINKS (it is denser than water)`;
    const options = pgShuffle([
      { text: correctText, correct: true },
      { text: wrongText, correct: false },
      { text: `${item.name} disappears in water`, correct: false },
      { text: `${item.name} turns to ice`, correct: false }
    ]);
    const correctIndex = options.findIndex(o => o.correct);
    out.push({
      id: `gen_sinkfloat_${i}_${item.name}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.7 - Sink or Float Prediction",
      difficulty: 2,
      prompt: `Lily drops a ${item.name.toLowerCase()} into a tub of water. What happens?`,
      visualType: "sink_float",
      visualData: { objects: [item.name] },
      options: options.map(o => ({ text: o.text, icon: item.icon })),
      correctIndex,
      hint: `Think about whether this object is heavy and dense, or light for its size.`,
      explanation: `${correctText}!`
    });
  }
  return out;
}

// ==========================================
// MASTER GENERATOR - assembles a huge, freshly-randomized question set every load
// ==========================================
function generateAllProceduralQuestions() {
  return [
    // Math (huge combinatorial fact space)
    ...generateAdditionFacts(90),
    ...generateSubtractionFacts(90),
    ...generateDoublesFacts(10),
    ...generateNearDoublesFacts(9),
    ...generateMissingAddendWordProblems(40),
    ...generateTwoDigitAddition(40),
    ...generateSkipCountingFacts(60),
    ...generateComparisonFacts(60),
    ...generateThreeNumberOrdering(40),
    ...generateOrdinalFacts(10),
    ...generateTimeTellingFacts(24),
    ...generateMoneyFacts(50),
    ...generatePlaceValueFacts(50),
    ...generateBalanceFacts(60),

    // Verbal
    ...generateVerbalAnalogies(VERBAL_ANALOGY_POOL.length),
    ...generateRiddleQuestions(RIDDLE_POOL.length),
    ...generateRhymeQuestions(RHYME_FAMILY_POOL.length),

    // Matrix / Nonverbal Reasoning
    ...generateColorCycleQuestions(50),
    ...generateSizeCycleQuestions(20),
    ...generateOddOneOutQuestions(50),
    ...generateSidesAnalogyQuestions(30),
    ...generateGrowingDotsQuestions(40),
    ...generateMatrix2x2Questions(60),

    // Spatial & Visual
    ...generatePaperFoldQuestions(40),
    ...generateBlockCountQuestions(50),
    ...generateMirrorQuestions(40),
    ...generateRotationQuestions(40),

    // Deductive Logic Mysteries
    ...generateLogicGridQuestions(60),
    ...generateOrderSequenceQuestions(50),
    ...generateComparativeOrderQuestions(40),

    // Science Explorer
    ...generateLivingNonlivingQuestions(40),
    ...generateStateOfMatterQuestions(40),
    ...generateLifeCycleQuestions(28),
    ...generateAnimalNeedsQuestions(28),
    ...generateSeasonQuestions(15),
    ...generateSinkFloatQuestions(32)
  ];
}

