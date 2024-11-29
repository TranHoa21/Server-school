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

// Định nghĩa schema cho PasswordReset
const passwordResetSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true // Bắt buộc phải có
    },
    resetCode: {
        type: String,
        required: true // Bắt buộc phải có
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30m' // Tự động xóa sau 30 phút
    }
});

// Tạo mô hình PasswordReset từ schema
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

// Xuất các mô hình
module.exports = { User, PasswordReset };