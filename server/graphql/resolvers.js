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
      try {
        if (!username || !email || !password) {
          throw new Error("All fields are required");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Invalid email format");
        }

        if (password.length < 6) {
          throw new Error("Password must be at least 6 characters long");
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          throw new Error("Email already in use");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ 
          username, 
          email, 
          password: hashedPassword,
          role: "user" // Mặc định đăng ký là user thường
        });

        return "User registered successfully";
      } catch (error) {
        throw new Error(error.message);
      }
    },

    login: async (_, { username, password }) => {
      const user = await User.findOne({ where: { username } });
      if (!user) throw new Error("User not found");

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid credentials");

      // Trân để ý: role được đưa vào token ở đây nè
      return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "1h" }
      );
    },

    addBook: async (_, args, context) => {
      if (!context.isAuth) {
        throw new Error("Unauthorized: Please login first");
      }

      if (context.user.role !== "admin") {
        throw new Error("Forbidden: Only Admin can add books");
      }

      return await Book.create(args);
    },
  },
};

module.exports = resolvers;