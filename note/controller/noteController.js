const router = require("express").Router();
const { Note } = require("../models");
const logger = require("../utils/logger");

router.get("/", async (req, res) => {
  const notes = await Note.findAll();

  console.log(JSON.stringify(notes, null, 2));
  res.json(notes);
});

router.post("/", async (req, res) => {
  try {
    const note = await Note.create(req.body);
    return res.json(note);
  } catch (error) {
    logger.error("Error creating note:", error);
    return res.status(400).json({ error });
  }
});

router.put("/:id", async (req, res) => {
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

// Alternative for delete Method
// router.delete("/:id", async (req, res) => {
//   const id = req.params.id;
//   const note = await Note.findByPk(id);
//   if (note) {
//     await note.destroy();
//     // await Note.destroy({ where: { id } }); //next method
//   }
//   res.status(200).send("Deleted");
// });

router.delete("/:id", async (req, res) => {
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

module.exports = router;
