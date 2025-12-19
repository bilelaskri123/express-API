const fs = require("fs");
const path = require("path");

const AUTHORS = [
  "69413a707e9e7c3f938e46ae",
  "69413a9c7e9e7c3f938e46b0",
  "6945512ba0d1b12e152e5677",
];

const COVER_TYPES = ["soft cover", "hard cover"];

const sampleAdjectives = [
  "Ancient",
  "Modern",
  "Hidden",
  "Brave",
  "Lonely",
  "Bright",
  "Silent",
  "Lost",
  "Sacred",
  "Wild",
];

const sampleNouns = [
  "Secrets",
  "Dreams",
  "Worlds",
  "Rivers",
  "Cities",
  "Hearts",
  "Journeys",
  "Shadows",
  "Legends",
  "Voices",
];

const sampleVerbs = [
  "Exploring",
  "Finding",
  "Chasing",
  "Building",
  "Remembering",
  "Breaking",
  "Crossing",
  "Facing",
];

const sampleObjects = [
  "the Past",
  "Tomorrow",
  "Home",
  "The Mountain",
  "Our Future",
  "the Edge",
  "the Unknown",
];

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPrice() {
  return Number((Math.random() * (100 - 5) + 5).toFixed(2));
}

function randomTitle() {
  return `${sampleAdjectives[randInt(0, sampleAdjectives.length - 1)]} ${
    sampleNouns[randInt(0, sampleNouns.length - 1)]
  }`;
}

function randomDescription() {
  const parts = [];
  const sentences = randInt(2, 5);
  for (let i = 0; i < sentences; i++) {
    parts.push(
      `${sampleVerbs[randInt(0, sampleVerbs.length - 1)]} ${sampleObjects[
        randInt(0, sampleObjects.length - 1)
      ].toLowerCase()}`
    );
  }
  // join into a short paragraph
  return parts.join(". ") + ".";
}

function randomCover() {
  return COVER_TYPES[randInt(0, COVER_TYPES.length - 1)];
}

function randomAuthor() {
  return AUTHORS[randInt(0, AUTHORS.length - 1)];
}

function makeBook(index) {
  return {
    title: `${randomTitle()} #${index + 1}`,
    description: randomDescription(),
    author: randomAuthor(),
    price: randomPrice(),
    coverImage: randomCover(),
  };
}

function generate(n = 100) {
  const books = Array.from({ length: n }, (_, i) => makeBook(i));
  return books;
}

function writeToFile(books) {
  const outDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, "books.json");
  fs.writeFileSync(outPath, JSON.stringify(books, null, 2), "utf8");
  console.log(`Wrote ${books.length} books to ${outPath}`);
}

(function main() {
  const books = generate(100);
  writeToFile(books);
})();
