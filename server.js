require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { json } = require("body-parser");
const sequelize = require("./config/database");

const bookRoutes = require("./routes/bookRoutes");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authmiddleware");

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use("/api/books", bookRoutes);

  app.use(
    "/graphql",
    cors(),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => authMiddleware(req),
    })
  );

  const PORT = process.env.PORT || 5000;
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`GraphQL Endpoint: http://localhost:${PORT}/graphql`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();