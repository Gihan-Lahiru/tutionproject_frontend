import api from './axios'

// Classes API
export const classesApi = {
  getAll: () => api.get('/classes'),
  getById: (id) => api.get(`/classes/${id}`),
  create: (data) => api.post('/classes', data),
  update: (id, data) => api.put(`/classes/${id}`, data),
  delete: (id) => api.delete(`/classes/${id}`),
  enroll: (id) => api.post(`/classes/${id}/enroll`),
}

// Announcements API
export const announcementsApi = {
  getByClass: (classId) => api.get(`/classes/${classId}/announcements`),
  create: (classId, data) => api.post(`/classes/${classId}/announcements`, data),
  update: (id, data) => api.put(`/announcements/${id}`, data),
  delete: (id) => api.delete(`/announcements/${id}`),
}

// Assignments API
export const assignmentsApi = {
  getByClass: (classId) => api.get(`/classes/${classId}/assignments`),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (classId, data) => api.post(`/classes/${classId}/assignments`, data),
  submit: (id, formData) => api.post(`/assignments/${id}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  grade: (id, data) => api.post(`/assignments/${id}/grade`, data),
}

// Notes API
export const notesApi = {
  getByClass: (classId) => api.get(`/classes/${classId}/notes`),
  create: (classId, formData) => api.post(`/classes/${classId}/notes`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/notes/${id}`),
}

// Videos API
export const videosApi = {
  getByClass: (classId) => api.get(`/classes/${classId}/videos`),
  create: (classId, data) => api.post(`/classes/${classId}/videos`, data),
  delete: (id) => api.delete(`/videos/${id}`),
}

// Payments API
export const paymentsApi = {
  getUserPayments: (userId) => api.get(`/users/${userId}/payments`),
  initPayment: (data) => api.post('/payments/init', data),
  verifyPayment: (data) => api.post('/payments/verify', data),
}

// Users API
export const usersApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getStudentsByClass: (classId) => api.get(`/classes/${classId}/students`),
}
