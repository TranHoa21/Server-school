// User.js
const mongoose = require('mongoose');

// Định nghĩa schema cho User
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // Bắt buộc phải có
    },
    email: {
        type: String,
        required: true,
        unique: true // Đảm bảo email là duy nhất
    },
    password: {
        type: String,
        required: true // Bắt buộc phải có
    },
    role: {
        type: String,
        enum: ['user', 'admin'], // Chỉ định các giá trị có thể cho role
        default: 'user', // Giá trị mặc định là 'user'
        required: true // Bắt buộc phải có
    },
    avatar: {
        type: String
    },
    phonenumber: {
        type: String // Sử dụng String để chứa số điện thoại
    },
    address: {
        type: String
    }
}, {
    timestamps: true // Tạo trường createdAt và updatedAt tự động
});

// Tạo mô hình User từ schema
const User = mongoose.model('User', userSchema);

// Xuất mô hình
module.exports = User;