import { useLanguage } from '@/contexts/LanguageContext';
import { User, Mail, Phone, Award, BookOpen, Users, FileText, TrendingUp, Star, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BasicInfoTabProps {
  role: string;
  profileData: any;
}

const StatCard = ({ icon: Icon, label, value, color = 'primary', delay = 0 }: { icon: any; label: string; value: string | number | null | undefined; color?: string; delay?: number }) => {
  const { t } = useLanguage();
  const colorMap: Record<string, string> = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    success: 'from-success/20 to-success/5 border-success/20',
    warning: 'from-warning/20 to-warning/5 border-warning/20',
    destructive: 'from-destructive/20 to-destructive/5 border-destructive/20',
  };
  const iconColorMap: Record<string, string> = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    destructive: 'text-destructive',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 }}
    >
      <Card className={`border bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm overflow-hidden relative group hover:shadow-lg transition-shadow`}>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1 min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className="text-xl font-bold truncate">{value ?? t('info.na')}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-background/80 flex items-center justify-center shrink-0 ${iconColorMap[color]}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | number | null | undefined }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-primary-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium truncate">{value ?? t('info.na')}</p>
      </div>
    </div>
  );
};

const BasicInfoTab = ({ role, profileData }: BasicInfoTabProps) => {
  const { t } = useLanguage();
  const data = profileData;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Activity className="w-12 h-12 mb-3 opacity-40" />
        <p className="text-lg font-medium">{t('analysis.noData')}</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Student/Teacher personal info */}
      {(role === 'student' || role === 'teacher') && (
        <Card className="border bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{t('profile.basicInfo')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-x-8">
              <InfoRow icon={User} label={t('info.username')} value={data?.username} />
              <InfoRow icon={User} label={t('info.fullName')} value={data?.full_name} />
              <InfoRow icon={Mail} label={t('info.email')} value={data?.email} />
              <InfoRow icon={Phone} label={t('info.phone')} value={data?.phone} />
              <InfoRow icon={Award} label={t('info.role')} value={t(`common.${role}`)} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Student stats */}
      {role === 'student' && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={TrendingUp} label={t('info.avgScore')} value={data?.overall_avg_score != null ? `${Number(data.overall_avg_score).toFixed(1)}%` : null} color="primary" delay={0} />
            <StatCard icon={Star} label={t('info.streak')} value={data?.longest_streak_days != null ? `${data.longest_streak_days} ${t('info.days')}` : null} color="warning" delay={1} />
            <StatCard icon={Award} label={t('info.rankInClass')} value={data?.rank_in_class ? `#${data.rank_in_class}` : null} color="success" delay={2} />
            <StatCard icon={Award} label={t('info.rankInLevel')} value={data?.rank_in_level ? `#${data.rank_in_level}` : null} color="primary" delay={3} />
          </div>

          {data?.level_info && (
            <StatCard icon={BookOpen} label={t('info.level')} value={data.level_info?.display} color="primary" delay={4} />
          )}

          {(data?.risk_factors?.length ?? 0) > 0 && (
            <Card className="border border-destructive/20 bg-destructive/5">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 text-destructive text-sm uppercase tracking-wider">{t('info.riskFactors')}</h3>
                <div className="flex flex-wrap gap-2">
                  {data.risk_factors.map((f: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 rounded-full text-sm font-medium bg-destructive/10 text-destructive border border-destructive/20">{f}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {(data?.subject_profiles?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">{t('profile.subjectAnalysis')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {data.subject_profiles.map((sp: any, i: number) => (
                    <motion.div
                      key={sp?.id ?? sp?.subject_id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="p-4 rounded-xl border border-border/60 bg-gradient-to-br from-muted/40 to-transparent hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-bold text-base">{sp?.subject_name}</span>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          sp?.performance_trend === 'improving' ? 'bg-success/10 text-success border border-success/20' :
                          sp?.performance_trend === 'declining' ? 'bg-destructive/10 text-destructive border border-destructive/20' :
                          'bg-muted text-muted-foreground border border-border'
                        }`}>
                          {sp?.performance_trend ? t(`analysis.${sp.performance_trend}`) : ''}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{t('info.avgScore')}</span>
                            <span className="font-semibold">{sp?.avg_score != null ? `${Number(sp.avg_score).toFixed(1)}%` : t('info.na')}</span>
                          </div>
                          <Progress value={sp?.avg_score ?? 0} className="h-2" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('info.passRate')}</span>
                          <span className="font-semibold">{sp?.pass_rate != null ? `${Number(sp.pass_rate).toFixed(1)}%` : t('info.na')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('analysis.exams')}</span>
                          <span className="font-semibold">{sp?.no_of_exams ?? 0}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Teacher stats */}
      {role === 'teacher' && (
        <>
          {data?.subject_info && (
            <StatCard icon={BookOpen} label={t('info.subject')} value={`${data.subject_info?.name} - ${data.subject_info?.semester}`} color="primary" delay={0} />
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label={t('info.totalStudents')} value={data?.total_students} color="primary" delay={1} />
            <StatCard icon={Users} label={t('info.totalClasses')} value={data?.total_classes} color="success" delay={2} />
            <StatCard icon={FileText} label={t('info.totalExams')} value={data?.total_exams_created} color="warning" delay={3} />
            <StatCard icon={TrendingUp} label={t('info.avgScore')} value={data?.avg_score != null ? `${Number(data.avg_score).toFixed(1)}%` : null} color="primary" delay={4} />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={TrendingUp} label={t('info.passRate')} value={data?.avg_pass_rate != null ? `${Number(data.avg_pass_rate).toFixed(1)}%` : null} color="success" delay={5} />
            <StatCard icon={Award} label={t('info.rankInOrg')} value={data?.rank_in_organization ? `#${data.rank_in_organization}` : null} color="primary" delay={6} />
            <StatCard icon={Star} label={t('info.performanceRating')} value={data?.performance_rating} color="warning" delay={7} />
            <StatCard icon={Users} label={t('info.highPerformers')} value={data?.high_performers_count} color="success" delay={8} />
          </div>
        </>
      )}

      {/* Admin/Head stats */}
      {(role === 'admin' || role === 'head') && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Users} label={t('info.totalStudents')} value={data?.total_students} color="primary" delay={0} />
          <StatCard icon={Users} label={t('info.totalTeachers')} value={data?.total_teachers} color="success" delay={1} />
          <StatCard icon={Users} label={t('info.totalClasses')} value={data?.total_classes} color="warning" delay={2} />
          <StatCard icon={FileText} label={t('info.totalExams')} value={data?.total_exams_administered} color="primary" delay={3} />
          <StatCard icon={TrendingUp} label={t('info.avgScore')} value={data?.overall_avg_score != null ? `${Number(data.overall_avg_score).toFixed(1)}%` : null} color="success" delay={4} />
          <StatCard icon={TrendingUp} label={t('info.passRate')} value={data?.overall_pass_rate != null ? `${Number(data.overall_pass_rate).toFixed(1)}%` : null} color="primary" delay={5} />
        </div>
      )}
    </motion.div>
  );
};

export default BasicInfoTab;
