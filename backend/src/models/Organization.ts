import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
    name: string;
    slug: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    members: Array<{
        user: mongoose.Types.ObjectId;
        role: string;
        joinedAt: Date;
    }>;
    settings: {
        maxStorageGB: number;
        maxVideoLength: number;
        allowedFormats: string[];
        moderationEnabled: boolean;
        streamingEnabled: boolean;
    };
    subscription: {
        plan: 'free' | 'basic' | 'pro' | 'enterprise';
        status: 'active' | 'inactive' | 'suspended';
        startDate: Date;
        endDate?: Date;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
    {
        name: {
            type: String,
            required: [true, 'Organization name is required'],
            trim: true,
            maxlength: [100, 'Name cannot be more than 100 characters'],
        },
        slug: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                user: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                role: {
                    type: String,
                    enum: ['owner', 'admin', 'member', 'viewer'],
                    default: 'member',
                },
                joinedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        settings: {
            maxStorageGB: {
                type: Number,
                default: 10,
            },
            maxVideoLength: {
                type: Number,
                default: 3600,
            },
            allowedFormats: {
                type: [String],
                default: ['mp4', 'mov', 'avi', 'mkv'],
            },
            moderationEnabled: {
                type: Boolean,
                default: true,
            },
            streamingEnabled: {
                type: Boolean,
                default: true,
            },
        },
        subscription: {
            plan: {
                type: String,
                enum: ['free', 'basic', 'pro', 'enterprise'],
                default: 'free',
            },
            status: {
                type: String,
                enum: ['active', 'inactive', 'suspended'],
                default: 'active',
            },
            startDate: {
                type: Date,
                default: Date.now,
            },
            endDate: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

organizationSchema.index({ owner: 1 });
organizationSchema.index({ slug: 1 }, { unique: true });
organizationSchema.index({ 'members.user': 1 });

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
