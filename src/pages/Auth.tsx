import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Loader2, Eye, EyeOff, Github, ArrowRight, BarChart3, TrendingUp } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

/* --------------------------- Dashboard preview --------------------------- */

const categoryScores = [
  { name: 'Typography', value: 62, color: 'hsl(245 70% 62%)' },
  { name: 'Colors', value: 85, color: 'hsl(255 75% 65%)' },
  { name: 'Icons', value: 92, color: 'hsl(165 65% 48%)' },
  { name: 'Motion', value: 74, color: 'hsl(200 85% 60%)' },
  { name: 'SEO', value: 88, color: 'hsl(220 80% 60%)' },
  { name: 'Performance', value: 46, color: 'hsl(32 90% 58%)' },
];

const radarAxes = ['Typography', 'Colors', 'Images', 'Motion', 'SEO', 'Performance', 'Accessibility', 'Icons'];
const radarValues = [0.7, 0.85, 0.6, 0.72, 0.65, 0.55, 0.68, 0.82];

const donut = [
  { name: 'Colors', value: 35, color: 'hsl(250 75% 62%)' },
  { name: 'Fonts', value: 20, color: 'hsl(215 85% 60%)' },
  { name: 'Animations', value: 17, color: 'hsl(160 65% 50%)' },
  { name: 'Images', value: 28, color: 'hsl(345 80% 62%)' },
];

const evaluation = [
  { label: 'HTTPS Security', value: '+15', tone: 'pos', dot: 'hsl(150 60% 45%)' },
  { label: 'Mobile Viewport', value: '+10', tone: 'pos', dot: 'hsl(215 85% 60%)' },
  { label: 'Image Alt Text', value: '-5', tone: 'neg', dot: 'hsl(345 80% 62%)' },
  { label: 'Font Loading', value: '+10', tone: 'pos', dot: 'hsl(32 90% 58%)' },
  { label: 'Color Contrast', value: '+8', tone: 'pos', dot: 'hsl(150 60% 45%)' },
  { label: 'Preconnect Hints', value: '-3', tone: 'neg', dot: 'hsl(345 80% 62%)' },
];

function PreviewCard({ title, icon: Icon, children, className }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "rounded-2xl bg-card border border-border/40 p-[clamp(0.75rem,1.6vh,1.25rem)]",
      "shadow-[0_1px_0_hsl(0_0%_100%/0.6)_inset,0_20px_40px_-24px_hsl(245_40%_30%/0.18),0_2px_6px_-2px_hsl(245_20%_40%/0.06)]",
      className
    )}>
      <div className="flex items-center gap-2.5 mb-[clamp(0.5rem,1.2vh,1rem)]">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}


function CategoryScoresCard() {
  return (
    <PreviewCard title="Category Scores" icon={BarChart3}>
      <p className="text-[11px] text-muted-foreground -mt-2 mb-2 ml-[38px]">Points earned per area</p>
      <div className="space-y-[clamp(0.3rem,0.85vh,0.6rem)]">
        {categoryScores.map((c) => (
          <div key={c.name} className="grid grid-cols-[80px_1fr_28px] items-center gap-3">
            <span className="text-xs text-foreground/80">{c.name}</span>
            <div className="h-1.5 rounded-full bg-muted/70 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${c.value}%`, background: c.color }} />
            </div>
            <span className="text-xs font-semibold text-foreground text-right">{c.value}</span>
          </div>
        ))}
        <div className="grid grid-cols-5 pt-1 text-[10px] text-muted-foreground/70">
          {[0, 25, 50, 75, 100].map((n) => <span key={n} className="text-center">{n}</span>)}
        </div>
      </div>
    </PreviewCard>
  );
}

