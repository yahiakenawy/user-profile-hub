import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { CreditCard, Calendar, Users, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
    mutationFn: (data: { plane_id: number; billing_cycle: string }) =>
      subscriptionApi.create(data),
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

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  const subData = subscription?.data ?? subscription;
  const isExpired = subscription?.detail?.includes('No current active');

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {subData ? (
        <>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                {t('sub.currentPlan')}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                subData?.status === 'active' ? 'bg-success/10 text-success' :
                subData?.status === 'expired' ? 'bg-destructive/10 text-destructive' :
                'bg-muted text-muted-foreground'
              }`}>
                {subData?.status === 'active' ? t('sub.active') : subData?.status === 'expired' ? t('sub.expired') : t('sub.cancelled')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t('sub.currentPlan')}</p>
                <p className="font-semibold">{subData?.plane_data?.name ?? t('info.na')}</p>
                <p className="text-sm text-muted-foreground">{subData?.plane_data?.description}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t('sub.billingCycle')}</p>
                <p className="font-semibold">{subData?.billing_cycle === 'monthly' ? t('sub.monthly') : t('sub.yearly')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground">{t('sub.maxStudents')}</p>
                <p className="font-semibold">{subData?.plane_data?.max_students ?? t('info.na')}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('sub.startDate')}</p>
                  <p className="font-semibold text-sm">{subData?.start_date ? new Date(subData.start_date).toLocaleDateString() : t('info.na')}</p>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{t('sub.endDate')}</p>
                  <p className="font-semibold text-sm">{subData?.end_date ? new Date(subData.end_date).toLocaleDateString() : t('info.na')}</p>
                </div>
              </div>
              {subData?.get_usage_info && (
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">{t('sub.usage')}</p>
                  <p className="font-semibold">
                    {subData.get_usage_info?.current_students ?? 0} / {subData.get_usage_info?.max_students ?? 0}
                  </p>
                  <div className="w-full h-2 rounded-full bg-muted mt-1">
                    <div
                      className="h-full rounded-full gradient-bg"
                      style={{ width: `${Math.min(subData.get_usage_info?.usage_percentage ?? 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {(isExpired || subData?.status !== 'active') && (
            <Button onClick={() => setShowRenew(true)} className="gradient-bg text-primary-foreground border-0">
              <RefreshCw className="w-4 h-4 me-2" /> {t('sub.renew')}
            </Button>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-warning" />
          <p className="text-lg font-semibold">{t('sub.noSubscription')}</p>
          <Button onClick={() => setShowRenew(true)} className="mt-4 gradient-bg text-primary-foreground border-0">
            {t('sub.selectPlan')}
          </Button>
        </div>
      )}

      {/* Renew / Select Plan */}
      {showRenew && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-lg">{t('sub.selectPlan')}</h3>

          {/* Billing cycle toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'monthly' ? 'gradient-bg text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {t('sub.monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                billingCycle === 'yearly' ? 'gradient-bg text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
            >
              {t('sub.yearly')}
            </button>
          </div>

          {loadingPlans ? (
            <div className="flex justify-center py-8"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(plans ?? []).map((plan: any) => (
                <div
                  key={plan?.id}
                  onClick={() => setSelectedPlan(plan?.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPlan === plan?.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <h4 className="font-bold">{plan?.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{plan?.description}</p>
                  <p className="text-2xl font-bold gradient-text">
                    {billingCycle === 'monthly' ? plan?.price_monthly : plan?.price_yearly}
                    <span className="text-sm text-muted-foreground font-normal">/{billingCycle === 'monthly' ? t('sub.monthly') : t('sub.yearly')}</span>
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" /> {plan?.max_students} {t('sub.maxStudents')}
                  </div>
                  {selectedPlan === plan?.id && (
                    <CheckCircle className="w-5 h-5 text-primary mt-2" />
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (!selectedPlan) { toast.error(t('sub.selectPlan')); return; }
                renewMutation.mutate({ plane_id: selectedPlan, billing_cycle: billingCycle });
              }}
              disabled={!selectedPlan || renewMutation.isPending}
              className="gradient-bg text-primary-foreground border-0"
            >
              {renewMutation.isPending ? t('common.loading') : t('sub.renew')}
            </Button>
            <Button variant="ghost" onClick={() => setShowRenew(false)}>
              ✕
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SubscriptionTab;
