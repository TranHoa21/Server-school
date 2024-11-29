import * as services from '../services';
import cloudinary from 'cloudinary';
import Joi from 'joi';

export const createCourses = async (req, res) => {
    const fileData = req.files; // Giả sử req.files chứa nhiều tệp
    const { title, content, description, tag, title_vietnamese, description_vietnamese, content_vietnamese, tag_vietnamese } = req.body;
    try {
        const schema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            description: Joi.string().required(),
            tag: Joi.array().items(Joi.string()).required(),
            title_vietnamese: Joi.string().required(),
            description_vietnamese: Joi.string().required(),
            content_vietnamese: Joi.string().required(),
            tag_vietnamese: Joi.array().items(Joi.string()).required(),
        });

        const { error } = schema.validate({ title, content, description, tag, title_vietnamese, description_vietnamese, content_vietnamese, tag_vietnamese });
        if (error) {
            if (fileData && fileData.length > 0) {
                for (const file of fileData) {
                    await cloudinary.uploader.destroy(file.filename);
                }
            }
            return res.status(400).json({ error: error.details[0].message });
        }

        const createLinkFromTitle = (title) => {
            const cleanedTitle = title.replace(/[^a-zA-Z0-9\s-]+/g, '');
            const lowercaseTitle = cleanedTitle.toLowerCase();
            return lowercaseTitle.replace(/\s+/g, '-');
        };

        const link = createLinkFromTitle(title);

        // Gọi hàm dịch vụ để tạo bài viết với nhiều hình ảnh
        const result = await services.createCourses({ title, description, content, tag, link, title_vietnamese, description_vietnamese, content_vietnamese, tag_vietnamese }, fileData);

        return res.status(201).json({ message: 'Tạo bài viết thành công', result });
    } catch (error) {
        console.error('Error creating Courses:', error); // In lỗi chi tiết

        // Xóa ảnh nếu có lỗi
        if (fileData && fileData.length > 0) {
            for (const file of fileData) {
                await cloudinary.uploader.destroy(file.filename);
            }
        }
        return res.status(500).json({ error: error.message });
    }
};
export const allCourses = async (req, res) => {
    // Lấy tham số page từ query, với giá trị mặc định là 1
    const page = parseInt(req.query.page) || 1; // Mặc định là trang 1

    try {
        const Coursess = await services.getAllCoursess(page); // Gọi hàm getAllCoursess với page, limit tự động là 9
        res.json(Coursess);
    } catch (error) {
        console.log('Error fetching all Coursess:', error);
        return res.status(500).json({
            error: true,
            message: 'Error in server',
        });
    }
};

export const getCoursesByLink = async (req, res) => {
    const { coursesLink } = req.params;
    try {
        const Courses = await services.getCoursesByLink(coursesLink);
        if (!Courses) {
            return res.status(404).json({ error: 'Courses not found' });
        }
        res.json(Courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateCourses = async (req, res) => {
    const { CoursesLink } = req.params;
    const newData = req.body;
    const newImageData = req.file;

    try {
        if (newImageData) {
            newData.image = newImageData.path; // Cập nhật đường dẫn ảnh mới vào newData
        }
        const Courses = await services.updateCourses(CoursesLink, newData);
        if (!Courses) {
            return res.status(404).json({ error: 'Courses not found' });
        }

        if (newImageData && Courses.image) {
            const publicId = Courses.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ trên Cloudinary
        }

        res.status(200).json({ message: 'Cập nhật bài viết thành công', Courses });
    } catch (error) {
        console.log('Error updating Courses:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật bài viết' });
    }
};

export const deleteCourses = async (req, res) => {
    const CoursesId = req.params.CoursesId;
    if (!CoursesId) {
        return res.status(400).json({ error: 'Invalid Courses ID' });
    }
    try {
        await services.deleteCourses(CoursesId);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: `Error deleting Courses: ${error.message}` });
    }
};