
import mongoose from 'mongoose';

const coursesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    image_2: {
        type: String,
    },
    image_3: {
        type: String,
    },
    time: {
        type: String,
        required: true,
    },
    tag: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },

    link: {
        type: String,
        required: true,
    },
    day_title: {
        type: [String],
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Tạo mô hình Post
const Courses = mongoose.model('Courses', coursesSchema);
//const User = mongoose.model('User', userSchema);

// Xuất các mô hình và hàm kết nối
module.exports = Courses;