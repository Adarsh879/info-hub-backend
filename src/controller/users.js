const User = require("../models/user");
const jwtDecode = require("jwt-decode");
const { body, validationResult } = require("express-validator");

const {
  createToken,
  hashPassword,
  verifyPassword,
} = require("../utils/authentication");

exports.signup = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }

  try {
    const { username, userid } = req.body;

    const hashedPassword = await hashPassword(req.body.password);

    const userData = {
      _id: userid,
      username: username,
      password: hashedPassword,
    };

    const existingUser = await User.findById(userData._id);

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const newUser = new User(userData);
    const savedUser = await newUser.save();
    if (savedUser) {
      const token = createToken(savedUser);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const { username, id, created, profilePhoto } = savedUser;
      const userInfo = {
        username,
        id,
        created,
        profilePhoto,
      };

      return res.json({
        message: "User created!",
        token,
        userInfo,
        expiresAt,
      });
    } else {
      return res.status(400).json({
        message: "There was a problem creating your account.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "There was a problem creating your account.",
    });
  }
};

exports.authenticate = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    const { userid, password } = req.body;
    const user = await User.findById(userid);

    if (!user) {
      return res.status(403).json({
        message: "Wrong username or password.",
      });
    }

    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const { username, id, created, profilePhoto } = user;
      const userInfo = { username, id, created, profilePhoto };

      res.json({
        message: "Authentication successful!",
        token,
        userInfo,
        expiresAt,
      });
    } else {
      res.status(403).json({
        message: "Wrong username or password.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Something went wrong.",
    });
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const { sortType = "-created" } = req.body;
    const users = await User.find().sort(sortType);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const users = await User.find({
      username: { $regex: req.params.search, $options: "i" },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.find = async (req, res, next) => {
  try {
    const users = await User.findById(req.params.userid);
    res.json(users);
  } catch (error) {
    next(error);
  }
};
