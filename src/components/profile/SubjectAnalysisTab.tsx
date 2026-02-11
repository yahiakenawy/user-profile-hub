import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';

interface SubjectAnalysisTabProps {
  role: string;
  profileData?: any;
}

const SubjectAnalysisTab = ({ role, profileData }: SubjectAnalysisTabProps) => {
  const { t } = useLanguage();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  // For teacher: use subject from profile
  const teacherSubjectId = profileData?.subject_info?.id;

  // Get subject overview
  const subjectId = role === 'teacher' ? teacherSubjectId : selectedSubjectId;

  const { data: subjectOverview, isLoading: loadingOverview, error: overviewError, refetch: refetchOverview } = useQuery({
    queryKey: ['subjectOverview', subjectId],
    queryFn: async () => {
      if (!subjectId) return null;
      const response = await analyticsApi.getSubjectOverview(subjectId);
      return response.data;
    },
    enabled: !!subjectId,
  });

  // For admin: get students in subject
  const { data: subjectStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ['subjectStudents', subjectId],
    queryFn: async () => {
      if (!subjectId) return null;
      const response = await analyticsApi.getSubjectStudents(subjectId);
      return response.data;
    },
    enabled: !!subjectId && (role === 'admin' || role === 'head' || role === 'teacher'),
  });

  // Get student subjects from profile for student role
  const studentSubjects = profileData?.subject_profiles ?? [];

  // For admin, get available subjects from profile
  const adminSubjects = profileData?.subject_performance
    ? Object.entries(profileData.subject_performance).map(([name], i) => ({ id: i + 1, name }))
    : [];

  const subjects = role === 'student' ? studentSubjects : role === 'teacher' ? (teacherSubjectId ? [profileData?.subject_info] : []) : adminSubjects;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Subject selector for admin/student */}
      {role !== 'teacher' && (subjects?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map((s: any) => (
            <button
              key={s?.id ?? s?.subject_id}
              onClick={() => setSelectedSubjectId(s?.id ?? s?.subject_id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                (s?.id ?? s?.subject_id) === selectedSubjectId
                  ? 'gradient-bg text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-accent'
              }`}
            >
              {s?.name ?? s?.subject_name}
            </button>
          ))}
        </div>
      )}

      {!subjectId && role !== 'teacher' && (
        <div className="text-center py-12 text-muted-foreground">
          {t('info.subject')} - {t('analysis.noData')}
        </div>
      )}

      {(loadingOverview || loadingStudents) && (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {overviewError && (
        <div className="text-center py-12">
          <p className="text-destructive mb-2">{t('common.error')}</p>
          <button onClick={() => refetchOverview()} className="text-primary underline">{t('common.retry')}</button>
        </div>
      )}

      {subjectOverview && (
        <>
          <div className="glass-card p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {subjectOverview.subject?.name} - {subjectOverview.subject?.semester}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xl font-bold">{subjectOverview.statistics?.total_students ?? 0}</p>
                <p className="text-xs text-muted-foreground">{t('info.totalStudents')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
                <p className="text-xl font-bold">{subjectOverview.statistics?.avg_score != null ? `${Number(subjectOverview.statistics.avg_score).toFixed(1)}%` : t('info.na')}</p>
                <p className="text-xs text-muted-foreground">{t('info.avgScore')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <Award className="w-5 h-5 mx-auto mb-1 text-warning" />
                <p className="text-xl font-bold">{subjectOverview.statistics?.avg_pass_rate != null ? `${Number(subjectOverview.statistics.avg_pass_rate).toFixed(1)}%` : t('info.na')}</p>
                <p className="text-xs text-muted-foreground">{t('info.passRate')}</p>
              </div>
            </div>
          </div>

          {/* Top Performers */}
          {(subjectOverview.top_performers?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">{t('analysis.topPerformers')}</h3>
              <div className="space-y-2">
                {subjectOverview.top_performers.map((tp: any) => (
                  <div key={tp?.student_id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {tp?.rank ?? '-'}
                      </span>
                      <span className="font-medium">{tp?.student_name}</span>
                    </div>
                    <span className="font-bold">{tp?.avg_score != null ? `${Number(tp.avg_score).toFixed(1)}%` : t('info.na')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Subject students table */}
      {subjectStudents && Array.isArray(subjectStudents) && subjectStudents.length > 0 && (
        <div className="glass-card p-4">
          <h3 className="font-semibold mb-3">{t('members.students')}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-2">{t('info.subject')}</th>
                  <th className="text-start p-2">{t('analysis.exams')}</th>
                  <th className="text-start p-2">{t('info.avgScore')}</th>
                  <th className="text-start p-2">{t('info.passRate')}</th>
                  <th className="text-start p-2">{t('analysis.highest')}</th>
                  <th className="text-start p-2">{t('analysis.lowest')}</th>
                </tr>
              </thead>
              <tbody>
                {subjectStudents.map((ss: any) => (
                  <tr key={ss?.id} className="border-b border-border/50">
                    <td className="p-2">{ss?.subject_name}</td>
                    <td className="p-2">{ss?.no_of_exams ?? 0}</td>
                    <td className="p-2 font-medium">{ss?.avg_score != null ? `${Number(ss.avg_score).toFixed(1)}%` : t('info.na')}</td>
                    <td className="p-2">{ss?.pass_rate != null ? `${Number(ss.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                    <td className="p-2">{ss?.highest_score != null ? `${Number(ss.highest_score).toFixed(1)}%` : t('info.na')}</td>
                    <td className="p-2">{ss?.lowest_score != null ? `${Number(ss.lowest_score).toFixed(1)}%` : t('info.na')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SubjectAnalysisTab;
