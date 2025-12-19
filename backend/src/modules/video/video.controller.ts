import { Response, NextFunction } from 'express';
import { Video, VideoStatus, ModerationStatus } from '../../models/Video';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AppError } from '../../middlewares/error.middleware';
import { SensitivityService } from '../../services/sensitivity.service';
import { VideoProcessingService } from '../../services/videoProcessing.service';
import path from 'path';

export const createVideo = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { title, description, tags, organizationId } = req.body;
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
            moderationStatus: ModerationStatus.PENDING,
            uploadedBy: req.user._id,
            organization: organizationId,
            tags: tags ? tags.split(',').map((tag: string) => tag.trim()) : [],
        });

        processVideoAsync(video._id.toString(), file.path, title, description).catch(console.error);

        res.status(201).json({
            success: true,
            message: 'Video uploaded successfully. Processing started.',
            data: { video },
        });
    } catch (error) {
        next(error);
    }
};

async function processVideoAsync(videoId: string, filePath: string, title: string, description: string): Promise<void> {
    try {
        await Video.findByIdAndUpdate(videoId, { status: VideoStatus.PROCESSING });

        const textAnalysis = await SensitivityService.analyzeText(`${title} ${description || ''}`);

        const sensitivityAnalysis = await SensitivityService.analyzeVideo(filePath, {});

        const moderationStatus = SensitivityService.determineModerationStatus(sensitivityAnalysis.score);

        const outputDir = path.join('uploads', 'processed', videoId);
        const processingResult = await VideoProcessingService.processVideo({
            inputPath: filePath,
            outputDir,
            videoId,
        });

        await Video.findByIdAndUpdate(videoId, {
            status: VideoStatus.COMPLETED,
            moderationStatus,
            sensitivityAnalysis,
            streamPath: processingResult.streamPath,
            thumbnailPath: processingResult.thumbnailPath,
            duration: processingResult.duration,
            metadata: processingResult.metadata,
        });
    } catch (error) {
        console.error('Video processing failed:', error);
        await Video.findByIdAndUpdate(videoId, { status: VideoStatus.FAILED });
    }
}

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

export const streamVideo = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const video = await Video.findById(req.params.id);

        if (!video) {
            throw new AppError('Video not found', 404);
        }

        if (video.moderationStatus === ModerationStatus.REJECTED) {
            throw new AppError('This video has been rejected and cannot be streamed', 403);
        }

        if (!video.streamPath) {
            throw new AppError('Video streaming not available yet. Processing may still be in progress.', 404);
        }

        res.status(200).json({
            success: true,
            data: {
                streamUrl: `/videos/${video._id}/stream.m3u8`,
                thumbnailUrl: video.thumbnailPath,
                duration: video.duration,
                status: video.status,
                moderationStatus: video.moderationStatus,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const moderateVideo = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { status, notes } = req.body;
        const video = await Video.findById(req.params.id);

        if (!video) {
            throw new AppError('Video not found', 404);
        }

        video.moderationStatus = status;
        await video.save();

        res.status(200).json({
            success: true,
            message: 'Video moderation status updated',
            data: { video },
        });
    } catch (error) {
        next(error);
    }
};
