import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Role } from '../models/Role';
import connectDB from '../config/database';

dotenv.config();

const createAdminUser = async () => {
    try {
        await connectDB();

        // Check if admin role exists
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.error('Admin role not found. Please run "npm run seed:roles" first.');
            process.exit(1);
        }

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email: admin@example.com');
            process.exit(0);
        }

        // Create admin user
        const adminUser = await User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'admin123',
            role: adminRole._id,
            isActive: true,
            isEmailVerified: true,
        });

        console.log('✓ Admin user created successfully!');
        console.log('\nLogin Credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('\n⚠️  IMPORTANT: Change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdminUser();
