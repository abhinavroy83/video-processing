import api from './api';

export interface Video {
    _id: string;
    title: string;
    description?: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    duration?: number;
    thumbnailPath?: string;
    streamPath?: string;
    status: 'uploading' | 'processing' | 'completed' | 'failed';
    moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
    sensitivityAnalysis?: {
        score: number;
        flags: string[];
        detectedContent: {
            violence?: boolean;
            adult?: boolean;
            offensive?: boolean;
            sensitive?: boolean;
        };
        analyzedAt: string;
    };
    uploadedBy: any;
    organization?: string;
    tags?: string[];
    metadata?: {
        resolution?: string;
        format?: string;
        codec?: string;
        bitrate?: number;
    };
    createdAt: string;
    updatedAt: string;
}

export const videoService = {
    uploadVideo: async (formData: FormData) => {
        const response = await api.post('/videos', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getVideos: async (page = 1, limit = 10) => {
        const response = await api.get(`/videos?page=${page}&limit=${limit}`);
        return response.data;
    },

    getMyVideos: async (page = 1, limit = 10) => {
        const response = await api.get(`/videos/my-videos?page=${page}&limit=${limit}`);
        return response.data;
    },

    getVideoById: async (id: string) => {
        const response = await api.get(`/videos/${id}`);
        return response.data;
    },

    getStreamUrl: async (id: string) => {
        const response = await api.get(`/videos/${id}/stream`);
        return response.data;
    },

    updateVideo: async (id: string, data: Partial<Video>) => {
        const response = await api.put(`/videos/${id}`, data);
        return response.data;
    },

    deleteVideo: async (id: string) => {
        const response = await api.delete(`/videos/${id}`);
        return response.data;
    },

    moderateVideo: async (id: string, status: string, notes?: string) => {
        const response = await api.put(`/videos/${id}/moderate`, { status, notes });
        return response.data;
    },
};
