export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/video_processing',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',
    jwtExpire: process.env.JWT_EXPIRE || '24h',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600'),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
};
