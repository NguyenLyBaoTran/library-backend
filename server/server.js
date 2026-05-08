const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const bookRoutes = require("./routes/bookRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/books", bookRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});