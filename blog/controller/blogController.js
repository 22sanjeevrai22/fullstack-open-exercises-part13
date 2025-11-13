const router = require("express").Router();
const { Blog } = require("../models");
const { requestLogger, error } = require("../utils/logger");

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    return res.json(blog);
  } catch (error) {
    requestLogger.error("Error creating blog:", error);
    return res.status(400).json({ error });
  }
});

// Put method works because ORM like sequalize and mongoose are smart enough to understand
router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  const updates = req.body; // { likes: 3 }
  try {
    const [updatedCount] = await Blog.update(updates, {
      where: { id },
    });

    if (updatedCount === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const updatedBlog = await Blog.findByPk(id);
    res.json({ message: "Blog Updated Successfully", blog: updatedBlog });
  } catch (error) {
    next(error);
  }
});

// Patch equivalent (This is technically correct)
// router.patch("/api/blogs/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body; // e.g. { likes: 3 }

//     const [updatedCount] = await Blog.update(updates, { where: { id } });

//     if (updatedCount === 0) {
//       return res.status(404).json({ error: "Blog not found" });
//     }

//     const updatedBlog = await Blog.findByPk(id);
//     res.json(updatedBlog);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const deletedCount = await Blog.destroy({ where: { id } });
    if (deletedCount === 1) {
      return res.status(204).end();
    } else {
      return res.status(404).json({ error: "Blog not found" });
    }
  } catch {
    requestLogger.error("Error deleting note:", error);
    next(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
