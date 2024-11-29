import courses from './courses.js';
import coursesData from './coursesData.js';
import user from "./user.js";
import auth from "./auth.js"
const initRouter = (app) => {

    app.use('/api/v1/courses', courses);
    app.use('/api/v1/coursesData', coursesData);
    app.use('/api/v1/user', user);
    app.use('/api/v1/auth', auth);


}

module.exports = initRouter