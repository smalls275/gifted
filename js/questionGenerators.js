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
// CogAT QUANTITATIVE & EXTRA MATH GENERATORS (math_logic)
// ==========================================

function generateNumberSeriesQuestions(count) {
  const rules = [
    { step: 1, desc: "counts up by 1" }, { step: 2, desc: "counts up by 2" },
    { step: 3, desc: "counts up by 3" }, { step: -1, desc: "counts DOWN by 1" },
    { step: -2, desc: "counts DOWN by 2" }, { step: 10, desc: "counts up by 10" },
    { step: -10, desc: "counts DOWN by 10" }
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const rule = pgPick(rules);
    const start = rule.step > 0 ? pgRandInt(1, 40) : pgRandInt(Math.abs(rule.step) * 4 + 2, 60);
    const seq = Array.from({ length: 4 }, (_, k) => start + rule.step * k);
    const correct = start + rule.step * 4;
    const { options, correctIndex } = pgBuildNumberOptions(correct, Math.max(0, correct - 15), correct + 15);
    out.push({
      id: `gen_numseries_${i}_${start}_${rule.step}_${Math.random()}`,
      category: "math_logic",
      standard: "CogAT Quant - Number Series",
      difficulty: Math.abs(rule.step) === 1 ? 1 : rule.step < 0 ? 3 : 2,
      prompt: `Find the pattern: ${seq.join(", ")}, ___? What number comes next?`,
      visualType: "math_expression",
      visualData: { items: [...seq.map(String), "?"] },
      options,
      correctIndex,
      hint: `Check how the numbers change each step - this pattern ${rule.desc}!`,
      explanation: `The pattern ${rule.desc}: ${seq[3]} ${rule.step > 0 ? "+" : "-"} ${Math.abs(rule.step)} = ${correct}!`
    });
  }
  return out;
}

function generateNumberAnalogyQuestions(count) {
  const rules = [
    ...Array.from({ length: 5 }, (_, k) => ({ apply: n => n + k + 1, desc: `adds ${k + 1}` })),
    { apply: n => n * 2, desc: "doubles the number" },
    ...Array.from({ length: 3 }, (_, k) => ({ apply: n => n - (k + 1), desc: `takes away ${k + 1}` }))
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const rule = pgPick(rules);
    const inputs = pgShuffle(Array.from({ length: 10 }, (_, k) => k + 3)).slice(0, 3);
    const pairs = inputs.map(n => [n, rule.apply(n)]);
    if (pairs.some(p => p[1] < 0 || p[1] > 30)) { i--; continue; }
    const correct = pairs[2][1];
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 30);
    out.push({
      id: `gen_numanalogy_${i}_${inputs.join("_")}_${Math.random()}`,
      category: "math_logic",
      standard: "CogAT Quant - Number Analogies",
      difficulty: rule.desc.includes("double") ? 3 : 2,
      prompt: `The magic number machine uses one secret rule: [ ${pairs[0][0]} ➔ ${pairs[0][1]} ], [ ${pairs[1][0]} ➔ ${pairs[1][1]} ], [ ${pairs[2][0]} ➔ ? ]. What comes out?`,
      visualType: "number_machine",
      visualData: { rule: rule.desc },
      options,
      correctIndex,
      hint: `What did the machine do to turn ${pairs[0][0]} into ${pairs[0][1]}? It ${rule.desc}! Now do the same to ${pairs[2][0]}.`,
      explanation: `The machine ${rule.desc} every time, so ${pairs[2][0]} becomes ${correct}!`
    });
  }
  return out;
}

function generateEvenOddQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const askEven = Math.random() < 0.5;
    const correct = askEven ? pgRandInt(1, 10) * 2 : pgRandInt(0, 9) * 2 + 1;
    const wrongs = new Set();
    while (wrongs.size < 3) {
      const w = askEven ? pgRandInt(0, 9) * 2 + 1 : pgRandInt(1, 10) * 2;
      wrongs.add(w);
    }
    const values = pgShuffle([correct, ...wrongs]);
    const options = values.map(v => ({ text: String(v), icon: "🔢" }));
    const correctIndex = values.indexOf(correct);
    out.push({
      id: `gen_evenodd_${i}_${correct}_${askEven}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.2 - Even and Odd Numbers",
      difficulty: 2,
      prompt: `Which of these numbers is ${askEven ? "EVEN (can be split into 2 equal teams)" : "ODD (always has 1 left over when making pairs)"}?`,
      visualType: "math_expression",
      visualData: { items: values.map(String) },
      options,
      correctIndex,
      hint: askEven ? `Even numbers end in 0, 2, 4, 6, or 8.` : `Odd numbers end in 1, 3, 5, 7, or 9.`,
      explanation: `${correct} is ${askEven ? "even - it can be split into two equal groups" : "odd - making pairs always leaves 1 extra"}!`
    });
  }
  return out;
}

function generateTenMoreLessQuestions(count) {
  const modes = [
    { delta: 10, label: "10 MORE than" }, { delta: -10, label: "10 LESS than" },
    { delta: 1, label: "1 MORE than" }, { delta: -1, label: "1 LESS than" }
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const mode = pgPick(modes);
    const base = pgRandInt(Math.abs(Math.min(mode.delta, 0)) + 2, 89);
    const correct = base + mode.delta;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 0, 110);
    out.push({
      id: `gen_tenmore_${i}_${base}_${mode.delta}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.1 - Ten More / Ten Less Mental Math",
      difficulty: Math.abs(mode.delta) === 10 ? 3 : 1,
      prompt: `Quick brain math: What number is ${mode.label} ${base}?`,
      visualType: "math_expression",
      visualData: { items: [String(base), mode.delta > 0 ? "+" : "-", String(Math.abs(mode.delta)), "=", "?"] },
      options,
      correctIndex,
      hint: Math.abs(mode.delta) === 10 ? `Only the TENS digit changes - the ones digit stays the same!` : `Count ${mode.delta > 0 ? "up" : "back"} just one number from ${base}.`,
      explanation: `${base} ${mode.delta > 0 ? "+" : "-"} ${Math.abs(mode.delta)} = ${correct}!`
    });
  }
  return out;
}

function generateFactFamilyQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = pgRandInt(2, 9);
    const b = pgRandInt(2, 9);
    const c = a + b;
    const correct = `${c} - ${b} = ${a}`;
    const wrongs = [
      `${c} + ${b} = ${a}`,
      `${a} - ${b} = ${c}`,
      `${c} - ${a + 1} = ${b}`
    ];
    const options = pgShuffle([correct, ...wrongs]).map(t => ({ text: t, icon: "👨‍👩‍👧" }));
    const correctIndex = options.findIndex(o => o.text === correct);
    out.push({
      id: `gen_factfam_${i}_${a}_${b}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.7 - Fact Families (Related Facts)",
      difficulty: 3,
      prompt: `The numbers ${a}, ${b}, and ${c} are a fact family, like ${a} + ${b} = ${c}. Which other fact belongs to the SAME family?`,
      visualType: "math_expression",
      visualData: { items: [`${a} + ${b} = ${c}`, "and...?"] },
      options,
      correctIndex,
      hint: `Fact family members use ONLY the numbers ${a}, ${b}, and ${c} - and the subtraction facts start with the biggest number, ${c}.`,
      explanation: `${correct} uses the same three numbers, so it's in the family with ${a} + ${b} = ${c}!`
    });
  }
  return out;
}

const FRACTION_FOODS = [
  { name: "pizza", icon: "🍕" }, { name: "sandwich", icon: "🥪" }, { name: "cookie", icon: "🍪" },
  { name: "pancake", icon: "🥞" }, { name: "pie", icon: "🥧" }, { name: "brownie", icon: "🍫" }
];

function generateFractionQuestions(count) {
  const fractionNames = { 2: "One Half (1/2)", 3: "One Third (1/3)", 4: "One Fourth (1/4)" };
  const out = [];
  for (let i = 0; i < count; i++) {
    const parts = pgPick([2, 3, 4]);
    const food = pgPick(FRACTION_FOODS);
    const correct = fractionNames[parts];
    const distractors = Object.values(fractionNames).filter(f => f !== correct);
    distractors.push("One Whole (1)");
    const options = pgShuffle([correct, ...distractors.slice(0, 3)]).map(t => ({ text: t, icon: food.icon }));
    const correctIndex = options.findIndex(o => o.text === correct);
    const partWord = parts === 2 ? "halves" : parts === 3 ? "thirds" : "fourths";
    out.push({
      id: `gen_fraction_${i}_${parts}_${food.name}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.4 - Fractions: Halves, Thirds & Fourths",
      difficulty: parts === 2 ? 2 : 3,
      prompt: `A ${food.name} is cut into ${parts} EQUAL pieces and shared fairly among ${parts} friends. What fraction of the ${food.name} does each friend get?`,
      visualType: "pizza_fraction",
      visualData: { slices: parts, people: parts },
      options,
      correctIndex,
      hint: `When something is split into ${parts} equal pieces, the pieces are called ${partWord}!`,
      explanation: `Split into ${parts} equal parts, each piece is ${correct.toLowerCase()} of the whole ${food.name}!`
    });
  }
  return out;
}

const MEASURE_ITEMS = [
  { name: "crayon", icon: "🖍️" }, { name: "marker", icon: "🖊️" }, { name: "pencil", icon: "✏️" },
  { name: "shoe", icon: "👟" }, { name: "book", icon: "📖" }, { name: "toy car", icon: "🚗" },
  { name: "spoon", icon: "🥄" }, { name: "ribbon", icon: "🎀" }
];

function generateMeasurementQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [itemA, itemB] = pgPickN(MEASURE_ITEMS, 2);
    let lenA = pgRandInt(3, 12);
    let lenB = pgRandInt(3, 12);
    if (lenA === lenB) lenB += pgRandInt(1, 3);
    const askLonger = Math.random() < 0.5;
    const correctItem = askLonger ? (lenA > lenB ? itemA : itemB) : (lenA < lenB ? itemA : itemB);
    const wrongItem = correctItem === itemA ? itemB : itemA;
    const options = pgShuffle([
      { text: `The ${correctItem.name}`, icon: correctItem.icon, isCorrect: true },
      { text: `The ${wrongItem.name}`, icon: wrongItem.icon, isCorrect: false },
      { text: "They are exactly the same", icon: "🟰", isCorrect: false },
      { text: "You cannot measure with paperclips", icon: "❌", isCorrect: false }
    ]);
    const correctIndex = options.findIndex(o => o.isCorrect);
    out.push({
      id: `gen_measure_${i}_${itemA.name}_${lenA}_${lenB}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.10 - Measuring Length with Nonstandard Units",
      difficulty: 2,
      prompt: `Lily measures with paperclips: the ${itemA.name} is ${lenA} paperclips long, and the ${itemB.name} is ${lenB} paperclips long. Which one is ${askLonger ? "LONGER" : "SHORTER"}?`,
      visualType: "math_expression",
      visualData: { items: [`${itemA.icon} ${lenA} 📎`, "vs", `${itemB.icon} ${lenB} 📎`] },
      options: options.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `Compare the numbers: ${lenA} and ${lenB}. ${askLonger ? "More paperclips means longer!" : "Fewer paperclips means shorter!"}`,
      explanation: `The ${correctItem.name} is ${askLonger ? "longer" : "shorter"} because ${askLonger ? Math.max(lenA, lenB) : Math.min(lenA, lenB)} paperclips ${askLonger ? "is more than" : "is less than"} ${askLonger ? Math.min(lenA, lenB) : Math.max(lenA, lenB)}!`
    });
  }
  return out;
}

const GRAPH_THEMES = [
  { title: "favorite pets", items: [{ name: "Dogs", icon: "🐶" }, { name: "Cats", icon: "🐱" }, { name: "Fish", icon: "🐟" }] },
  { title: "favorite fruits", items: [{ name: "Apples", icon: "🍎" }, { name: "Bananas", icon: "🍌" }, { name: "Grapes", icon: "🍇" }] },
  { title: "favorite sports", items: [{ name: "Soccer", icon: "⚽" }, { name: "Basketball", icon: "🏀" }, { name: "Swimming", icon: "🏊" }] },
  { title: "ways kids get to school", items: [{ name: "Bus", icon: "🚌" }, { name: "Car", icon: "🚗" }, { name: "Walking", icon: "🚶" }] },
  { title: "favorite ice cream flavors", items: [{ name: "Chocolate", icon: "🍫" }, { name: "Vanilla", icon: "🍦" }, { name: "Strawberry", icon: "🍓" }] }
];

function generateGraphReadingQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const theme = pgPick(GRAPH_THEMES);
    const counts = pgShuffle([pgRandInt(1, 3), pgRandInt(4, 6), pgRandInt(7, 9)]);
    const rows = theme.items.map((item, k) => ({ ...item, count: counts[k] }));
    const askMost = Math.random() < 0.6;
    const sorted = [...rows].sort((x, y) => y.count - x.count);
    const correctRow = askMost ? sorted[0] : sorted[sorted.length - 1];
    const options = pgShuffle([
      ...rows.map(r => ({ text: `${r.name} (${r.count} votes)`, icon: r.icon, isCorrect: r.name === correctRow.name })),
      { text: "They all tied", icon: "🤝", isCorrect: false }
    ]);
    const correctIndex = options.findIndex(o => o.isCorrect);
    const graphText = rows.map(r => `${r.name}: ${r.icon.repeat(r.count)} (${r.count})`).join("   •   ");
    out.push({
      id: `gen_graph_${i}_${theme.title.replace(/\s/g, "")}_${counts.join("_")}_${Math.random()}`,
      category: "math_logic",
      standard: "VA SOL 1.12 - Reading Picture Graphs",
      difficulty: 2,
      prompt: `The class made a picture graph of ${theme.title}: ${graphText}. Which got the ${askMost ? "MOST" : "FEWEST"} votes?`,
      visualType: "sequence",
      visualData: { items: rows.map(r => `${r.name}: ${r.icon.repeat(r.count)}`) },
      options: options.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `Count the pictures in each row. ${askMost ? "The longest row wins!" : "The shortest row has the fewest!"}`,
      explanation: `${correctRow.name} has ${correctRow.count} votes - the ${askMost ? "most" : "fewest"} of all!`
    });
  }
  return out;
}

const NUMBER_WORDS = [
  [1, "one"], [2, "two"], [3, "three"], [4, "four"], [5, "five"], [6, "six"], [7, "seven"], [8, "eight"],
  [9, "nine"], [10, "ten"], [11, "eleven"], [12, "twelve"], [13, "thirteen"], [14, "fourteen"], [15, "fifteen"],
  [16, "sixteen"], [17, "seventeen"], [18, "eighteen"], [19, "nineteen"], [20, "twenty"],
  [30, "thirty"], [40, "forty"], [50, "fifty"], [60, "sixty"], [70, "seventy"], [80, "eighty"], [90, "ninety"], [100, "one hundred"]
];

function generateNumberWordQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [num, word] = pgPick(NUMBER_WORDS);
    const wordToNum = Math.random() < 0.5;
    const distractorPairs = pgPickN(NUMBER_WORDS.filter(p => p[0] !== num), 3);
    if (wordToNum) {
      const options = pgShuffle([num, ...distractorPairs.map(p => p[0])]).map(n => ({ text: String(n), icon: "🔢" }));
      const correctIndex = options.findIndex(o => o.text === String(num));
      out.push({
        id: `gen_numword_${i}_${num}_w2n_${Math.random()}`,
        category: "math_logic",
        standard: "VA SOL 1.1 - Number Words & Numerals",
        difficulty: num <= 10 ? 1 : 2,
        prompt: `Which numeral matches the number word "${word.toUpperCase()}"?`,
        visualType: "math_expression",
        visualData: { items: [word, "=", "?"] },
        options,
        correctIndex,
        hint: `Count up and spell along until you reach "${word}".`,
        explanation: `The word "${word}" is written as the numeral ${num}!`
      });
    } else {
      const options = pgShuffle([word, ...distractorPairs.map(p => p[1])]).map(w => ({ text: w, icon: "🔤" }));
      const correctIndex = options.findIndex(o => o.text === word);
      out.push({
        id: `gen_numword_${i}_${num}_n2w_${Math.random()}`,
        category: "math_logic",
        standard: "VA SOL 1.1 - Number Words & Numerals",
        difficulty: num <= 10 ? 1 : 2,
        prompt: `How do you write the number ${num} as a word?`,
        visualType: "math_expression",
        visualData: { items: [String(num), "=", "?"] },
        options,
        correctIndex,
        hint: `Say the number out loud: "${word}". Which answer spells that?`,
        explanation: `The number ${num} is written as "${word}"!`
      });
    }
  }
  return out;
}

const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const YEAR_MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function generateCalendarQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const mode = pgPick(["dayAfter", "dayBefore", "monthAfter", "weekCount"]);
    if (mode === "dayAfter" || mode === "dayBefore") {
      const idx = pgRandInt(0, 6);
      const after = mode === "dayAfter";
      const correct = WEEK_DAYS[(idx + (after ? 1 : 6)) % 7];
      const distractors = pgPickN(WEEK_DAYS.filter(d => d !== correct), 3);
      const options = pgShuffle([correct, ...distractors]).map(d => ({ text: d, icon: "📅" }));
      const correctIndex = options.findIndex(o => o.text === correct);
      out.push({
        id: `gen_calendar_${i}_${mode}_${idx}_${Math.random()}`,
        category: "math_logic",
        standard: "VA SOL 1.11 - Calendar: Days of the Week",
        difficulty: after ? 1 : 2,
        prompt: `What day comes right ${after ? "AFTER" : "BEFORE"} ${WEEK_DAYS[idx]}?`,
        visualType: "sequence",
        visualData: { items: after ? [WEEK_DAYS[idx], "❓"] : ["❓", WEEK_DAYS[idx]] },
        options,
        correctIndex,
        hint: `Sing the days in order: ${WEEK_DAYS.join(", ")}...`,
        explanation: `The day ${after ? "after" : "before"} ${WEEK_DAYS[idx]} is ${correct}!`
      });
    } else if (mode === "monthAfter") {
      const idx = pgRandInt(0, 11);
      const correct = YEAR_MONTHS[(idx + 1) % 12];
      const distractors = pgPickN(YEAR_MONTHS.filter(m => m !== correct), 3);
      const options = pgShuffle([correct, ...distractors]).map(m => ({ text: m, icon: "🗓️" }));
      const correctIndex = options.findIndex(o => o.text === correct);
      out.push({
        id: `gen_calendar_${i}_month_${idx}_${Math.random()}`,
        category: "math_logic",
        standard: "VA SOL 1.11 - Calendar: Months of the Year",
        difficulty: 2,
        prompt: `What month comes right after ${YEAR_MONTHS[idx]}?`,
        visualType: "sequence",
        visualData: { items: [YEAR_MONTHS[idx], "❓"] },
        options,
        correctIndex,
        hint: `Say the months in order starting from January until you pass ${YEAR_MONTHS[idx]}.`,
        explanation: `The month after ${YEAR_MONTHS[idx]} is ${correct}!`
      });
    } else {
      const facts = [
        { q: "How many days are in one week?", correct: "7", wrongs: ["5", "10", "12"] },
        { q: "How many months are in one year?", correct: "12", wrongs: ["7", "10", "20"] },
        { q: "How many days of the week start with the letter S?", correct: "2 (Saturday and Sunday)", wrongs: ["1", "3", "0"] },
        { q: "Which days make up the WEEKEND?", correct: "Saturday and Sunday", wrongs: ["Monday and Tuesday", "Wednesday and Thursday", "Friday and Monday"] }
      ];
      const fact = pgPick(facts);
      const options = pgShuffle([fact.correct, ...fact.wrongs]).map(t => ({ text: t, icon: "📅" }));
      const correctIndex = options.findIndex(o => o.text === fact.correct);
      out.push({
        id: `gen_calendar_${i}_fact_${fact.correct}_${Math.random()}`,
        category: "math_logic",
        standard: "VA SOL 1.11 - Calendar Facts",
        difficulty: 1,
        prompt: fact.q,
        visualType: "math_expression",
        visualData: { items: ["📅", "?"] },
        options,
        correctIndex,
        hint: `Picture the calendar hanging on the classroom wall!`,
        explanation: `${fact.q} The answer is ${fact.correct}!`
      });
    }
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
  { pair1: "Baby ➔ Crawl", pair2: "Bird ➔ ?", correct: "Fly", correctIcon: "🐦 Fly", distractors: [{ text: "Swim", icon: "🏊 Swim" }, { text: "Hop", icon: "🐇 Hop" }, { text: "Slither", icon: "🐍 Slither" }], hint: "A baby moves by crawling. A bird moves through the sky by...?" },
  { pair1: "Glove ➔ Hand", pair2: "Sock ➔ ?", correct: "Foot", correctIcon: "🦶 Foot", distractors: [{ text: "Head", icon: "🗣️ Head" }, { text: "Ear", icon: "👂 Ear" }, { text: "Elbow", icon: "💪 Elbow" }], hint: "A glove goes on your hand. A sock goes on your...?" },
  { pair1: "Hat ➔ Head", pair2: "Scarf ➔ ?", correct: "Neck", correctIcon: "🧣 Neck", distractors: [{ text: "Foot", icon: "🦶 Foot" }, { text: "Knee", icon: "🦵 Knee" }, { text: "Finger", icon: "☝️ Finger" }], hint: "A hat is worn on your head. A scarf is wrapped around your...?" },
  { pair1: "Library ➔ Books", pair2: "Aquarium ➔ ?", correct: "Fish", correctIcon: "🐟 Fish", distractors: [{ text: "Cars", icon: "🚗 Cars" }, { text: "Flowers", icon: "🌷 Flowers" }, { text: "Shoes", icon: "👟 Shoes" }], hint: "A library is full of books. An aquarium is full of...?" },
  { pair1: "Pilot ➔ Airplane", pair2: "Conductor ➔ ?", correct: "Train", correctIcon: "🚂 Train", distractors: [{ text: "Boat", icon: "⛵ Boat" }, { text: "Rocket", icon: "🚀 Rocket" }, { text: "Scooter", icon: "🛴 Scooter" }], hint: "A pilot flies an airplane. A conductor drives a...?" },
  { pair1: "Grape ➔ Raisin", pair2: "Plum ➔ ?", correct: "Prune", correctIcon: "🍑 Prune", distractors: [{ text: "Jelly Bean", icon: "🍬 Jelly Bean" }, { text: "Pickle", icon: "🥒 Pickle" }, { text: "Popcorn", icon: "🍿 Popcorn" }], hint: "A dried grape is called a raisin. A dried plum is called a...?" },
  { pair1: "Milk ➔ Cheese", pair2: "Flour ➔ ?", correct: "Bread", correctIcon: "🍞 Bread", distractors: [{ text: "Juice", icon: "🧃 Juice" }, { text: "Ice", icon: "🧊 Ice" }, { text: "Soup", icon: "🍲 Soup" }], hint: "Cheese is made from milk. Bread is made from...?" },
  { pair1: "Tear ➔ Sad", pair2: "Smile ➔ ?", correct: "Happy", correctIcon: "😊 Happy", distractors: [{ text: "Angry", icon: "😠 Angry" }, { text: "Sleepy", icon: "😴 Sleepy" }, { text: "Scared", icon: "😨 Scared" }], hint: "A tear shows someone is sad. A smile shows someone is...?" },
  { pair1: "Night ➔ Dark", pair2: "Day ➔ ?", correct: "Bright", correctIcon: "☀️ Bright", distractors: [{ text: "Quiet", icon: "🤫 Quiet" }, { text: "Cold", icon: "🥶 Cold" }, { text: "Scary", icon: "👻 Scary" }], hint: "Night time is dark. Day time is...?" },
  { pair1: "Knife ➔ Cut", pair2: "Spoon ➔ ?", correct: "Scoop", correctIcon: "🥄 Scoop", distractors: [{ text: "Hammer", icon: "🔨 Hammer" }, { text: "Draw", icon: "🎨 Draw" }, { text: "Pour", icon: "🫗 Pour" }], hint: "A knife is used to cut food. A spoon is used to...?" },
  { pair1: "Author ➔ Book", pair2: "Chef ➔ ?", correct: "Meal", correctIcon: "🍽️ Meal", distractors: [{ text: "Song", icon: "🎵 Song" }, { text: "Painting", icon: "🖼️ Painting" }, { text: "House", icon: "🏠 House" }], hint: "An author creates a book. A chef creates a...?" },
  { pair1: "Train ➔ Track", pair2: "Car ➔ ?", correct: "Road", correctIcon: "🛣️ Road", distractors: [{ text: "River", icon: "🏞️ River" }, { text: "Sky", icon: "🌤️ Sky" }, { text: "Rail", icon: "🛤️ Rail" }], hint: "A train travels on a track. A car travels on a...?" },
  { pair1: "Sled ➔ Snow", pair2: "Surfboard ➔ ?", correct: "Waves", correctIcon: "🌊 Waves", distractors: [{ text: "Grass", icon: "🌱 Grass" }, { text: "Ice", icon: "🧊 Ice" }, { text: "Sand", icon: "🏖️ Sand" }], hint: "A sled slides on snow. A surfboard rides on ocean...?" },
  { pair1: "Mouse ➔ Mice", pair2: "Goose ➔ ?", correct: "Geese", correctIcon: "🪿 Geese", distractors: [{ text: "Gooses", icon: "🪿 Gooses" }, { text: "Geeses", icon: "🪿 Geeses" }, { text: "Goose", icon: "🪿 Goose" }], hint: "More than one mouse is called mice. More than one goose is called...?" },
  { pair1: "One ➔ Two", pair2: "First ➔ ?", correct: "Second", correctIcon: "🥈 Second", distractors: [{ text: "Third", icon: "🥉 Third" }, { text: "Last", icon: "🏁 Last" }, { text: "Fifth", icon: "✋ Fifth" }], hint: "After one comes two. After first comes...?" },
  { pair1: "Letter ➔ Word", pair2: "Word ➔ ?", correct: "Sentence", correctIcon: "📝 Sentence", distractors: [{ text: "Number", icon: "🔢 Number" }, { text: "Picture", icon: "🖼️ Picture" }, { text: "Sound", icon: "🔊 Sound" }], hint: "Letters join together to build a word. Words join together to build a...?" },
  { pair1: "Minute ➔ Hour", pair2: "Day ➔ ?", correct: "Week", correctIcon: "📅 Week", distractors: [{ text: "Second", icon: "⏱️ Second" }, { text: "Clock", icon: "🕐 Clock" }, { text: "Morning", icon: "🌅 Morning" }], hint: "Many minutes make an hour. Many days make a...?" },
  { pair1: "Cold ➔ Freezing", pair2: "Warm ➔ ?", correct: "Hot", correctIcon: "🔥 Hot", distractors: [{ text: "Cool", icon: "❄️ Cool" }, { text: "Wet", icon: "💧 Wet" }, { text: "Icy", icon: "🧊 Icy" }], hint: "Freezing is even colder than cold. What is even warmer than warm?" },
  { pair1: "Big ➔ Giant", pair2: "Small ➔ ?", correct: "Tiny", correctIcon: "🐜 Tiny", distractors: [{ text: "Huge", icon: "🐘 Huge" }, { text: "Tall", icon: "📏 Tall" }, { text: "Wide", icon: "↔️ Wide" }], hint: "Giant means extra big. What word means extra small?" },
  { pair1: "Eye ➔ Blink", pair2: "Heart ➔ ?", correct: "Beat", correctIcon: "❤️ Beat", distractors: [{ text: "Blink", icon: "👁️ Blink" }, { text: "Chew", icon: "😬 Chew" }, { text: "Clap", icon: "👏 Clap" }], hint: "An eye blinks. A heart goes thump-thump - it...?" },
  { pair1: "Dog ➔ Puppy", pair2: "Cow ➔ ?", correct: "Calf", correctIcon: "🐄 Calf", distractors: [{ text: "Kitten", icon: "🐱 Kitten" }, { text: "Chick", icon: "🐣 Chick" }, { text: "Cub", icon: "🐻 Cub" }], hint: "A baby dog is a puppy. A baby cow is a...?" },
  { pair1: "Sheep ➔ Lamb", pair2: "Horse ➔ ?", correct: "Foal", correctIcon: "🐴 Foal", distractors: [{ text: "Piglet", icon: "🐷 Piglet" }, { text: "Duckling", icon: "🦆 Duckling" }, { text: "Joey", icon: "🦘 Joey" }], hint: "A baby sheep is a lamb. A baby horse is a...?" },
  { pair1: "Deer ➔ Fawn", pair2: "Goat ➔ ?", correct: "Kid", correctIcon: "🐐 Kid", distractors: [{ text: "Lamb", icon: "🐑 Lamb" }, { text: "Calf", icon: "🐄 Calf" }, { text: "Pup", icon: "🐶 Pup" }], hint: "A baby deer is a fawn. A baby goat is called a 'kid' - just like you!" },
  { pair1: "Wheel ➔ Round", pair2: "Box ➔ ?", correct: "Square", correctIcon: "📦 Square", distractors: [{ text: "Round", icon: "⚪ Round" }, { text: "Pointy", icon: "🔺 Pointy" }, { text: "Bendy", icon: "🪱 Bendy" }], hint: "A wheel has a round shape. A box has a...?" },
  { pair1: "Grass ➔ Green", pair2: "Sky ➔ ?", correct: "Blue", correctIcon: "🔵 Blue", distractors: [{ text: "Purple", icon: "🟣 Purple" }, { text: "Brown", icon: "🟤 Brown" }, { text: "Black", icon: "⚫ Black" }], hint: "Grass is green. On a sunny day, the sky is...?" },
  { pair1: "Salt ➔ Salty", pair2: "Sugar ➔ ?", correct: "Sweet", correctIcon: "🍬 Sweet", distractors: [{ text: "Sour", icon: "🍋 Sour" }, { text: "Spicy", icon: "🌶️ Spicy" }, { text: "Bitter", icon: "☕ Bitter" }], hint: "Salt tastes salty. Sugar tastes...?" },
  { pair1: "Lemon ➔ Sour", pair2: "Pepper ➔ ?", correct: "Spicy", correctIcon: "🌶️ Spicy", distractors: [{ text: "Sweet", icon: "🍬 Sweet" }, { text: "Cold", icon: "🧊 Cold" }, { text: "Salty", icon: "🧂 Salty" }], hint: "A lemon tastes sour. Hot pepper tastes...?" },
  { pair1: "Teacher ➔ Students", pair2: "Coach ➔ ?", correct: "Players", correctIcon: "⚽ Players", distractors: [{ text: "Books", icon: "📚 Books" }, { text: "Patients", icon: "🏥 Patients" }, { text: "Customers", icon: "🛒 Customers" }], hint: "A teacher helps students learn. A coach helps a team of...?" },
  { pair1: "Vet ➔ Animals", pair2: "Doctor ➔ ?", correct: "People", correctIcon: "🧑 People", distractors: [{ text: "Plants", icon: "🌱 Plants" }, { text: "Cars", icon: "🚗 Cars" }, { text: "Robots", icon: "🤖 Robots" }], hint: "A vet takes care of sick animals. A doctor takes care of sick...?" },
  { pair1: "Stove ➔ Hot", pair2: "Refrigerator ➔ ?", correct: "Cold", correctIcon: "❄️ Cold", distractors: [{ text: "Loud", icon: "🔊 Loud" }, { text: "Soft", icon: "🧸 Soft" }, { text: "Hot", icon: "🔥 Hot" }], hint: "A stove makes food hot. A refrigerator keeps food...?" },
  { pair1: "Feather ➔ Light", pair2: "Rock ➔ ?", correct: "Heavy", correctIcon: "🪨 Heavy", distractors: [{ text: "Fluffy", icon: "☁️ Fluffy" }, { text: "Light", icon: "🪶 Light" }, { text: "Warm", icon: "🔥 Warm" }], hint: "A feather is very light. A rock is very...?" },
  { pair1: "Turtle ➔ Shell", pair2: "Porcupine ➔ ?", correct: "Quills", correctIcon: "🦔 Quills", distractors: [{ text: "Shell", icon: "🐚 Shell" }, { text: "Feathers", icon: "🪶 Feathers" }, { text: "Wings", icon: "🪽 Wings" }], hint: "A turtle is protected by its shell. A porcupine is protected by its sharp...?" },
  { pair1: "Bird ➔ Wings", pair2: "Fish ➔ ?", correct: "Fins", correctIcon: "🐟 Fins", distractors: [{ text: "Wings", icon: "🪽 Wings" }, { text: "Paws", icon: "🐾 Paws" }, { text: "Hooves", icon: "🐴 Hooves" }], hint: "A bird moves using wings. A fish moves using...?" },
  { pair1: "Person ➔ House", pair2: "Horse ➔ ?", correct: "Barn", correctIcon: "🏚️ Barn", distractors: [{ text: "Nest", icon: "🪺 Nest" }, { text: "Hive", icon: "🐝 Hive" }, { text: "Web", icon: "🕸️ Web" }], hint: "A person lives in a house. A horse on a farm sleeps in a...?" },
  { pair1: "Candle ➔ Wax", pair2: "Snowman ➔ ?", correct: "Snow", correctIcon: "⛄ Snow", distractors: [{ text: "Mud", icon: "🟤 Mud" }, { text: "Wood", icon: "🪵 Wood" }, { text: "Paper", icon: "📄 Paper" }], hint: "A candle is made of wax. A snowman is made of...?" },
  { pair1: "Page ➔ Book", pair2: "Branch ➔ ?", correct: "Tree", correctIcon: "🌳 Tree", distractors: [{ text: "Flower", icon: "🌷 Flower" }, { text: "Rock", icon: "🪨 Rock" }, { text: "Fence", icon: "🚧 Fence" }], hint: "A page is one part of a book. A branch is one part of a...?" }
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
  { clues: "What has a thumb and four fingers, but is not a hand?", correct: "A Glove", correctIcon: "🧤 Glove", distractors: [{ text: "A Hand", icon: "✋ Hand" }, { text: "A Puppet", icon: "🧦 Puppet" }, { text: "A Sock", icon: "🧦 Sock" }], hint: "You wear me on a cold day to keep your fingers warm." },
  { clues: "I can fly high without wings, and I can cry without eyes.", correct: "A Cloud", correctIcon: "☁️ Cloud", distractors: [{ text: "A Bird", icon: "🐦 Bird" }, { text: "A Kite", icon: "🪁 Kite" }, { text: "An Airplane", icon: "✈️ Airplane" }], hint: "I float in the sky, and sometimes rain falls from me." },
  { clues: "What kind of room has no doors and no windows at all?", correct: "A Mushroom", correctIcon: "🍄 Mushroom", distractors: [{ text: "A Tent", icon: "⛺ Tent" }, { text: "A Cave", icon: "🪨 Cave" }, { text: "A Box", icon: "📦 Box" }], hint: "Listen closely to the word - it has 'room' hiding inside it!" },
  { clues: "I have a ring, but I have no finger to wear it on.", correct: "A Telephone", correctIcon: "☎️ Telephone", distractors: [{ text: "A Tree", icon: "🌳 Tree" }, { text: "A Bell", icon: "🔔 Bell" }, { text: "A Crown", icon: "👑 Crown" }], hint: "When I 'ring', someone wants to talk to you!" },
  { clues: "I have one eye, but I cannot see anything at all.", correct: "A Needle", correctIcon: "🪡 Needle", distractors: [{ text: "A Potato", icon: "🥔 Potato" }, { text: "A Storm", icon: "🌀 Storm" }, { text: "A Doll", icon: "🪆 Doll" }], hint: "You thread string through my tiny 'eye' to sew." },
  { clues: "I appear in the sky after rain when the sun comes back out. I am an arch of many colors.", correct: "A Rainbow", correctIcon: "🌈 Rainbow", distractors: [{ text: "A Cloud", icon: "☁️ Cloud" }, { text: "Lightning", icon: "⚡ Lightning" }, { text: "The Moon", icon: "🌙 Moon" }], hint: "Red, orange, yellow, green, blue... count my beautiful colors arching across the sky!" },
  { clues: "I get shorter and shorter every time you use me to write or draw, until I need sharpening.", correct: "A Pencil", correctIcon: "✏️ Pencil", distractors: [{ text: "A Ruler", icon: "📏 Ruler" }, { text: "A Marker", icon: "🖊️ Marker" }, { text: "A Paintbrush", icon: "🖌️ Paintbrush" }], hint: "You write with me, erase with my pink end, and sharpen me when my point gets dull." },
  { clues: "I have four legs but I cannot walk. You eat your dinner on top of me.", correct: "A Table", correctIcon: "🪵 Table", distractors: [{ text: "A Dog", icon: "🐶 Dog" }, { text: "A Bed", icon: "🛏️ Bed" }, { text: "A Ladder", icon: "🪜 Ladder" }], hint: "I stand in the kitchen and hold your plates and cups at dinner time." },
  { clues: "I have bristles and live in your bathroom. You use me every morning and every night on your teeth.", correct: "A Toothbrush", correctIcon: "🪥 Toothbrush", distractors: [{ text: "A Hairbrush", icon: "💇 Hairbrush" }, { text: "A Towel", icon: "🧻 Towel" }, { text: "A Broom", icon: "🧹 Broom" }], hint: "Squeeze some toothpaste on me and scrub-scrub-scrub those teeth!" },
  { clues: "I have wings but I am not a bird. I am made of metal and I carry people high above the clouds.", correct: "An Airplane", correctIcon: "✈️ Airplane", distractors: [{ text: "A Butterfly", icon: "🦋 Butterfly" }, { text: "A Bat", icon: "🦇 Bat" }, { text: "A Kite", icon: "🪁 Kite" }], hint: "You ride inside me to fly to faraway places, and I take off from an airport." },
  { clues: "The more of me there is, the less you can see. What am I?", correct: "Darkness", correctIcon: "🌑 Darkness", distractors: [{ text: "Light", icon: "💡 Light" }, { text: "Fog", icon: "🌫️ Fog" }, { text: "Water", icon: "💧 Water" }], hint: "When the lights go out at night, there is lots of me - and you can hardly see anything!" },
  { clues: "What has one head, one foot, and four legs, but is not alive?", correct: "A Bed", correctIcon: "🛏️ Bed", distractors: [{ text: "A Horse", icon: "🐴 Horse" }, { text: "A Chair", icon: "🪑 Chair" }, { text: "A Monster", icon: "👹 Monster" }], hint: "You sleep on me every night - I have a headboard at my 'head' and a footboard at my 'foot'!" },
  { clues: "I can show you moments from the past, like your birthday party or a trip to the beach. I am made with a camera.", correct: "A Photo", correctIcon: "📷 Photo", distractors: [{ text: "A Mirror", icon: "🪞 Mirror" }, { text: "A Window", icon: "🪟 Window" }, { text: "A Dream", icon: "💭 Dream" }], hint: "Say cheese! Click! Now you can look at this memory forever." },
  { clues: "I have ears but I cannot hear a single sound. I grow in a field and you can eat me.", correct: "Corn", correctIcon: "🌽 Corn", distractors: [{ text: "A Rabbit", icon: "🐰 Rabbit" }, { text: "A Potato", icon: "🥔 Potato" }, { text: "An Apple", icon: "🍎 Apple" }], hint: "People say an 'ear' of this yellow vegetable - you eat it right off the cob!" },
  { clues: "I travel all around the world, but I always stay in my corner.", correct: "A Stamp", correctIcon: "📮 Stamp", distractors: [{ text: "A Suitcase", icon: "🧳 Suitcase" }, { text: "A Map", icon: "🗺️ Map" }, { text: "A Pilot", icon: "👨‍✈️ Pilot" }], hint: "I get stuck on the corner of an envelope, and then the letter travels anywhere in the world!" },
  { clues: "What goes UP when the rain comes DOWN?", correct: "An Umbrella", correctIcon: "☂️ Umbrella", distractors: [{ text: "A Puddle", icon: "💧 Puddle" }, { text: "A Boot", icon: "🥾 Boot" }, { text: "A Cloud", icon: "☁️ Cloud" }], hint: "When raindrops start falling, you pop me open and hold me over your head!" },
  { clues: "I am round and bouncy. Kids kick me, throw me, and roll me in games.", correct: "A Ball", correctIcon: "⚽ Ball", distractors: [{ text: "A Rock", icon: "🪨 Rock" }, { text: "A Box", icon: "📦 Box" }, { text: "An Egg", icon: "🥚 Egg" }], hint: "Soccer, basketball, and kickball all need one of me!" },
  { clues: "You can catch me, but you can never throw me. I make you sneeze and cough.", correct: "A Cold", correctIcon: "🤧 Cold", distractors: [{ text: "A Ball", icon: "⚽ Ball" }, { text: "A Frisbee", icon: "🥏 Frisbee" }, { text: "A Fish", icon: "🐟 Fish" }], hint: "When you 'catch' me, you might need tissues, rest, and warm soup!" },
  { clues: "I start with the letter T, I end with the letter T, and I am full of tea.", correct: "A Teapot", correctIcon: "🫖 Teapot", distractors: [{ text: "A Tent", icon: "⛺ Tent" }, { text: "A Toot", icon: "🎺 Toot" }, { text: "A Turtle", icon: "🐢 Turtle" }], hint: "Spell it out: T-E-A-P-O-T. It starts with T, ends with T, and you pour tea from it!" },
  { clues: "What building in town has the most STORIES inside it?", correct: "The Library", correctIcon: "📚 Library", distractors: [{ text: "A Skyscraper", icon: "🏙️ Skyscraper" }, { text: "A Castle", icon: "🏰 Castle" }, { text: "A Barn", icon: "🏚️ Barn" }], hint: "This is a tricky word joke! 'Stories' can mean floors of a building OR the tales inside books!" }
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
  { family: "ine", target: "Nine", rhymes: ["Line", "Pine", "Shine"], nonRhymes: ["Sun", "Frog", "Cap"] },
  { family: "ed", target: "Bed", rhymes: ["Red", "Sled", "Shed"], nonRhymes: ["Moon", "Cat", "Boat"] },
  { family: "en", target: "Hen", rhymes: ["Ten", "Pen", "Den"], nonRhymes: ["Car", "Fish", "Book"] },
  { family: "et", target: "Jet", rhymes: ["Net", "Pet", "Wet"], nonRhymes: ["Sun", "Dog", "Moon"] },
  { family: "ip", target: "Ship", rhymes: ["Lip", "Trip", "Drip"], nonRhymes: ["Cake", "Star", "Hen"] },
  { family: "ump", target: "Jump", rhymes: ["Bump", "Pump", "Stump"], nonRhymes: ["Tree", "Fish", "Cat"] },
  { family: "ox", target: "Fox", rhymes: ["Box", "Socks", "Blocks"], nonRhymes: ["Bee", "Rain", "Cup"] },
  { family: "ar", target: "Star", rhymes: ["Car", "Jar", "Far"], nonRhymes: ["Hen", "Moon", "Dish"] },
  { family: "all", target: "Ball", rhymes: ["Tall", "Wall", "Fall"], nonRhymes: ["Pig", "Net", "Sun"] },
  { family: "ay", target: "Day", rhymes: ["Play", "Say", "Way"], nonRhymes: ["Fox", "Cup", "Moon"] },
  { family: "eep", target: "Sheep", rhymes: ["Jeep", "Sleep", "Deep"], nonRhymes: ["Cat", "Ball", "Star"] },
  { family: "ide", target: "Ride", rhymes: ["Hide", "Slide", "Wide"], nonRhymes: ["Hen", "Fox", "Cup"] },
  { family: "ook", target: "Book", rhymes: ["Look", "Cook", "Hook"], nonRhymes: ["Day", "Star", "Jet"] },
  { family: "ain", target: "Rain", rhymes: ["Train", "Brain", "Chain"], nonRhymes: ["Fox", "Sheep", "Cup"] }
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

