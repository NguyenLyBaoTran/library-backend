require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const sequelize = require("./config/database");

const bookRoutes = require("./routes/bookRoutes");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authMiddleware");

const Book = require("./models/Book");
const User = require("./models/User");
const BorrowRecord = require("./models/BorrowRecord");

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers, introspection: true,});

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use("/api/books", bookRoutes);

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware(req),
    })
  );

  const PORT = process.env.PORT || 5000;
  try {

    await sequelize.authenticate();

    Book.hasMany(BorrowRecord, { foreignKey: 'book_id', as: 'borrow_records' });
    BorrowRecord.belongsTo(Book, { foreignKey: 'book_id' });

    User.hasMany(BorrowRecord, { foreignKey: 'user_id' });
    BorrowRecord.belongsTo(User, { foreignKey: 'user_id' });

    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`GraphQL Endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();