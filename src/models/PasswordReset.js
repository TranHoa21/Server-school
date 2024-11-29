// PasswordReset.js
const mongoose = require('mongoose');

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

// Xuất mô hình
module.exports = PasswordReset;