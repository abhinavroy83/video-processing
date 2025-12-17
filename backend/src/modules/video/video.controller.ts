import { Response, NextFunction } from 'express';
import { Video, VideoStatus } from '../../models/Video';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AppError } from '../../middlewares/error.middleware';

export const createVideo = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, description, tags } = req.body;
        const file = req.file;

        if (!file) {
            throw new AppError('Video file is required', 400);
        }

        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }

        const video = await Video.create({
            title,
            description,
            fileName: file.filename,
            filePath: file.path,
            fileSize: file.size,
            status: VideoStatus.UPLOADING,
            uploadedBy: req.user._id,
            tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        });

        res.status(201).json({
            success: true,
            message: 'Video uploaded successfully',
            data: { video },
        });
    } catch (error) {
        next(error);
    }
};

export const getVideos = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const videos = await Video.find()
            .populate('uploadedBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Video.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                videos,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getVideoById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const video = await Video.findById(req.params.id).populate(
            'uploadedBy',
            'firstName lastName email'
        );

        if (!video) {
            throw new AppError('Video not found', 404);
        }

        res.status(200).json({
            success: true,
            data: { video },
        });
    } catch (error) {
        next(error);
    }
};

export const updateVideo = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, description, tags, status } = req.body;

        const video = await Video.findById(req.params.id);

        if (!video) {
            throw new AppError('Video not found', 404);
        }

        // Check if user owns the video or is admin
        if (video.uploadedBy.toString() !== req.user?._id.toString()) {
            throw new AppError('Not authorized to update this video', 403);
        }

        video.title = title || video.title;
        video.description = description || video.description;
        video.tags = tags ? tags.split(',').map((tag: string) => tag.trim()) : video.tags;
        video.status = status || video.status;

        await video.save();

        res.status(200).json({
            success: true,
            message: 'Video updated successfully',
            data: { video },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteVideo = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            throw new AppError('Video not found', 404);
        }

        // Check if user owns the video
        if (video.uploadedBy.toString() !== req.user?._id.toString()) {
            throw new AppError('Not authorized to delete this video', 403);
        }

        await video.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Video deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const getMyVideos = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const videos = await Video.find({ uploadedBy: req.user?._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Video.countDocuments({ uploadedBy: req.user?._id });

        res.status(200).json({
            success: true,
            data: {
                videos,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