// Synonym pool (verbal_detective)
const SYNONYM_POOL = [
  { word: "Happy", correct: "Glad", icon: "😊", distractors: ["Angry", "Sleepy", "Hungry"] },
  { word: "Big", correct: "Huge", icon: "🐘", distractors: ["Tiny", "Thin", "Slow"] },
  { word: "Small", correct: "Little", icon: "🐜", distractors: ["Giant", "Wide", "Heavy"] },
  { word: "Fast", correct: "Quick", icon: "⚡", distractors: ["Slow", "Lazy", "Loud"] },
  { word: "Mad", correct: "Angry", icon: "😠", distractors: ["Joyful", "Calm", "Silly"] },
  { word: "Sad", correct: "Unhappy", icon: "😢", distractors: ["Cheerful", "Excited", "Proud"] },
  { word: "Begin", correct: "Start", icon: "🏁", distractors: ["Finish", "Stop", "Rest"] },
  { word: "Shut", correct: "Close", icon: "🚪", distractors: ["Open", "Break", "Lift"] },
  { word: "Loud", correct: "Noisy", icon: "🔊", distractors: ["Quiet", "Soft", "Gentle"] },
  { word: "Smart", correct: "Clever", icon: "🧠", distractors: ["Sleepy", "Hungry", "Short"] },
  { word: "Pretty", correct: "Beautiful", icon: "🌸", distractors: ["Messy", "Grumpy", "Noisy"] },
  { word: "Cold", correct: "Chilly", icon: "🥶", distractors: ["Warm", "Burning", "Sunny"] },
  { word: "Jump", correct: "Leap", icon: "🦘", distractors: ["Crawl", "Sit", "Sleep"] },
  { word: "Yell", correct: "Shout", icon: "📢", distractors: ["Whisper", "Hum", "Listen"] },
  { word: "Sleepy", correct: "Tired", icon: "😴", distractors: ["Awake", "Bouncy", "Hungry"] },
  { word: "Afraid", correct: "Scared", icon: "😨", distractors: ["Brave", "Happy", "Bored"] },
  { word: "Trash", correct: "Garbage", icon: "🗑️", distractors: ["Treasure", "Toys", "Food"] },
  { word: "Gift", correct: "Present", icon: "🎁", distractors: ["Bill", "Chore", "Test"] },
  { word: "Silent", correct: "Quiet", icon: "🤫", distractors: ["Loud", "Screaming", "Musical"] },
  { word: "Hard", correct: "Difficult", icon: "🧗", distractors: ["Easy", "Soft", "Simple"] }
];

