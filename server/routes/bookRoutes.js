const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const restProtect = (req, res, next) => {
  const auth = authMiddleware(req);
  if (!auth.isAuth) return res.status(401).json({ message: "Unauthorized" });
  req.user = auth.user; 
  next();
};

const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Forbidden: Admin only" });
  next();
};

router.get("/", bookController.getAllBooks);
router.get("/:id", bookController.getBookDetail); 

router.post("/", restProtect, adminOnly, bookController.createBook);
router.put("/:id", restProtect, adminOnly, bookController.updateBook);
router.delete("/:id", restProtect, adminOnly, bookController.deleteBook);

module.exports = router;