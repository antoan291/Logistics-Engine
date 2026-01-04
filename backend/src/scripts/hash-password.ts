import bcrypt from "bcrypt";

const password = "Admin123!";
const saltRounds = 12;

bcrypt.hash(password, saltRounds).then((hash) => {
  console.log("Password:", password);
  console.log("Hash:", hash);
  console.log("\nCopy this hash and use it in the SQL INSERT command:");
  process.exit(0);
});
