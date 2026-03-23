/**
 * Seed Admin User Script
 * Run: node backend/scripts/seedAdminUser.js
 * Creates super_admin if not exists.
 * Login: admin@fashioncart.com / Admin@123
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

import connectDB from '../config/databaseConnection.js';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'admin@fashioncart.com';
const ADMIN_PASSWORD = 'Admin@123';

const seedAdminUser = async () => {
  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (admin) {
      admin.password = hashedPassword;
      admin.role = 'super_admin';
      await admin.save();
      console.log('Admin password reset successfully!');
    } else {
      admin = await User.create({
      name: 'Super Admin',
      email: ADMIN_EMAIL,
      phone: '9999999999',
      password: hashedPassword,
      role: 'super_admin',
    });
      console.log('Admin user created successfully!');
    }


    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};

seedAdminUser();
