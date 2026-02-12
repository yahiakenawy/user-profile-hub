import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Users, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MembersTab = () => {
  const { t } = useLanguage();
  const [tab, setTab] = useState<'student' | 'teacher'>('student');
  const [search, setSearch] = useState('');

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['members', tab, search],
    queryFn: async () => {
      const params: { role: string; username?: string } = { role: tab };
      if (search.trim()) params.username = search.trim();
      const response = await usersApi.listUsers(params);
      const result = response.data;
      if (Array.isArray(result)) return result;
      if (result?.results && Array.isArray(result.results)) return result.results;
      return [];
    },
  });

  if (isLoading) return <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (error) return (
    <div className="text-center py-16">
      <p className="text-destructive mb-2">{t('common.error')}</p>
      <button onClick={() => refetch()} className="text-primary underline">{t('common.retry')}</button>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-2">
        {(['student', 'teacher'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setTab(r)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              tab === r ? 'gradient-bg text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card border border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            {r === 'student' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
            {r === 'student' ? t('members.students') : t('members.teachers')}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('members.search')}
          className="ps-10 rounded-xl bg-card border-border"
        />
      </div>

      {/* List */}
      {(users?.length ?? 0) === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Users className="w-12 h-12 mb-3 opacity-40" />
          <p className="text-lg font-medium">{t('members.noResults')}</p>
        </div>
      ) : (
        <Card className="border bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-start p-3 font-medium text-muted-foreground">{t('info.username')}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t('members.name')}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t('info.email')}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t('info.phone')}</th>
                  <th className="text-start p-3 font-medium text-muted-foreground">{t('members.joined')}</th>
                </tr>
              </thead>
              <tbody>
                {users!.map((u: any) => (
                  <tr key={u?.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-medium">{u?.username}</td>
                    <td className="p-3">{[u?.first_name, u?.last_name].filter(Boolean).join(' ') || t('info.na')}</td>
                    <td className="p-3 text-muted-foreground">{u?.email || t('info.na')}</td>
                    <td className="p-3 text-muted-foreground">{u?.phone || t('info.na')}</td>
                    <td className="p-3 text-muted-foreground">{u?.created_at ? new Date(u.created_at).toLocaleDateString() : t('info.na')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default MembersTab;
