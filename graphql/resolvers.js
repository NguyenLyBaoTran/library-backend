const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const Book = require("../models/Book");
const User = require("../models/User");

const resolvers = {
  Query: {
    getAllBooks: async (_, __, context) => {
      if (!context.isAuth) {
        throw new Error("Unauthorized: Please login to access this data");
      }
      return await Book.findAll();
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ username, email, password: hashedPassword });
      return "User registered successfully!";
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
    },

    addBook: async (_, args, context) => {
      if (!context.isAuth) throw new Error("Forbidden: You do not have permission");
      return await Book.create(args);
    },
  },
};

module.exports = resolvers;