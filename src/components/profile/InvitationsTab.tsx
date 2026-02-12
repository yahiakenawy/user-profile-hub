import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Plus, Download, Trash2, Check, Clock, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Copied!');
  };

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return (
    <div className="text-center py-16">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Create */}
      <Card className="border bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> {t('inv.create')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{t('inv.role')}</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm"
              >
                <option value="student">{t('common.student')}</option>
                <option value="teacher">{t('common.teacher')}</option>
                <option value="admin">{t('common.admin')}</option>
                <option value="parent">{t('common.parent')}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">{t('inv.count')}</label>
              <Input
                type="number"
                min={1}
                value={count}
                onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 rounded-xl"
              />
            </div>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending}
              className="gradient-bg text-primary-foreground border-0 shadow-lg shadow-primary/20"
            >
              {createMutation.isPending ? t('common.loading') : t('inv.generate')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Codes */}
      {generatedCodes.length > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="border border-primary/20 bg-primary/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t('inv.newCodes')}</CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadCodes(generatedCodes)} className="rounded-lg">
                  <Download className="w-4 h-4 me-1" /> {t('inv.download')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {generatedCodes.map((code: any) => (
                  <div key={code?.id} className="p-3 rounded-xl bg-background border border-primary/20 font-mono text-sm flex items-center justify-between group">
                    <span className="truncate">{code?.code}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{code?.role}</span>
                      <button onClick={() => copyCode(code?.code)} className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Existing Invitations */}
      <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{t('inv.existing')}</CardTitle>
            {(invitations?.length ?? 0) > 0 && (
              <Button variant="outline" size="sm" onClick={() => downloadCodes(invitations ?? [])} className="rounded-lg">
                <Download className="w-4 h-4 me-1" /> {t('inv.download')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {(invitations?.length ?? 0) === 0 ? (
            <p className="text-center py-12 text-muted-foreground">{t('analysis.noData')}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('inv.code')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('inv.role')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('inv.status')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground">{t('inv.created')}</th>
                    <th className="text-start p-3 font-medium text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {(invitations ?? []).map((inv: any) => (
                    <tr key={inv?.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="p-3 font-mono font-medium">{inv?.code}</td>
                      <td className="p-3">{t(`common.${inv?.role}`) || inv?.role}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                          inv?.is_accepted ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
                        }`}>
                          {inv?.is_accepted ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {inv?.is_accepted ? t('inv.accepted') : t('inv.pending')}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">{inv?.created_at ? new Date(inv.created_at).toLocaleDateString() : ''}</td>
                      <td className="p-3">
                        {!inv?.is_accepted && (
                          <button
                            onClick={() => { if (inv?.id) deleteMutation.mutate([inv.id]); }}
                            className="text-destructive hover:text-destructive/80 transition-colors p-1.5 rounded-lg hover:bg-destructive/10"
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default InvitationsTab;
