const express = require("express");
const Course = require("../models/Course");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();


// ======================================================
// CREATE COURSE
// POST /api/courses
// ======================================================

router.post("/", authMiddleware, adminMiddleware, async (req, res) => {

    try {

        const {
            title,
            courseCode,
            description,
            instructor,
            credits
        } = req.body;


        // Check required fields
        if (
            !title ||
            !courseCode ||
            !description ||
            !instructor ||
            !credits
        ) {

            return res.status(400).json({
                message: "All course fields are required"
            });

        }


        // Check if course code already exists
        const existingCourse = await Course.findOne({
            courseCode
        });


        if (existingCourse) {

            return res.status(400).json({
                message: "Course code already exists"
            });

        }


        // Create course
        const course = await Course.create({

            title,
            courseCode,
            description,
            instructor,
            credits

        });


        res.status(201).json({

            message: "Course created successfully",

            course

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Course creation failed",

            error: error.message

        });

    }

});



// ======================================================
// GET ALL COURSES
// GET /api/courses
// ======================================================

router.get("/", async (req, res) => {

    try {

        const courses = await Course.find();


        res.status(200).json({

            message: "Courses fetched successfully",

            count: courses.length,

            courses: courses

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to fetch courses",

            error: error.message

        });

    }

});



// ======================================================
// GET ONE COURSE
// GET /api/courses/:id
// ======================================================

router.get("/:id", async (req, res) => {

    try {

        const courseId = req.params.id;


        const course = await Course.findById(courseId);


        if (!course) {

            return res.status(404).json({

                message: "Course not found"

            });

        }


        res.status(200).json({

            message: "Course fetched successfully",

            course: course

        });


    } catch (error) {

        console.log(error);


        if (error.name === "CastError") {

            return res.status(400).json({

                message: "Invalid course ID"

            });

        }


        res.status(500).json({

            message: "Failed to fetch course",

            error: error.message

        });

    }

});



// ======================================================
// UPDATE COURSE
// PUT /api/courses/:id
// ======================================================

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {

    try {

        const courseId = req.params.id;


        const {
            title,
            courseCode,
            description,
            instructor,
            credits
        } = req.body;


        // Find course
        const course = await Course.findById(courseId);


        if (!course) {

            return res.status(404).json({

                message: "Course not found"

            });

        }


        // Update only fields that were provided

        if (title) {

            course.title = title;

        }

        if (courseCode) {

            course.courseCode = courseCode;

        }

        if (description) {

            course.description = description;

        }

        if (instructor) {

            course.instructor = instructor;

        }

        if (credits) {

            course.credits = credits;

        }


        // Save updated course
        await course.save();


        res.status(200).json({

            message: "Course updated successfully",

            course: course

        });


    } catch (error) {

        console.log(error);


        if (error.name === "CastError") {

            return res.status(400).json({

                message: "Invalid course ID"

            });

        }


        res.status(500).json({

            message: "Course update failed",

            error: error.message

        });

    }

});



// ======================================================
// DELETE COURSE
// DELETE /api/courses/:id
// ======================================================

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {

    try {

        const courseId = req.params.id;


        // Find course
        const course = await Course.findById(courseId);


        if (!course) {

            return res.status(404).json({

                message: "Course not found"

            });

        }


        // Delete course
        await Course.findByIdAndDelete(courseId);


        res.status(200).json({

            message: "Course deleted successfully"

        });


    } catch (error) {

        console.log(error);


        if (error.name === "CastError") {

            return res.status(400).json({

                message: "Invalid course ID"

            });

        }


        res.status(500).json({

            message: "Course deletion failed",

            error: error.message

        });

    }

});


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;