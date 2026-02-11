import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sun,
  Moon,
  Globe,
  LogOut,
  User,
  BookOpen,
  ChevronDown,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useTenant } from '@/hooks/useTenant';

const Navbar = () => {
  const { t, language, setLanguage, isRTL } = useLanguage();
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { data: tenant } = useTenant();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 border-0 border-b ${
        isDark
          ? 'bg-background/95 backdrop-blur-xl border-border/40'
          : 'glass-card'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
              tenant?.profile_pic ? '' : isDark ? 'bg-primary' : 'gradient-bg'
            }`}>
              {tenant?.profile_pic ? (
                <img src={tenant.profile_pic} alt={tenant.name || 'Logo'} className="w-full h-full object-cover" />
              ) : (
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              )}
            </div>
            <span className="text-xl font-bold gradient-text hidden sm:block">
              {tenant?.name || 'Zakerai Academy'}
            </span>
          </a>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-accent' : ''}
                >
                  🇺🇸 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('ar')}
                  className={language === 'ar' ? 'bg-accent' : ''}
                >
                  🇸🇦 العربية
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>

            {/* Auth Actions */}
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2 rounded-full px-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="hidden sm:block">{user?.username}</span>
                        <ChevronDown className="w-4 h-4 hidden sm:block" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-48">
                      <DropdownMenuItem onClick={() => { window.location.href = '/profile'; }}>
                        <User className="w-4 h-4 me-2" />
                        {t('nav.profile')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                        <LogOut className="w-4 h-4 me-2" />
                        {t('nav.logout')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={() => { window.location.href = '/login'; }}>
                      {t('nav.login')}
                    </Button>
                    <Button className="gradient-bg text-primary-foreground border-0" onClick={() => { window.location.href = '/register'; }}>
                      {t('nav.register')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
