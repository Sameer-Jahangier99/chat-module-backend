// Models
const User = require("../../models/User");

const findUserByEmail = async (email) => await User.findOne({ email });

const createUser = async (first_name, last_name, email, password) =>
  await User.create({
    first_name,
    last_name,
    email,
    password,
  });

module.exports = {
  findUserByEmail,
  createUser,
};