function generateSynonymQuestions(count) {
  const pool = pgShuffle(SYNONYM_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.distractors]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_syn_${i}_${item.word}_${Math.random()}`,
      category: "verbal_detective",
      standard: "VA SOL 1.6 & CogAT Verbal - Synonym Matching",
      difficulty: pgRandInt(2, 3),
      prompt: `Which word means almost the SAME as "${item.word}"?`,
      visualType: "word_group",
      visualData: { words: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `A synonym is a word twin - it means almost the same thing as "${item.word}".`,
      explanation: `"${item.correct}" means almost the same as "${item.word}" - they are synonyms!`
    };
  });
}

// Antonym pool (verbal_detective)
const ANTONYM_POOL = [
  { word: "Hot", correct: "Cold", icon: "🥶", distractors: ["Warm", "Spicy", "Sunny"] },
  { word: "Tall", correct: "Short", icon: "📏", distractors: ["High", "Big", "Wide"] },
  { word: "Empty", correct: "Full", icon: "🧃", distractors: ["Open", "Clean", "Light"] },
  { word: "Soft", correct: "Hard", icon: "🪨", distractors: ["Fluffy", "Smooth", "Warm"] },
  { word: "Light (brightness)", correct: "Dark", icon: "🌑", distractors: ["Shiny", "Sunny", "Glowing"] },
  { word: "First", correct: "Last", icon: "🏁", distractors: ["Second", "Next", "Best"] },
  { word: "Over", correct: "Under", icon: "⬇️", distractors: ["Above", "Beside", "On Top"] },
  { word: "Push", correct: "Pull", icon: "🪢", distractors: ["Shove", "Press", "Carry"] },
  { word: "Early", correct: "Late", icon: "🕙", distractors: ["Fast", "First", "Soon"] },
  { word: "Smooth", correct: "Rough", icon: "🪵", distractors: ["Slippery", "Soft", "Flat"] },
  { word: "Awake", correct: "Asleep", icon: "😴", distractors: ["Alert", "Jumping", "Happy"] },
  { word: "Found", correct: "Lost", icon: "🔍", distractors: ["Kept", "Seen", "Held"] },
  { word: "Begin", correct: "End", icon: "🔚", distractors: ["Start", "Continue", "Open"] },
  { word: "Loud", correct: "Quiet", icon: "🤫", distractors: ["Noisy", "Booming", "Musical"] },
  { word: "Young", correct: "Old", icon: "👵", distractors: ["New", "Little", "Fresh"] },
  { word: "Near", correct: "Far", icon: "🗺️", distractors: ["Close", "Next To", "Beside"] },
  { word: "Inside", correct: "Outside", icon: "🌳", distractors: ["Within", "Indoors", "Middle"] },
  { word: "Strong", correct: "Weak", icon: "🪶", distractors: ["Mighty", "Tough", "Powerful"] },
  { word: "Always", correct: "Never", icon: "🚫", distractors: ["Often", "Sometimes", "Forever"] },
  { word: "Day", correct: "Night", icon: "🌙", distractors: ["Morning", "Noon", "Sunrise"] }
];

function generateAntonymQuestions(count) {
  const pool = pgShuffle(ANTONYM_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.distractors]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_ant_${i}_${item.word}_${Math.random()}`,
      category: "verbal_detective",
      standard: "CogAT Verbal - Antonyms & Opposites",
      difficulty: pgRandInt(1, 3),
      prompt: `What is the OPPOSITE of "${item.word}"?`,
      visualType: "word_group",
      visualData: { words: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `An opposite (antonym) is as different as can be from "${item.word}" - like up and down!`,
      explanation: `"${item.correct}" is the opposite of "${item.word}"!`
    };
  });
}

// Odd-word-out category pool (verbal_detective)
const ODD_WORD_OUT_POOL = [
  { group: ["Dog", "Cat", "Rabbit"], groupName: "animals", odd: "Carrot", oddType: "a vegetable", icons: ["🐶", "🐱", "🐰", "🥕"] },
  { group: ["Shirt", "Pants", "Hat"], groupName: "clothes you wear", odd: "Banana", oddType: "a fruit", icons: ["👕", "👖", "🎩", "🍌"] },
  { group: ["Car", "Bus", "Truck"], groupName: "vehicles", odd: "Apple", oddType: "a fruit", icons: ["🚗", "🚌", "🚚", "🍎"] },
  { group: ["Square", "Circle", "Triangle"], groupName: "shapes", odd: "Blue", oddType: "a color", icons: ["🟩", "⭕", "🔺", "🔵"] },
  { group: ["Milk", "Juice", "Water"], groupName: "drinks", odd: "Sandwich", oddType: "a food you chew", icons: ["🥛", "🧃", "💧", "🥪"] },
  { group: ["Teacher", "Doctor", "Firefighter"], groupName: "jobs people do", odd: "Spoon", oddType: "a kitchen tool", icons: ["👩‍🏫", "🧑‍⚕️", "👩‍🚒", "🥄"] },
  { group: ["Guitar", "Piano", "Drum"], groupName: "musical instruments", odd: "Scissors", oddType: "a cutting tool", icons: ["🎸", "🎹", "🥁", "✂️"] },
  { group: ["Soccer", "Baseball", "Basketball"], groupName: "sports", odd: "Painting", oddType: "an art activity", icons: ["⚽", "⚾", "🏀", "🎨"] },
  { group: ["Ant", "Bee", "Butterfly"], groupName: "insects", odd: "Dog", oddType: "a mammal with fur", icons: ["🐜", "🐝", "🦋", "🐶"] },
  { group: ["Rose", "Daisy", "Tulip"], groupName: "flowers", odd: "Rock", oddType: "a non-living thing", icons: ["🌹", "🌼", "🌷", "🪨"] },
  { group: ["Winter", "Summer", "Spring"], groupName: "seasons", odd: "Monday", oddType: "a day of the week", icons: ["❄️", "☀️", "🌷", "📅"] },
  { group: ["Monday", "Tuesday", "Friday"], groupName: "days of the week", odd: "July", oddType: "a month of the year", icons: ["📅", "📅", "📅", "🗓️"] },
  { group: ["Eyes", "Ears", "Nose"], groupName: "parts of your face", odd: "Shoes", oddType: "something you wear on your feet", icons: ["👀", "👂", "👃", "👟"] },
  { group: ["Two", "Five", "Nine"], groupName: "numbers", odd: "Blue", oddType: "a color", icons: ["2️⃣", "5️⃣", "9️⃣", "🔵"] },
  { group: ["Whale", "Shark", "Dolphin"], groupName: "ocean animals", odd: "Eagle", oddType: "a bird of the sky", icons: ["🐋", "🦈", "🐬", "🦅"] },
  { group: ["Fork", "Spoon", "Knife"], groupName: "things you eat with", odd: "Pillow", oddType: "something you sleep on", icons: ["🍴", "🥄", "🔪", "🛏️"] },
  { group: ["Breakfast", "Lunch", "Dinner"], groupName: "meals", odd: "Recess", oddType: "play time, not a meal", icons: ["🥞", "🥪", "🍝", "⚽"] },
  { group: ["Rain", "Snow", "Hail"], groupName: "things that fall from clouds", odd: "Rainbow", oddType: "light you see in the sky", icons: ["🌧️", "❄️", "🧊", "🌈"] }
];

function generateOddWordOutQuestions(count) {
  const pool = pgShuffle(ODD_WORD_OUT_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const all = [
      ...item.group.map((w, k) => ({ text: w, icon: item.icons[k], isOdd: false })),
      { text: item.odd, icon: item.icons[3], isOdd: true }
    ];
    const options = pgShuffle(all);
    const correctIndex = options.findIndex(o => o.isOdd);
    return {
      id: `gen_oddword_${i}_${item.odd}_${Math.random()}`,
      category: "verbal_detective",
      standard: "CogAT Verbal - Category Classification (Odd One Out)",
      difficulty: pgRandInt(2, 3),
      prompt: `Which word does NOT belong with the others?`,
      visualType: "word_group",
      visualData: { words: options.map(o => o.text) },
      options: options.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `Three of these are ${item.groupName}. One of them is something totally different!`,
      explanation: `${item.group.join(", ")} are all ${item.groupName}, but ${item.odd} is ${item.oddType} - it doesn't belong!`
    };
  });
}

// Compound word pool (verbal_detective)
const COMPOUND_WORD_POOL = [
  { a: "SUN", b: "FLOWER", correct: "Sunflower", icon: "🌻", distractors: ["Sunshine", "Flowerpot", "Raincoat"] },
  { a: "RAIN", b: "BOW", correct: "Rainbow", icon: "🌈", distractors: ["Raindrop", "Bowtie", "Snowman"] },
  { a: "CUP", b: "CAKE", correct: "Cupcake", icon: "🧁", distractors: ["Pancake", "Teacup", "Cakepop"] },
  { a: "BUTTER", b: "FLY", correct: "Butterfly", icon: "🦋", distractors: ["Firefly", "Butterball", "Flyswatter"] },
  { a: "STAR", b: "FISH", correct: "Starfish", icon: "⭐", distractors: ["Jellyfish", "Starlight", "Fishbowl"] },
  { a: "FOOT", b: "BALL", correct: "Football", icon: "🏈", distractors: ["Baseball", "Footprint", "Ballpark"] },
  { a: "SNOW", b: "MAN", correct: "Snowman", icon: "⛄", distractors: ["Snowball", "Mailman", "Snowflake"] },
  { a: "PAN", b: "CAKE", correct: "Pancake", icon: "🥞", distractors: ["Cupcake", "Panfry", "Cakewalk"] },
  { a: "TOOTH", b: "BRUSH", correct: "Toothbrush", icon: "🪥", distractors: ["Hairbrush", "Toothpaste", "Paintbrush"] },
  { a: "BED", b: "ROOM", correct: "Bedroom", icon: "🛏️", distractors: ["Bathroom", "Bedtime", "Classroom"] },
  { a: "MAIL", b: "BOX", correct: "Mailbox", icon: "📬", distractors: ["Toolbox", "Mailman", "Lunchbox"] },
  { a: "POP", b: "CORN", correct: "Popcorn", icon: "🍿", distractors: ["Cornbread", "Popsicle", "Lollipop"] },
  { a: "FIRE", b: "FLY", correct: "Firefly", icon: "✨", distractors: ["Butterfly", "Firetruck", "Flypaper"] },
  { a: "DOG", b: "HOUSE", correct: "Doghouse", icon: "🐶", distractors: ["Birdhouse", "Housecat", "Doggy"] },
  { a: "SEA", b: "SHELL", correct: "Seashell", icon: "🐚", distractors: ["Seaweed", "Eggshell", "Seahorse"] },
  { a: "MOON", b: "LIGHT", correct: "Moonlight", icon: "🌙", distractors: ["Sunlight", "Moonbeam", "Flashlight"] },
  { a: "BACK", b: "PACK", correct: "Backpack", icon: "🎒", distractors: ["Backyard", "Packrat", "Paperback"] },
  { a: "SAND", b: "BOX", correct: "Sandbox", icon: "🏖️", distractors: ["Sandcastle", "Mailbox", "Boxcar"] },
  { a: "GRASS", b: "HOPPER", correct: "Grasshopper", icon: "🦗", distractors: ["Grassland", "Bunnyhopper", "Ladybug"] },
  { a: "BIRD", b: "HOUSE", correct: "Birdhouse", icon: "🐦", distractors: ["Birdbath", "Doghouse", "Treehouse"] }
];

function generateCompoundWordQuestions(count) {
  const pool = pgShuffle(COMPOUND_WORD_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.distractors]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_compound_${i}_${item.correct}_${Math.random()}`,
      category: "verbal_detective",
      standard: "VA SOL 1.5 - Compound Word Building",
      difficulty: 2,
      prompt: `Word building time! What NEW word do you make when you snap "${item.a}" and "${item.b}" together?`,
      visualType: "analogy",
      visualData: { pair1: `${item.a} + ${item.b}`, pair2: "= ?" },
      options,
      correctIndex,
      hint: `Say the two words together without a pause: ${item.a}... ${item.b}...`,
      explanation: `${item.a} + ${item.b} = ${item.correct}! Two small words snapped together make a compound word!`
    };
  });
}

// Beginning sound groups (verbal_detective)
const BEGINNING_SOUND_SETS = [
  { letter: "B", words: ["Ball", "Banana", "Bear", "Bike", "Bus"] },
  { letter: "M", words: ["Moon", "Milk", "Mouse", "Monkey", "Mitten"] },
  { letter: "S", words: ["Sun", "Sock", "Star", "Sand", "Soup"] },
  { letter: "T", words: ["Turtle", "Table", "Tiger", "Tooth", "Taco"] },
  { letter: "D", words: ["Dog", "Duck", "Door", "Dinosaur", "Dot"] },
  { letter: "F", words: ["Fish", "Fan", "Fox", "Feather", "Fork"] },
  { letter: "P", words: ["Pig", "Pencil", "Pizza", "Penguin", "Pumpkin"] },
  { letter: "C", words: ["Cat", "Car", "Cup", "Cake", "Corn"] },
  { letter: "L", words: ["Lion", "Leaf", "Lamp", "Lemon", "Ladder"] },
  { letter: "R", words: ["Rabbit", "Rain", "Ring", "Rocket", "Rake"] },
  { letter: "W", words: ["Wagon", "Worm", "Window", "Watch", "Wolf"] },
  { letter: "H", words: ["Hat", "Horse", "House", "Heart", "Hand"] }
];

function generateBeginningSoundQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const set = pgPick(BEGINNING_SOUND_SETS);
    const [target, correct] = pgPickN(set.words, 2);
    const otherSets = BEGINNING_SOUND_SETS.filter(s => s.letter !== set.letter);
    const distractors = pgPickN(otherSets, 3).map(s => pgPick(s.words));
    const options = pgShuffle([correct, ...distractors]).map(w => ({ text: w, icon: "🔤" }));
    const correctIndex = options.findIndex(o => o.text === correct);
    out.push({
      id: `gen_beginsound_${i}_${set.letter}_${target}_${correct}_${Math.random()}`,
      category: "verbal_detective",
      standard: "VA SOL 1.4 - Beginning Sounds & Phonemic Awareness",
      difficulty: 1,
      prompt: `Listen to the FIRST sound in "${target}". Which word starts with the same sound?`,
      visualType: "phonics_mystery",
      visualData: { rhyme: target.toLowerCase(), startsWith: set.letter },
      options,
      correctIndex,
      hint: `"${target}" starts with the /${set.letter.toLowerCase()}/ sound. Say each answer out loud - which one starts the same way?`,
      explanation: `"${target}" and "${correct}" both start with the letter ${set.letter} sound!`
    });
  }
  return out;
}

// Sentence completion pool (CogAT Verbal format)
const SENTENCE_COMPLETION_POOL = [
  { sentence: "A ____ is used to tell what time it is.", correct: "Clock", icon: "⏰", distractors: ["Spoon", "Pillow", "Crayon"] },
  { sentence: "We wear ____ on our feet to keep them safe.", correct: "Shoes", icon: "👟", distractors: ["Gloves", "Hats", "Glasses"] },
  { sentence: "At night, we can see the ____ and stars in the sky.", correct: "Moon", icon: "🌙", distractors: ["Sun", "Rainbow", "Clouds only"] },
  { sentence: "A fish uses its ____ to swim through the water.", correct: "Fins", icon: "🐟", distractors: ["Wings", "Legs", "Hands"] },
  { sentence: "When you are thirsty, you should ____.", correct: "Drink water", icon: "💧", distractors: ["Take a nap", "Jump rope", "Read a book"] },
  { sentence: "Ice is frozen ____.", correct: "Water", icon: "🧊", distractors: ["Milk", "Sand", "Air"] },
  { sentence: "You hear with your ____.", correct: "Ears", icon: "👂", distractors: ["Eyes", "Elbows", "Toes"] },
  { sentence: "The season that comes after winter is ____.", correct: "Spring", icon: "🌷", distractors: ["Summer", "Fall", "Another winter"] },
  { sentence: "A bird builds a ____ to hold its eggs.", correct: "Nest", icon: "🪺", distractors: ["Garage", "Cave", "Tent"] },
  { sentence: "Before crossing the street, you should always ____.", correct: "Look both ways", icon: "🚸", distractors: ["Close your eyes", "Run fast", "Shout loudly"] },
  { sentence: "An umbrella keeps you ____ when it rains.", correct: "Dry", icon: "☂️", distractors: ["Wet", "Sleepy", "Hungry"] },
  { sentence: "A library is a quiet place where people go to read ____.", correct: "Books", icon: "📚", distractors: ["Pizzas", "Clouds", "Bicycles"] },
  { sentence: "In the morning, the sun ____ in the sky.", correct: "Rises", icon: "🌅", distractors: ["Disappears", "Melts", "Sleeps"] },
  { sentence: "You should brush your ____ after eating to keep them healthy.", correct: "Teeth", icon: "🦷", distractors: ["Shoes", "Toys", "Windows"] },
  { sentence: "A caterpillar changes into a ____.", correct: "Butterfly", icon: "🦋", distractors: ["Puppy", "Fish", "Bird"] },
  { sentence: "When the light turns red, cars must ____.", correct: "Stop", icon: "🛑", distractors: ["Go faster", "Honk", "Turn around"] }
];

function generateSentenceCompletionQuestions(count) {
  const pool = pgShuffle(SENTENCE_COMPLETION_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.distractors]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_sentcomp_${i}_${item.correct.replace(/\s/g, "")}_${Math.random()}`,
      category: "verbal_detective",
      standard: "CogAT Verbal - Sentence Completion",
      difficulty: pgRandInt(1, 3),
      prompt: `Finish the sentence: "${item.sentence}"`,
      visualType: "riddle",
      visualData: { clues: [item.sentence] },
      options,
      correctIndex,
      hint: `Read the whole sentence and think about which word makes it TRUE and sensible.`,
      explanation: `"${item.sentence.replace("____", item.correct)}" - that makes perfect sense!`
    };
  });
}

