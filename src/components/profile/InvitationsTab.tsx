import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Plus, Download, Trash2, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

const InvitationsTab = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [role, setRole] = useState('student');
  const [count, setCount] = useState(1);
  const [generatedCodes, setGeneratedCodes] = useState<any[]>([]);

  const { data: invitations, isLoading, error, refetch } = useQuery({
    queryKey: ['invitations'],
    queryFn: async () => {
      const response = await usersApi.getInvitations();
      const result = response.data;
      if (Array.isArray(result)) return result;
      if (result?.results && Array.isArray(result.results)) return result.results;
      return [];
    },
  });

  const createMutation = useMutation({
    mutationFn: () => usersApi.createInvitations(role, count),
    onSuccess: (response) => {
      const codes = Array.isArray(response.data) ? response.data : [response.data];
      setGeneratedCodes(codes);
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast.success(`${codes.length} ${t('inv.codes')} ✓`);
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail || err?.response?.data?.error || t('common.error');
      toast.error(detail);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => usersApi.deleteInvitations(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      toast.success(t('inv.delete') + ' ✓');
    },
    onError: (err: any) => {
      const detail = err?.response?.data?.detail || err?.response?.data?.error || t('common.error');
      toast.error(detail);
    },
  });

  const downloadCodes = (codes: any[]) => {
    const content = codes.map(c => `${c?.code} | ${c?.role} | ${c?.is_accepted ? t('inv.accepted') : t('inv.pending')}`).join('\n');
    const header = `${t('inv.code')} | ${t('inv.role')} | ${t('inv.status')}\n${'='.repeat(50)}\n`;
    const blob = new Blob([header + content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `invitation-codes-${new Date().toISOString().split('T')[0]}.txt`);
  };

  if (isLoading) return <div className="flex justify-center py-12"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return (
    <div className="text-center py-12">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Create Invitations */}
      <div className="glass-card p-6">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> {t('inv.create')}
        </h3>
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t('inv.role')}</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-sm"
            >
              <option value="student">{t('common.student')}</option>
              <option value="teacher">{t('common.teacher')}</option>
              <option value="admin">{t('common.admin')}</option>
              <option value="parent">{t('common.parent')}</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">{t('inv.count')}</label>
            <Input
              type="number"
              min={1}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20"
            />
          </div>
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="gradient-bg text-primary-foreground border-0"
          >
            {createMutation.isPending ? t('common.loading') : t('inv.generate')}
          </Button>
        </div>
      </div>

      {/* Generated Codes */}
      {generatedCodes.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">{t('inv.newCodes')}</h3>
            <Button variant="outline" size="sm" onClick={() => downloadCodes(generatedCodes)}>
              <Download className="w-4 h-4 me-1" /> {t('inv.download')}
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {generatedCodes.map((code: any) => (
              <div key={code?.id} className="p-3 rounded-lg bg-primary/5 border border-primary/20 font-mono text-sm flex items-center justify-between">
                <span>{code?.code}</span>
                <span className="text-xs text-muted-foreground">{code?.role}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Existing Invitations */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">{t('inv.existing')}</h3>
          {(invitations?.length ?? 0) > 0 && (
            <Button variant="outline" size="sm" onClick={() => downloadCodes(invitations ?? [])}>
              <Download className="w-4 h-4 me-1" /> {t('inv.download')}
            </Button>
          )}
        </div>

        {(invitations?.length ?? 0) === 0 ? (
          <p className="text-center py-8 text-muted-foreground">{t('analysis.noData')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-2">{t('inv.code')}</th>
                  <th className="text-start p-2">{t('inv.role')}</th>
                  <th className="text-start p-2">{t('inv.status')}</th>
                  <th className="text-start p-2">{t('inv.created')}</th>
                  <th className="text-start p-2"></th>
                </tr>
              </thead>
              <tbody>
                {(invitations ?? []).map((inv: any) => (
                  <tr key={inv?.id} className="border-b border-border/50">
                    <td className="p-2 font-mono">{inv?.code}</td>
                    <td className="p-2">{t(`common.${inv?.role}`) || inv?.role}</td>
                    <td className="p-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                        inv?.is_accepted ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {inv?.is_accepted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {inv?.is_accepted ? t('inv.accepted') : t('inv.pending')}
                      </span>
                    </td>
                    <td className="p-2 text-muted-foreground">{inv?.created_at ? new Date(inv.created_at).toLocaleDateString() : ''}</td>
                    <td className="p-2">
                      {!inv?.is_accepted && (
                        <button
                          onClick={() => { if (inv?.id) deleteMutation.mutate([inv.id]); }}
                          className="text-destructive hover:text-destructive/80 transition-colors"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default InvitationsTab;
