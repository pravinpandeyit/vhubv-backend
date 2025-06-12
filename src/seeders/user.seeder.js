const db = require("../../src/modules/model.index");
const bcrypt = require("bcryptjs");
const User = db.users;

async function UserSeederFn() {
  try {
    await User.create({
      user_type: 4,
      fullname: "admin",
      email: "admin@yopmail.com",
      password: bcrypt.hashSync("admin@123", 10),
      mobile: "1234567890",
      status: 1,
    });
    console.log("User seeded successfully.");
  } catch (error) {
    console.error("Error seeding user:", error);
  }
}

module.exports = UserSeederFn;
