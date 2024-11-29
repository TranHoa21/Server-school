import * as services from '../services';
import cloudinary from 'cloudinary';
import Joi from 'joi';

export const createCoursesData = async (req, res) => {
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
        const result = await services.createCoursesData({ title, description, content, tag, link, title_vietnamese, description_vietnamese, content_vietnamese, tag_vietnamese }, fileData);

        return res.status(201).json({ message: 'Tạo bài viết thành công', result });
    } catch (error) {
        console.error('Error creating coursesData:', error); // In lỗi chi tiết

        // Xóa ảnh nếu có lỗi
        if (fileData && fileData.length > 0) {
            for (const file of fileData) {
                await cloudinary.uploader.destroy(file.filename);
            }
        }
        return res.status(500).json({ error: error.message });
    }
};
export const allCoursesData = async (req, res) => {
    // Lấy tham số page từ query, với giá trị mặc định là 1
    const page = parseInt(req.query.page) || 1; // Mặc định là trang 1

    try {
        const coursesDatas = await services.getAllCoursesDatas(page); // Gọi hàm getAllCoursesDatas với page, limit tự động là 9
        res.json(coursesDatas);
    } catch (error) {
        console.log('Error fetching all coursesDatas:', error);
        return res.status(500).json({
            error: true,
            message: 'Error in server',
        });
    }
};

export const getCoursesDataByLink = async (req, res) => {
    const { coursesDataLink } = req.params;

    try {
        const coursesData = await services.getCoursesDataByLink(coursesDataLink);

        if (!coursesData || coursesData.length === 0) {
            return res.status(404).json({ error: 'CoursesData not found' });
        }

        res.json(coursesData);
    } catch (error) {
        console.error('Error in getCoursesDataByLink controller:', error);
        res.status(500).json({ error: error.message });
    }
};

export const updateCoursesData = async (req, res) => {
    const { coursesDataLink } = req.params;
    const newData = req.body;
    const newImageData = req.file;

    try {
        if (newImageData) {
            newData.image = newImageData.path; // Cập nhật đường dẫn ảnh mới vào newData
        }
        const coursesData = await services.updateCoursesData(coursesDataLink, newData);
        if (!coursesData) {
            return res.status(404).json({ error: 'CoursesData not found' });
        }

        if (newImageData && coursesData.image) {
            const publicId = coursesData.image.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId); // Xóa ảnh cũ trên Cloudinary
        }

        res.status(200).json({ message: 'Cập nhật bài viết thành công', coursesData });
    } catch (error) {
        console.log('Error updating coursesData:', error);
        res.status(500).json({ error: 'Đã xảy ra lỗi khi cập nhật bài viết' });
    }
};

export const deleteCoursesData = async (req, res) => {
    const coursesDataId = req.params.coursesDataId;
    if (!coursesDataId) {
        return res.status(400).json({ error: 'Invalid coursesData ID' });
    }
    try {
        await services.deleteCoursesData(coursesDataId);
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: `Error deleting coursesData: ${error.message}` });
    }
};