import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, TrendingUp, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from 'recharts';

interface SubjectAnalysisTabProps {
  role: string;
  profileData?: any;
}

const SubjectAnalysisTab = ({ role, profileData }: SubjectAnalysisTabProps) => {
  const { t } = useLanguage();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  const teacherSubjectId = profileData?.subject_info?.id;
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

  const { data: subjectStudents, isLoading: loadingStudents } = useQuery({
    queryKey: ['subjectStudents', subjectId],
    queryFn: async () => {
      if (!subjectId) return null;
      const response = await analyticsApi.getSubjectStudents(subjectId);
      return response.data;
    },
    enabled: !!subjectId && (role === 'admin' || role === 'head' || role === 'teacher'),
  });

  const studentSubjects = profileData?.subject_profiles ?? [];
  const adminSubjects = profileData?.subject_performance
    ? Object.entries(profileData.subject_performance).map(([name], i) => ({ id: i + 1, name }))
    : [];
  const subjects = role === 'student' ? studentSubjects : role === 'teacher' ? (teacherSubjectId ? [profileData?.subject_info] : []) : adminSubjects;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Subject selector */}
      {role !== 'teacher' && (subjects?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-2">
          {subjects.map((s: any) => (
            <button
              key={s?.id ?? s?.subject_id}
              onClick={() => setSelectedSubjectId(s?.id ?? s?.subject_id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                (s?.id ?? s?.subject_id) === selectedSubjectId
                  ? 'gradient-bg text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {s?.name ?? s?.subject_name}
            </button>
          ))}
        </div>
      )}

      {!subjectId && role !== 'teacher' && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <BookOpen className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">{t('info.subject')} - {t('analysis.noData')}</p>
        </div>
      )}

      {(loadingOverview || loadingStudents) && (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {overviewError && (
        <div className="text-center py-16">
          <p className="text-destructive mb-2">{t('common.error')}</p>
          <button onClick={() => refetchOverview()} className="text-primary underline">{t('common.retry')}</button>
        </div>
      )}

      {subjectOverview && (
        <>
          {/* Subject header with stats */}
          <Card className="border bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {subjectOverview.subject?.name} — {subjectOverview.subject?.semester}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Users, label: t('info.totalStudents'), value: subjectOverview.statistics?.total_students ?? 0, color: 'text-primary' },
                  { icon: TrendingUp, label: t('info.avgScore'), value: subjectOverview.statistics?.avg_score != null ? `${Number(subjectOverview.statistics.avg_score).toFixed(1)}%` : t('info.na'), color: 'text-success' },
                  { icon: Award, label: t('info.passRate'), value: subjectOverview.statistics?.avg_pass_rate != null ? `${Number(subjectOverview.statistics.avg_pass_rate).toFixed(1)}%` : t('info.na'), color: 'text-warning' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-xl bg-muted/30 border border-border/50 text-center"
                  >
                    <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Score distribution bar chart */}
            {(subjectOverview.score_distribution?.length ?? 0) > 0 && (
              <Card className="border bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.scoreDistribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={subjectOverview.score_distribution} barSize={35}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                        <Bar dataKey="count" fill="hsl(173, 80%, 40%)" radius={[6, 6, 0, 0]} name={t('info.totalStudents')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monthly trend line chart */}
            {(subjectOverview.monthly_trend?.length ?? 0) > 0 && (
              <Card className="border bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.trend')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={subjectOverview.monthly_trend}>
                        <defs>
                          <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                        <Area type="monotone" dataKey="avg_score" stroke="hsl(173, 80%, 40%)" fill="url(#sGrad)" strokeWidth={2.5} name={t('info.avgScore')} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Top Performers */}
          {(subjectOverview.top_performers?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.topPerformers')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subjectOverview.top_performers.map((tp: any, i: number) => (
                    <motion.div
                      key={tp?.student_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                          i === 0 ? 'gradient-bg text-primary-foreground' :
                          i === 1 ? 'bg-success/10 text-success border border-success/20' :
                          i === 2 ? 'bg-warning/10 text-warning border border-warning/20' :
                          'bg-muted text-muted-foreground border border-border'
                        }`}>
                          {tp?.rank ?? '-'}
                        </span>
                        <span className="font-medium">{tp?.student_name}</span>
                      </div>
                      <span className="font-bold text-lg">{tp?.avg_score != null ? `${Number(tp.avg_score).toFixed(1)}%` : t('info.na')}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Subject students table */}
      {subjectStudents && Array.isArray(subjectStudents) && subjectStudents.length > 0 && (
        <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('members.students')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('info.subject')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.exams')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('info.avgScore')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('info.passRate')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.highest')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.lowest')}</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectStudents.map((ss: any) => (
                    <tr key={ss?.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-medium">{ss?.subject_name}</td>
                      <td className="p-3">{ss?.no_of_exams ?? 0}</td>
                      <td className="p-3 font-semibold">{ss?.avg_score != null ? `${Number(ss.avg_score).toFixed(1)}%` : t('info.na')}</td>
                      <td className="p-3">{ss?.pass_rate != null ? `${Number(ss.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                      <td className="p-3">{ss?.highest_score != null ? `${Number(ss.highest_score).toFixed(1)}%` : t('info.na')}</td>
                      <td className="p-3">{ss?.lowest_score != null ? `${Number(ss.lowest_score).toFixed(1)}%` : t('info.na')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SubjectAnalysisTab;
