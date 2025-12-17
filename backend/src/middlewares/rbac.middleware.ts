import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { IRole } from '../models/Role';

export const authorize = (...permissions: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !req.role) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
            return;
        }

        const role = req.role as IRole;

        // Check if user has any of the required permissions
        const hasPermission = permissions.some((permission) =>
            role.permissions.includes(permission)
        );

        if (!hasPermission) {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
                requiredPermissions: permissions,
            });
            return;
        }

        next();
    };
};

export const restrictTo = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !req.role) {
            res.status(401).json({
                success: false,
                message: 'Authentication required.',
            });
            return;
        }

        const role = req.role as IRole;

        if (!roles.includes(role.name)) {
            res.status(403).json({
                success: false,
                message: 'You do not have the required role to perform this action.',
                requiredRoles: roles,
                yourRole: role.name,
            });
            return;
        }

        next();
    };
};
