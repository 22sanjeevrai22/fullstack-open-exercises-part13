require("dotenv").config();
const logger = require("./utils/logger");
const { Sequelize, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();

// parse JSON bodies
app.use(express.json());
// request logging middleware
app.use(logger.requestLogger);

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Use this only in development
    },
  },
});

class Note extends Model {}
Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    important: {
      type: DataTypes.BOOLEAN,
    },
    date: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: "note",
  }
);

Note.sync();

app.get("/api/notes", async (req, res) => {
  const notes = await Note.findAll();

  console.log(JSON.stringify(notes, null, 2));
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    return res.json(note);
  } catch (error) {
    logger.error("Error creating note:", error);
    return res.status(400).json({ error });
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  if (note) {
    console.log(note.toJSON());
    note.important = req.body.important;
    await note.save();
    res.json(note);
  } else {
    res.status(404).end();
  }
});

// app.delete("/api/notes/:id", async (req, res) => {
//   const id = req.params.id;
//   const note = await Note.findByPk(id);
//   if (note) {
//     await note.destroy();
//     res.status(200).send("Deleted");
//     // await Note.destroy({ where: { id } }); //next method
//   }
// });

app.delete("/api/notes/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedCount = await Note.destroy({ where: { id } });
    if (deletedCount === 1) {
      return res.status(204).end();
    } else {
      return res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    logger.error("Error deleting note:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
