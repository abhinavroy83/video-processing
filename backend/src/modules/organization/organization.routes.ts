import { Router } from 'express';
import * as orgController from './organization.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authorize } from '../../middlewares/rbac.middleware';

const router = Router();

router.post(
    '/',
    authenticate,
    orgController.createOrganization
);

router.get(
    '/',
    authenticate,
    orgController.getOrganizations
);

router.get(
    '/:id',
    authenticate,
    orgController.getOrganizationById
);

router.post(
    '/:id/members',
    authenticate,
    orgController.addMember
);

router.delete(
    '/:id/members/:userId',
    authenticate,
    orgController.removeMember
);

export default router;
