import axios from 'axios';

const getBaseURL = (): string => {
  const hostname = window.location.hostname;
  if (hostname.includes('localhost')) {
    const parts = hostname.split('.');
    const subdomain = parts.length > 1 ? parts[0] : 'demo';
    return `http://${subdomain}.localhost`;
  }
  return `https://${hostname}`;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== MOCK MODE =====
// Set to true to use mock data instead of real API calls
export const USE_MOCK_API = true;

import {
  mockProfileAdmin,
  mockAnalysisAdmin,
  mockSubjectOverview,
  mockSubscription,
  mockPlans,
  mockUsers,
  mockInvitations,
} from './mockData';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// Tenant API
export const tenantApi = {
  getTenantInfo: () => apiClient.get('/api/tenant/'),
};

// Analytics API
export const analyticsApi = {
  getProfile: async () => {
    if (USE_MOCK_API) {
      await delay(400);
      return { data: mockProfileAdmin };
    }
    return apiClient.get('/api/analytics/profile/');
  },
  getAnalysis: async () => {
    if (USE_MOCK_API) {
      await delay(500);
      return { data: mockAnalysisAdmin };
    }
    return apiClient.get('/api/analytics/analysis/');
  },
  getStudentsAnalysis: async (params?: { subject_id?: number; level_id?: number }) => {
    if (USE_MOCK_API) {
      await delay(400);
      return { data: mockUsers.students };
    }
    return apiClient.get('/api/analytics/analysis/students/', { params });
  },
  getTeachersAnalysis: async (params?: { subject_id?: number }) => {
    if (USE_MOCK_API) {
      await delay(400);
      return { data: mockUsers.teachers };
    }
    return apiClient.get('/api/analytics/analysis/teachers/', { params });
  },
  getSubjectOverview: async (subjectId: number) => {
    if (USE_MOCK_API) {
      await delay(400);
      return { data: { ...mockSubjectOverview, subject: { ...mockSubjectOverview.subject, id: subjectId } } };
    }
    return apiClient.get(`/api/analytics/subject-analysis/${subjectId}/`);
  },
  getSubjectStudents: async (subjectId: number) => {
    if (USE_MOCK_API) {
      await delay(300);
      return { data: [] };
    }
    return apiClient.get(`/api/analytics/subject-analysis/${subjectId}/students/`);
  },
};

// Subscription API
export const subscriptionApi = {
  getDetail: async () => {
    if (USE_MOCK_API) {
      await delay(400);
      return { data: mockSubscription };
    }
    return apiClient.get('/api/subiscription/detail/');
  },
  create: async (data: { plane_id: number; billing_cycle: string }) => {
    if (USE_MOCK_API) {
      await delay(800);
      return { data: { ...mockSubscription, plane_data: mockPlans.find(p => p.id === data.plane_id), billing_cycle: data.billing_cycle } };
    }
    return apiClient.post('/api/subiscription/', data);
  },
  getPlans: async (language?: string) => {
    if (USE_MOCK_API) {
      await delay(300);
      return { data: mockPlans };
    }
    return apiClient.get('/api/subiscription/plans/', { params: { language } });
  },
  getTiers: async (language?: string) => {
    if (USE_MOCK_API) {
      await delay(300);
      return { data: [] };
    }
    return apiClient.get('/api/subiscription/tiers/', { params: { language } });
  },
};

// Users API
export const usersApi = {
  listUsers: async (params?: { role?: string; username?: string }) => {
    if (USE_MOCK_API) {
      await delay(400);
      const role = params?.role ?? 'student';
      let users = role === 'teacher' ? mockUsers.teachers : mockUsers.students;
      if (params?.username) {
        users = users.filter(u => u.username.toLowerCase().includes(params.username!.toLowerCase()));
      }
      return { data: users };
    }
    return apiClient.get('/api/users/', { params });
  },
  getInvitations: async (params?: { user_id?: number }) => {
    if (USE_MOCK_API) {
      await delay(400);
      return { data: mockInvitations };
    }
    return apiClient.get('/api/users/invite-code/', { params });
  },
  createInvitations: async (role: string, count?: number) => {
    if (USE_MOCK_API) {
      await delay(600);
      const num = count ?? 1;
      const codes = Array.from({ length: num }, (_, i) => ({
        id: 100 + i,
        is_accepted: false,
        created_at: new Date().toISOString(),
        code: `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        role,
      }));
      return { data: codes };
    }
    return apiClient.post(`/api/users/invite-code/${count ? `?count=${count}` : ''}`, { role });
  },
  deleteInvitations: async (ids: number[]) => {
    if (USE_MOCK_API) {
      await delay(300);
      return { data: { deleted: ids.length } };
    }
    return apiClient.delete('/api/users/invite-code/', { data: { ids } });
  },
};
