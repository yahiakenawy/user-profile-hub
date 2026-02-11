import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Phone, Award, BookOpen, Users, FileText, TrendingUp, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface BasicInfoTabProps {
  role: string;
  profileData: any;
}

const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null | undefined }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold truncate">{value ?? t('info.na')}</p>
      </div>
    </div>
  );
};

const BasicInfoTab = ({ role, profileData }: BasicInfoTabProps) => {
  const { t } = useLanguage();
  const data = profileData;

  if (!data) {
    return <div className="text-center py-12 text-muted-foreground">{t('analysis.noData')}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Common info for student/teacher */}
      {(role === 'student' || role === 'teacher') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem icon={User} label={t('info.username')} value={data?.username} />
          <InfoItem icon={User} label={t('info.fullName')} value={data?.full_name} />
          <InfoItem icon={Mail} label={t('info.email')} value={data?.email} />
          <InfoItem icon={Phone} label={t('info.phone')} value={data?.phone} />
          <InfoItem icon={Award} label={t('info.role')} value={t(`common.${role}`)} />
        </div>
      )}

      {/* Student specific */}
      {role === 'student' && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.level_info && (
              <InfoItem icon={BookOpen} label={t('info.level')} value={data.level_info?.display} />
            )}
            <InfoItem icon={TrendingUp} label={t('info.avgScore')} value={data?.overall_avg_score != null ? `${Number(data.overall_avg_score).toFixed(1)}%` : null} />
            <InfoItem icon={Star} label={t('info.streak')} value={data?.longest_streak_days != null ? `${data.longest_streak_days} ${t('info.days')}` : null} />
            <InfoItem icon={Award} label={t('info.rankInClass')} value={data?.rank_in_class} />
            <InfoItem icon={Award} label={t('info.rankInLevel')} value={data?.rank_in_level} />
            <InfoItem icon={Phone} label={t('info.parentPhone')} value={data?.parent_phone} />
          </div>

          {(data?.risk_factors?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-2 text-destructive">{t('info.riskFactors')}</h3>
              <div className="flex flex-wrap gap-2">
                {data.risk_factors.map((f: string, i: number) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive">{f}</span>
                ))}
              </div>
            </div>
          )}

          {(data?.subject_profiles?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">{t('profile.subjectAnalysis')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.subject_profiles.map((sp: any) => (
                  <div key={sp?.id ?? sp?.subject_id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">{sp?.subject_name}</span>
                      <span className={`text-sm px-2 py-0.5 rounded-full ${
                        sp?.performance_trend === 'improving' ? 'bg-success/10 text-success' :
                        sp?.performance_trend === 'declining' ? 'bg-destructive/10 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {sp?.performance_trend ? t(`analysis.${sp.performance_trend}`) : ''}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>{t('info.avgScore')}</span>
                        <span className="font-medium text-foreground">{sp?.avg_score != null ? `${Number(sp.avg_score).toFixed(1)}%` : t('info.na')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('info.passRate')}</span>
                        <span className="font-medium text-foreground">{sp?.pass_rate != null ? `${Number(sp.pass_rate).toFixed(1)}%` : t('info.na')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('analysis.exams')}</span>
                        <span className="font-medium text-foreground">{sp?.no_of_exams ?? 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Teacher specific */}
      {role === 'teacher' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.subject_info && (
            <InfoItem icon={BookOpen} label={t('info.subject')} value={`${data.subject_info?.name} - ${data.subject_info?.semester}`} />
          )}
          <InfoItem icon={Users} label={t('info.totalStudents')} value={data?.total_students} />
          <InfoItem icon={Users} label={t('info.totalClasses')} value={data?.total_classes} />
          <InfoItem icon={FileText} label={t('info.totalExams')} value={data?.total_exams_created} />
          <InfoItem icon={TrendingUp} label={t('info.avgScore')} value={data?.avg_score != null ? `${Number(data.avg_score).toFixed(1)}%` : null} />
          <InfoItem icon={TrendingUp} label={t('info.passRate')} value={data?.avg_pass_rate != null ? `${Number(data.avg_pass_rate).toFixed(1)}%` : null} />
          <InfoItem icon={Award} label={t('info.rankInOrg')} value={data?.rank_in_organization} />
          <InfoItem icon={Star} label={t('info.performanceRating')} value={data?.performance_rating} />
          <InfoItem icon={Users} label={t('info.highPerformers')} value={data?.high_performers_count} />
        </div>
      )}

      {/* Admin/Head specific */}
      {(role === 'admin' || role === 'head') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem icon={Users} label={t('info.totalStudents')} value={data?.total_students} />
          <InfoItem icon={Users} label={t('info.totalTeachers')} value={data?.total_teachers} />
          <InfoItem icon={Users} label={t('info.totalClasses')} value={data?.total_classes} />
          <InfoItem icon={FileText} label={t('info.totalExams')} value={data?.total_exams_administered} />
          <InfoItem icon={TrendingUp} label={t('info.avgScore')} value={data?.overall_avg_score != null ? `${Number(data.overall_avg_score).toFixed(1)}%` : null} />
          <InfoItem icon={TrendingUp} label={t('info.passRate')} value={data?.overall_pass_rate != null ? `${Number(data.overall_pass_rate).toFixed(1)}%` : null} />
        </div>
      )}
    </motion.div>
  );
};

export default BasicInfoTab;
