const asyncHandler = require("express-async-handler");
const { generateToken } = require("../utils/helpers");

// Validation Schemas
const {
  userSignupSchema,
  userLoginSchema,
} = require("../validationSchema/user");

// Queries
const { findUserByEmail, createUser } = require("../queries/user/userQueries");

// @desc		Register new user
// @route		/api/users
// @access		Public
const registerUser = asyncHandler(async (req, res) => {
  const { error, value } = await userSignupSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(422).json({ error: error.details });
  }

  const { first_name, last_name, email, password } = value;

  const userExist = findUserByEmail(email);

  if (userExist) {
    res.status(400);
    throw new Error("Email is already registered");
  }

  const newUser = createUser(first_name, last_name, email, password );

  //   ? response
  if (newUser) {
    res.status(200).json({
      user: {
        _id: newUser._id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
      },
      message: "User registered successfully",
      token: generateToken(newUser._id),
    });
  } else {
    res.status(500);
    throw new Error("Server could not process the request");
  }
});

// @desc		Login existing user
// @route		/api/users/login
// @access		Public
const loginUser = asyncHandler(async (req, res) => {
  const { error, value } = userLoginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(422).json({ error: error.details });
  }

  const { email, password } = value;
  const userExist = findUserByEmail(email);

  if (userExist && (await userExist.matchPassword(password))) {
    res.status(200).json({
      user: userExist,
      message: "user successfully logged in",
      token: generateToken(userExist._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});



module.exports = { registerUser, loginUser };
