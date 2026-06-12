/**
 * ============================================================
 *   Student Routes
 *   File: routes/studentRoutes.js
 *   Maps HTTP endpoints to controller methods + middleware
 * ============================================================
 */

const express = require("express");
const router = express.Router();

// Import controller functions (business logic)
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

// Import validation middleware
const {
  validateCreateStudent,
  validateUpdateStudent,
} = require("../middleware/validation");

// ─── Route Definitions ────────────────────────────────────────

/**
 * GET /students
 * Fetch all students.
 * Supports optional query params:
 *   ?name=<string>   → search by partial name
 *   ?course=<string> → filter by exact course name
 *
 * Example: GET /students?course=Information Technology
 */
router.get("/", getAllStudents);

/**
 * GET /students/:id
 * Fetch a single student by their unique ID.
 *
 * Example: GET /students/1
 */
router.get("/:id", getStudentById);

/**
 * POST /students
 * Create a new student record.
 * validateCreateStudent runs FIRST to check the request body.
 *
 * Required body fields: name, email, course
 * Optional body fields: year (defaults to "1st Year")
 */
router.post("/", validateCreateStudent, createStudent);

/**
 * PUT /students/:id
 * Update an existing student's details.
 * validateUpdateStudent runs FIRST to check the request body.
 *
 * At least one of: name, email, course, year must be provided.
 *
 * Example: PUT /students/2
 */
router.put("/:id", validateUpdateStudent, updateStudent);

/**
 * DELETE /students/:id
 * Permanently delete a student record.
 *
 * Example: DELETE /students/3
 */
router.delete("/:id", deleteStudent);

// ─── Export Router ────────────────────────────────────────────
module.exports = router;
