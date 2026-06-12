/**
 * ============================================================
 *   Student Management REST API
 *   Entry Point: server.js
 *   Author: DecodeLabs Full Stack Internship — Project 2
 * ============================================================
 */

const express = require("express");
const studentRoutes = require("./routes/studentRoutes");
const { requestLogger } = require("./middleware/validation");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Global Middleware ────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Log every incoming request (custom middleware)
app.use(requestLogger);

// ─── Health Check Endpoint ────────────────────────────────────
/**
 * GET /health
 * Quick check to confirm the API server is running
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🟢 Student Management API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// ─── API Routes ───────────────────────────────────────────────
// All student-related routes are prefixed with /students
app.use("/students", studentRoutes);

// ─── Root Route ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Student Management REST API",
    endpoints: {
      health: "GET /health",
      getAllStudents: "GET /students",
      getStudentById: "GET /students/:id",
      searchByName: "GET /students?name=<query>",
      filterByCourse: "GET /students?course=<course>",
      createStudent: "POST /students",
      updateStudent: "PUT /students/:id",
      deleteStudent: "DELETE /students/:id",
    },
  });
});

// ─── 404 Handler (Unknown Routes) ────────────────────────────
// This must come AFTER all defined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    message: `The endpoint '${req.originalUrl}' does not exist on this server.`,
  });
});

// ─── Global Error Handler ─────────────────────────────────────
// Catches any unhandled errors passed via next(err)
app.use((err, req, res, next) => {
  console.error("❌ Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: "Something went wrong on the server. Please try again later.",
  });
});

// ─── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log("===========================================");
  console.log(`  🎓 Student Management API`);
  console.log(`  🚀 Server running on port ${PORT}`);
  console.log(`  🌐 URL: http://localhost:${PORT}`);
  console.log(`  🏥 Health: http://localhost:${PORT}/health`);
  console.log("===========================================");
});

module.exports = app;
