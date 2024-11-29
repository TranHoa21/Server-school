const cloudinary = require('cloudinary').v2;
import CoursesData from '../models/CoursesData';

export const createCoursesData = async (body, fileData) => {
    try {
        const createLinkFromTitle = (title) => {
            const cleanedTitle = title.replace(/[^a-zA-Z0-9\s-]+/g, '');
            const lowercaseTitle = cleanedTitle.toLowerCase();
            return lowercaseTitle.replace(/\s+/g, '-');
        }

        const link = createLinkFromTitle(body.title);

        // Tạo đối tượng mới từ mô hình Post
        const newCoursesData = new CoursesData({
            title: body.title,
            description: body.description,
            content: body.content,
            tag: body.tag,
            link: link,
            image: fileData?.path, // Giả sử fileData là tệp đã được tải lên
            title_vietnamese: body.title_vietnamese,
            description_vietnamese: body.description_vietnamese,
            content_vietnamese: body.content_vietnamese,
            tag_vietnamese: body.tag_vietnamese
        });

        // Lưu bài viết vào cơ sở dữ liệu
        const response = await newCoursesData.save();

        // Xóa ảnh nếu không tạo thành công
        if (fileData && !response) {
            await cloudinary.uploader.destroy(fileData.filename);
        }

        return {
            err: response ? 0 : 1,
            mes: response ? 'Created' : 'Cannot create new post',
        };
    } catch (error) {
        // Xóa ảnh đã tải lên nếu có lỗi
        if (fileData && fileData.length > 0) {
            for (const file of fileData) {
                const publicId = file.filename.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(publicId);
            }
        }
        throw error; // Ném lại lỗi để xử lý ở nơi gọi
    }
};

export const getAllCoursesDatas = async () => {
    try {


        const totalCoursesDatas = await CoursesData.countDocuments();

        return {

            total: totalCoursesDatas, // Tổng số bài viết
        };
    } catch (error) {
        console.log('Error fetching all posts:', error);
        throw error;
    }
};
export const getCoursesDataByLink = async (coursesDataLink) => {
    try {
        if (!coursesDataLink) {
            throw new Error('Invalid post link');
        }

        // Tìm tất cả các tài liệu với link trùng khớp
        const coursesData = await CoursesData.find({ link: coursesDataLink });

        return coursesData;
    } catch (error) {
        console.log('Error fetching post by link:', error);
        throw new Error(`Error fetching post by link: ${error.message}`);
    }
};

export const findCoursesDataById = async (coursesDataId) => {
    try {
        if (!coursesDataId) {
            throw new Error('Invalid post ID');
        }
        const coursesData = await CoursesData.findById(coursesDataId); // Tìm bài viết theo ID
        return coursesData;
    } catch (error) {
        console.log('Error fetching post by ID:', error);
        throw new Error(`Error fetching post by ID: ${error.message}`);
    }
};

export const updateCoursesData = async (coursesDataId, newData) => {
    try {
        const coursesData = await CoursesData.findById(coursesDataId); // Tìm bài viết theo ID
        if (!coursesData) {
            throw new Error('coursesData not found');
        }

        Object.assign(coursesData, newData); // Cập nhật dữ liệu mới
        await coursesData.save(); // Lưu thay đổi

        return coursesData;
    } catch (error) {
        console.log('Error updating post:', error);
        throw error;
    }
};

export const deleteCoursesData = async (coursesDataId) => {
    try {
        const coursesData = await CoursesData.findById(coursesDataId); // Tìm bài viết theo ID
        if (!coursesData) {
            throw new Error('coursesData not found');
        }
        await CoursesData.deleteOne({ _id: coursesDataId }); // Xóa bài viết
    } catch (error) {
        console.log('Error deleting post:', error);
        throw error;
    }
};



