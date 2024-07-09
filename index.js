const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { verifyToken } = require("./middleware/auth.middleware.js");
// const { verifyToken } = require("./middleware/auth.middleware");

const PORT = process.env.PORT || 3000;

dotenv.config(); // Load config

async function connect(){
  await connectDB();
}
connect()

// MIDDLEWARE
app.use(express.static("public"))
app.use(express.json());

// allow CORS for local development (for production, you should configure it properly)
app.use(
  cors()
);

// ROUTES
const authRoutes = require("./routes/auth.route");
const useresRoutes = require("./routes/users.route.js");
const TasksRoutes = require("./routes/tasks.route.js");

app.use("/api/tasks",verifyToken, TasksRoutes);
app.use("/api/users",verifyToken, useresRoutes);
app.use("/api/auth", authRoutes);

// Catch-all route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
