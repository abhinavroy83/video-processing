import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';
import { IRole } from '../models/Role';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
    user?: IUser;
    role?: IRole;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. No token provided.',
            });
            return;
        }

        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.userId)
            .populate('role')
            .select('-password');

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'User not found or token invalid.',
            });
            return;
        }

        if (!user.isActive) {
            res.status(403).json({
                success: false,
                message: 'Account is inactive. Please contact support.',
            });
            return;
        }

        req.user = user;
        req.role = user.role as any;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token.',
        });
    }
};
