import api from './api';

export interface Organization {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    owner: any;
    members: Array<{
        user: any;
        role: string;
        joinedAt: string;
    }>;
    settings: {
        maxStorageGB: number;
        maxVideoLength: number;
        allowedFormats: string[];
        moderationEnabled: boolean;
        streamingEnabled: boolean;
    };
    createdAt: string;
    updatedAt: string;
}

export const organizationService = {
    createOrganization: async (data: { name: string; description?: string }) => {
        const response = await api.post('/organizations', data);
        return response.data;
    },

    getOrganizations: async () => {
        const response = await api.get('/organizations');
        return response.data;
    },

    getOrganizationById: async (id: string) => {
        const response = await api.get(`/organizations/${id}`);
        return response.data;
    },

    addMember: async (orgId: string, userId: string, role: string) => {
        const response = await api.post(`/organizations/${orgId}/members`, { userId, role });
        return response.data;
    },

    removeMember: async (orgId: string, userId: string) => {
        const response = await api.delete(`/organizations/${orgId}/members/${userId}`);
        return response.data;
    },
};
