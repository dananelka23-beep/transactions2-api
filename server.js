require("dotenv").config({ override: true });

const express = require("express");
const { connectToDatabase } = require("./config/database");
const transactionRoutes = require("./routes/transactionRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Transactions 2 API is running",
    routes: {
      transactions: "/api/transactions"
    }
  });
});

app.use("/api/transactions", transactionRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found."
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    error: error.message || "Internal server error."
  });
});

async function startServer() {
  await connectToDatabase();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});