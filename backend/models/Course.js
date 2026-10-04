const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        courseCode: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        description: {
            type: String,
            required: true
        },

        instructor: {
            type: String,
            required: true
        },

        credits: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);