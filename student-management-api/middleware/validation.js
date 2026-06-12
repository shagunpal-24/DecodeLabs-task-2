/**
 * ============================================================
 *   Validation & Request Middleware
 *   File: middleware/validation.js
 *   Validates incoming request bodies before they hit controllers
 * ============================================================
 */

// ─── Request Logger Middleware ────────────────────────────────
/**
 * Logs each incoming HTTP request with method, URL, and timestamp.
 * This runs on EVERY request before it reaches any route.
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method.padEnd(7); // Align log output
  const url = req.originalUrl;

  console.log(`[${timestamp}]  ${method}  ${url}`);
  next(); // Pass control to the next middleware/route
};

// ─── Validate Student Creation ────────────────────────────────
/**
 * Middleware: validateCreateStudent
 * Runs before POST /students
 * Checks that all required fields are present and valid.
 */
const validateCreateStudent = (req, res, next) => {
  const { name, email, course, year } = req.body;
  const errors = [];

  // ── Name Validation ──
  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("'name' is required and must be a non-empty string.");
  } else if (name.trim().length < 2) {
    errors.push("'name' must be at least 2 characters long.");
  } else if (name.trim().length > 100) {
    errors.push("'name' must not exceed 100 characters.");
  }

  // ── Email Validation ──
  if (!email || typeof email !== "string" || email.trim() === "") {
    errors.push("'email' is required and must be a non-empty string.");
  } else {
    // Basic email format check using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push("'email' must be a valid email address (e.g., user@example.com).");
    }
  }

  // ── Course Validation ──
  if (!course || typeof course !== "string" || course.trim() === "") {
    errors.push("'course' is required and must be a non-empty string.");
  } else if (course.trim().length < 2) {
    errors.push("'course' must be at least 2 characters long.");
  }

  // ── Year Validation (Optional) ──
  const validYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  if (year && !validYears.includes(year.trim())) {
    errors.push(
      `'year' must be one of: ${validYears.join(", ")}. Leave blank to default to '1st Year'.`
    );
  }

  // ── Return Errors if Any ──
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Failed",
      message: "Please fix the following errors:",
      errors,
    });
  }

  // All good — proceed to controller
  next();
};

// ─── Validate Student Update ──────────────────────────────────
/**
 * Middleware: validateUpdateStudent
 * Runs before PUT /students/:id
 * At least one valid field must be provided; validates any fields present.
 */
const validateUpdateStudent = (req, res, next) => {
  const { name, email, course, year } = req.body;
  const errors = [];

  // Check that the request body is not completely empty
  const hasAtLeastOneField = name || email || course || year;
  if (!hasAtLeastOneField) {
    return res.status(400).json({
      success: false,
      error: "Validation Failed",
      message:
        "Request body must include at least one field to update: name, email, course, or year.",
    });
  }

  // ── Validate Name (if provided) ──
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim() === "") {
      errors.push("'name' must be a non-empty string.");
    } else if (name.trim().length < 2) {
      errors.push("'name' must be at least 2 characters long.");
    } else if (name.trim().length > 100) {
      errors.push("'name' must not exceed 100 characters.");
    }
  }

  // ── Validate Email (if provided) ──
  if (email !== undefined) {
    if (typeof email !== "string" || email.trim() === "") {
      errors.push("'email' must be a non-empty string.");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errors.push("'email' must be a valid email address.");
      }
    }
  }

  // ── Validate Course (if provided) ──
  if (course !== undefined) {
    if (typeof course !== "string" || course.trim() === "") {
      errors.push("'course' must be a non-empty string.");
    } else if (course.trim().length < 2) {
      errors.push("'course' must be at least 2 characters long.");
    }
  }

  // ── Validate Year (if provided) ──
  const validYears = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  if (year !== undefined && !validYears.includes(year.trim())) {
    errors.push(`'year' must be one of: ${validYears.join(", ")}.`);
  }

  // ── Return Errors if Any ──
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: "Validation Failed",
      message: "Please fix the following errors:",
      errors,
    });
  }

  next();
};

// ─── Export Middleware ────────────────────────────────────────
module.exports = {
  requestLogger,
  validateCreateStudent,
  validateUpdateStudent,
};
