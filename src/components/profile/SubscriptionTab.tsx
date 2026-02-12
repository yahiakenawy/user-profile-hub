import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Users, CheckCircle, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

const SubscriptionTab = () => {
  const { t, language } = useLanguage();
  const queryClient = useQueryClient();
  const [showRenew, setShowRenew] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const { data: subscription, isLoading, error, refetch } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      try {
        const response = await subscriptionApi.getDetail();
        return response.data;
      } catch (err: any) {
        if (err?.response?.status === 404) return null;
        throw err;
      }
    },
  });

  const { data: plans, isLoading: loadingPlans } = useQuery({
    queryKey: ['plans', language],
    queryFn: async () => {
      const response = await subscriptionApi.getPlans(language);
      return response.data;
    },
    enabled: showRenew,
  });

  const renewMutation = useMutation({
    mutationFn: (data: { plane_id: number; billing_cycle: string }) => subscriptionApi.create(data),
    onSuccess: () => {
      toast.success(t('sub.renew') + ' ✓');
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      setShowRenew(false);
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail || err?.response?.data?.error || t('common.error');
      toast.error(detail);
    },
  });

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return (
    <div className="text-center py-16">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  const subData = subscription?.data ?? subscription;
  const isExpired = subscription?.detail?.includes('No current active');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {subData ? (
        <>
          <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  {t('sub.currentPlan')}
                </CardTitle>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  subData?.status === 'active' ? 'bg-success/10 text-success border-success/20' :
                  subData?.status === 'expired' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                  'bg-muted text-muted-foreground border-border'
                }`}>
                  {subData?.status === 'active' ? t('sub.active') : subData?.status === 'expired' ? t('sub.expired') : t('sub.cancelled')}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('sub.currentPlan')}</p>
                  <p className="font-bold text-lg">{subData?.plane_data?.name ?? t('info.na')}</p>
                  <p className="text-sm text-muted-foreground">{subData?.plane_data?.description}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('sub.billingCycle')}</p>
                  <p className="font-bold text-lg">{subData?.billing_cycle === 'monthly' ? t('sub.monthly') : t('sub.yearly')}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('sub.maxStudents')}</p>
                  <p className="font-bold text-lg">{subData?.plane_data?.max_students ?? t('info.na')}</p>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('sub.startDate')}</p>
                    <p className="font-semibold">{subData?.start_date ? new Date(subData.start_date).toLocaleDateString() : t('info.na')}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-muted/30 border border-border/50 flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-warning shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{t('sub.endDate')}</p>
                    <p className="font-semibold">{subData?.end_date ? new Date(subData.end_date).toLocaleDateString() : t('info.na')}</p>
                  </div>
                </div>
                {subData?.get_usage_info && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{t('sub.usage')}</p>
                    <p className="font-bold text-lg mb-2">
                      {subData.get_usage_info?.current_students ?? 0} / {subData.get_usage_info?.max_students ?? 0}
                    </p>
                    <Progress value={Math.min(subData.get_usage_info?.usage_percentage ?? 0, 100)} className="h-2.5" />
                    <p className="text-xs text-muted-foreground mt-1">{Number(subData.get_usage_info?.usage_percentage ?? 0).toFixed(1)}%</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {(isExpired || subData?.status !== 'active') && (
            <Button onClick={() => setShowRenew(true)} className="gradient-bg text-primary-foreground border-0 shadow-lg shadow-primary/20">
              <RefreshCw className="w-4 h-4 me-2" /> {t('sub.renew')}
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <AlertTriangle className="w-14 h-14 mb-4 text-warning" />
          <p className="text-xl font-bold mb-1">{t('sub.noSubscription')}</p>
          <Button onClick={() => setShowRenew(true)} className="mt-4 gradient-bg text-primary-foreground border-0 shadow-lg shadow-primary/20">
            {t('sub.selectPlan')}
          </Button>
        </div>
      )}

      {/* Plan selection */}
      {showRenew && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {t('sub.selectPlan')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex gap-2 p-1 rounded-xl bg-muted/50 w-fit">
                {(['monthly', 'yearly'] as const).map((bc) => (
                  <button
                    key={bc}
                    onClick={() => setBillingCycle(bc)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                      billingCycle === bc ? 'gradient-bg text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {bc === 'monthly' ? t('sub.monthly') : t('sub.yearly')}
                  </button>
                ))}
              </div>

              {loadingPlans ? (
                <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(plans ?? []).map((plan: any) => (
                    <motion.div
                      key={plan?.id}
                      whileHover={{ y: -4 }}
                      onClick={() => setSelectedPlan(plan?.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        selectedPlan === plan?.id
                          ? 'border-primary bg-primary/5 shadow-xl shadow-primary/10'
                          : 'border-border hover:border-primary/40 hover:shadow-lg'
                      }`}
                    >
                      {selectedPlan === plan?.id && (
                        <CheckCircle className="w-5 h-5 text-primary absolute top-4 end-4" />
                      )}
                      <h4 className="font-bold text-lg">{plan?.name}</h4>
                      <p className="text-sm text-muted-foreground mb-4">{plan?.description}</p>
                      <p className="text-3xl font-bold gradient-text">
                        {billingCycle === 'monthly' ? plan?.price_monthly : plan?.price_yearly}
                        <span className="text-sm text-muted-foreground font-normal">/{billingCycle === 'monthly' ? t('sub.monthly') : t('sub.yearly')}</span>
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" /> {plan?.max_students} {t('sub.maxStudents')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    if (!selectedPlan) { toast.error(t('sub.selectPlan')); return; }
                    renewMutation.mutate({ plane_id: selectedPlan, billing_cycle: billingCycle });
                  }}
                  disabled={!selectedPlan || renewMutation.isPending}
                  className="gradient-bg text-primary-foreground border-0 shadow-lg shadow-primary/20"
                >
                  {renewMutation.isPending ? t('common.loading') : t('sub.renew')}
                </Button>
                <Button variant="ghost" onClick={() => setShowRenew(false)}>✕</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionTab;
