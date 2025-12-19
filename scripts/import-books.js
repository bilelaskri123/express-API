#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const { Book } = require("../models/Book");

async function main() {
  const filePath = path.join(__dirname, "..", "data", "books.json");
  if (!fs.existsSync(filePath)) {
    console.error("books.json not found at", filePath);
    process.exit(1);
  }

  let books;
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    books = JSON.parse(raw);
    if (!Array.isArray(books)) throw new Error("Expected an array of books");
  } catch (err) {
    console.error("Failed to read or parse books.json:", err.message);
    process.exit(1);
  }

  // connect to DB (expects MONGO_URI in env or use --env-file .env when running)
  await connectDB();

  const clear = process.argv.includes("--clear") || process.argv.includes("-c");
  const force = process.argv.includes("--force") || process.argv.includes("-f");
  try {
    if (clear) {
      if (!force) {
        // Ask for confirmation interactively
        const readline = require("readline");
        const answer = await new Promise((resolve) => {
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question(
            'Are you sure you want to clear existing books? Type "yes" to confirm: ',
            (ans) => {
              rl.close();
              resolve(ans);
            }
          );
        });

        if (!answer || !/^y(es)?$/i.test(answer.trim())) {
          console.log(
            "Clear aborted by user. Proceeding to insert without clearing."
          );
        } else {
          const deleted = await Book.deleteMany({});
          console.log(`Cleared existing books (${deleted.deletedCount})`);
        }
      } else {
        // forced clear without prompt
        const deleted = await Book.deleteMany({});
        console.log(`Cleared existing books (${deleted.deletedCount})`);
      }
    }

    const inserted = await Book.insertMany(books, { ordered: false });
    console.log(`Inserted ${inserted.length} books`);
  } catch (err) {
    // insertMany may throw on some errors (e.g., validation); log details
    console.error("Errors occurred during insert:", err.message || err);
  } finally {
    // close mongoose connection
    try {
      await mongoose.connection.close();
    } catch (e) {
      // ignore
    }
    process.exit(0);
  }
}

main();
