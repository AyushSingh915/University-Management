const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ================= ENROLL IN COURSE =================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                message: "Course ID is required"
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Check if already enrolled
        const existingEnrollment = await Enrollment.findOne({
            student: req.user.id,
            course: courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({
                message: "Already enrolled in this course"
            });
        }

        // Create enrollment
        const enrollment = await Enrollment.create({
            student: req.user.id,
            course: courseId
        });

        res.status(201).json({
            message: "Enrolled successfully",
            enrollment
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Enrollment failed",
            error: error.message
        });
    }
});
// ================= MY ENROLLED COURSES =================

router.get("/my-courses", authMiddleware, async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user.id
        }).populate("course");

        res.status(200).json({
            message: "Enrolled courses fetched successfully",
            count: enrollments.length,
            enrollments: enrollments
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch enrolled courses",
            error: error.message
        });
    }
});


module.exports = router;