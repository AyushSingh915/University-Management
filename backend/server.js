const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config({ path: __dirname + "/.env" });

console.log("MONGO_URI exists:", !!process.env.MONGO_URI);

const app = express();

app.use(cors());
app.use(express.json());


// Routes

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);


// Home route

app.get("/", (req, res) => {
    res.send("University Course Management System API");
});


// Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

connectDB();