// Syllable counting pool (verbal_detective)
const SYLLABLE_POOL = [
  { word: "Cat", count: 1, icon: "🐱", parts: "cat" }, { word: "Dog", count: 1, icon: "🐶", parts: "dog" },
  { word: "Sun", count: 1, icon: "☀️", parts: "sun" }, { word: "Book", count: 1, icon: "📖", parts: "book" },
  { word: "Apple", count: 2, icon: "🍎", parts: "ap-ple" }, { word: "Pencil", count: 2, icon: "✏️", parts: "pen-cil" },
  { word: "Rainbow", count: 2, icon: "🌈", parts: "rain-bow" }, { word: "Tiger", count: 2, icon: "🐯", parts: "ti-ger" },
  { word: "Banana", count: 3, icon: "🍌", parts: "ba-na-na" }, { word: "Butterfly", count: 3, icon: "🦋", parts: "but-ter-fly" },
  { word: "Elephant", count: 3, icon: "🐘", parts: "el-e-phant" }, { word: "Dinosaur", count: 3, icon: "🦖", parts: "di-no-saur" },
  { word: "Kangaroo", count: 3, icon: "🦘", parts: "kan-ga-roo" }, { word: "Watermelon", count: 4, icon: "🍉", parts: "wa-ter-mel-on" },
  { word: "Alligator", count: 4, icon: "🐊", parts: "al-li-ga-tor" }, { word: "Caterpillar", count: 4, icon: "🐛", parts: "cat-er-pil-lar" }
];

function generateSyllableQuestions(count) {
  const pool = pgShuffle(SYLLABLE_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const distractors = pgUniqueDistractors(item.count, 1, 5, 3);
    const options = pgShuffle([item.count, ...distractors]).map(n => ({ text: `${n} syllable${n === 1 ? "" : "s"}`, icon: "👏" }));
    const correctIndex = options.findIndex(o => o.text.startsWith(`${item.count} `));
    return {
      id: `gen_syllable_${i}_${item.word}_${Math.random()}`,
      category: "verbal_detective",
      standard: "VA SOL 1.4 - Syllable Counting (Clap It Out)",
      difficulty: item.count >= 3 ? 2 : 1,
      prompt: `Clap it out! How many syllables (word parts) are in the word "${item.word.toUpperCase()}"? ${item.icon}`,
      visualType: "phonics_mystery",
      visualData: { rhyme: item.word.toLowerCase() },
      options,
      correctIndex,
      hint: `Clap once for each part as you say it slowly: ${item.parts}.`,
      explanation: `"${item.word}" claps out as ${item.parts} - that's ${item.count} syllable${item.count === 1 ? "" : "s"}!`
    };
  });
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

function generateLetterSeriesQuestions(count) {
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const out = [];
  for (let i = 0; i < count; i++) {
    const skip = pgRandInt(1, 2); // 1 = consecutive letters, 2 = skip-one (gifted)
    const start = pgRandInt(0, 25 - skip * 5);
    const seq = Array.from({ length: 4 }, (_, k) => ALPHABET[start + skip * k]);
    const correct = ALPHABET[start + skip * 4];
    const distractorPool = ALPHABET.filter(l => l !== correct && Math.abs(ALPHABET.indexOf(l) - (start + skip * 4)) <= 4);
    const distractors = pgPickN(distractorPool, 3);
    const options = pgShuffle([correct, ...distractors]).map(l => ({ text: l, icon: "🔠" }));
    const correctIndex = options.findIndex(o => o.text === correct);
    out.push({
      id: `gen_letterseries_${i}_${start}_${skip}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "CogAT - Letter Series Pattern",
      difficulty: skip === 1 ? 2 : 4,
      prompt: `Look at the letter pattern: ${seq.join(", ")}, ___? Which letter comes next?`,
      visualType: "sequence",
      visualData: { items: [...seq, "❓"] },
      options,
      correctIndex,
      hint: skip === 1 ? `The letters go in ABC order, one after another.` : `The pattern SKIPS a letter each time! Say the alphabet and jump over one letter each step.`,
      explanation: skip === 1 ? `The letters follow alphabet order, so after ${seq[3]} comes ${correct}!` : `The pattern skips one letter each time: ${seq.join(", ")}, and skipping again lands on ${correct}!`
    });
  }
  return out;
}

const AB_PATTERN_EMOJI_PAIRS = [
  ["🍎", "🍌"], ["⭐", "🌙"], ["🐶", "🐱"], ["🔴", "🟦"], ["🌸", "🍀"],
  ["⚽", "🏀"], ["🚗", "🚲"], ["🦋", "🐞"], ["🍕", "🧁"], ["☀️", "☁️"]
];

function generateABPatternQuestions(count) {
  const patternTypes = [
    { name: "AAB", seq: [0, 0, 1], difficulty: 2 },
    { name: "ABB", seq: [0, 1, 1], difficulty: 2 },
    { name: "AABB", seq: [0, 0, 1, 1], difficulty: 3 },
    { name: "AAAB", seq: [0, 0, 0, 1], difficulty: 3 }
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    const pat = pgPick(patternTypes);
    const [a, b] = pgPick(AB_PATTERN_EMOJI_PAIRS);
    const emojis = [a, b];
    const unitLen = pat.seq.length;
    const shownLen = unitLen * 2 + pgRandInt(0, unitLen - 1);
    const shown = Array.from({ length: shownLen }, (_, k) => emojis[pat.seq[k % unitLen]]);
    const correct = emojis[pat.seq[shownLen % unitLen]];
    const wrong = correct === a ? b : a;
    const options = pgShuffle([
      { text: correct, icon: correct, isCorrect: true },
      { text: wrong, icon: wrong, isCorrect: false },
      { text: `${a}${b} (both)`, icon: `${a}${b}`, isCorrect: false },
      { text: "🚫 Nothing comes next", icon: "🚫", isCorrect: false }
    ]);
    const correctIndex = options.findIndex(o => o.isCorrect);
    out.push({
      id: `gen_abpattern_${i}_${pat.name}_${a}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: `NNAT3 - ${pat.name} Repeating Pattern`,
      difficulty: pat.difficulty,
      prompt: `Look at this ${pat.name} pattern: ${shown.join(" ")} ___? What comes next?`,
      visualType: "sequence",
      visualData: { items: [...shown, "❓"] },
      options: options.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `The repeating chunk is ${pat.seq.map(idx => emojis[idx]).join(" ")}. Find where the pattern is inside the chunk!`,
      explanation: `This is a ${pat.name} pattern - the chunk ${pat.seq.map(idx => emojis[idx]).join(" ")} repeats, so ${correct} comes next!`
    });
  }
  return out;
}

const SHAPE_CYCLE_EMOJIS = [
  { name: "Star", emoji: "⭐" }, { name: "Circle", emoji: "🔵" }, { name: "Square", emoji: "🟩" },
  { name: "Heart", emoji: "💜" }, { name: "Triangle", emoji: "🔺" }, { name: "Diamond", emoji: "🔷" },
  { name: "Moon", emoji: "🌙" }, { name: "Flower", emoji: "🌸" }
];

function generateShapeCycleQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const cycleLen = pgRandInt(2, 3);
    const shapes = pgPickN(SHAPE_CYCLE_EMOJIS, cycleLen);
    const shownLen = pgRandInt(4, 6);
    const seq = Array.from({ length: shownLen }, (_, k) => shapes[k % cycleLen]);
    const correct = shapes[shownLen % cycleLen];
    const distractors = pgPickN(SHAPE_CYCLE_EMOJIS.filter(s => s.name !== correct.name), 3);
    const options = pgShuffle([correct, ...distractors]).map(s => ({ text: s.name, icon: s.emoji }));
    const correctIndex = options.findIndex(o => o.text === correct.name);
    out.push({
      id: `gen_shapecycle_${i}_${cycleLen}_${shownLen}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "NNAT3 - Repeating Shape Pattern Cycle",
      difficulty: cycleLen === 2 ? 1 : 2,
      prompt: `Look at the shape pattern: ${seq.map(s => s.name).join(", ")}, ___? What shape comes next?`,
      visualType: "sequence",
      visualData: { items: [...seq.map(s => s.emoji), "❓"] },
      options,
      correctIndex,
      hint: `The shapes repeat in a cycle of ${cycleLen}: ${shapes.map(s => s.name).join(", ")}...`,
      explanation: `The pattern repeats every ${cycleLen} shapes, so the next one is the ${correct.name}!`
    });
  }
  return out;
}

function generateMatrixCountQuestions(count) {
  const emojiSet = ["⭐", "🔵", "💜", "🌸", "🔺"];
  const out = [];
  for (let i = 0; i < count; i++) {
    const emoji = pgPick(emojiSet);
    const topStart = pgRandInt(1, 3);
    const delta = pgRandInt(1, 3);
    const bottomStart = pgRandInt(1, 4);
    const correct = bottomStart + delta;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 1, 12);
    const optionsLabeled = options.map(o => ({ text: `${o.text} ${emoji}`, icon: emoji.repeat(Math.min(parseInt(o.text, 10) || 1, 6)) }));
    out.push({
      id: `gen_matrixcount_${i}_${topStart}_${delta}_${bottomStart}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "CogAT Nonverbal - 2x2 Matrix Counting Rule",
      difficulty: delta === 1 ? 2 : 4,
      prompt: `Look at the pattern box and count carefully. The top row goes from ${topStart} to ${topStart + delta}. The bottom row starts with ${bottomStart}. What completes the puzzle?`,
      visualType: "matrix_2x2",
      visualData: {
        tl: { desc: `${topStart} ${emoji}` },
        tr: { desc: `${topStart + delta} ${emoji}` },
        bl: { desc: `${bottomStart} ${emoji}` },
        br: "?"
      },
      options: optionsLabeled,
      correctIndex,
      hint: `The top row ADDS ${delta} going across (${topStart} ➔ ${topStart + delta}). Do the same to the bottom row!`,
      explanation: `The rule is +${delta} across each row. ${bottomStart} + ${delta} = ${correct}!`
    });
  }
  return out;
}

function generateMatrix2x2SizeQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const [shapeA, shapeB] = pgPickN(MATRIX_SHAPES, 2);
    const [colorA, colorB] = pgPickN(MATRIX_COLORS, 2);
    const shrink = Math.random() < 0.5;
    const sizes = shrink ? ["large", "small"] : ["small", "large"];
    const correctDesc = `${sizes[1]} ${colorB.name} ${shapeB}`;
    const optionDefs = pgShuffle([
      { text: `${capitalizeWords(sizes[1])} ${colorB.name} ${shapeB}`, visual: { shape: shapeB, size: sizes[1], color: colorB.hex }, isCorrect: true },
      { text: `${capitalizeWords(sizes[0])} ${colorB.name} ${shapeB}`, visual: { shape: shapeB, size: sizes[0], color: colorB.hex }, isCorrect: false },
      { text: `${capitalizeWords(sizes[1])} ${colorA.name} ${shapeA}`, visual: { shape: shapeA, size: sizes[1], color: colorA.hex }, isCorrect: false },
      { text: `${capitalizeWords(sizes[0])} ${colorA.name} ${shapeB}`, visual: { shape: shapeB, size: sizes[0], color: colorA.hex }, isCorrect: false }
    ]);
    const correctIndex = optionDefs.findIndex(o => o.isCorrect);
    out.push({
      id: `gen_matrixsize_${i}_${shapeA}_${shapeB}_${shrink}_${Math.random()}`,
      category: "matrix_reasoning",
      standard: "CogAT Nonverbal - 2x2 Size Transformation",
      difficulty: 3,
      prompt: `Look at how the top row changes size. What completes the bottom row?`,
      visualType: "matrix_2x2",
      visualData: {
        tl: { shape: shapeA, size: sizes[0], color: colorA.hex },
        tr: { shape: shapeA, size: sizes[1], color: colorA.hex },
        bl: { shape: shapeB, size: sizes[0], color: colorB.hex },
        br: "?"
      },
      options: optionDefs.map(o => ({ text: o.text, icon: "🔷", visual: o.visual })),
      correctIndex,
      hint: `The rule is: the ${sizes[0]} shape becomes a ${sizes[1]} shape of the SAME color and type!`,
      explanation: `The ${sizes[0]} ${colorA.name} ${shapeA} became ${sizes[1]}. So the ${sizes[0]} ${colorB.name} ${shapeB} becomes a ${correctDesc}!`
    });
  }
  return out;
}

