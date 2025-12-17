import mongoose, { Document, Schema } from 'mongoose';

export enum VideoStatus {
    UPLOADING = 'uploading',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface IVideo extends Document {
    title: string;
    description?: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    duration?: number;
    thumbnailPath?: string;
    status: VideoStatus;
    uploadedBy: mongoose.Types.ObjectId;
    tags?: string[];
    metadata?: {
        resolution?: string;
        format?: string;
        codec?: string;
        bitrate?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
    {
        title: {
            type: String,
            required: [true, 'Video title is required'],
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot be more than 1000 characters'],
        },
        fileName: {
            type: String,
            required: [true, 'File name is required'],
        },
        filePath: {
            type: String,
            required: [true, 'File path is required'],
        },
        fileSize: {
            type: Number,
            required: [true, 'File size is required'],
        },
        duration: {
            type: Number,
        },
        thumbnailPath: {
            type: String,
        },
        status: {
            type: String,
            enum: Object.values(VideoStatus),
            default: VideoStatus.UPLOADING,
        },
        uploadedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        tags: [
            {
                type: String,
                trim: true,
            },
        ],
        metadata: {
            resolution: String,
            format: String,
            codec: String,
            bitrate: Number,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
videoSchema.index({ uploadedBy: 1, status: 1 });
videoSchema.index({ createdAt: -1 });

export const Video = mongoose.model<IVideo>('Video', videoSchema);
