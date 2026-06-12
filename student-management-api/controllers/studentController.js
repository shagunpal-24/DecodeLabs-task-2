/**
 * ============================================================
 *   Student Controller
 *   File: controllers/studentController.js
 *   Handles all business logic for student operations
 * ============================================================
 */

// ─── In-Memory Data Store ─────────────────────────────────────
// In a real app, this would be replaced by a database (MongoDB, PostgreSQL, etc.)
let students = [
  {
    id: 1,
    name: "Shagun Pal",
    email: "palshagun17@gmail.com",
    course: "Information Technology",
    year: "2nd Year",
    createdAt: new Date("2024-01-10T10:00:00.000Z").toISOString(),
  },
  {
    id: 2,
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    course: "Computer Science",
    year: "1st Year",
    createdAt: new Date("2024-01-12T11:30:00.000Z").toISOString(),
  },
  {
    id: 3,
    name: "Priya Verma",
    email: "priya.verma@example.com",
    course: "Electronics Engineering",
    year: "3rd Year",
    createdAt: new Date("2024-02-05T09:15:00.000Z").toISOString(),
  },
  {
    id: 4,
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    course: "Information Technology",
    year: "4th Year",
    createdAt: new Date("2024-03-01T08:00:00.000Z").toISOString(),
  },
];

// Auto-incrementing ID counter
let nextId = students.length + 1;

// ─── Helper ───────────────────────────────────────────────────
/**
 * Find a student by their numeric ID
 * @param {number} id
 * @returns {object|undefined}
 */
const findStudentById = (id) => students.find((s) => s.id === id);

// ─── Controller Methods ───────────────────────────────────────

/**
 * GET /students
 * Returns all students. Supports optional query filters:
 *   ?name=<string>   — partial, case-insensitive name search
 *   ?course=<string> — exact, case-insensitive course filter
 */
const getAllStudents = (req, res) => {
  try {
    let result = [...students];
    const { name, course } = req.query;

    // Filter by name (partial match)
    if (name) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Filter by course (exact match, case-insensitive)
    if (course) {
      result = result.filter(
        (s) => s.course.toLowerCase() === course.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      count: result.length,
      filters: { name: name || null, course: course || null },
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /students/:id
 * Returns a single student by their ID
 */
const getStudentById = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Validate that the ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Student ID must be a valid number.",
      });
    }

    const student = findStudentById(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: `No student found with ID ${id}.`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /students
 * Creates a new student record
 * Body: { name, email, course, year }
 */
const createStudent = (req, res) => {
  try {
    const { name, email, course, year } = req.body;

    // Check for duplicate email
    const emailExists = students.some(
      (s) => s.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      return res.status(409).json({
        success: false,
        error: "Conflict",
        message: `A student with the email '${email}' already exists.`,
      });
    }

    // Build the new student object
    const newStudent = {
      id: nextId++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      course: course.trim(),
      year: year ? year.trim() : "1st Year",
      createdAt: new Date().toISOString(),
    };

    students.push(newStudent);

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: newStudent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /students/:id
 * Updates an existing student's details
 * Body: any subset of { name, email, course, year }
 */
const updateStudent = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Student ID must be a valid number.",
      });
    }

    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: `No student found with ID ${id}.`,
      });
    }

    const { name, email, course, year } = req.body;

    // If email is being updated, check for duplicate
    if (email) {
      const emailExists = students.some(
        (s) =>
          s.email.toLowerCase() === email.toLowerCase() && s.id !== id
      );
      if (emailExists) {
        return res.status(409).json({
          success: false,
          error: "Conflict",
          message: `Another student with the email '${email}' already exists.`,
        });
      }
    }

    // Merge existing fields with updated ones
    const updatedStudent = {
      ...students[studentIndex],
      ...(name && { name: name.trim() }),
      ...(email && { email: email.trim().toLowerCase() }),
      ...(course && { course: course.trim() }),
      ...(year && { year: year.trim() }),
      updatedAt: new Date().toISOString(),
    };

    students[studentIndex] = updatedStudent;

    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: updatedStudent,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /students/:id
 * Removes a student record by ID
 */
const deleteStudent = (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Bad Request",
        message: "Student ID must be a valid number.",
      });
    }

    const studentIndex = students.findIndex((s) => s.id === id);

    if (studentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: `No student found with ID ${id}.`,
      });
    }

    const deletedStudent = students.splice(studentIndex, 1)[0];

    res.status(200).json({
      success: true,
      message: `Student '${deletedStudent.name}' deleted successfully.`,
      data: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Export Controllers ───────────────────────────────────────
module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
