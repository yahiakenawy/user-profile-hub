import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // Nav
  'nav.profile': { en: 'Profile', ar: 'الملف الشخصي' },
  'nav.logout': { en: 'Logout', ar: 'تسجيل الخروج' },
  'nav.login': { en: 'Login', ar: 'تسجيل الدخول' },
  'nav.register': { en: 'Register', ar: 'تسجيل' },
  'nav.courses': { en: 'Courses', ar: 'الدورات' },
  'nav.classes': { en: 'Classes', ar: 'الفصول' },
  'nav.exams': { en: 'Exams', ar: 'الاختبارات' },
  'nav.subjects': { en: 'Subjects', ar: 'المواد' },
  'nav.dashboard': { en: 'Dashboard', ar: 'لوحة التحكم' },

  // Profile
  'profile.title': { en: 'Profile', ar: 'الملف الشخصي' },
  'profile.basicInfo': { en: 'Basic Information', ar: 'المعلومات الأساسية' },
  'profile.generalAnalysis': { en: 'General Analysis', ar: 'التحليل العام' },
  'profile.subjectAnalysis': { en: 'Subject Analysis', ar: 'تحليل المواد' },
  'profile.subscription': { en: 'Subscription', ar: 'الاشتراك' },
  'profile.members': { en: 'Members', ar: 'الأعضاء' },
  'profile.invitations': { en: 'Invitations', ar: 'الدعوات' },
  'profile.analysis': { en: 'Analysis', ar: 'التحليل' },
  'profile.myAnalysis': { en: 'My Analysis', ar: 'تحليلي' },
  'profile.mySubjectAnalysis': { en: 'My Subject Analysis', ar: 'تحليل مادتي' },
  'profile.settings': { en: 'Settings', ar: 'الإعدادات' },
  'profile.comingSoon': { en: 'Coming Soon', ar: 'قريباً' },

  // Basic Info
  'info.username': { en: 'Username', ar: 'اسم المستخدم' },
  'info.fullName': { en: 'Full Name', ar: 'الاسم الكامل' },
  'info.email': { en: 'Email', ar: 'البريد الإلكتروني' },
  'info.phone': { en: 'Phone', ar: 'الهاتف' },
  'info.role': { en: 'Role', ar: 'الدور' },
  'info.level': { en: 'Level', ar: 'المستوى' },
  'info.subject': { en: 'Subject', ar: 'المادة' },
  'info.totalStudents': { en: 'Total Students', ar: 'إجمالي الطلاب' },
  'info.totalTeachers': { en: 'Total Teachers', ar: 'إجمالي المعلمين' },
  'info.totalClasses': { en: 'Total Classes', ar: 'إجمالي الفصول' },
  'info.totalExams': { en: 'Total Exams', ar: 'إجمالي الاختبارات' },
  'info.avgScore': { en: 'Average Score', ar: 'متوسط الدرجات' },
  'info.passRate': { en: 'Pass Rate', ar: 'نسبة النجاح' },
  'info.rank': { en: 'Rank', ar: 'الترتيب' },
  'info.streak': { en: 'Longest Streak', ar: 'أطول سلسلة' },
  'info.lastActive': { en: 'Last Active', ar: 'آخر نشاط' },
  'info.parentPhone': { en: 'Parent Phone', ar: 'هاتف ولي الأمر' },
  'info.riskFactors': { en: 'Risk Factors', ar: 'عوامل الخطر' },
  'info.performanceRating': { en: 'Performance Rating', ar: 'تقييم الأداء' },
  'info.rankInClass': { en: 'Rank in Class', ar: 'الترتيب في الفصل' },
  'info.rankInLevel': { en: 'Rank in Level', ar: 'الترتيب في المستوى' },
  'info.rankInOrg': { en: 'Rank in Organization', ar: 'الترتيب في المؤسسة' },
  'info.highPerformers': { en: 'High Performers', ar: 'المتفوقون' },
  'info.days': { en: 'days', ar: 'أيام' },
  'info.na': { en: 'N/A', ar: 'غير متوفر' },

  // Analysis
  'analysis.strengths': { en: 'Strengths', ar: 'نقاط القوة' },
  'analysis.weakPoints': { en: 'Weak Points', ar: 'نقاط الضعف' },
  'analysis.improvements': { en: 'Areas for Improvement', ar: 'مجالات التحسين' },
  'analysis.recommendations': { en: 'Recommendations', ar: 'التوصيات' },
  'analysis.insights': { en: 'Insights', ar: 'الرؤى' },
  'analysis.trend': { en: 'Trend', ar: 'الاتجاه' },
  'analysis.improving': { en: 'Improving', ar: 'في تحسن' },
  'analysis.declining': { en: 'Declining', ar: 'في تراجع' },
  'analysis.stable': { en: 'Stable', ar: 'مستقر' },
  'analysis.recentSnapshots': { en: 'Recent Snapshots', ar: 'اللقطات الأخيرة' },
  'analysis.teacherRankings': { en: 'Teacher Rankings', ar: 'ترتيب المعلمين' },
  'analysis.subjectInsights': { en: 'Subject Insights', ar: 'رؤى المواد' },
  'analysis.classPerformance': { en: 'Class Performance', ar: 'أداء الفصل' },
  'analysis.noData': { en: 'No data available', ar: 'لا توجد بيانات' },
  'analysis.topPerformers': { en: 'Top Performers', ar: 'المتفوقون' },
  'analysis.score': { en: 'Score', ar: 'الدرجة' },
  'analysis.exams': { en: 'Exams', ar: 'الاختبارات' },
  'analysis.highest': { en: 'Highest', ar: 'الأعلى' },
  'analysis.lowest': { en: 'Lowest', ar: 'الأدنى' },
  'analysis.period': { en: 'Period', ar: 'الفترة' },
  'analysis.needsAttention': { en: 'Needs Attention', ar: 'يحتاج اهتمام' },
  'analysis.good': { en: 'Good', ar: 'جيد' },

  // Subscription
  'sub.currentPlan': { en: 'Current Plan', ar: 'الخطة الحالية' },
  'sub.status': { en: 'Status', ar: 'الحالة' },
  'sub.active': { en: 'Active', ar: 'نشط' },
  'sub.expired': { en: 'Expired', ar: 'منتهي' },
  'sub.cancelled': { en: 'Cancelled', ar: 'ملغي' },
  'sub.billingCycle': { en: 'Billing Cycle', ar: 'دورة الفوترة' },
  'sub.monthly': { en: 'Monthly', ar: 'شهري' },
  'sub.yearly': { en: 'Yearly', ar: 'سنوي' },
  'sub.startDate': { en: 'Start Date', ar: 'تاريخ البدء' },
  'sub.endDate': { en: 'End Date', ar: 'تاريخ الانتهاء' },
  'sub.maxStudents': { en: 'Max Students', ar: 'الحد الأقصى للطلاب' },
  'sub.usage': { en: 'Usage', ar: 'الاستخدام' },
  'sub.renew': { en: 'Renew Subscription', ar: 'تجديد الاشتراك' },
  'sub.selectPlan': { en: 'Select Plan', ar: 'اختر الخطة' },
  'sub.noSubscription': { en: 'No active subscription', ar: 'لا يوجد اشتراك نشط' },
  'sub.price': { en: 'Price', ar: 'السعر' },

  // Members
  'members.students': { en: 'Students', ar: 'الطلاب' },
  'members.teachers': { en: 'Teachers', ar: 'المعلمون' },
  'members.search': { en: 'Search by username...', ar: 'البحث بالاسم...' },
  'members.noResults': { en: 'No results found', ar: 'لا توجد نتائج' },
  'members.name': { en: 'Name', ar: 'الاسم' },
  'members.joined': { en: 'Joined', ar: 'انضم' },

  // Invitations
  'inv.create': { en: 'Create Invitations', ar: 'إنشاء دعوات' },
  'inv.role': { en: 'Role', ar: 'الدور' },
  'inv.count': { en: 'Count', ar: 'العدد' },
  'inv.generate': { en: 'Generate', ar: 'إنشاء' },
  'inv.codes': { en: 'Invitation Codes', ar: 'أكواد الدعوة' },
  'inv.download': { en: 'Download', ar: 'تحميل' },
  'inv.code': { en: 'Code', ar: 'الكود' },
  'inv.status': { en: 'Status', ar: 'الحالة' },
  'inv.accepted': { en: 'Accepted', ar: 'مقبول' },
  'inv.pending': { en: 'Pending', ar: 'قيد الانتظار' },
  'inv.created': { en: 'Created', ar: 'تم الإنشاء' },
  'inv.delete': { en: 'Delete', ar: 'حذف' },
  'inv.existing': { en: 'Existing Invitations', ar: 'الدعوات الحالية' },
  'inv.newCodes': { en: 'Generated Codes', ar: 'الأكواد المُنشأة' },

  // Common
  'common.loading': { en: 'Loading...', ar: 'جاري التحميل...' },
  'common.error': { en: 'An error occurred', ar: 'حدث خطأ' },
  'common.retry': { en: 'Retry', ar: 'إعادة المحاولة' },
  'common.student': { en: 'Student', ar: 'طالب' },
  'common.teacher': { en: 'Teacher', ar: 'معلم' },
  'common.admin': { en: 'Admin', ar: 'مدير' },
  'common.head': { en: 'Head', ar: 'رئيس' },
  'common.parent': { en: 'Parent', ar: 'ولي أمر' },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('language') as Language) || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[key]?.[language] || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
