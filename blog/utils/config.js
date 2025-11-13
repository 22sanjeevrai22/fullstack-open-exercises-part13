require("dotenv").config();

module.exports = {
  BLOG_DATABASE_URL: process.env.BLOG_DATABASE_URL,
  PORT: process.env.PORT || 3001,
};