function capitalizeWords(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
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

// 3D solid shapes pool (spatial_folding)
const SOLID_SHAPE_FACTS = [
  { q: "Which 3D shape can ROLL because it is round all over?", correct: "Sphere (like a ball)", icon: "⚽", wrongs: ["Cube (like a box)", "Pyramid", "Rectangular Prism (like a brick)"] },
  { q: "A soup can is shaped like which 3D solid?", correct: "Cylinder", icon: "🥫", wrongs: ["Cube", "Sphere", "Cone"] },
  { q: "A gift box with 6 square faces is shaped like which 3D solid?", correct: "Cube", icon: "🎁", wrongs: ["Sphere", "Cone", "Cylinder"] },
  { q: "An ice cream cone has a point at one end and a circle at the other. What 3D shape is it?", correct: "Cone", icon: "🍦", wrongs: ["Cube", "Cylinder", "Sphere"] },
  { q: "How many flat faces does a cube have?", correct: "6 faces", icon: "🧊", wrongs: ["4 faces", "8 faces", "2 faces"] },
  { q: "Which 3D shape can you both STACK flat on top of another AND ROLL on its side?", correct: "Cylinder", icon: "🥫", wrongs: ["Sphere", "Cube", "Pyramid"] },
  { q: "A basketball is shaped like which 3D solid?", correct: "Sphere", icon: "🏀", wrongs: ["Circle (flat)", "Cylinder", "Cube"] },
  { q: "Which 3D shape slides but can NEVER roll?", correct: "Cube", icon: "🧊", wrongs: ["Sphere", "Cylinder", "Ball"] },
  { q: "What flat shape do you see when you look at the END of a cylinder (like the top of a can)?", correct: "A Circle", icon: "⭕", wrongs: ["A Square", "A Triangle", "A Star"] },
  { q: "The great pyramids in Egypt have a square bottom and triangle sides meeting at a point. What 3D shape are they?", correct: "Pyramid", icon: "🔺", wrongs: ["Cube", "Cone", "Sphere"] }
];

function generateSolidShapeQuestions(count) {
  const pool = pgShuffle(SOLID_SHAPE_FACTS);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_solid_${i}_${item.correct.replace(/\s/g, "")}_${Math.random()}`,
      category: "spatial_folding",
      standard: "VA SOL 1.11 - 3D Solid Shapes (Sphere, Cube, Cylinder, Cone)",
      difficulty: pgRandInt(2, 3),
      prompt: item.q,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Picture the shape in your hands - can it roll? Can it stack? Does it have corners or curves?`,
      explanation: `The answer is: ${item.correct}!`
    };
  });
}

// Shape composition pool (spatial_folding)
const SHAPE_COMPOSE_POOL = [
  { q: "If you join two squares side by side, what shape do you make?", correct: "A Rectangle", icon: "🟦🟦", wrongs: ["A Triangle", "A Circle", "A Bigger Square"] },
  { q: "If you put two half-circles (semicircles) together along their flat sides, what do you make?", correct: "A Whole Circle", icon: "⚪", wrongs: ["An Oval", "A Square", "A Moon"] },
  { q: "If you snap four small squares together in a 2-by-2 grid, what bigger shape do you make?", correct: "A Bigger Square", icon: "🟩", wrongs: ["A Triangle", "A Circle", "A Pentagon"] },
  { q: "If you put a triangle on top of a square, what does it look like?", correct: "A House", icon: "🏠", wrongs: ["A Ball", "A Fish", "A Doughnut"] },
  { q: "In pattern blocks, two trapezoids snap together to make which shape?", correct: "A Hexagon (6 sides)", icon: "⬡", wrongs: ["A Square", "A Circle", "A Triangle"] },
  { q: "If you cut a square in half from one side straight to the other, what two shapes can you get?", correct: "Two Rectangles", icon: "▬▬", wrongs: ["Two Circles", "Two Stars", "Two Hexagons"] },
  { q: "If you cut a circle exactly in half, what is each piece called?", correct: "A Half Circle (Semicircle)", icon: "🌗", wrongs: ["A Quarter", "A Triangle", "An Oval"] },
  { q: "Six equal triangles from pattern blocks can fit together to build which shape?", correct: "A Hexagon", icon: "⬡", wrongs: ["A Square", "A Circle", "A Rectangle"] },
  { q: "If you fold a square piece of paper corner to corner, what shape do you see?", correct: "A Triangle", icon: "🔺", wrongs: ["A Smaller Square", "A Circle", "A Heart"] },
  { q: "Two identical right triangles joined along their longest sides make which shape?", correct: "A Square or Rectangle", icon: "🟩", wrongs: ["A Circle", "A Star", "An Oval"] }
];

function generateShapeComposeQuestions(count) {
  const pool = pgShuffle(SHAPE_COMPOSE_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_compose_${i}_${i}_${Math.random()}`,
      category: "spatial_folding",
      standard: "VA SOL 1.11 - Composing & Decomposing Shapes",
      difficulty: pgRandInt(2, 4),
      prompt: item.q,
      visualType: "tangram",
      visualData: { parts: [item.q] },
      options,
      correctIndex,
      hint: `Imagine the shapes snapping together (or splitting apart) in your mind like puzzle pieces!`,
      explanation: `The answer is: ${item.correct}!`
    };
  });
}

// Position reasoning (spatial_folding)
const POSITION_ANIMALS = [
  { name: "Cat", icon: "🐱" }, { name: "Dog", icon: "🐶" }, { name: "Bunny", icon: "🐰" },
  { name: "Fox", icon: "🦊" }, { name: "Bear", icon: "🐻" }, { name: "Panda", icon: "🐼" },
  { name: "Frog", icon: "🐸" }, { name: "Pig", icon: "🐷" }
];

function generatePositionQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const n = pgRandInt(3, 4);
    const animals = pgPickN(POSITION_ANIMALS, n);
    const mode = pgPick(n === 3 ? ["between", "leftOf", "rightOf", "ordinal"] : ["leftOf", "rightOf", "ordinal"]);
    let correctAnimal, questionText, hintText;
    if (mode === "between" && n === 3) {
      correctAnimal = animals[1];
      questionText = `Look at the animal parade: ${animals.map(a => a.icon + " " + a.name).join(", ")}. Which animal is standing BETWEEN the ${animals[0].name} and the ${animals[2].name}?`;
      hintText = `"Between" means in the middle of the two others.`;
    } else if (mode === "leftOf") {
      const idx = pgRandInt(1, n - 1);
      correctAnimal = animals[idx - 1];
      questionText = `Look at the animal parade: ${animals.map(a => a.icon + " " + a.name).join(", ")}. Which animal is just to the LEFT of the ${animals[idx].name}?`;
      hintText = `Left means the side the line starts from - look at the animal right before the ${animals[idx].name}.`;
    } else if (mode === "rightOf") {
      const idx = pgRandInt(0, n - 2);
      correctAnimal = animals[idx + 1];
      questionText = `Look at the animal parade: ${animals.map(a => a.icon + " " + a.name).join(", ")}. Which animal is just to the RIGHT of the ${animals[idx].name}?`;
      hintText = `Right means further along the line - look at the animal right after the ${animals[idx].name}.`;
    } else {
      const ordinals = ["1st", "2nd", "3rd", "4th"];
      const idx = pgRandInt(0, n - 1);
      correctAnimal = animals[idx];
      questionText = `The animals line up for lunch: ${animals.map(a => a.icon + " " + a.name).join(", ")}. Which animal is ${ordinals[idx]} in line?`;
      hintText = `Count from the start of the line: 1st, 2nd, 3rd...`;
    }
    const distractors = animals.filter(a => a.name !== correctAnimal.name);
    const options = pgShuffle([correctAnimal, ...distractors]).slice(0, 4).map(a => ({ text: a.name, icon: a.icon }));
    const correctIndex = options.findIndex(o => o.text === correctAnimal.name);
    out.push({
      id: `gen_position_${i}_${mode}_${animals.map(a => a.name).join("")}_${Math.random()}`,
      category: "spatial_folding",
      standard: "Spatial - Position Words (Left, Right, Between)",
      difficulty: mode === "ordinal" ? 1 : 2,
      prompt: questionText,
      visualType: "sequence",
      visualData: { items: animals.map(a => a.icon) },
      options,
      correctIndex,
      hint: hintText,
      explanation: `The ${correctAnimal.name} ${correctAnimal.icon} is in that spot!`
    });
  }
  return out;
}

// Symmetry objects pool (spatial_folding)
const SYMMETRY_POOL = [
  { correct: "Butterfly", icon: "🦋", wrongs: [{ t: "Flag blowing sideways", i: "🚩" }, { t: "The letter F", i: "🇫" }, { t: "A checkmark", i: "✔️" }] },
  { correct: "Heart", icon: "❤️", wrongs: [{ t: "The letter R", i: "🇷" }, { t: "The number 7", i: "7️⃣" }, { t: "A boot", i: "🥾" }] },
  { correct: "Circle", icon: "⭕", wrongs: [{ t: "The letter J", i: "🇯" }, { t: "The letter G", i: "🇬" }, { t: "The number 2", i: "2️⃣" }] },
  { correct: "Snowflake", icon: "❄️", wrongs: [{ t: "A sideways arrow", i: "➡️" }, { t: "The letter P", i: "🇵" }, { t: "The number 5", i: "5️⃣" }] },
  { correct: "Star", icon: "⭐", wrongs: [{ t: "The letter Q", i: "🇶" }, { t: "A comma", i: "«" }, { t: "The number 4", i: "4️⃣" }] },
  { correct: "Ladybug seen from above", icon: "🐞", wrongs: [{ t: "The letter L", i: "🇱" }, { t: "The number 6", i: "6️⃣" }, { t: "A swoosh", i: "〰️" }] }
];

function generateSymmetryQuestions(count) {
  const pool = pgShuffle(SYMMETRY_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([
      { text: item.correct, icon: item.icon, isCorrect: true },
      ...item.wrongs.map(w => ({ text: w.t, icon: w.i, isCorrect: false }))
    ]);
    const correctIndex = options.findIndex(o => o.isCorrect);
    return {
      id: `gen_symmetry_${i}_${item.correct.replace(/\s/g, "")}_${Math.random()}`,
      category: "spatial_folding",
      standard: "Spatial - Lines of Symmetry in Objects",
      difficulty: 3,
      prompt: `Which of these has a LINE OF SYMMETRY - meaning you could fold it down the middle and both halves would match perfectly?`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options: options.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `Imagine folding each one down the middle like a piece of paper. Which one's two sides are mirror twins?`,
      explanation: `A ${item.correct.toLowerCase()} is symmetrical - fold it down the middle and both halves match!`
    };
  });
}

// Hidden block counting with a buried layer (spatial_folding)
function generateHiddenBlockQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const bottom = pgRandInt(3, 6);
    const top = pgRandInt(1, bottom - 1);
    const correct = bottom + top;
    const { options, correctIndex } = pgBuildNumberOptions(correct, 2, 14);
    const optionsLabeled = options.map(o => ({ text: `${o.text} Blocks`, icon: "🧱" }));
    out.push({
      id: `gen_hiddenblocks_${i}_${bottom}_${top}_${Math.random()}`,
      category: "spatial_folding",
      standard: "NNAT3 - Hidden Block Structure Counting",
      difficulty: 4,
      prompt: `A block building has a bottom floor of ${bottom} blocks in a row, with ${top} block${top > 1 ? "s" : ""} stacked on top. Some bottom blocks are hiding under the top ones - count them anyway! How many blocks in ALL?`,
      visualType: "blocks_3d",
      visualData: { layers: [[bottom], [top]] },
      options: optionsLabeled,
      correctIndex,
      hint: `Don't forget the hidden blocks underneath! Bottom floor (${bottom}) + top blocks (${top}) = ?`,
      explanation: `${bottom} bottom blocks + ${top} top block${top > 1 ? "s" : ""} = ${correct} blocks total - even the hidden ones count!`
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

// Secret number riddles (logic_mysteries)
function generateNumberRiddleQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const low = pgRandInt(1, 15);
    const high = low + 3;
    const candidates = [low + 1, low + 2];
    const correct = pgPick(candidates);
    const excluded = candidates.find(c => c !== correct);
    const distractors = pgUniqueDistractors(correct, 1, high + 5, 2).filter(d => d !== excluded).slice(0, 2);
    const values = pgShuffle([correct, excluded, ...distractors]).slice(0, 4);
    if (!values.includes(correct)) values[0] = correct;
    const options = values.map(v => ({ text: String(v), icon: "🔢" }));
    const correctIndex = values.indexOf(correct);
    out.push({
      id: `gen_numriddle_${i}_${low}_${correct}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - Secret Number Deduction",
      difficulty: 3,
      prompt: `I'm thinking of a secret number!\n• Clue 1: It is GREATER than ${low}.\n• Clue 2: It is LESS than ${high}.\n• Clue 3: It is NOT ${excluded}.\nWhat is my secret number?`,
      visualType: "logic_grid",
      visualData: { people: [`> ${low}`, `< ${high}`, `not ${excluded}`], items: values.map(String) },
      options,
      correctIndex,
      hint: `Numbers between ${low} and ${high} are: ${low + 1} and ${low + 2}. Now cross out ${excluded}!`,
      explanation: `Between ${low} and ${high} leaves ${low + 1} and ${low + 2}. Since it's not ${excluded}, the secret number is ${correct}!`
    });
  }
  return out;
}

