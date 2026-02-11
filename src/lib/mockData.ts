// Mock data for demo/development mode

export const mockProfileAdmin = {
  role: 'admin',
  profile_data: {
    id: 1,
    total_students: 342,
    total_teachers: 28,
    total_classes: 18,
    level_distribution: { elementary: 120, middle: 112, high: 110 },
    overall_avg_score: 74.5,
    overall_pass_rate: 82.3,
    performance_distribution: { excellent: 45, good: 120, average: 130, needs_improvement: 47 },
    subject_performance: { Arabic: 78.2, English: 71.4, Math: 69.8, Science: 76.1, History: 80.5 },
    total_exams_administered: 1256,
  },
};

export const mockProfileTeacher = {
  role: 'teacher',
  profile_data: {
    id: 2,
    username: 'teacher_ali',
    full_name: 'Ali Hassan',
    email: 'ali@school.com',
    phone: '+966501234567',
    subject_info: { id: 1, name: 'Arabic', level: 'elementary', semester: 'First Semester' },
    total_students: 65,
    total_classes: 4,
    total_exams_created: 32,
    avg_score: 76.3,
    avg_pass_rate: 85.1,
    high_performers_count: 12,
    grade_distribution: { A: 12, B: 20, C: 18, D: 10, F: 5 },
    weak_points: ['Grammar rules', 'Essay structure'],
    strength_points: ['Reading comprehension', 'Vocabulary'],
    rank_in_organization: 3,
    performance_rating: 'good',
  },
};

export const mockProfileStudent = {
  role: 'student',
  profile_data: {
    id: 3,
    username: 'student_sara',
    full_name: 'Sara Ahmed',
    email: 'sara@school.com',
    phone: '+966507654321',
    level_info: { id: 1, stage: 'elementary', grade: '3', display: 'Elementary Grade 3' },
    longest_streak_days: 14,
    last_active_date: '2026-02-10',
    rank_in_class: 5,
    rank_in_level: 12,
    overall_avg_score: 81.2,
    parent_phone: '+966509876543',
    risk_factors: [],
    subject_profiles: [
      { id: 1, subject_id: 1, subject_name: 'Arabic', no_of_exams: 8, avg_score: 85.3, pass_rate: 100, highest_score: 95, lowest_score: 72, last_5_exams_avg: 87.1, weak_points: ['Grammar'], strength_points: ['Reading'], rank_in_class: 3, rank_in_level: 8, performance_trend: 'improving' },
      { id: 2, subject_id: 2, subject_name: 'English', no_of_exams: 7, avg_score: 78.5, pass_rate: 85.7, highest_score: 92, lowest_score: 60, last_5_exams_avg: 80.2, weak_points: ['Writing'], strength_points: ['Listening'], rank_in_class: 7, rank_in_level: 15, performance_trend: 'stable' },
      { id: 3, subject_id: 5, subject_name: 'Math', no_of_exams: 9, avg_score: 72.1, pass_rate: 77.8, highest_score: 88, lowest_score: 55, last_5_exams_avg: 74.5, weak_points: ['Fractions', 'Word problems'], strength_points: ['Addition', 'Multiplication'], rank_in_class: 10, rank_in_level: 22, performance_trend: 'declining' },
    ],
  },
};

