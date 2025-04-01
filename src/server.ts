import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import routes from "./routes";
import loggerMiddleware from "./middlewares/logger";
import logger from "./utils/logger";
import cors from "cors";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(loggerMiddleware);
app.use(routes);

const PORT = process.env.PORT || 3000;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@backend.k11ic.mongodb.net/?retryWrites=true&w=majority&appName=Backend`
  )
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB:", err);
  });

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});
