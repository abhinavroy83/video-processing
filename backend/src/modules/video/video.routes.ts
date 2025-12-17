import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import * as videoController from './video.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, 'video-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|avi|mov|wmv|flv|mkv/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'));
        }
    },
});

// Routes
router.post(
    '/',
    authenticate,
    authorize('video:create'),
    upload.single('video'),
    videoController.createVideo
);

router.get(
    '/',
    authenticate,
    authorize('video:read'),
    videoController.getVideos
);

router.get(
    '/my-videos',
    authenticate,
    authorize('video:read'),
    videoController.getMyVideos
);

router.get(
    '/:id',
    authenticate,
    authorize('video:read'),
    videoController.getVideoById
);

router.put(
    '/:id',
    authenticate,
    authorize('video:update'),
    videoController.updateVideo
);

router.delete(
    '/:id',
    authenticate,
    authorize('video:delete'),
    videoController.deleteVideo
);

export default router;
