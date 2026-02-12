import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  BarChart3,
  BookOpen,
  CreditCard,
  Users,
  Mail,
  Settings,
  X,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import BasicInfoTab from '@/components/profile/BasicInfoTab';
import GeneralAnalysisTab from '@/components/profile/GeneralAnalysisTab';
import SubjectAnalysisTab from '@/components/profile/SubjectAnalysisTab';
import SubscriptionTab from '@/components/profile/SubscriptionTab';
import MembersTab from '@/components/profile/MembersTab';
import InvitationsTab from '@/components/profile/InvitationsTab';
import { Card, CardContent } from '@/components/ui/card';

interface TabConfig {
  key: string;
  labelKey: string;
  icon: React.ReactNode;
  roles: string[];
}

const tabs: TabConfig[] = [
  { key: 'info', labelKey: 'profile.basicInfo', icon: <User className="w-4 h-4" />, roles: ['student', 'teacher', 'admin', 'head'] },
  { key: 'analysis', labelKey: 'profile.generalAnalysis', icon: <BarChart3 className="w-4 h-4" />, roles: ['admin', 'head'] },
  { key: 'myAnalysis', labelKey: 'profile.myAnalysis', icon: <BarChart3 className="w-4 h-4" />, roles: ['teacher'] },
  { key: 'studentAnalysis', labelKey: 'profile.analysis', icon: <BarChart3 className="w-4 h-4" />, roles: ['student'] },
  { key: 'subjectAnalysis', labelKey: 'profile.subjectAnalysis', icon: <BookOpen className="w-4 h-4" />, roles: ['admin', 'head'] },
  { key: 'mySubjectAnalysis', labelKey: 'profile.mySubjectAnalysis', icon: <BookOpen className="w-4 h-4" />, roles: ['teacher'] },
  { key: 'subscription', labelKey: 'profile.subscription', icon: <CreditCard className="w-4 h-4" />, roles: ['admin', 'head'] },
  { key: 'members', labelKey: 'profile.members', icon: <Users className="w-4 h-4" />, roles: ['admin', 'head'] },
  { key: 'invitations', labelKey: 'profile.invitations', icon: <Mail className="w-4 h-4" />, roles: ['admin', 'head'] },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const role = user?.role ?? 'student';
  const [activeTab, setActiveTab] = useState('info');
  const [showSettings, setShowSettings] = useState(false);

  const filteredTabs = tabs.filter((tab) => tab.roles.includes(role));

  const { data: profileResponse, isLoading: profileLoading, error: profileError, refetch: refetchProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await analyticsApi.getProfile();
      return response.data;
    },
  });

  const profileData = profileResponse?.profile_data;
  const profileRole = profileResponse?.role ?? role;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="content-container pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-primary/20">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user?.username ?? t('profile.title')}</h1>
              <p className="text-sm text-muted-foreground font-medium">{t(`common.${profileRole}`)}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-xl transition-all ${showSettings ? 'gradient-bg text-primary-foreground shadow-lg shadow-primary/20' : 'bg-card border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground'}`}
            title={t('profile.settings')}
          >
            {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
          </button>
        </motion.div>

        {/* Settings Panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <Card className="border bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <Settings className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <h3 className="text-xl font-bold mb-1">{t('profile.settings')}</h3>
                  <p className="text-muted-foreground">{t('profile.comingSoon')}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto scrollbar-hide pb-2">
          {filteredTabs.map((tab, i) => (
            <motion.button
              key={tab.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'gradient-bg text-primary-foreground shadow-lg shadow-primary/20'
                  : 'bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              }`}
            >
              {tab.icon}
              {t(tab.labelKey)}
            </motion.button>
          ))}
        </div>

        {/* Loading / Error for profile */}
        {profileLoading && activeTab === 'info' && (
          <div className="flex justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}

        {profileError && activeTab === 'info' && (
          <div className="text-center py-16">
            <p className="text-destructive mb-2">{t('common.error')}</p>
            <button onClick={() => refetchProfile()} className="text-primary underline">{t('common.retry')}</button>
          </div>
        )}

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.2 }}>
            {activeTab === 'info' && !profileLoading && !profileError && (
              <BasicInfoTab role={profileRole} profileData={profileData} />
            )}
            {(activeTab === 'analysis' || activeTab === 'myAnalysis' || activeTab === 'studentAnalysis') && (
              <GeneralAnalysisTab role={profileRole} />
            )}
            {(activeTab === 'subjectAnalysis' || activeTab === 'mySubjectAnalysis') && (
              <SubjectAnalysisTab role={profileRole} profileData={profileData} />
            )}
            {activeTab === 'subscription' && <SubscriptionTab />}
            {activeTab === 'members' && <MembersTab />}
            {activeTab === 'invitations' && <InvitationsTab />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default ProfilePage;