function StrengthMapCard() {
  const cx = 110, cy = 100, r = 70;
  const points = radarValues.map((v, i) => {
    const angle = (Math.PI * 2 * i) / radarValues.length - Math.PI / 2;
    return [cx + Math.cos(angle) * r * v, cy + Math.sin(angle) * r * v];
  });
  const polygon = points.map((p) => p.join(',')).join(' ');
  return (
    <PreviewCard title="Strength Map" icon={() => <Logo size={16} />}>
      <div className="flex justify-center">
        <svg viewBox="0 0 220 200" className="w-full max-w-[220px] h-[clamp(120px,17vh,180px)]">
          {[0.33, 0.66, 1].map((s) => (
            <polygon
              key={s}
              points={radarAxes.map((_, i) => {
                const a = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
                return `${cx + Math.cos(a) * r * s},${cy + Math.sin(a) * r * s}`;
              }).join(' ')}
              fill="none"
              stroke="hsl(240 20% 88%)"
              strokeWidth="0.8"
            />
          ))}
          {radarAxes.map((_, i) => {
            const a = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
            return <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="hsl(240 20% 88%)" strokeWidth="0.8" />;
          })}
          <polygon points={polygon} fill="hsl(245 70% 62% / 0.18)" stroke="hsl(245 70% 62%)" strokeWidth="1.5" />
          {points.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.5" fill="hsl(245 70% 62%)" />
          ))}
          {radarAxes.map((label, i) => {
            const a = (Math.PI * 2 * i) / radarAxes.length - Math.PI / 2;
            const lx = cx + Math.cos(a) * (r + 14);
            const ly = cy + Math.sin(a) * (r + 14);
            return (
              <text key={label} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fontSize="7.5" fill="hsl(240 15% 40%)">
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </PreviewCard>
  );
}

function AssetDistributionCard() {
  const total = donut.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const C = 2 * Math.PI * 32;
  return (
    <PreviewCard title="Asset Distribution" icon={TrendingUp}>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 80 80" className="w-[clamp(4rem,8vh,6rem)] h-[clamp(4rem,8vh,6rem)] shrink-0 -rotate-90">
          {donut.map((d) => {
            const frac = d.value / total;
            const dash = frac * C;
            const el = (
              <circle
                key={d.name}
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke={d.color}
                strokeWidth="14"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return el;
          })}
        </svg>
        <div className="flex-1 space-y-[clamp(0.25rem,0.7vh,0.5rem)]">
          {donut.map((d) => (
            <div key={d.name} className="flex items-center gap-2.5 text-xs">
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span className="flex-1 text-foreground/80">{d.name}</span>
              <span className="font-semibold text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      </div>
    </PreviewCard>
  );
}

function EvaluationCard() {
  return (
    <PreviewCard title="Evaluation Details" icon={TrendingUp}>
      <div className="space-y-[clamp(0.3rem,0.85vh,0.6rem)]">
        {evaluation.map((e) => (
          <div key={e.label} className="flex items-center gap-3 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.dot }} />
            <span className="flex-1 text-foreground/80">{e.label}</span>
            <span className={cn("font-semibold text-xs", e.tone === 'pos' ? 'text-primary' : 'text-destructive')}>
              {e.value}
            </span>
          </div>
        ))}
      </div>
    </PreviewCard>
  );
}

/* -------------------------------- Auth page -------------------------------- */

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, displayName);
        if (error) throw error;
        toast.success('Account created successfully!');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast.success('Welcome back!');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const oauth = async (provider: 'google' | 'github') => {
    const setter = provider === 'google' ? setIsGoogleLoading : setIsGithubLoading;
    setter(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `${provider} sign-in failed`);
      setter(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] lg:h-[100dvh] lg:overflow-hidden bg-background text-foreground">
      <div className="fixed top-4 right-4 z-30">
        <ThemeToggle />
      </div>

      <div className="min-h-[100dvh] lg:h-full grid lg:grid-cols-[1.45fr_1px_1fr]">
        {/* -------------------- LEFT: hero + dashboard preview -------------------- */}
        <section className="relative px-6 sm:px-10 lg:px-[clamp(1.5rem,3vw,4rem)] py-8 lg:py-[clamp(1rem,3vh,3rem)] flex flex-col lg:justify-center lg:overflow-hidden">
          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate('/')}
            className="flex items-center self-start group"
          >
            <Logo height={34} priority className="transition-transform group-hover:scale-105" />
          </motion.button>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 lg:mt-[clamp(1rem,3vh,3rem)] max-w-xl"
          >
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[clamp(2rem,3.6vh+0.8rem,3.25rem)] leading-[1.06] tracking-tight">
              Discover the design DNA of{' '}
              <span className="text-primary">any website</span>
            </h1>
            <p className="mt-[clamp(0.6rem,1.6vh,1.25rem)] text-muted-foreground text-[clamp(0.85rem,1.5vh,1rem)] max-w-md leading-relaxed">
              Extract colors, fonts, images, animations, videos and everything that makes a website exceptional.
            </p>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-[clamp(1rem,2.5vh,3rem)] grid grid-cols-1 sm:grid-cols-2 gap-[clamp(0.6rem,1.5vh,1.25rem)] max-w-3xl"
          >
            <CategoryScoresCard />
            <StrengthMapCard />
            <AssetDistributionCard />
            <EvaluationCard />
          </motion.div>

        </section>

        {/* -------------------- Divider -------------------- */}
        <div className="hidden lg:block bg-border/60" />

        {/* -------------------- RIGHT: auth card -------------------- */}
        <section className="px-6 sm:px-10 lg:px-[clamp(1.25rem,2.5vw,3.5rem)] py-10 lg:py-[clamp(1rem,2vh,2rem)] flex items-start lg:items-center justify-center lg:overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-md rounded-3xl bg-card p-6 sm:p-8 lg:p-[clamp(1.25rem,2.6vh,2.25rem)] border border-border/40 shadow-[0_1px_0_hsl(0_0%_100%/0.6)_inset,0_30px_60px_-30px_hsl(245_40%_25%/0.28),0_2px_8px_-2px_hsl(245_20%_40%/0.08)]"
          >
            {/* Brand */}
            <div className="flex items-center mb-[clamp(0.75rem,2vh,1.75rem)]">
              <Logo height={30} priority />
            </div>

            <h2 className="font-display font-bold text-[clamp(1.5rem,3vh,1.875rem)] tracking-tight">
              {mode === 'signin' ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1.5">
              {mode === 'signin'
                ? 'Sign in to continue analyzing beautiful websites.'
                : 'Join WebVision to unlock powerful analysis tools.'}
            </p>

            {/* Tabs */}
            <div className="mt-[clamp(0.75rem,2vh,1.75rem)] grid grid-cols-2 border-b border-border/60">
              {(['signin', 'signup'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={cn(
                    'relative pb-3 text-sm font-semibold transition-colors',
                    mode === m ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {m === 'signin' ? 'Login' : 'Register'}
                  {mode === m && (
                    <motion.span
                      layoutId="auth-tab"
                      className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-[clamp(0.75rem,1.8vh,1.5rem)] space-y-[clamp(0.5rem,1.4vh,1rem)]">
              <AnimatePresence mode="wait">
                {mode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="displayName" className="sr-only">Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="pl-11 h-[clamp(2.5rem,5.2vh,3rem)] rounded-xl bg-background border-border/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="pl-11 h-[clamp(2.5rem,5.2vh,3rem)] rounded-xl bg-background border-border/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="pl-11 pr-11 h-[clamp(2.5rem,5.2vh,3rem)] rounded-xl bg-background border-border/70 focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(!!v)}
                    className="rounded-[5px] data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm text-primary font-medium hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-[clamp(2.5rem,5.2vh,3rem)] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-[15px] shadow-[0_10px_24px_-10px_hsl(var(--primary)/0.6)] transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'signin' ? 'Sign in' : 'Create account'}
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>

              <div className="relative py-[clamp(0.15rem,0.6vh,0.5rem)]">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-px bg-border/60" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-3 text-xs text-muted-foreground">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => oauth('google')}
                disabled={isGoogleLoading}
                className="w-full h-[clamp(2.5rem,5.2vh,3rem)] rounded-xl border-border/70 bg-background hover:bg-muted/50 font-medium"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => oauth('github')}
                disabled={isGithubLoading}
                className="w-full h-[clamp(2.5rem,5.2vh,3rem)] rounded-xl border-border/70 bg-background hover:bg-muted/50 font-medium"
              >
                {isGithubLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Github className="w-5 h-5 mr-2" />
                    Continue with GitHub
                  </>
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground pt-[clamp(0.25rem,1vh,0.75rem)]">
                By continuing, you agree to our{' '}
                <a className="text-primary hover:underline" href="#">Terms of Service</a>{' '}and{' '}
                <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
              </p>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Auth;
