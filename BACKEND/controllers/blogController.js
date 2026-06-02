const blogModel = require('../data/blogs');

// Get all blogs
const getBlogs = async (req, res) => {
    try {
        const blogs = await blogModel.find({});
        res.json({ blogs });
    } catch (error) {
        console.error('Error getting blogs:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
    try {
        let blog = null;
        // Try to find by MongoDB _id first
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            blog = await blogModel.findById(req.params.id);
        }
        // If not found, try to find by numeric id
        if (!blog) {
            const numericId = parseInt(req.params.id);
            if (!isNaN(numericId)) {
                blog = await blogModel.findOne({ id: numericId });
            }
        }
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ blog });
    } catch (error) {
        console.error('Error getting blog by id:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, content, author, img, category, tags, date } = req.body;

        if (!title || !content || !author) {
            return res.status(400).json({ message: "Title, content, and author are required" });
        }

        const existingBlogs = await blogModel.find({});
        const highestId = existingBlogs.reduce((max, blog) => {
            const currentId = parseInt(blog.id || 0);
            return currentId > max ? currentId : max;
        }, 0);
        const newId = highestId + 1;

        const newBlog = new blogModel({
            id: newId,
            title,
            content,
            author,
            img: img || '/default-blog-image.jpg',
            category: category || 'Uncategorized',
            tags: tags || [],
            date: date ? new Date(date) : new Date()
        });

        await newBlog.save();
        console.log('Blog created successfully:', newBlog);
        res.status(201).json({ blog: newBlog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update an existing blog
const updateBlog = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const updatedBlog = await blogModel.findOneAndUpdate(
            { id },
            { $set: req.body },
            { new: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.json({ blog: updatedBlog });
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        let deletedBlog = null;
        // Try to delete by MongoDB _id first
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            deletedBlog = await blogModel.findByIdAndDelete(req.params.id);
        }
        // If not found, try to delete by numeric id
        if (!deletedBlog) {
            const numericId = parseInt(req.params.id);
            if (!isNaN(numericId)) {
                deletedBlog = await blogModel.findOneAndDelete({ id: numericId });
            }
        }
        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};
