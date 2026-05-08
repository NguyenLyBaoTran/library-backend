const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.log(err));

const bookRoutes = require("./routes/bookRoutes");

app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("Library API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});