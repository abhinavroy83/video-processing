import { Response, NextFunction } from 'express';
import { Organization } from '../../models/Organization';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AppError } from '../../middlewares/error.middleware';

export const createOrganization = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, description } = req.body;

        if (!req.user) {
            throw new AppError('User not authenticated', 401);
        }

        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const existingOrg = await Organization.findOne({ slug });
        if (existingOrg) {
            throw new AppError('Organization with this name already exists', 400);
        }

        const organization = await Organization.create({
            name,
            slug,
            description,
            owner: req.user._id,
            members: [
                {
                    user: req.user._id,
                    role: 'owner',
                    joinedAt: new Date(),
                },
            ],
        });

        res.status(201).json({
            success: true,
            message: 'Organization created successfully',
            data: { organization },
        });
    } catch (error) {
        next(error);
    }
};

export const getOrganizations = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const organizations = await Organization.find({
            $or: [
                { owner: req.user?._id },
                { 'members.user': req.user?._id },
            ],
        }).populate('owner', 'firstName lastName email');

        res.status(200).json({
            success: true,
            data: { organizations },
        });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const organization = await Organization.findById(req.params.id)
            .populate('owner', 'firstName lastName email')
            .populate('members.user', 'firstName lastName email');

        if (!organization) {
            throw new AppError('Organization not found', 404);
        }

        const isMember = organization.members.some(
            (member) => member.user._id.toString() === req.user?._id.toString()
        );

        if (!isMember) {
            throw new AppError('Not authorized to view this organization', 403);
        }

        res.status(200).json({
            success: true,
            data: { organization },
        });
    } catch (error) {
        next(error);
    }
};

export const addMember = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId, role } = req.body;
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            throw new AppError('Organization not found', 404);
        }

        if (organization.owner.toString() !== req.user?._id.toString()) {
            throw new AppError('Only organization owner can add members', 403);
        }

        const existingMember = organization.members.find(
            (member) => member.user.toString() === userId
        );

        if (existingMember) {
            throw new AppError('User is already a member', 400);
        }

        organization.members.push({
            user: userId,
            role: role || 'member',
            joinedAt: new Date(),
        });

        await organization.save();

        res.status(200).json({
            success: true,
            message: 'Member added successfully',
            data: { organization },
        });
    } catch (error) {
        next(error);
    }
};

export const removeMember = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { userId } = req.params;
        const organization = await Organization.findById(req.params.id);

        if (!organization) {
            throw new AppError('Organization not found', 404);
        }

        if (organization.owner.toString() !== req.user?._id.toString()) {
            throw new AppError('Only organization owner can remove members', 403);
        }

        organization.members = organization.members.filter(
            (member) => member.user.toString() !== userId
        );

        await organization.save();

        res.status(200).json({
            success: true,
            message: 'Member removed successfully',
            data: { organization },
        });
    } catch (error) {
        next(error);
    }
};
