/**
 * Virginia Standards of Learning (SOL) - Grade 1
 * and Stafford County Public Schools (SCPS) Gifted / FOCUS Identification Standards
 */

const VA_SOL_STANDARDS = {
  math: [
    { id: 'SOL.1.1', title: 'Number Sense & Counting', desc: 'Count forward/backward, identify tens and ones, compare numbers to 120.' },
    { id: 'SOL.1.2', title: 'Ordinal Numbers & Fractions', desc: 'Use ordinal numbers first-tenth, recognize halves and fourths.' },
    { id: 'SOL.1.3', title: 'Skip Counting & Grouping', desc: 'Count by 2s, 5s, and 10s to 120 and group objects.' },
    { id: 'SOL.1.5', title: 'Addition & Subtraction Facts', desc: 'Recall addition/subtraction facts within 20; solve real-world problems.' },
    { id: 'SOL.1.6', title: 'Equality & Balance', desc: 'Understand the equal sign (=) as balance, find missing numbers.' },
    { id: 'SOL.1.11', title: '2D & 3D Geometry', desc: 'Identify, describe, and combine circles, triangles, squares, rectangles, spheres, cubes, cones.' },
    { id: 'SOL.1.13', title: 'Time & Money', desc: 'Tell time to hour and half-hour; identify penny, nickel, dime, quarter and value.' },
    { id: 'SOL.1.14', title: 'Patterns & Sequences', desc: 'Identify, describe, extend, and create repeating and growing patterns.' },
    { id: 'SOL.1.15', title: 'Data & Graphing', desc: 'Collect, organize, and interpret data in tally charts and picture graphs.' }
  ],
  reading: [
    { id: 'SOL.1.5', title: 'Phonological Awareness & Phonics', desc: 'Blend, segment, decode one- and two-syllable words and rhyme patterns.' },
    { id: 'SOL.1.6', title: 'Vocabulary & Context Clues', desc: 'Use context, synonyms, and antonyms to understand new words.' },
    { id: 'SOL.1.8', title: 'Reading Comprehension & Inference', desc: 'Identify main idea, sequence events, make inferences, and predict outcomes.' },
    { id: 'SOL.1.9', title: 'Verbal Analogies & Classification', desc: 'Categorize words and understand semantic relationships.' }
  ],
  science: [
    { id: 'SOL.1.1', title: 'Scientific Investigation', desc: 'Observe, classify, measure, predict, and conduct simple investigations.' },
    { id: 'SOL.1.4', title: 'Plants, Animals & Life Cycles', desc: 'Understand living vs. non-living, plant/animal needs, and life cycles.' },
    { id: 'SOL.1.6', title: 'Earth Patterns & Seasons', desc: 'Observe day/night, sun, moon, weather patterns, and seasonal changes.' },
    { id: 'SOL.1.7', title: 'Matter & Properties', desc: 'Investigate physical properties, solids/liquids/gases, and sink/float.' }
  ]
};

const SCPS_GATE_STANDARDS = {
  district: 'Stafford County Public Schools (SCPS)',
  school: 'Winding Creek Elementary School',
  programName: 'SCPS Gifted and Talented Education (FOCUS)',
  assessmentBatteries: [
    {
      domain: 'cogat_nonverbal',
      name: 'Nonverbal & Matrix Reasoning (CogAT/NNAT3)',
      skills: ['2x2 Figure Matrices', 'Spatial Transformations', 'Pattern Synthesis', 'Paper Folding & Symmetry', 'Figure Classification']
    },
    {
      domain: 'cogat_quantitative',
      name: 'Quantitative Reasoning & Mathematical Logic',
      skills: ['Number Analogies', 'Algebraic Balance Scales', 'Growing Number Sequences', 'Multi-Step Math Logic', 'Hidden Patterns']
    },
    {
      domain: 'cogat_verbal',
      name: 'Verbal Reasoning & Deductive Language',
      skills: ['Verbal Analogies', 'Category Deduction', 'Context Clue Riddles', 'Sentence Completion', 'Antonym/Synonym Logic']
    },
    {
      domain: 'spatial_visual',
      name: 'Spatial Visualization & Geometry',
      skills: ['Hidden 3D Cube Counts', 'Rotated Shapes', 'Mirror Reflections', 'Tangram Deconstruction', 'Perspective Views']
    },
    {
      domain: 'deductive_logic',
      name: 'SCPS Deductive Logic Mysteries',
      skills: ['Logic Grid Puzzles', 'Order & Sequencing Clues', 'Exclusion Logic', 'If-Then Reasoning']
    },
    {
      domain: 'creative_divergent',
      name: 'Scientific Inquiry & Lateral Thinking',
      skills: ['Cause & Effect Deduction', 'Hypothesis Testing', 'Divergent Association', 'Pattern Rule Discovery']
    }
  ]
};
