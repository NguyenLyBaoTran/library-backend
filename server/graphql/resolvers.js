const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); 
const Book = require("../models/Book");
const User = require("../models/User");
const BorrowRecord = require("../models/BorrowRecord");

const resolvers = {
  Query: {
    getAllBooks: async (_, __, context) => {
      if (!context.isAuth) throw new Error("Unauthorized: Please login");
      return await Book.findAll({ where: { isAvailable: true } });
    },

    getBookById: async (_, { id }, context) => {
      if (!context.isAuth) throw new Error("Unauthorized");
      const book = await Book.findByPk(id);
      if (!book) throw new Error("Book not found");
      return book;
    },

    getBookById: async (_, { id }, context) => {
      if (!context.isAuth) throw new Error("Unauthorized");
      const book = await Book.findByPk(id);
      if (!book) throw new Error("Book not found");
      return book;
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
          role: "user" 
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

    borrowBook: async (_, { book_id }, context) => {
      if (!context.isAuth) {
        throw new Error("You must login to borrow books");
      }

      const book = await Book.findByPk(book_id);
      if (!book) throw new Error("Book does not exist");
      if (!book.isAvailable) throw new Error("This book is already borrowed");

      book.isAvailable = false;
      await book.save();

      const record = await BorrowRecord.create({
        user_id: context.user.id,
        book_id: book_id,
        status: "borrowed"
        
      });

      return record;
    },

    returnBook: async (_, { record_id }, context) => {
      if (!context.isAuth || context.user.role !== "admin") {
        throw new Error("Forbidden: Only Admin can confirm book returns");
      }

      const record = await BorrowRecord.findByPk(record_id);
      if (!record) throw new Error("Borrow record not found");
      if (record.status === "returned") throw new Error("Book already returned");

      const book = await Book.findByPk(record.book_id);
      if (book) {
        book.isAvailable = true;
        await book.save();
      }

      record.status = "returned";
      await record.save();

      return record;
    },
  },
};

module.exports = resolvers;