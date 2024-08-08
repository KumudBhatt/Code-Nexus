//routes/user.js
const express = require("express");
const userRouter = express.Router();
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { JWT_SECRET } = require('../config');
const authMiddleware = require("./middleware");
const { User, Project } = require("../db");
const { generateFile } = require('../generateFile');
const { executeCpp } = require("../executeCpp"); 


// Define the schemas for validation
const signupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string()
});

const signinSchema = z.object({
    username: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string()
}).refine(data => data.username || data.email, {
    message: "Either 'username' or 'email' must be provided",
});

const updateBody = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
});

const projectSchema = z.object({
    projectName: z.string().min(1),
    data: z.string().optional()
});

// Standardized response format
const formatResponse = (status, message, data = null) => ({ status, message, data });

// Rate limiting middleware for login/signup
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

const submissionLimiter = rateLimit({
    windowMs: 5 * 1000, // 5 seconds
    max: 1, // Limit each IP to 1 request per windowMs
    message: 'Too many submissions from this IP, please try again later.',
});

// User signup route
userRouter.post("/signup", async (req, res) => {
    const data = req.body;
    const result = signupSchema.safeParse(data);

    if (!result.success) {
        return res.status(403).json(formatResponse('error', 'Invalid inputs', result.error.errors));
    }

    try {
        const existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(409).json(formatResponse('error', 'Username already taken'));
        }
        const existingEmail = await User.findOne({ email: data.email });
        if (existingEmail) {
            return res.status(409).json(formatResponse('error', 'Email already taken'));
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const user = await User.create(data);
        const userId = user._id;

        const token = jwt.sign({ userId }, JWT_SECRET);

        return res.json(formatResponse('success', 'User created successfully', { token }));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// User signin route
userRouter.post("/signin", authLimiter, async (req, res) => {
    const data = req.body;
    const result = signinSchema.safeParse(data);

    if (!result.success) {
        return res.status(403).json(formatResponse('error', 'Invalid username or email', result.error.errors));
    }

    try {
        const user = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] });
        if (!user) {
            return res.status(401).json(formatResponse('error', 'Invalid username or email'));
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json(formatResponse('error', 'Invalid password'));
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET);
        return res.status(200).json(formatResponse('success', 'Signin successful', { token }));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// Route to update user information
userRouter.put('/updateUserInfo', authMiddleware, async (req, res) => {
    const data = req.body;
    const result = updateBody.safeParse(data);

    if (!result.success) {
        return res.status(400).json(formatResponse('error', 'Invalid update data', result.error.errors));
    }

    try {
        const updates = { ...data };

        // Hash the new password if provided
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        // Update user in the database
        const user = await User.findByIdAndUpdate(req.userId, updates, { new: true }).select('-password');
        
        if (!user) {
            return res.status(404).json(formatResponse('error', 'User not found'));
        }

        return res.json(formatResponse('success', 'User updated successfully', user));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// Create a new project
userRouter.post("/create", authMiddleware, async (req, res) => {
    const data = req.body;
    const result = projectSchema.safeParse(data);

    if (!result.success) {
        return res.status(400).json(formatResponse('error', 'Invalid project data', result.error.errors));
    }

    try {
        const project = await Project.create({ ...data, userId: req.userId });
        return res.status(201).json(formatResponse('success', 'Project created successfully', { projectId: project._id }));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// Update project data
userRouter.put("/update/:projectId", authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    const data = req.body;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json(formatResponse('error', 'Project not found'));
        }

        if (project.userId.toString() !== req.userId) {
            return res.status(403).json(formatResponse('error', 'Not authorized to update this project'));
        }

        await Project.updateOne({ _id: projectId }, data);
        return res.json(formatResponse('success', 'Project updated successfully'));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// Get user projects route
userRouter.get("/projects", authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find({ userId: req.userId });
        return res.json(formatResponse('success', 'Projects fetched successfully', projects));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// Delete project route
userRouter.delete("/delete/:projectId", authMiddleware, async (req, res) => {
    const { projectId } = req.params;

    try {
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json(formatResponse('error', 'Project not found'));
        }

        if (project.userId.toString() !== req.userId) {
            return res.status(403).json(formatResponse('error', 'Not authorized to delete this project'));
        }

        await Project.deleteOne({ _id: projectId });
        return res.json(formatResponse('success', 'Project deleted successfully'));
    } catch (error) {
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

// Compile and run a project
userRouter.post('/projects/:projectId/run', authMiddleware, submissionLimiter, async (req, res) => {
    const { projectId } = req.params;
    const { userInput, code, format } = req.body;

    if (typeof userInput !== 'string') {
        return res.status(400).json(formatResponse('error', 'Invalid input format'));
    }

    try {
        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json(formatResponse('error', 'Project not found'));
        }

        // Check if the user owns the project
        if (project.userId.toString() !== req.userId) {
            return res.status(403).json(formatResponse('error', 'Not authorized to run this project'));
        }

        // Generate a file with the provided code and format
        const filepath = await generateFile(format, code);

        // Compile and run the generated file
        const output = await executeCpp(filepath, userInput);

        return res.status(200).json(formatResponse('success', 'Execution successful', output));
    } catch (error) {
        console.error("Error executing project:", error);
        res.status(500).json(formatResponse('error', 'Internal server error', error.message));
    }
});

module.exports = userRouter;