// Yesterday / tomorrow day logic (logic_mysteries)
function generateDayLogicQuestions(count) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const out = [];
  for (let i = 0; i < count; i++) {
    const todayIdx = pgRandInt(0, 6);
    const mode = pgPick(["yesterday", "tomorrow", "dayAfterTomorrow"]);
    let correct, questionText;
    if (mode === "yesterday") {
      correct = days[(todayIdx + 6) % 7];
      questionText = `Today is ${days[todayIdx]}. What day was it YESTERDAY?`;
    } else if (mode === "tomorrow") {
      correct = days[(todayIdx + 1) % 7];
      questionText = `Today is ${days[todayIdx]}. What day will it be TOMORROW?`;
    } else {
      correct = days[(todayIdx + 2) % 7];
      questionText = `Today is ${days[todayIdx]}. What day will it be the DAY AFTER tomorrow? (That's 2 days from now!)`;
    }
    const distractors = pgPickN(days.filter(d => d !== correct), 3);
    const options = pgShuffle([correct, ...distractors]).map(d => ({ text: d, icon: "📅" }));
    const correctIndex = options.findIndex(o => o.text === correct);
    out.push({
      id: `gen_daylogic_${i}_${todayIdx}_${mode}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - Time & Day Reasoning",
      difficulty: mode === "dayAfterTomorrow" ? 4 : 2,
      prompt: questionText,
      visualType: "sequence",
      visualData: { items: mode === "yesterday" ? ["❓", `${days[todayIdx]} (today)`] : [`${days[todayIdx]} (today)`, mode === "tomorrow" ? "❓" : "tomorrow", mode === "dayAfterTomorrow" ? "❓" : ""].filter(Boolean) },
      options,
      correctIndex,
      hint: `Say the days in order and step ${mode === "yesterday" ? "BACKWARD one day" : mode === "tomorrow" ? "FORWARD one day" : "FORWARD two days"} from ${days[todayIdx]}.`,
      explanation: `Starting at ${days[todayIdx]} and going ${mode === "yesterday" ? "back one day" : mode === "tomorrow" ? "forward one day" : "forward two days"} lands on ${correct}!`
    });
  }
  return out;
}

// Silly syllogisms with made-up words (logic_mysteries)
const SYLLOGISM_POOL = [
  { rule: "ALL Zibbles are blue", fact: "Pip is a Zibble", q: "What color is Pip?", correct: "Blue - every Zibble is blue, and Pip is a Zibble!", wrongs: ["Red", "We can't know", "Green"] },
  { rule: "ALL Wugs love to sing", fact: "Momo is a Wug", q: "What does Momo love to do?", correct: "Sing - all Wugs love singing, and Momo is a Wug!", wrongs: ["Sleep all day", "We can't know", "Eat pizza"] },
  { rule: "EVERY Floof has three eyes", fact: "Teeny is a Floof", q: "How many eyes does Teeny have?", correct: "Three - every single Floof has three eyes!", wrongs: ["Two", "We can't know", "Ten"] },
  { rule: "ALL Snorps live underwater", fact: "Bubbles is a Snorp", q: "Where does Bubbles live?", correct: "Underwater - all Snorps live there, and Bubbles is a Snorp!", wrongs: ["In a treehouse", "We can't know", "On the moon"] },
  { rule: "EVERY Glimmer can fly", fact: "Twinkle is a Glimmer", q: "Can Twinkle fly?", correct: "Yes - every Glimmer can fly, so Twinkle can too!", wrongs: ["No, never", "We can't know", "Only on Tuesdays"] },
  { rule: "ALL Bloops are bouncy", fact: "Ziggy is NOT bouncy at all", q: "Can Ziggy be a Bloop?", correct: "No - all Bloops are bouncy, so a not-bouncy Ziggy can't be one!", wrongs: ["Yes, definitely", "Only at night", "Only small Bloops bounce"] }
];

function generateSyllogismQuestions(count) {
  const pool = pgShuffle(SYLLOGISM_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: "🧠" }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_syllogism_${i}_${i}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - If-All-Then Reasoning (Syllogisms)",
      difficulty: 4,
      prompt: `Silly creature logic!\n• Rule: ${item.rule}.\n• Fact: ${item.fact}.\n${item.q}`,
      visualType: "logic_grid",
      visualData: { people: [item.rule], items: [item.fact] },
      options,
      correctIndex,
      hint: `If the rule is true for ALL of them, it must be true for this one too!`,
      explanation: item.correct
    };
  });
}

// Four-person elimination grid (logic_mysteries)
function generateFourPersonLogicQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const names = pgPickN(KID_NAME_POOL, 4);
    const itemSet = pgPick(LOGIC_ITEM_SETS);
    const extraPool = LOGIC_ITEM_SETS.filter(s => s.category !== itemSet.category).flatMap(s => s.items);
    const items = pgShuffle([...itemSet.items, pgPick(extraPool)]).slice(0, 4);
    const [pA, pB, pC, pD] = names;
    const [iA, iB, iC, iD] = items;
    // Clues: B has iB, C has iC, A doesn't have iD → A has iA.
    const optionDefs = pgShuffle([
      { text: iA.name, icon: iA.icon, correct: true },
      { text: iB.name, icon: iB.icon, correct: false },
      { text: iC.name, icon: iC.icon, correct: false },
      { text: iD.name, icon: iD.icon, correct: false }
    ]);
    const correctIndex = optionDefs.findIndex(o => o.correct);
    out.push({
      id: `gen_logic4_${i}_${pA}_${iA.name}_${Math.random()}`,
      category: "logic_mysteries",
      standard: "SCPS FOCUS - Four-Friend Elimination Mystery",
      difficulty: 4,
      prompt: `${pA}, ${pB}, ${pC}, and ${pD} each picked a different favorite: ${items.map(it => it.name).join(", ")}.\n• Clue 1: ${pB} picked the ${iB.name}.\n• Clue 2: ${pC} picked the ${iC.name}.\n• Clue 3: ${pA} did NOT pick the ${iD.name}.\nWhat did ${pA} pick?`,
      visualType: "logic_grid",
      visualData: { people: names, items: items.map(it => it.name) },
      options: optionDefs.map(o => ({ text: o.text, icon: o.icon })),
      correctIndex,
      hint: `Cross out what's taken: ${pB} has the ${iB.name}, ${pC} has the ${iC.name}. That leaves two choices for ${pA} - and one of them is crossed out by Clue 3!`,
      explanation: `${pB} has the ${iB.name} and ${pC} has the ${iC.name}, leaving the ${iA.name} and ${iD.name}. Since ${pA} didn't pick the ${iD.name}, ${pA} picked the ${iA.name} (and ${pD} got the ${iD.name})!`
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

// Animal coverings (science_inquiry)
const ANIMAL_COVERING_POOL = [
  { animal: "Bear", icon: "🐻", correct: "Fur", wrongs: ["Feathers", "Scales", "A Shell"] },
  { animal: "Duck", icon: "🦆", correct: "Feathers", wrongs: ["Fur", "Scales", "A Shell"] },
  { animal: "Fish", icon: "🐟", correct: "Scales", wrongs: ["Fur", "Feathers", "Wool"] },
  { animal: "Turtle", icon: "🐢", correct: "A hard Shell", wrongs: ["Fluffy Fur", "Feathers", "Wool"] },
  { animal: "Snake", icon: "🐍", correct: "Scales", wrongs: ["Fur", "Feathers", "A Shell"] },
  { animal: "Sheep", icon: "🐑", correct: "Wool", wrongs: ["Scales", "Feathers", "A Shell"] },
  { animal: "Owl", icon: "🦉", correct: "Feathers", wrongs: ["Fur", "Scales", "Wool"] },
  { animal: "Rabbit", icon: "🐰", correct: "Soft Fur", wrongs: ["Scales", "Feathers", "A Shell"] },
  { animal: "Frog", icon: "🐸", correct: "Smooth, moist Skin", wrongs: ["Thick Fur", "Feathers", "Wool"] },
  { animal: "Crab", icon: "🦀", correct: "A hard Shell", wrongs: ["Fur", "Feathers", "Wool"] }
];

function generateAnimalCoveringQuestions(count) {
  const pool = pgShuffle(ANIMAL_COVERING_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_covering_${i}_${item.animal}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.5 - Animal Body Coverings",
      difficulty: 2,
      prompt: `What covers and protects a ${item.animal.toLowerCase()}'s body? ${item.icon}`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Picture petting or touching a ${item.animal.toLowerCase()} - what would you feel?`,
      explanation: `A ${item.animal.toLowerCase()} is covered in ${item.correct.toLowerCase()}!`
    };
  });
}

// Animal homes (science_inquiry)
const ANIMAL_HOME_POOL = [
  { animal: "Bird", icon: "🐦", correct: "A Nest", wrongs: ["A Web", "A Hive", "A Doghouse"] },
  { animal: "Bee", icon: "🐝", correct: "A Hive", wrongs: ["A Nest", "A Burrow", "A Cave"] },
  { animal: "Ant", icon: "🐜", correct: "An underground Anthill", wrongs: ["A Nest in a tree", "A Web", "A Barn"] },
  { animal: "Spider", icon: "🕷️", correct: "A Web", wrongs: ["A Hive", "A Burrow", "A Nest"] },
  { animal: "Bear", icon: "🐻", correct: "A Den or Cave", wrongs: ["A Web", "A Hive", "A Birdhouse"] },
  { animal: "Rabbit", icon: "🐰", correct: "A Burrow underground", wrongs: ["A Nest in a tree", "A Web", "A Hive"] },
  { animal: "Beaver", icon: "🦫", correct: "A Lodge it builds in the water", wrongs: ["A Cave on a mountain", "A Web", "A Birdhouse"] },
  { animal: "Horse", icon: "🐴", correct: "A Stable or Barn", wrongs: ["A Hive", "A Web", "A Burrow"] },
  { animal: "Dog", icon: "🐶", correct: "A Doghouse (or your house!)", wrongs: ["A Hive", "A Web", "An Anthill"] },
  { animal: "Squirrel", icon: "🐿️", correct: "A nest high in a Tree", wrongs: ["Underwater", "A Hive", "A Barn"] }
];

function generateAnimalHomeQuestions(count) {
  const pool = pgShuffle(ANIMAL_HOME_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_home_${i}_${item.animal}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.5 - Animal Homes & Shelters",
      difficulty: 1,
      prompt: `Where does a ${item.animal.toLowerCase()} usually make its home? ${item.icon}`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Think about where you would go looking to find a ${item.animal.toLowerCase()} sleeping!`,
      explanation: `A ${item.animal.toLowerCase()}'s home is ${item.correct.toLowerCase()}!`
    };
  });
}

// Habitats (science_inquiry)
const HABITAT_POOL = [
  { animal: "Whale", icon: "🐋", correct: "The Ocean", wrongs: ["The Desert", "The Forest", "A Pond"] },
  { animal: "Camel", icon: "🐪", correct: "The Desert", wrongs: ["The Ocean", "The Arctic", "A Pond"] },
  { animal: "Deer", icon: "🦌", correct: "The Forest", wrongs: ["The Ocean", "The Desert", "The Arctic"] },
  { animal: "Polar Bear", icon: "🐻‍❄️", correct: "The icy Arctic", wrongs: ["The hot Desert", "The Rainforest", "A warm Pond"] },
  { animal: "Monkey", icon: "🐵", correct: "The Rainforest", wrongs: ["The Arctic", "The Desert", "The deep Ocean"] },
  { animal: "Octopus", icon: "🐙", correct: "The Ocean", wrongs: ["The Forest", "The Desert", "A Meadow"] },
  { animal: "Lizard", icon: "🦎", correct: "The warm Desert", wrongs: ["The icy Arctic", "The deep Ocean", "A Snowbank"] },
  { animal: "Duck", icon: "🦆", correct: "A Pond or Lake", wrongs: ["The dry Desert", "The deep Ocean floor", "The icy Arctic"] },
  { animal: "Owl", icon: "🦉", correct: "The Forest", wrongs: ["The Ocean", "The Desert", "Under a pond"] },
  { animal: "Penguin", icon: "🐧", correct: "Cold, icy places near the sea", wrongs: ["The hot Desert", "The Rainforest treetops", "A backyard garden"] }
];

function generateHabitatQuestions(count) {
  const pool = pgShuffle(HABITAT_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_habitat_${i}_${item.animal}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.5 - Animal Habitats",
      difficulty: 2,
      prompt: `A habitat is the place where an animal naturally lives. What is the habitat of a ${item.animal.toLowerCase()}? ${item.icon}`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Think about what a ${item.animal.toLowerCase()} needs: the right food, water, and temperature to survive.`,
      explanation: `A ${item.animal.toLowerCase()} lives in ${item.correct.toLowerCase()} - that's its habitat!`
    };
  });
}

// Five senses (science_inquiry)
const SENSES_POOL = [
  { situation: "see a beautiful rainbow", correct: "Eyes (sight)", icon: "👀", wrongs: ["Ears (hearing)", "Nose (smell)", "Tongue (taste)"] },
  { situation: "hear a fire truck siren", correct: "Ears (hearing)", icon: "👂", wrongs: ["Eyes (sight)", "Tongue (taste)", "Skin (touch)"] },
  { situation: "smell cookies baking in the oven", correct: "Nose (smell)", icon: "👃", wrongs: ["Ears (hearing)", "Eyes (sight)", "Skin (touch)"] },
  { situation: "taste a sweet, juicy strawberry", correct: "Tongue (taste)", icon: "👅", wrongs: ["Nose (smell)", "Ears (hearing)", "Eyes (sight)"] },
  { situation: "feel how soft a kitten's fur is", correct: "Skin and hands (touch)", icon: "✋", wrongs: ["Ears (hearing)", "Tongue (taste)", "Nose (smell)"] },
  { situation: "notice the thunder rumbling far away", correct: "Ears (hearing)", icon: "👂", wrongs: ["Tongue (taste)", "Nose (smell)", "Hands (touch)"] },
  { situation: "feel that the sidewalk is bumpy under your feet", correct: "Skin (touch)", icon: "✋", wrongs: ["Eyes (sight)", "Ears (hearing)", "Nose (smell)"] },
  { situation: "watch fireworks sparkle in the night sky", correct: "Eyes (sight)", icon: "👀", wrongs: ["Nose (smell)", "Tongue (taste)", "Ears only"] }
];

function generateSensesQuestions(count) {
  const pool = pgShuffle(SENSES_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_senses_${i}_${i}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA Science SOL - The Five Senses",
      difficulty: 1,
      prompt: `Which sense and body part do you use to ${item.situation}?`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Your five senses are: sight, hearing, smell, taste, and touch. Which one fits?`,
      explanation: `You use your ${item.correct.toLowerCase()} to ${item.situation}!`
    };
  });
}

// Weather tools & observation (science_inquiry)
const WEATHER_TOOL_POOL = [
  { q: "Which tool tells you how HOT or COLD it is outside?", correct: "A Thermometer", icon: "🌡️", wrongs: ["A Ruler", "A Clock", "A Magnet"] },
  { q: "Which tool catches falling rain so you can measure how much fell?", correct: "A Rain Gauge", icon: "🌧️", wrongs: ["A Thermometer", "A Telescope", "A Scale"] },
  { q: "Which tool shows you which direction the WIND is blowing?", correct: "A Wind Vane (weather vane)", icon: "🌬️", wrongs: ["A Thermometer", "A Rain Gauge", "A Microscope"] },
  { q: "A windsock at the airport is puffed up and pointing sideways. What does that tell you?", correct: "The wind is blowing", wrongs: ["It is raining", "It is nighttime", "It is snowing"], icon: "🪁" },
  { q: "What should a scientist do EVERY day to track the weather?", correct: "Observe and record what they see", icon: "📓", wrongs: ["Guess without looking", "Only check once a year", "Ask a goldfish"] },
  { q: "The thermometer reads very HOT and the sky is clear. What should Lily wear outside?", correct: "Shorts, t-shirt, sunscreen and a sun hat", icon: "☀️", wrongs: ["A heavy snow coat", "Rain boots and umbrella", "Mittens and a scarf"] },
  { q: "The weather report says SNOW is coming. What should Lily wear?", correct: "A warm coat, hat, and mittens", icon: "❄️", wrongs: ["A swimsuit", "Sandals and sunglasses", "Just pajamas"] }
];

function generateWeatherToolQuestions(count) {
  const pool = pgShuffle(WEATHER_TOOL_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_weathertool_${i}_${i}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.6/1.7 - Weather Tools & Observation",
      difficulty: 2,
      prompt: item.q,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Think like a weather scientist (a meteorologist) - which tool or choice fits the weather?`,
      explanation: `${item.correct}!`
    };
  });
}

// Push & pull forces, VA SOL 1.2 (science_inquiry)
const PUSH_PULL_POOL = [
  { action: "Kicking a soccer ball across the field", correct: "A PUSH", icon: "⚽" },
  { action: "Opening a drawer toward you", correct: "A PULL", icon: "🗄️" },
  { action: "Pressing an elevator button", correct: "A PUSH", icon: "🔘" },
  { action: "Dragging a wagon behind you", correct: "A PULL", icon: "🛒" },
  { action: "Pushing a friend on a swing", correct: "A PUSH", icon: "🧒" },
  { action: "Tugging a rope in tug-of-war", correct: "A PULL", icon: "🪢" },
  { action: "Rolling a bowling ball down the lane", correct: "A PUSH", icon: "🎳" },
  { action: "Pulling a sled up a snowy hill", correct: "A PULL", icon: "🛷" },
  { action: "Closing the car door from outside", correct: "A PUSH", icon: "🚗" },
  { action: "Picking a carrot out of the ground", correct: "A PULL", icon: "🥕" }
];

