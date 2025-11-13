const { Sequelize } = require("sequelize");
const { BLOG_DATABASE_URL } = require("./config");

const sequelize = new Sequelize(BLOG_DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Use this only in development
    },
  },
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    return process.exit(1);
  }
};

module.exports = { sequelize, connectToDatabase };
