const Book = require("../models/Book");
const BorrowRecord = require("../models/BorrowRecord");

exports.getAllBooks = async (req, res) => {
  try {
    if (req.user && req.user.role === 'admin') {
      const books = await Book.findAll();
      return res.status(200).json(books);
    }
    const books = await Book.findAll({ where: { isAvailable: true }});
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id, {
      include: [{ model: BorrowRecord, as: 'borrow_records' }] 
    });
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createBook = async (req, res) => {
  try {
    if (Array.isArray(req.body)) {
      const newBooks = await Book.bulkCreate(req.body);
      return res.status(201).json(newBooks);
    } else {
      const newBook = await Book.create(req.body);
      return res.status(201).json(newBook);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.update(req.body, { where: { id } });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.destroy({ where: { id } });
    res.status(200).json({ message: "Deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};