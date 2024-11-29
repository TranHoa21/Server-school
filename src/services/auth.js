import User from '../models/Users.js';
import PasswordReset from '../models/PasswordReset.js'; // Đảm bảo import đúng mô hình PasswordReset
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { createNewUser } from './user.js';
import generateToken from '../middleware/generateToken.js';

export const hashPassword = async (password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error('Failed to hash password');
    }
};

export const signup = async ({ name, email, password }) => {
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return {
                success: false,
                message: 'Email has already been registered. Please use a different email.',
                user: null,
                error: 'EmailExists'
            };
        }

        const hashedPassword = await hashPassword(password);

        const newUser = await createNewUser({
            name,
            email,
            password: hashedPassword,
            isVerified: false,
        });


        const token = newUser[1] && jwt.sign({ id: newUser[0].id, email: newUser[0].email }, process.env.SECRET_KEY, { expiresIn: '2d' })
        return {
            err: token ? 0 : 2,
            msg: token ? 'Register is successfully !' : 'Email has already been registered. Please use a different email.',
            user: token ? { id: newUser.id, name: newUser.name } : null,
            error: null
        };
    } catch (err) {
        return {
            success: false,
            message: 'An error occurred during signup.',
            user: null,
            error: err.message
        };
    }
};
export const generateVerificationCode = () => {
    const codeLength = 6;
    const characters = '0123456789MNBVCXZLKJHGFDSAQWERTYUIOP';

    let verificationCode = '';
    for (let i = 0; i < codeLength; i++) {
        const randomIndex = crypto.randomInt(0, characters.length);
        verificationCode += characters.charAt(randomIndex);
    }
    return verificationCode;
};

export const sendVerificationEmail = async (email, resetCode) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'giaikystore@gmail.com',
            pass: 'biwp dfng ahnb acfx'
        },
        tls: {
            rejectUnauthorized: false // Bỏ qua kiểm tra chứng chỉ SSL
        }
    });

    const mailOptions = {
        from: 'giaikystore@gmail.com',
        to: email,
        subject: 'Xác minh email',
        text: `Mã xác minh của bạn là: ${resetCode}`
    };

    try {
        await transporter.sendMail(mailOptions);
        const newResetPassword = new PasswordReset({
            email,
            resetCode
        });
        await newResetPassword.save();

        return {
            err: 0,
            mes: 'PasswordReset created successfully.',
        };
    } catch (error) {
        console.log('Lỗi khi gửi email xác minh', error);
        return {
            err: 1,
            mes: 'Failed to send verification email.',
        };
    }
};

export const isVerificationCodeValid = async (email, resetCode) => {
    const storedCode = await PasswordReset.findOne({ email });

    if (!storedCode) {
        return false;
    }

    const currentTime = new Date();
    const timeDifference = currentTime - storedCode.createdAt;
    const timeDifferenceInMinutes = Math.floor(timeDifference / (1000 * 60));

    return timeDifferenceInMinutes <= 30 && resetCode === storedCode.resetCode;
};

export const updatePassword = async (email, newPassword) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return {
                err: 1,
                mes: 'User not found.',
            };
        }

        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        return {
            err: 0,
            mes: 'Password updated successfully.',
        };
    } catch (error) {
        console.log('check err >>>', error);
        throw error;
    }
};

export const login = async ({ email, password, res }) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return {
                err: 401,
                mes: 'Email chưa được đăng ký.',
            };
        }


        const passwordMatch = bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return {
                err: 401,
                mes: 'Mật khẩu không chính xác.',
            };
        }

        const token = generateToken(user.id, res);

        return {
            err: 0,
            mes: 'Đăng nhập thành công.',
            accessToken: token,
            user, // Bao gồm cả thông tin user và role
        };
    } catch (err) {
        throw err;
    }
};