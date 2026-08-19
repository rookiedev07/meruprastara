const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const ChandasNote = require('../models/ChandasNote');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const articles = [
  {
    title: 'Ācārya Piṅgala & the Chandaḥśāstra',
    body: `Ācārya Piṅgala (c. 3rd–2nd century BCE) was an ancient Indian mathematician and grammarian who composed the **Chandaḥśāstra** ("Science of Sanskrit Meters"). In Chapter 8 of this seminal work, Piṅgala presented a systematic method for enumerating all possible combinations of **Laghu** (light, 1 mora, denoted as |) and **Guru** (heavy, 2 morae, denoted as ऽ) syllables in Sanskrit poetic meters.\n\nTo count how many meters of total length *n* contain exactly *r* heavy syllables, Piṅgala described a tabular expansion structure known as **Meru-Prastāra** ("Mount Meru Expansion"). This structure is mathematically identical to what was later known in Western mathematics as Pascal's Triangle (Blaise Pascal, 1655 CE) and in China as Yang Hui's Triangle (1261 CE), preceding both by over a millennium.`,
    category: 'history',
    author: 'TYCS IKSCS Research Team',
    publishedAt: new Date('2026-07-01')
  },
  {
    title: 'Connecting Meru-Prastāra to Dynamic Programming & Memoization',
    body: `In modern Computer Science, computing binomial coefficients C(n,r) via naive recursion mirrors Piṅgala's combinatorial recurrence:\n\n$$C(n,r) = C(n-1, r-1) + C(n-1, r)$$\n\nHowever, a naive recursive implementation evaluates identical subproblems repeatedly. For instance, calculating C(5,3) evaluates C(3,2) multiple times across separate tree branches, causing $O(2^n)$ exponential growth in execution time and stack space.\n\nBy introducing **Memoization** (Top-Down caching) or **Tabulation** (Bottom-Up table filling as in Meru-Prastāra's row-by-row construction), we eliminate all duplicate subproblem evaluations, reducing execution time to $O(n \\times r)$ linear space and time.`,
    category: 'method',
    author: 'TYCS IKSCS Research Team',
    publishedAt: new Date('2026-07-05')
  },
  {
    title: 'Glossary of Indian Prosody (Chandaḥśāstra) & Combinatorics',
    body: `### Core Terminology:\n- **Meru-Prastāra**: "Expansion of Mount Meru" — the pyramid layout of binomial coefficients.\n- **Laghu (लघु)**: A short syllable having a duration of 1 matra (mora). Symbol: |\n- **Guru (गुरु)**: A long syllable having a duration of 2 matras. Symbol: ऽ\n- **Prastāra**: Systematic step-by-step permutation listing of all possible meter patterns.\n- **Saṅkhyā**: Direct formula computation for total combinations of meter length *n* ($2^n$).\n- **Naṣṭam & Uddiṣṭam**: Algorithms for finding the pattern given an index, and finding the index given a pattern.`,
    category: 'glossary',
    author: 'TYCS IKSCS Research Team',
    publishedAt: new Date('2026-07-10')
  }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/meruprastara';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    await ChandasNote.deleteMany();
    await ChandasNote.insertMany(articles);

    console.log('Successfully seeded Chandaḥśāstra historical articles!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
