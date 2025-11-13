const express = require("express");
const logger = require("./utils/logger");
const { PORT } = require("./utils/config.js");
const { connectToDatabase } = require("./utils/db.js");

const app = express();
const blogRouter = require("./controller/blogController.js");
const errorHandler = require("./middleware/errorHandler.js");
// parse JSON bodies
app.use(express.json());
// request logging middleware
app.use(logger.requestLogger);

app.use("/api/blogs", blogRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start();
