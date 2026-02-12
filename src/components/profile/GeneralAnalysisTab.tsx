import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, BarChart3, Users, Award, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart,
} from 'recharts';

interface GeneralAnalysisTabProps {
  role: string;
}

const CHART_COLORS = [
  'hsl(173, 80%, 40%)',
  'hsl(142, 76%, 45%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 84%, 60%)',
  'hsl(158, 64%, 52%)',
];

const TrendBadge = ({ trend }: { trend?: string }) => {
  const { t } = useLanguage();
  if (!trend) return null;
  const config = {
    improving: { icon: TrendingUp, color: 'text-success bg-success/10 border-success/20', label: t('analysis.improving') },
    up: { icon: TrendingUp, color: 'text-success bg-success/10 border-success/20', label: t('analysis.improving') },
    declining: { icon: TrendingDown, color: 'text-destructive bg-destructive/10 border-destructive/20', label: t('analysis.declining') },
    down: { icon: TrendingDown, color: 'text-destructive bg-destructive/10 border-destructive/20', label: t('analysis.declining') },
    stable: { icon: Minus, color: 'text-muted-foreground bg-muted border-border', label: t('analysis.stable') },
  }[trend] || { icon: Minus, color: 'text-muted-foreground bg-muted border-border', label: trend };
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      <Icon className="w-3.5 h-3.5" /> {config.label}
    </span>
  );
};

