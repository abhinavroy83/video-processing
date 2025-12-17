import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Role } from '../models/Role';
import connectDB from '../config/database';

dotenv.config();

const defaultRoles = [
    {
        name: 'admin',
        description: 'Administrator with full access',
        permissions: [
            'video:create',
            'video:read',
            'video:update',
            'video:delete',
            'user:read',
            'user:update',
            'user:delete',
            'role:manage',
        ],
    },
    {
        name: 'user',
        description: 'Default user role',
        permissions: ['video:create', 'video:read', 'video:update', 'user:read'],
    },
    {
        name: 'moderator',
        description: 'Content moderator',
        permissions: [
            'video:create',
            'video:read',
            'video:update',
            'video:delete',
            'user:read',
        ],
    },
    {
        name: 'editor',
        description: 'Content editor',
        permissions: ['video:create', 'video:read', 'video:update', 'user:read'],
    },
];

const seedRoles = async () => {
    try {
        await connectDB();

        // Clear existing roles
        await Role.deleteMany({});
        console.log('Cleared existing roles');

        // Insert default roles
        await Role.insertMany(defaultRoles);
        console.log('Default roles created successfully');

        console.log('\nRoles seeded:');
        defaultRoles.forEach((role) => {
            console.log(`- ${role.name}: ${role.description}`);
            console.log(`  Permissions: ${role.permissions.join(', ')}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding roles:', error);
        process.exit(1);
    }
};

seedRoles();
