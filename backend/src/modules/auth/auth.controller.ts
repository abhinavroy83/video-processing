import { Request, Response, NextFunction } from 'express';
import { User } from '../../models/User';
import { Role } from '../../models/Role';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { AppError } from '../../middlewares/error.middleware';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('Email already registered', 400);
        }

        // Get default user role
        let userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
            // Create default user role if it doesn't exist
            userRole = await Role.create({
                name: 'user',
                description: 'Default user role',
                permissions: ['video:create', 'video:read', 'video:update', 'user:read'],
            });
        }

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            role: userRole._id,
        });

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            role: userRole.name,
        });

        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            email: user.email,
            role: userRole.name,
        });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: userRole.name,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find user with password
        const user = await User.findOne({ email }).select('+password').populate('role');

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        // Check if user is active
        if (!user.isActive) {
            throw new AppError('Account is inactive. Please contact support.', 403);
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        const role = user.role as any;

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            role: role.name,
        });

        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            email: user.email,
            role: role.name,
        });

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: role.name,
                    permissions: role.permissions,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.user) {
            req.user.refreshToken = undefined;
            await req.user.save();
        }

        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user
        const user = await User.findById(decoded.userId)
            .select('+refreshToken')
            .populate('role');

        if (!user || user.refreshToken !== refreshToken) {
            throw new AppError('Invalid refresh token', 401);
        }

        const role = user.role as any;

        // Generate new access token
        const newAccessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            role: role.name,
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                accessToken: newAccessToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.user) {
            throw new AppError('User not found', 404);
        }

        const role = req.role as any;

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    role: role.name,
                    permissions: role.permissions,
                    isEmailVerified: req.user.isEmailVerified,
                },
            },
        });
    } catch (error) {
        next(error);
    }
};
