import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/lib/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Users, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
      // Handle pagination or direct array
      const result = response.data;
      if (Array.isArray(result)) return result;
      if (result?.results && Array.isArray(result.results)) return result.results;
      return [];
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('student')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            tab === 'student' ? 'gradient-bg text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          <Users className="w-4 h-4" /> {t('members.students')}
        </button>
        <button
          onClick={() => setTab('teacher')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
            tab === 'teacher' ? 'gradient-bg text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'
          }`}
        >
          <User className="w-4 h-4" /> {t('members.teachers')}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('members.search')}
          className="ps-10"
        />
      </div>

      {/* List */}
      {(users?.length ?? 0) === 0 ? (
        <div className="text-center py-12 text-muted-foreground">{t('members.noResults')}</div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-start p-3">{t('info.username')}</th>
                <th className="text-start p-3">{t('members.name')}</th>
                <th className="text-start p-3">{t('info.email')}</th>
                <th className="text-start p-3">{t('info.phone')}</th>
                <th className="text-start p-3">{t('members.joined')}</th>
              </tr>
            </thead>
            <tbody>
              {users!.map((u: any) => (
                <tr key={u?.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{u?.username}</td>
                  <td className="p-3">{[u?.first_name, u?.last_name].filter(Boolean).join(' ') || t('info.na')}</td>
                  <td className="p-3">{u?.email || t('info.na')}</td>
                  <td className="p-3">{u?.phone || t('info.na')}</td>
                  <td className="p-3 text-muted-foreground">{u?.created_at ? new Date(u.created_at).toLocaleDateString() : t('info.na')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default MembersTab;
