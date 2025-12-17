import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
    name: string;
    description: string;
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<IRole>(
    {
        name: {
            type: String,
            required: [true, 'Role name is required'],
            unique: true,
            trim: true,
            enum: ['admin', 'user', 'moderator', 'editor'],
        },
        description: {
            type: String,
            required: [true, 'Role description is required'],
        },
        permissions: [
            {
                type: String,
                enum: [
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
        ],
    },
    {
        timestamps: true,
    }
);

export const Role = mongoose.model<IRole>('Role', roleSchema);
