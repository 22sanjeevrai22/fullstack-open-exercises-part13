const express = require("express");
const app = express();
const logger = require("./utils/logger");
const { PORT } = require("./utils/config.js");
const { connectToDatabase } = require("./utils/db.js");

// parse JSON bodies
app.use(express.json());
// request logging middleware
app.use(logger.requestLogger);

const notesRouter = require("./controller/noteController.js");

app.use("/api/notes", notesRouter);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
