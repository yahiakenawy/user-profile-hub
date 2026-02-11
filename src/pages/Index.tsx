import Navbar from '@/components/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const { t } = useLanguage();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="content-container pt-24 pb-12 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl"
        >
          <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Zakerai</span> Academy
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            {isAuthenticated
              ? `Welcome back, ${user?.username}!`
              : 'Your intelligent education analytics platform'}
          </p>
          {isAuthenticated && (
            <Button
              onClick={() => { window.location.href = '/profile'; }}
              className="gradient-bg text-primary-foreground border-0 px-6 py-3 text-base"
            >
              {t('nav.profile')} <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Index;
