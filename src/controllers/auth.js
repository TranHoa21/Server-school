


import * as services from '../services';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log('cehck >>', name, email, password)
        if (!name || !email || !password) {
            return res.status(400).json({
                error: true,
                message: 'Missing payload',

            });
        }
        const response = await services.signup({ name, email, password });
        if (!response.error) {
            return res.status(200).json({ message: response.msg, user: response.user, success: true });
        } else {
            return res.status(400).json({
                error: true,
                message: response.message,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: 'Error in server',
        });
    }
};

export const sendVerificationEmailController = (req, res) => {
    try {
        const email = req.body.email;
        const verificationCode = services.generateVerificationCode();
        services.sendVerificationEmail(email, verificationCode);
        res.status(200).json({ message: 'Verification email sent successfully' });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: true,
            message: 'Error in server',
        });
    }

};

export const verifyPasswordResetCodeController = (req, res) => {
    const { email, resetCode } = req.body;

    const isValid = services.isVerificationCodeValid(email, resetCode);

    if (isValid) {
        res.status(200).json({ message: 'Mã xác minh hợp lệ' });
    } else {
        res.status(400).json({ message: 'Mã xác minh không hợp lệ hoặc thời hạn đã hết' });
    }
};

export const updatePassword = async (req, res) => {
    const { email, newPassword } = req.body
    try {
        const result = await services.updatePassword({ email, newPassword })
        res.json(result)
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await services.login({ email, password, res });

        if (result.err === 0) {
            return res.status(200).json({
                message: result.mes,
                user: result.user,
                accessToken: result.accessToken,
                role: result.user.role // Bao gồm cả quyền (role)
            });
        } else {
            return res.status(result.err).json({ mes: result.mes });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Đã xảy ra lỗi server.' });
    }
};


