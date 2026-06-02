const User = require('../data/users');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

// GET all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'username email'); // only select these fields
        // Map _id to id for frontend compatibility
        const usersWithId = users.map(u => ({
            id: u._id,
            username: u.username,
            email: u.email
        }));
        res.json({ users: usersWithId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id, 'username email');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ id: user._id, username: user.username, email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REGISTER user
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN user
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) return res.status(400).json({ message: 'Invalid credentials' });

        res.json({
            message: 'Logged in successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, username } = req.body;

        if (!email && !username) {
            return res.status(400).json({ message: 'At least one field (email or username) is required' });
        }

        const existingUser = await User.findById(id);
        if (!existingUser) return res.status(404).json({ message: 'User not found' });

        if (username && username !== existingUser.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) return res.status(400).json({ message: 'Username already exists' });
            existingUser.username = username;
        }

        if (email && email !== existingUser.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) return res.status(400).json({ message: 'Email already exists' });
            existingUser.email = email;
        }

        await existingUser.save();

        res.json({
            message: 'User updated successfully',
            user: {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

module.exports = {
    getUsers,
    getUserById,
    registerUser,
    loginUser,
    updateUser,
    deleteUser
};
