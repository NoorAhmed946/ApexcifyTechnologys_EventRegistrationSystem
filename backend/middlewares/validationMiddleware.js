const validateRegister = (req, res, next) => {
    const { name, email, password, phone, role } = req.body;

    // Basic empty check
    if (!name || !email || !password || !phone) {
        res.status(400);
        throw new Error('All fields (Name, Email, Password, Phone) are required');
    }

    // Email Format Validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
        res.status(400);
        throw new Error('Please enter a valid email address');
    }

    //  Phone Number Validation
    const pkPhoneRegex = /^((\+92)|(92)|(0))3\d{2}-?\d{7}$/;
    if (!pkPhoneRegex.test(phone)) {
        res.status(400);
        throw new Error('Please enter a valid Pakistani phone number (e.g., 03001234567)');
    }

    // 4. Password Length
    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    if (role && !['attendee', 'organizer'].includes(role)) {
        res.status(400);
        throw new Error('Invalid user role specified');
    }

    next();
};

const validateEvent = (req, res, next) => {
    const { title, description, date, time, location, category, capacity } = req.body;

    if (!title || !description || !date || !time || !location || !category || !capacity) {
        res.status(400);
        throw new Error('Please fill all event details, including description');
    }

    const validCategories = ['Digital Art', 'Music', 'Technology', 'Networking'];
    if (!validCategories.includes(category)) {
        res.status(400);
        throw new Error(`Category must be one of: ${validCategories.join(', ')}`);
    }

    if (isNaN(capacity) || capacity <= 0) {
        res.status(400);
        throw new Error('Capacity must be a valid number greater than 0');
    }

    next();
};

module.exports = { validateRegister, validateEvent };