export const mockAnalysisAdmin = {
  current_profile: mockProfileAdmin.profile_data,
  recent_snapshots: [
    { id: 1, period_type: 'monthly', period_start: '2026-01-01', period_end: '2026-01-31', academic_year: '2025-2026', term: 'First', total_students: 342, avg_score: 74.5, pass_rate: 82.3, exams_administered: 156, performance_distribution: { excellent: 45, good: 120, average: 130, needs_improvement: 47 }, subject_performance: null, level_distribution: null, growth_from_previous_term: 2.3, growth_indicator: 'improving' },
    { id: 2, period_type: 'monthly', period_start: '2025-12-01', period_end: '2025-12-31', academic_year: '2025-2026', term: 'First', total_students: 340, avg_score: 72.2, pass_rate: 80.1, exams_administered: 142, performance_distribution: null, subject_performance: null, level_distribution: null, growth_from_previous_term: -1.1, growth_indicator: 'declining' },
  ],
  teacher_rankings: [
    { id: 1, name: 'Ali Hassan', subject: 'Arabic', avg_score: 78.2, pass_rate: 88.5, rank: 1 },
    { id: 2, name: 'Fatima Omar', subject: 'Math', avg_score: 75.1, pass_rate: 82.3, rank: 2 },
    { id: 3, name: 'Ahmed Saeed', subject: 'English', avg_score: 73.8, pass_rate: 80.9, rank: 3 },
    { id: 4, name: 'Nora Khalid', subject: 'Science', avg_score: 71.4, pass_rate: 79.2, rank: 4 },
    { id: 5, name: 'Youssef Tariq', subject: 'History', avg_score: 69.9, pass_rate: 77.5, rank: 5 },
  ],
  subject_insights: [
    { subject: 'Arabic', avg_score: 78.2, pass_rate: 88.5, student_count: 342, status: 'good' },
    { subject: 'English', avg_score: 71.4, pass_rate: 80.9, student_count: 342, status: 'needs_attention' },
    { subject: 'Math', avg_score: 69.8, pass_rate: 77.5, student_count: 342, status: 'needs_attention' },
    { subject: 'Science', avg_score: 76.1, pass_rate: 84.2, student_count: 280, status: 'good' },
    { subject: 'History', avg_score: 80.5, pass_rate: 90.1, student_count: 220, status: 'good' },
  ],
  trends: {
    available: true,
    score_trend: 'up',
    pass_rate_trend: 'up',
    score_change: 2.3,
    pass_rate_change: 2.2,
  },
};

export const mockAnalysisTeacher = {
  profile: mockProfileTeacher.profile_data,
  managed_students: [],
  class_performance: {
    total_students: 65,
    avg_class_score: 76.3,
    pass_rate: 85.1,
    high_performers: 12,
  },
  insights: {
    strengths: ['Strong reading comprehension scores', 'Consistent student attendance', 'High engagement in class activities'],
    areas_for_improvement: ['Essay writing needs more focus', 'Grammar assessments below average'],
    recommendations: ['Introduce weekly essay assignments', 'Use interactive grammar exercises', 'Peer review sessions'],
  },
};

export const mockAnalysisStudent = {
  profile: mockProfileStudent.profile_data,
  subject_breakdown: mockProfileStudent.profile_data.subject_profiles,
  recent_snapshots: [
    { id: 1, student_name: 'Sara Ahmed', subject_name: 'Arabic', period_type: 'weekly', period_start: '2026-02-03', period_end: '2026-02-09', exams_taken: 2, avg_score: 88.5, pass_rate: 100, highest_score: 92, lowest_score: 85, topics_mastered: ['Poetry analysis'], topics_struggled: ['Advanced grammar'], rank_in_period: 4 },
    { id: 2, student_name: 'Sara Ahmed', subject_name: 'Math', period_type: 'weekly', period_start: '2026-02-03', period_end: '2026-02-09', exams_taken: 1, avg_score: 70, pass_rate: 100, highest_score: 70, lowest_score: 70, topics_mastered: null, topics_struggled: ['Fractions'], rank_in_period: 12 },
  ],
  insights: {
    strengths: ['Consistent performance in Arabic', 'Strong reading skills', 'Active participation'],
    areas_for_improvement: ['Math problem solving', 'English writing skills'],
    recommendations: ['Practice fraction exercises daily', 'Read English short stories', 'Join the math study group'],
  },
};

export const mockSubjectOverview = {
  subject: { id: 1, name: 'Arabic', level: 'elementary', semester: 'First Semester' },
  statistics: { total_students: 120, avg_score: 78.2, avg_pass_rate: 88.5 },
  top_performers: [
    { student_id: 10, student_name: 'Mohammed Ali', avg_score: 96.5, rank: 1 },
    { student_id: 11, student_name: 'Layla Ibrahim', avg_score: 94.2, rank: 2 },
    { student_id: 12, student_name: 'Omar Khalid', avg_score: 92.8, rank: 3 },
    { student_id: 3, student_name: 'Sara Ahmed', avg_score: 85.3, rank: 8 },
  ],
};

