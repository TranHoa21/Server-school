
import mongoose from 'mongoose';

const coursesDataSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    day: {
        type: String,
        required: true,
    },
    title_day: {
        type: String,
        required: true,
    },
    lesson_stt: {
        type: String,
        required: true,
    },
    lesson_title: {
        type: String,
        required: true,
    },
    lesson_time: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


// Tạo mô hình Post
const CoursesData = mongoose.model('CoursesData', coursesDataSchema);
//const User = mongoose.model('User', userSchema);

// Xuất các mô hình và hàm kết nối
module.exports = CoursesData;