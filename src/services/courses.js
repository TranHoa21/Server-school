const cloudinary = require('cloudinary').v2;
import Courses from '../models/Courses';

export const createCourses = async (body, fileData) => {
    try {
        const createLinkFromTitle = (title) => {
            const cleanedTitle = title.replace(/[^a-zA-Z0-9\s-]+/g, '');
            const lowercaseTitle = cleanedTitle.toLowerCase();
            return lowercaseTitle.replace(/\s+/g, '-');
        }

        const link = createLinkFromTitle(body.title);

        // Tạo đối tượng mới từ mô hình Courses
        const newCourses = new Courses({
            title: body.title,
            description: body.description,
            content: body.content,
            tag: body.tag,
            link: link,
            image: fileData?.path,
            title_vietnamese: body.title_vietnamese,
            description_vietnamese: body.description_vietnamese,
            content_vietnamese: body.content_vietnamese,
            tag_vietnamese: body.tag_vietnamese
        });

        // Lưu bài viết vào cơ sở dữ liệu
        const response = await newCourses.save();

        // Xóa ảnh nếu không tạo thành công
        if (fileData && !response) {
            await cloudinary.uploader.destroy(fileData.filename);
        }

        return {
            err: response ? 0 : 1,
            mes: response ? 'Created' : 'Cannot create new Courses',
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

export const getAllCoursess = async () => {
    try {
        const Coursess = await Courses.find()
        return {
            Coursess,
        };
    } catch (error) {
        console.log('Error fetching all Coursess:', error);
        throw error;
    }
};
export const getCoursesByLink = async (coursesLink) => {
    try {
        if (!coursesLink) {
            throw new Error('Invalid Courses link');
        }
        const course = await Courses.findOne({ link: coursesLink });
        return course;
    } catch (error) {
        console.log('Error fetching Courses by link:', error);
        throw new Error(`Error fetching Courses by link: ${error.message}`);
    }
};

export const findCoursesById = async (CoursesId) => {
    try {
        if (!CoursesId) {
            throw new Error('Invalid Courses ID');
        }
        const Courses = await Courses.findById(CoursesId); // Tìm bài viết theo ID
        return Courses;
    } catch (error) {
        console.log('Error fetching Courses by ID:', error);
        throw new Error(`Error fetching Courses by ID: ${error.message}`);
    }
};

export const updateCourses = async (CoursesId, newData) => {
    try {
        const Courses = await Courses.findById(CoursesId); // Tìm bài viết theo ID
        if (!Courses) {
            throw new Error('Courses not found');
        }

        Object.assign(Courses, newData); // Cập nhật dữ liệu mới
        await Courses.save(); // Lưu thay đổi

        return Courses;
    } catch (error) {
        console.log('Error updating Courses:', error);
        throw error;
    }
};

export const deleteCourses = async (CoursesId) => {
    try {
        const Courses = await Courses.findById(CoursesId); // Tìm bài viết theo ID
        if (!Courses) {
            throw new Error('Courses not found');
        }
        await Courses.deleteOne({ _id: CoursesId }); // Xóa bài viết
    } catch (error) {
        console.log('Error deleting Courses:', error);
        throw error;
    }
};



