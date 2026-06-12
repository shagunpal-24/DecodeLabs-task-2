# 🎓 Student Management REST API

> **DecodeLabs Full Stack Development Internship — Project 2**
> Built with Node.js & Express.js

## 🚀 Quick Start

```bash
npm install
npm start
```

Visit: `http://localhost:3000`

## 📁 Project Structure

student-management-api/

├── server.js

├── package.json

├── routes/

│   └── studentRoutes.js

├── controllers/

│   └── studentController.js

└── middleware/

└── validation.js

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get student by ID |
| GET | `/students?name=sha` | Search by name |
| GET | `/students?course=IT` | Filter by course |
| POST | `/students` | Create student |
| PUT | `/students/:id` | Update student |
| DELETE | `/students/:id` | Delete student |

## 🛠 Tech Stack
- Node.js
- Express.js
- JavaScript
