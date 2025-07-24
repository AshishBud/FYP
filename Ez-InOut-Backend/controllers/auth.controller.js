import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js';
import Admin from '../models/admin.model.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    // Throw error if an existing admin is found
    const existingAdmin = await Admin.findOne({ email }).session(session);
    if (existingAdmin) {
      const error = new Error('Admin already exists');
      error.statusCode = 409;
      throw error;
    }

    // Validate input
    if (!name || !name.trim()) {
      const error = new Error('Name is required');
      error.statusCode = 400;
      throw error;
    }
    if (!email || !email.trim()) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }
    if (!password || !password.trim()) {
      const error = new Error('Password is required');
      error.statusCode = 400;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin
    const newAdmins = await Admin.create(
      [{ name, email, password: hashedPassword}],
      { session }
    );

    // Generate JWT token
    const token = jwt.sign({ adminId: newAdmins[0]._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: 'New Admin Created',
      data: {
        token,
        admin: newAdmins[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !email.trim()) {
      const error = new Error('Email is required');
      error.statusCode = 400;
      throw error;
    }
    if (!password || !password.trim()) {
      const error = new Error('Password is required');
      error.statusCode = 400;
      throw error;
    }

    // Retrieve the hashed password for the admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      const error = new Error('Admin not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if the password matches
    const adminValidated = await bcrypt.compare(password, admin.password);
    if (!adminValidated) {
      const error = new Error('Password is incorrect');
      error.statusCode = 401;
      throw error;
    }


    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id}, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      data: {
        token,
        admin,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  // Implement sign-out logic if needed (e.g., token blacklist)
  res.status(200).json({
    success: true,
    message: 'Admin signed out successfully',
  });
};