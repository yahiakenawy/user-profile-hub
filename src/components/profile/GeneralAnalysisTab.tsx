import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, BarChart3, Users, Award } from 'lucide-react';

interface GeneralAnalysisTabProps {
  role: string;
}

const TrendBadge = ({ trend }: { trend?: string }) => {
  const { t } = useLanguage();
  if (!trend) return null;
  const config = {
    improving: { icon: TrendingUp, color: 'text-success bg-success/10', label: t('analysis.improving') },
    up: { icon: TrendingUp, color: 'text-success bg-success/10', label: t('analysis.improving') },
    declining: { icon: TrendingDown, color: 'text-destructive bg-destructive/10', label: t('analysis.declining') },
    down: { icon: TrendingDown, color: 'text-destructive bg-destructive/10', label: t('analysis.declining') },
    stable: { icon: Minus, color: 'text-muted-foreground bg-muted', label: t('analysis.stable') },
  }[trend] || { icon: Minus, color: 'text-muted-foreground bg-muted', label: trend };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" /> {config.label}
    </span>
  );
};

const GeneralAnalysisTab = ({ role }: GeneralAnalysisTabProps) => {
  const { t } = useLanguage();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['analysis', role],
    queryFn: async () => {
      const response = await analyticsApi.getAnalysis();
      return response.data;
    },
  });

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Student Analysis */}
      {role === 'student' && data && (
        <>
          {/* Insights */}
          {data.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(data.insights?.strengths?.length ?? 0) > 0 && (
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-success">
                    <CheckCircle className="w-4 h-4" /> {t('analysis.strengths')}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {data.insights.strengths.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1"><span className="text-success mt-1">•</span> {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(data.insights?.areas_for_improvement?.length ?? 0) > 0 && (
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-4 h-4" /> {t('analysis.improvements')}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {data.insights.areas_for_improvement.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1"><span className="text-warning mt-1">•</span> {s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {(data.insights?.recommendations?.length ?? 0) > 0 && (
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                    <BarChart3 className="w-4 h-4" /> {t('analysis.recommendations')}
                  </h4>
                  <ul className="space-y-1 text-sm">
                    {data.insights.recommendations.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-1"><span className="text-primary mt-1">•</span> {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Recent Snapshots */}
          {(data.recent_snapshots?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">{t('analysis.recentSnapshots')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start p-2">{t('info.subject')}</th>
                      <th className="text-start p-2">{t('analysis.period')}</th>
                      <th className="text-start p-2">{t('analysis.score')}</th>
                      <th className="text-start p-2">{t('info.passRate')}</th>
                      <th className="text-start p-2">{t('analysis.exams')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_snapshots.map((s: any) => (
                      <tr key={s?.id} className="border-b border-border/50">
                        <td className="p-2">{s?.subject_name}</td>
                        <td className="p-2 text-muted-foreground">{s?.period_type}</td>
                        <td className="p-2 font-medium">{s?.avg_score != null ? `${Number(s.avg_score).toFixed(1)}%` : t('info.na')}</td>
                        <td className="p-2">{s?.pass_rate != null ? `${Number(s.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                        <td className="p-2">{s?.exams_taken ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Teacher Analysis */}
      {role === 'teacher' && data && (
        <>
          {data.class_performance && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{data.class_performance?.total_students ?? 0}</p>
                <p className="text-xs text-muted-foreground">{t('info.totalStudents')}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <BarChart3 className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold">{data.class_performance?.avg_class_score != null ? `${Number(data.class_performance.avg_class_score).toFixed(1)}%` : t('info.na')}</p>
                <p className="text-xs text-muted-foreground">{t('info.avgScore')}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <TrendingUp className="w-6 h-6 mx-auto mb-1 text-success" />
                <p className="text-2xl font-bold">{data.class_performance?.pass_rate != null ? `${Number(data.class_performance.pass_rate).toFixed(1)}%` : t('info.na')}</p>
                <p className="text-xs text-muted-foreground">{t('info.passRate')}</p>
              </div>
              <div className="glass-card p-4 text-center">
                <Award className="w-6 h-6 mx-auto mb-1 text-warning" />
                <p className="text-2xl font-bold">{data.class_performance?.high_performers ?? 0}</p>
                <p className="text-xs text-muted-foreground">{t('info.highPerformers')}</p>
              </div>
            </div>
          )}

          {data.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(data.insights?.strengths?.length ?? 0) > 0 && (
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2 text-success flex items-center gap-2"><CheckCircle className="w-4 h-4" />{t('analysis.strengths')}</h4>
                  <ul className="space-y-1 text-sm">{data.insights.strengths.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
                </div>
              )}
              {(data.insights?.areas_for_improvement?.length ?? 0) > 0 && (
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2 text-warning flex items-center gap-2"><AlertTriangle className="w-4 h-4" />{t('analysis.improvements')}</h4>
                  <ul className="space-y-1 text-sm">{data.insights.areas_for_improvement.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
                </div>
              )}
              {(data.insights?.recommendations?.length ?? 0) > 0 && (
                <div className="glass-card p-4">
                  <h4 className="font-semibold mb-2 text-primary flex items-center gap-2"><BarChart3 className="w-4 h-4" />{t('analysis.recommendations')}</h4>
                  <ul className="space-y-1 text-sm">{data.insights.recommendations.map((s: string, i: number) => <li key={i}>• {s}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Admin/Head Analysis */}
      {(role === 'admin' || role === 'head') && data && (
        <>
          {/* Trends */}
          {data.trends?.available && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('analysis.score')} {t('analysis.trend')}</p>
                <TrendBadge trend={data.trends?.score_trend} />
                {data.trends?.score_change != null && <p className="text-lg font-bold mt-1">{Number(data.trends.score_change).toFixed(1)}%</p>}
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">{t('info.passRate')} {t('analysis.trend')}</p>
                <TrendBadge trend={data.trends?.pass_rate_trend} />
                {data.trends?.pass_rate_change != null && <p className="text-lg font-bold mt-1">{Number(data.trends.pass_rate_change).toFixed(1)}%</p>}
              </div>
            </div>
          )}

          {/* Teacher Rankings */}
          {(data.teacher_rankings?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">{t('analysis.teacherRankings')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start p-2">{t('info.rank')}</th>
                      <th className="text-start p-2">{t('members.name')}</th>
                      <th className="text-start p-2">{t('info.subject')}</th>
                      <th className="text-start p-2">{t('info.avgScore')}</th>
                      <th className="text-start p-2">{t('info.passRate')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.teacher_rankings.map((tr: any) => (
                      <tr key={tr?.id} className="border-b border-border/50">
                        <td className="p-2 font-bold text-primary">#{tr?.rank ?? '-'}</td>
                        <td className="p-2">{tr?.name}</td>
                        <td className="p-2">{tr?.subject}</td>
                        <td className="p-2">{tr?.avg_score != null ? `${Number(tr.avg_score).toFixed(1)}%` : t('info.na')}</td>
                        <td className="p-2">{tr?.pass_rate != null ? `${Number(tr.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subject Insights */}
          {(data.subject_insights?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">{t('analysis.subjectInsights')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.subject_insights.map((si: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{si?.subject}</p>
                      <p className="text-sm text-muted-foreground">{si?.student_count ?? 0} {t('members.students').toLowerCase()}</p>
                    </div>
                    <div className="text-end">
                      <p className="font-bold">{si?.avg_score != null ? `${Number(si.avg_score).toFixed(1)}%` : t('info.na')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        si?.status === 'good' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                      }`}>
                        {si?.status === 'good' ? t('analysis.good') : t('analysis.needsAttention')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Snapshots */}
          {(data.recent_snapshots?.length ?? 0) > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-3">{t('analysis.recentSnapshots')}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-start p-2">{t('analysis.period')}</th>
                      <th className="text-start p-2">{t('analysis.score')}</th>
                      <th className="text-start p-2">{t('info.passRate')}</th>
                      <th className="text-start p-2">{t('analysis.exams')}</th>
                      <th className="text-start p-2">{t('analysis.trend')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent_snapshots.map((s: any) => (
                      <tr key={s?.id} className="border-b border-border/50">
                        <td className="p-2">{s?.period_type} ({s?.period_start} - {s?.period_end})</td>
                        <td className="p-2 font-medium">{s?.avg_score != null ? `${Number(s.avg_score).toFixed(1)}%` : t('info.na')}</td>
                        <td className="p-2">{s?.pass_rate != null ? `${Number(s.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                        <td className="p-2">{s?.exams_administered ?? 0}</td>
                        <td className="p-2"><TrendBadge trend={s?.growth_indicator} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {!data && <div className="text-center py-12 text-muted-foreground">{t('analysis.noData')}</div>}
    </motion.div>
  );
};

export default GeneralAnalysisTab;
