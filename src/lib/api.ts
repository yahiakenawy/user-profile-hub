import axios from 'axios';

const getBaseURL = (): string => {
  const hostname = window.location.hostname;
  // In production: subdomain.zakerai.org
  // In dev: subdomain.localhost
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

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tenant API
export const tenantApi = {
  getTenantInfo: () => apiClient.get('/api/tenant/'),
};

// Analytics API
export const analyticsApi = {
  getProfile: () => apiClient.get('/api/analytics/profile/'),
  getAnalysis: () => apiClient.get('/api/analytics/analysis/'),
  getStudentsAnalysis: (params?: { subject_id?: number; level_id?: number }) =>
    apiClient.get('/api/analytics/analysis/students/', { params }),
  getTeachersAnalysis: (params?: { subject_id?: number }) =>
    apiClient.get('/api/analytics/analysis/teachers/', { params }),
  getSubjectOverview: (subjectId: number) =>
    apiClient.get(`/api/analytics/subject-analysis/${subjectId}/`),
  getSubjectStudents: (subjectId: number) =>
    apiClient.get(`/api/analytics/subject-analysis/${subjectId}/students/`),
};

// Subscription API
export const subscriptionApi = {
  getDetail: () => apiClient.get('/api/subiscription/detail/'),
  create: (data: { plane_id: number; billing_cycle: string }) =>
    apiClient.post('/api/subiscription/', data),
  getPlans: (language?: string) =>
    apiClient.get('/api/subiscription/plans/', { params: { language } }),
  getTiers: (language?: string) =>
    apiClient.get('/api/subiscription/tiers/', { params: { language } }),
};

// Users API
export const usersApi = {
  listUsers: (params?: { role?: string; username?: string }) =>
    apiClient.get('/api/users/', { params }),
  getInvitations: (params?: { user_id?: number }) =>
    apiClient.get('/api/users/invite-code/', { params }),
  createInvitations: (role: string, count?: number) =>
    apiClient.post(`/api/users/invite-code/${count ? `?count=${count}` : ''}`, { role }),
  deleteInvitations: (ids: number[]) =>
    apiClient.delete('/api/users/invite-code/', { data: { ids } }),
};