function generatePushPullQuestions(count) {
  const out = [];
  const motionExtras = [
    { q: "Which will make a toy car move FASTER?", correct: "A big, strong push", icon: "🏎️", wrongs: ["A tiny, gentle tap", "No push at all", "Whispering to it"] },
    { q: "A ball is rolling across the grass. What will eventually make it STOP?", correct: "The grass rubbing against it slows it down", icon: "⚽", wrongs: ["It speeds up forever", "It turns into a cube", "The air makes it faster"] },
    { q: "Which surface will a toy car roll FARTHEST on after the same push?", correct: "Smooth wood floor", icon: "🚗", wrongs: ["Thick fluffy carpet", "Sticky mud", "Deep sand"] }
  ];
  for (let i = 0; i < count; i++) {
    if (i % 4 === 3) {
      const extra = pgPick(motionExtras);
      const options = pgShuffle([extra.correct, ...extra.wrongs]).map(t => ({ text: t, icon: extra.icon }));
      const correctIndex = options.findIndex(o => o.text === extra.correct);
      out.push({
        id: `gen_motion_${i}_${Math.random()}`,
        category: "science_inquiry",
        standard: "VA SOL 1.2 - Force & Motion",
        difficulty: 3,
        prompt: extra.q,
        visualType: "classification",
        visualData: { shapes: options.map(o => o.text) },
        options,
        correctIndex,
        hint: `Think about what makes things speed up, slow down, or keep rolling.`,
        explanation: `${extra.correct}!`
      });
    } else {
      const item = pgPick(PUSH_PULL_POOL);
      const wrong = item.correct === "A PUSH" ? "A PULL" : "A PUSH";
      const options = pgShuffle([
        { text: item.correct, icon: item.icon, isCorrect: true },
        { text: wrong, icon: item.icon, isCorrect: false },
        { text: "Neither - no force is used", icon: "🚫", isCorrect: false },
        { text: "Gravity turning off", icon: "🌎", isCorrect: false }
      ]);
      const correctIndex = options.findIndex(o => o.isCorrect);
      out.push({
        id: `gen_pushpull_${i}_${item.action.slice(0, 10)}_${Math.random()}`,
        category: "science_inquiry",
        standard: "VA SOL 1.2 - Push & Pull Forces",
        difficulty: 2,
        prompt: `Forces make things move! Is this a PUSH or a PULL? "${item.action}"`,
        visualType: "classification",
        visualData: { shapes: [item.action] },
        options: options.map(o => ({ text: o.text, icon: o.icon })),
        correctIndex,
        hint: `A PUSH moves something AWAY from you. A PULL brings something TOWARD you.`,
        explanation: `${item.action} is ${item.correct.toLowerCase()}!`
      });
    }
  }
  return out;
}

// Magnets (science_inquiry)
const MAGNETIC_ITEMS = [
  { name: "Steel Paperclip", icon: "📎", magnetic: true }, { name: "Iron Nail", icon: "🔩", magnetic: true },
  { name: "Metal Scissors", icon: "✂️", magnetic: true }, { name: "Refrigerator Door", icon: "🧲", magnetic: true },
  { name: "Crayon", icon: "🖍️", magnetic: false }, { name: "Paper", icon: "📄", magnetic: false },
  { name: "Leaf", icon: "🍃", magnetic: false }, { name: "Plastic Toy", icon: "🧸", magnetic: false },
  { name: "Rubber Band", icon: "🪢", magnetic: false }, { name: "Wooden Block", icon: "🪵", magnetic: false }
];

function generateMagnetQuestions(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const askMagnetic = Math.random() < 0.6;
    const correctPool = MAGNETIC_ITEMS.filter(m => m.magnetic === askMagnetic);
    const wrongPool = MAGNETIC_ITEMS.filter(m => m.magnetic !== askMagnetic);
    const correct = pgPick(correctPool);
    const distractors = pgPickN(wrongPool, 3);
    const options = pgShuffle([correct, ...distractors]).map(o => ({ text: o.name, icon: o.icon }));
    const correctIndex = options.findIndex(o => o.text === correct.name);
    out.push({
      id: `gen_magnet_${i}_${correct.name}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA Science SOL - Magnets Attract Iron & Steel",
      difficulty: 2,
      prompt: askMagnetic ? `Lily waves a magnet over her desk. Which item will the magnet STICK to?` : `Which of these will a magnet NOT pick up?`,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Magnets only attract things made of certain metals, like iron and steel - not paper, plastic, or wood.`,
      explanation: askMagnetic
        ? `The ${correct.name.toLowerCase()} is made of metal with iron/steel, so the magnet sticks to it!`
        : `The ${correct.name.toLowerCase()} has no iron or steel in it, so the magnet ignores it!`
    });
  }
  return out;
}

// Natural resources & taking care of Earth, VA SOL 1.8 (science_inquiry)
const EARTH_CARE_POOL = [
  { q: "Which of these is a NATURAL resource (something from nature that we use)?", correct: "Water", icon: "💧", wrongs: ["A Television", "A Video Game", "A Plastic Toy"] },
  { q: "Paper is made from which natural resource?", correct: "Trees", icon: "🌳", wrongs: ["Rocks", "Clouds", "Sand"] },
  { q: "Lily finishes her juice. The plastic bottle should go in the...", correct: "Recycling Bin", icon: "♻️", wrongs: ["Toilet", "Backyard grass", "Storm drain"] },
  { q: "Which is a smart way to SAVE water at home?", correct: "Turn off the faucet while brushing your teeth", icon: "🚰", wrongs: ["Let the water run all day", "Water the driveway", "Take 3 baths in a row"] },
  { q: "What does RECYCLING mean?", correct: "Turning old things into new things instead of trashing them", icon: "♻️", wrongs: ["Throwing everything in the ocean", "Burying toys in the yard", "Buying more stuff"] },
  { q: "Which of these gives us light and warmth and is a natural resource?", correct: "The Sun", icon: "☀️", wrongs: ["A Flashlight", "A Lamp", "A Phone Screen"] },
  { q: "What can Lily do with vegetable scraps to help her garden grow?", correct: "Compost them into rich soil", icon: "🌱", wrongs: ["Throw them in the street", "Hide them under her bed", "Mail them away"] },
  { q: "Why should we NOT litter at the park?", correct: "Trash can hurt animals and spoil nature", icon: "🚯", wrongs: ["Litter helps flowers grow", "Animals love eating plastic", "The wind cleans it up"] }
];

function generateEarthCareQuestions(count) {
  const pool = pgShuffle(EARTH_CARE_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_earthcare_${i}_${i}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.8 - Natural Resources & Conservation",
      difficulty: 2,
      prompt: item.q,
      visualType: "classification",
      visualData: { shapes: options.map(o => o.text) },
      options,
      correctIndex,
      hint: `Think about what comes from nature and how we can protect the Earth!`,
      explanation: `${item.correct}!`
    };
  });
}

// Plant parts & jobs, VA SOL 1.4 (science_inquiry)
const PLANT_PART_POOL = [
  { q: "Which plant part grows UNDER the ground and drinks up water?", correct: "The Roots", icon: "🌱", wrongs: ["The Flower", "The Leaves", "The Petals"] },
  { q: "Which plant part works like a straw, carrying water UP from the roots?", correct: "The Stem", icon: "🌿", wrongs: ["The Flower", "The Roots", "The Seeds"] },
  { q: "Which plant part catches sunlight to make food for the plant?", correct: "The Leaves", icon: "🍃", wrongs: ["The Roots", "The Stem", "The Soil"] },
  { q: "Which plant part makes SEEDS so new plants can grow?", correct: "The Flower", icon: "🌸", wrongs: ["The Roots", "The Stem", "The Dirt"] },
  { q: "What is hiding inside a seed?", correct: "A tiny baby plant waiting to grow", icon: "🌰", wrongs: ["A little rock", "Water drops", "A bug"] },
  { q: "What do we call it when a seed wakes up and starts to grow?", correct: "Sprouting (germination)", icon: "🌱", wrongs: ["Melting", "Hibernating", "Evaporating"] },
  { q: "Which part of the carrot plant do we actually EAT?", correct: "The Root", icon: "🥕", wrongs: ["The Flower", "The Leaf only", "The Seed only"] },
  { q: "Why do flowers have bright colors and sweet smells?", correct: "To attract bees and butterflies that spread pollen", icon: "🐝", wrongs: ["To scare away sunshine", "To look nice for photos", "To catch rain"] }
];

function generatePlantPartQuestions(count) {
  const pool = pgShuffle(PLANT_PART_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_plantpart_${i}_${i}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.4 - Plant Parts & Their Jobs",
      difficulty: 2,
      prompt: item.q,
      visualType: "plant_needs",
      visualData: { plant: "Plant Parts" },
      options,
      correctIndex,
      hint: `Picture a flower from bottom to top: roots, stem, leaves, flower!`,
      explanation: `${item.correct}!`
    };
  });
}

// Day & night sky, VA SOL 1.6 (science_inquiry)
const SKY_POOL = [
  { q: "Which of these do we usually see ONLY in the night sky?", correct: "The Moon and Stars", icon: "🌙", wrongs: ["The bright Sun", "Rainbows", "Blue Sky"] },
  { q: "What gives Earth its light and heat during the day?", correct: "The Sun", icon: "☀️", wrongs: ["The Moon", "Street Lights", "Lightning Bugs"] },
  { q: "Why can't we see the stars during the day?", correct: "The Sun's light is so bright it hides them", icon: "🌟", wrongs: ["Stars go to sleep", "Stars melt in the morning", "Clouds eat them"] },
  { q: "The Sun seems to 'rise' and 'set' every day. Why?", correct: "Because the Earth is spinning", icon: "🌍", wrongs: ["The Sun bounces up and down", "The Sun turns on and off", "Clouds push the Sun"] },
  { q: "When it is DAY where Lily lives in Virginia, what is it on the other side of the world?", correct: "Night", icon: "🌏", wrongs: ["Also day", "Always lunchtime", "No time at all"] },
  { q: "Which is bigger in real life, even though they look similar in the sky?", correct: "The Sun is MUCH bigger than the Moon", icon: "☀️", wrongs: ["The Moon is bigger", "They are exactly equal", "Stars are the smallest things in space"] }
];

function generateSkyQuestions(count) {
  const pool = pgShuffle(SKY_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_sky_${i}_${i}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.6 - Sun, Moon & the Day/Night Sky",
      difficulty: pgRandInt(2, 3),
      prompt: item.q,
      visualType: "shadow_science",
      visualData: { sunPosition: "sky" },
      options,
      correctIndex,
      hint: `Think about what you see when you look up in the daytime versus at bedtime!`,
      explanation: `${item.correct}!`
    };
  });
}

// How animals survive winter (science_inquiry)
const WINTER_SURVIVAL_POOL = [
  { q: "What does a bear do to survive the cold winter?", correct: "Hibernates - sleeps deeply in its den for months", icon: "🐻", wrongs: ["Flies south like a bird", "Grows wings", "Swims to the ocean"] },
  { q: "Why do many birds fly SOUTH when winter comes?", correct: "To find warmer weather and more food (migration)", icon: "🦅", wrongs: ["They're afraid of snowmen", "To race each other", "Their wings freeze otherwise"] },
  { q: "What does a squirrel do in fall to get ready for winter?", correct: "Gathers and hides acorns to eat later", icon: "🐿️", wrongs: ["Builds a snowman", "Flies south", "Sheds all its fur"] },
  { q: "How does a fox's thick winter coat help it?", correct: "It keeps the fox warm in freezing weather", icon: "🦊", wrongs: ["It helps the fox fly", "It makes the fox invisible", "It lets the fox breathe underwater"] },
  { q: "What happens to many trees in winter?", correct: "They lose their leaves and rest until spring", icon: "🌳", wrongs: ["They grow twice as fast", "They walk somewhere warm", "They bloom flowers"] },
  { q: "Monarch butterflies travel thousands of miles to Mexico each fall. What is that journey called?", correct: "Migration", icon: "🦋", wrongs: ["Hibernation", "Vacation", "Evaporation"] }
];

function generateWinterSurvivalQuestions(count) {
  const pool = pgShuffle(WINTER_SURVIVAL_POOL);
  const chosen = count >= pool.length ? pool : pool.slice(0, count);
  return chosen.map((item, i) => {
    const options = pgShuffle([item.correct, ...item.wrongs]).map(t => ({ text: t, icon: item.icon }));
    const correctIndex = options.findIndex(o => o.text === item.correct);
    return {
      id: `gen_winter_${i}_${i}_${Math.random()}`,
      category: "science_inquiry",
      standard: "VA SOL 1.5/1.7 - How Animals Survive Seasons",
      difficulty: 3,
      prompt: item.q,
      visualType: "camouflage",
      visualData: { season: "Winter" },
      options,
      correctIndex,
      hint: `Animals have clever tricks for winter: hibernating, migrating, storing food, or growing warm coats!`,
      explanation: `${item.correct}!`
    };
  });
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
    ...generateNumberSeriesQuestions(60),
    ...generateNumberAnalogyQuestions(50),
    ...generateEvenOddQuestions(30),
    ...generateTenMoreLessQuestions(50),
    ...generateFactFamilyQuestions(40),
    ...generateFractionQuestions(24),
    ...generateMeasurementQuestions(40),
    ...generateGraphReadingQuestions(40),
    ...generateNumberWordQuestions(40),
    ...generateCalendarQuestions(40),

    // Verbal
    ...generateVerbalAnalogies(VERBAL_ANALOGY_POOL.length),
    ...generateRiddleQuestions(RIDDLE_POOL.length),
    ...generateRhymeQuestions(40),
    ...generateSynonymQuestions(SYNONYM_POOL.length),
    ...generateAntonymQuestions(ANTONYM_POOL.length),
    ...generateOddWordOutQuestions(ODD_WORD_OUT_POOL.length),
    ...generateCompoundWordQuestions(COMPOUND_WORD_POOL.length),
    ...generateBeginningSoundQuestions(40),
    ...generateSentenceCompletionQuestions(SENTENCE_COMPLETION_POOL.length),
    ...generateSyllableQuestions(SYLLABLE_POOL.length),

    // Matrix / Nonverbal Reasoning
    ...generateColorCycleQuestions(50),
    ...generateSizeCycleQuestions(20),
    ...generateOddOneOutQuestions(50),
    ...generateSidesAnalogyQuestions(30),
    ...generateGrowingDotsQuestions(40),
    ...generateMatrix2x2Questions(60),
    ...generateLetterSeriesQuestions(40),
    ...generateABPatternQuestions(40),
    ...generateShapeCycleQuestions(40),
    ...generateMatrixCountQuestions(40),
    ...generateMatrix2x2SizeQuestions(40),

    // Spatial & Visual
    ...generatePaperFoldQuestions(40),
    ...generateBlockCountQuestions(50),
    ...generateMirrorQuestions(40),
    ...generateRotationQuestions(40),
    ...generateSolidShapeQuestions(SOLID_SHAPE_FACTS.length),
    ...generateShapeComposeQuestions(SHAPE_COMPOSE_POOL.length),
    ...generatePositionQuestions(50),
    ...generateSymmetryQuestions(SYMMETRY_POOL.length),
    ...generateHiddenBlockQuestions(30),

    // Deductive Logic Mysteries
    ...generateLogicGridQuestions(60),
    ...generateOrderSequenceQuestions(50),
    ...generateComparativeOrderQuestions(40),
    ...generateNumberRiddleQuestions(40),
    ...generateDayLogicQuestions(40),
    ...generateSyllogismQuestions(SYLLOGISM_POOL.length),
    ...generateFourPersonLogicQuestions(50),

    // Science Explorer
    ...generateLivingNonlivingQuestions(40),
    ...generateStateOfMatterQuestions(40),
    ...generateLifeCycleQuestions(28),
    ...generateAnimalNeedsQuestions(28),
    ...generateSeasonQuestions(15),
    ...generateSinkFloatQuestions(32),
    ...generateAnimalCoveringQuestions(ANIMAL_COVERING_POOL.length),
    ...generateAnimalHomeQuestions(ANIMAL_HOME_POOL.length),
    ...generateHabitatQuestions(HABITAT_POOL.length),
    ...generateSensesQuestions(SENSES_POOL.length),
    ...generateWeatherToolQuestions(WEATHER_TOOL_POOL.length),
    ...generatePushPullQuestions(40),
    ...generateMagnetQuestions(30),
    ...generateEarthCareQuestions(EARTH_CARE_POOL.length),
    ...generatePlantPartQuestions(PLANT_PART_POOL.length),
    ...generateSkyQuestions(SKY_POOL.length),
    ...generateWinterSurvivalQuestions(WINTER_SURVIVAL_POOL.length)
  ];
}

