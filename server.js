require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const sequelize = require("./config/database");

const bookRoutes = require("./routes/bookRoutes");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");
const authMiddleware = require("./middleware/authmiddleware");

// Giữ nguyên các phần require ở trên đầu...

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();

  // 1. Cấu hình Middleware toàn cục
  app.use(cors());
  
  // Express 5 đôi khi cần parser mạnh hơn ở mức toàn cục
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/books", bookRoutes);

  // 2. Cấu hình riêng cho GraphQL (Sửa đoạn này)
  app.use(
    "/graphql",
    // Ta truyền middleware json trực tiếp vào đây để ép Express 5 xử lý body cho Apollo
    express.json(), 
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
      console.log(`GraphQL Endpoint: /graphql`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

startServer();