const InsightCard = ({ icon: Icon, title, items, color }: { icon: any; title: string; items: string[]; color: string }) => {
  const colorMap: Record<string, string> = {
    success: 'border-success/20 from-success/5 to-transparent',
    warning: 'border-warning/20 from-warning/5 to-transparent',
    primary: 'border-primary/20 from-primary/5 to-transparent',
  };
  const dotMap: Record<string, string> = { success: 'bg-success', warning: 'bg-warning', primary: 'bg-primary' };
  const textMap: Record<string, string> = { success: 'text-success', warning: 'text-warning', primary: 'text-primary' };
  return (
    <Card className={`border bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm`}>
      <CardContent className="p-5">
        <h4 className={`font-semibold mb-3 flex items-center gap-2 text-sm ${textMap[color]}`}>
          <Icon className="w-4 h-4" /> {title}
        </h4>
        <ul className="space-y-2">
          {items.map((s: string, i: number) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${dotMap[color]}`} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
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

  if (isLoading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
    </div>
  );
  if (error) return (
    <div className="text-center py-16">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">

      {/* ─── Student Analysis ─── */}
      {role === 'student' && data && (
        <>
          {/* Subject scores bar chart */}
          {(data.subject_scores?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('profile.subjectAnalysis')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.subject_scores} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="subject" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                      <Bar dataKey="score" fill="hsl(173, 80%, 40%)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Exam history line chart */}
          {(data.exam_history?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.recentSnapshots')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.exam_history}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="exam" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                      <Legend />
                      <Line type="monotone" dataKey="Arabic" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[0] }} />
                      <Line type="monotone" dataKey="English" stroke={CHART_COLORS[1]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[1] }} />
                      <Line type="monotone" dataKey="Math" stroke={CHART_COLORS[2]} strokeWidth={2.5} dot={{ r: 4, fill: CHART_COLORS[2] }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          {data.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(data.insights?.strengths?.length ?? 0) > 0 && (
                <InsightCard icon={CheckCircle} title={t('analysis.strengths')} items={data.insights.strengths} color="success" />
              )}
              {(data.insights?.areas_for_improvement?.length ?? 0) > 0 && (
                <InsightCard icon={AlertTriangle} title={t('analysis.improvements')} items={data.insights.areas_for_improvement} color="warning" />
              )}
              {(data.insights?.recommendations?.length ?? 0) > 0 && (
                <InsightCard icon={BarChart3} title={t('analysis.recommendations')} items={data.insights.recommendations} color="primary" />
              )}
            </div>
          )}

          {/* Recent Snapshots Table */}
          {(data.recent_snapshots?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.recentSnapshots')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.subject')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.period')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.score')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.passRate')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.exams')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_snapshots.map((s: any) => (
                        <tr key={s?.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-medium">{s?.subject_name}</td>
                          <td className="p-3 text-muted-foreground">{s?.period_type}</td>
                          <td className="p-3 font-semibold">{s?.avg_score != null ? `${Number(s.avg_score).toFixed(1)}%` : t('info.na')}</td>
                          <td className="p-3">{s?.pass_rate != null ? `${Number(s.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                          <td className="p-3">{s?.exams_taken ?? 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* ─── Teacher Analysis ─── */}
      {role === 'teacher' && data && (
        <>
          {/* KPI cards */}
          {data.class_performance && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Users, label: t('info.totalStudents'), value: data.class_performance?.total_students ?? 0, color: 'primary' },
                { icon: BarChart3, label: t('info.avgScore'), value: data.class_performance?.avg_class_score != null ? `${Number(data.class_performance.avg_class_score).toFixed(1)}%` : t('info.na'), color: 'primary' },
                { icon: TrendingUp, label: t('info.passRate'), value: data.class_performance?.pass_rate != null ? `${Number(data.class_performance.pass_rate).toFixed(1)}%` : t('info.na'), color: 'success' },
                { icon: Award, label: t('info.highPerformers'), value: data.class_performance?.high_performers ?? 0, color: 'warning' },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="border bg-card/80 backdrop-blur-sm text-center p-5">
                    <item.icon className={`w-7 h-7 mx-auto mb-2 ${item.color === 'success' ? 'text-success' : item.color === 'warning' ? 'text-warning' : 'text-primary'}`} />
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          {/* Monthly trend area chart */}
          {(data.monthly_scores?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.trend')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthly_scores}>
                      <defs>
                        <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradPass" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                      <Legend />
                      <Area type="monotone" dataKey="avg_score" stroke="hsl(173, 80%, 40%)" fill="url(#gradScore)" strokeWidth={2.5} name={t('info.avgScore')} />
                      <Area type="monotone" dataKey="pass_rate" stroke="hsl(142, 76%, 45%)" fill="url(#gradPass)" strokeWidth={2.5} name={t('info.passRate')} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Grade distribution pie */}
          {data.grade_distribution && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.gradeDistribution')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(data.grade_distribution).map(([name, value]) => ({ name, value }))}
                        cx="50%" cy="50%" outerRadius={90} innerRadius={50}
                        dataKey="value" paddingAngle={3}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {Object.keys(data.grade_distribution).map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Insights */}
          {data.insights && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(data.insights?.strengths?.length ?? 0) > 0 && <InsightCard icon={CheckCircle} title={t('analysis.strengths')} items={data.insights.strengths} color="success" />}
              {(data.insights?.areas_for_improvement?.length ?? 0) > 0 && <InsightCard icon={AlertTriangle} title={t('analysis.improvements')} items={data.insights.areas_for_improvement} color="warning" />}
              {(data.insights?.recommendations?.length ?? 0) > 0 && <InsightCard icon={BarChart3} title={t('analysis.recommendations')} items={data.insights.recommendations} color="primary" />}
            </div>
          )}
        </>
      )}

      {/* ─── Admin/Head Analysis ─── */}
      {(role === 'admin' || role === 'head') && data && (
        <>
          {/* Trend KPIs */}
          {data.trends?.available && (
            <div className="grid grid-cols-2 gap-4">
              <Card className="border bg-gradient-to-br from-primary/10 to-transparent border-primary/20 backdrop-blur-sm">
                <CardContent className="p-5 text-center">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('analysis.score')} {t('analysis.trend')}</p>
                  <TrendBadge trend={data.trends?.score_trend} />
                  {data.trends?.score_change != null && <p className="text-3xl font-bold mt-2">{Number(data.trends.score_change) > 0 ? '+' : ''}{Number(data.trends.score_change).toFixed(1)}%</p>}
                </CardContent>
              </Card>
              <Card className="border bg-gradient-to-br from-success/10 to-transparent border-success/20 backdrop-blur-sm">
                <CardContent className="p-5 text-center">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{t('info.passRate')} {t('analysis.trend')}</p>
                  <TrendBadge trend={data.trends?.pass_rate_trend} />
                  {data.trends?.pass_rate_change != null && <p className="text-3xl font-bold mt-2">{Number(data.trends.pass_rate_change) > 0 ? '+' : ''}{Number(data.trends.pass_rate_change).toFixed(1)}%</p>}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Monthly area chart */}
          {(data.monthly_scores?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.trend')} - {t('analysis.score')} & {t('info.passRate')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data.monthly_scores}>
                      <defs>
                        <linearGradient id="aGradScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="aGradPass" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                      <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                      <Legend />
                      <Area type="monotone" dataKey="avg_score" stroke="hsl(173, 80%, 40%)" fill="url(#aGradScore)" strokeWidth={2.5} name={t('info.avgScore')} />
                      <Area type="monotone" dataKey="pass_rate" stroke="hsl(142, 76%, 45%)" fill="url(#aGradPass)" strokeWidth={2.5} name={t('info.passRate')} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance distribution pie */}
            {data.performance_distribution && (
              <Card className="border bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.performanceDistribution')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={Object.entries(data.performance_distribution).map(([name, value]) => ({ name: name.replace('_', ' '), value }))}
                          cx="50%" cy="50%" outerRadius={85} innerRadius={45}
                          dataKey="value" paddingAngle={3}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {Object.keys(data.performance_distribution).map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subject insights bar chart */}
            {(data.subject_insights?.length ?? 0) > 0 && (
              <Card className="border bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.subjectInsights')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.subject_insights} barSize={30}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="subject" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip contentStyle={{ borderRadius: '0.75rem', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))' }} />
                        <Legend />
                        <Bar dataKey="avg_score" fill="hsl(173, 80%, 40%)" radius={[6, 6, 0, 0]} name={t('info.avgScore')} />
                        <Bar dataKey="pass_rate" fill="hsl(142, 76%, 45%)" radius={[6, 6, 0, 0]} name={t('info.passRate')} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Teacher Rankings */}
          {(data.teacher_rankings?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.teacherRankings')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.rank')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('members.name')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.subject')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.avgScore')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.passRate')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.teacher_rankings.map((tr: any, i: number) => (
                        <tr key={tr?.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="p-3">
                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                              i === 0 ? 'gradient-bg text-primary-foreground' :
                              i === 1 ? 'bg-success/10 text-success' :
                              i === 2 ? 'bg-warning/10 text-warning' :
                              'bg-muted text-muted-foreground'
                            }`}>#{tr?.rank ?? '-'}</span>
                          </td>
                          <td className="p-3 font-medium">{tr?.name}</td>
                          <td className="p-3">{tr?.subject}</td>
                          <td className="p-3 font-semibold">{tr?.avg_score != null ? `${Number(tr.avg_score).toFixed(1)}%` : t('info.na')}</td>
                          <td className="p-3">{tr?.pass_rate != null ? `${Number(tr.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Snapshots */}
          {(data.recent_snapshots?.length ?? 0) > 0 && (
            <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">{t('analysis.recentSnapshots')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.period')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.score')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('info.passRate')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.exams')}</th>
                        <th className="text-start p-3 font-medium text-muted-foreground">{t('analysis.trend')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recent_snapshots.map((s: any) => (
                        <tr key={s?.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="p-3 text-muted-foreground">{s?.period_type} ({s?.period_start} → {s?.period_end})</td>
                          <td className="p-3 font-semibold">{s?.avg_score != null ? `${Number(s.avg_score).toFixed(1)}%` : t('info.na')}</td>
                          <td className="p-3">{s?.pass_rate != null ? `${Number(s.pass_rate).toFixed(1)}%` : t('info.na')}</td>
                          <td className="p-3">{s?.exams_administered ?? 0}</td>
                          <td className="p-3"><TrendBadge trend={s?.growth_indicator} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!data && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Activity className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">{t('analysis.noData')}</p>
        </div>
      )}
    </motion.div>
  );
};

export default GeneralAnalysisTab;
