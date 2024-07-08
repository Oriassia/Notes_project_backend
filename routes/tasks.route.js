const express = require("express");
const router = express.Router();

const {
    getTasks,
    getTaskById,
    deleteTask,
    createTask,
    updateTask
  } = require("../controllers/task.controller");
const { verifyToken } = require("../middleware/auth.middleware");


router.get("/",verifyToken, getTasks);
router.post("/", createTask);
router.get("/:id", getTaskById);
router.delete("/:id", deleteTask);
router.put("/:id",updateTask)

module.exports = router;