export const mockSubscription = {
  id: 1,
  plane_data: { id: 2, name: 'Professional Plan', description: 'For growing institutions', tier: 2, max_students: 500, price_monthly: '299.99', price_yearly: '2999.99' },
  tier_data: { id: 2, name: 'Professional Tier', language: 'en' },
  billing_cycle: 'yearly',
  status: 'active',
  start_date: '2025-09-01T00:00:00Z',
  end_date: '2026-09-01T00:00:00Z',
  get_usage_info: { current_students: 342, max_students: 500, students_remaining: 158, usage_percentage: 68.4 },
};

export const mockPlans = [
  { id: 1, name: 'Basic Plan', description: 'Perfect for small schools', tier: 1, max_students: 100, price_monthly: '99.99', price_yearly: '999.99' },
  { id: 2, name: 'Professional Plan', description: 'For growing institutions', tier: 2, max_students: 500, price_monthly: '299.99', price_yearly: '2999.99' },
  { id: 3, name: 'Enterprise Plan', description: 'Unlimited potential', tier: 3, max_students: 999999, price_monthly: '999.99', price_yearly: '9999.99' },
];

export const mockUsers = {
  students: [
    { id: 3, username: 'student_sara', first_name: 'Sara', last_name: 'Ahmed', email: 'sara@school.com', role: 'student', created_at: '2025-09-15T10:00:00Z', phone: '+966507654321' },
    { id: 4, username: 'student_mohammed', first_name: 'Mohammed', last_name: 'Ali', email: 'mohammed@school.com', role: 'student', created_at: '2025-09-15T10:30:00Z', phone: '+966501112233' },
    { id: 5, username: 'student_layla', first_name: 'Layla', last_name: 'Ibrahim', email: 'layla@school.com', role: 'student', created_at: '2025-09-16T08:00:00Z', phone: null },
    { id: 6, username: 'student_omar', first_name: 'Omar', last_name: 'Khalid', email: 'omar@school.com', role: 'student', created_at: '2025-09-16T09:00:00Z', phone: '+966504445566' },
    { id: 7, username: 'student_huda', first_name: 'Huda', last_name: 'Nasser', email: 'huda@school.com', role: 'student', created_at: '2025-10-01T11:00:00Z', phone: null },
  ],
  teachers: [
    { id: 2, username: 'teacher_ali', first_name: 'Ali', last_name: 'Hassan', email: 'ali@school.com', role: 'teacher', created_at: '2025-08-20T10:00:00Z', phone: '+966501234567' },
    { id: 8, username: 'teacher_fatima', first_name: 'Fatima', last_name: 'Omar', email: 'fatima@school.com', role: 'teacher', created_at: '2025-08-20T11:00:00Z', phone: '+966502223344' },
    { id: 9, username: 'teacher_ahmed', first_name: 'Ahmed', last_name: 'Saeed', email: 'ahmed@school.com', role: 'teacher', created_at: '2025-08-21T09:00:00Z', phone: '+966503334455' },
    { id: 10, username: 'teacher_nora', first_name: 'Nora', last_name: 'Khalid', email: 'nora@school.com', role: 'teacher', created_at: '2025-08-22T10:00:00Z', phone: null },
  ],
};

export const mockInvitations = [
  { id: 1, is_accepted: true, created_at: '2025-09-01T10:00:00Z', code: 'INV-A1B2C3', role: 'student' },
  { id: 2, is_accepted: true, created_at: '2025-09-01T10:00:00Z', code: 'INV-D4E5F6', role: 'student' },
  { id: 3, is_accepted: false, created_at: '2026-01-15T14:00:00Z', code: 'INV-G7H8I9', role: 'teacher' },
  { id: 4, is_accepted: false, created_at: '2026-02-01T09:00:00Z', code: 'INV-J1K2L3', role: 'student' },
  { id: 5, is_accepted: false, created_at: '2026-02-05T11:30:00Z', code: 'INV-M4N5O6', role: 'student' },
  { id: 6, is_accepted: false, created_at: '2026-02-10T08:00:00Z', code: 'INV-P7Q8R9', role: 'admin' },
];
