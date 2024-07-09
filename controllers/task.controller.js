const Task = require("../models/task.model");
const User = require("../models/user.model");

async function getTasks(req, res) {
  try {
    const tasks = await Task.find().exec();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getTaskById(req, res) {
  const { id } = req.params;
  try {
    const task = await Task.findById(id).exec();
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  const {userId} = req;

  try {
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { tasks: id }
    });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Task in user not found" });
    }
    res.status(500).json({ message: error.message });
  }
}

async function createTask(req, res) {
  const { userId } = req; // user id recieved from verifyToken func
  try {
    // Create and save the new task
    const tempTask = new Task({ ...req.body, user: userId });
    await tempTask.save();// ID will be assigned here

    // Find the user and add the task ID to their tasks array
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.tasks.push(tempTask._id);
    await user.save();

    res.status(201).json({ message: "Task added successfully", task: tempTask });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateTask(req, res) {
  const updatedData = req.body;
  const { id:taskId } = req.params;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while updating the task", error: error.message });
  }
}

module.exports = {
  getTasks,
  getTaskById,
  deleteTask,
  createTask,
  updateTask
};
