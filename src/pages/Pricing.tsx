import { motion } from 'framer-motion';
import { Check, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useUsageLimits } from '@/hooks/useUsageLimits';
import { toast } from 'sonner';

const Pricing = () => {
  const { user } = useAuth();
  const { usageCount, limit, remaining, isPaidUser } = useUsageLimits();

  const handleUpgrade = () => {
    toast.info('Razorpay integration coming soon! For now, enjoy the free tier.');
  };

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Get started with basic analysis',
      icon: Zap,
      features: [
        '2 analyses without login',
        '10 analyses with free account',
        'Basic score breakdown',
        'Color & font extraction',
        'Image gallery',
      ],
      cta: user ? 'Current Plan' : 'Sign Up Free',
      disabled: !!user && !isPaidUser,
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '$3',
      period: '/month',
      description: 'Unlimited analyses & premium features',
      icon: Crown,
      features: [
        'Unlimited website analyses',
        'Detailed performance insights',
        'Export reports (PDF & JSON)',
        'Compare multiple websites',
        'Priority analysis speed',
        'History & saved analyses',
        'SEO & accessibility deep dive',
      ],
      cta: isPaidUser ? 'Current Plan' : 'Upgrade to Pro',
      disabled: isPaidUser,
      highlighted: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary/5 text-primary text-xs font-medium rounded-lg border border-primary/10 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simple pricing
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Unlock the full power of
            <br />
            <span className="gradient-text">WebVision</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            Start free, upgrade when you need more. Cancel anytime.
          </p>

          {/* Usage indicator */}
          {!isPaidUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 inline-flex items-center gap-2.5 px-5 py-3 bg-muted/40 rounded-lg border border-border/40 text-sm"
            >
              <div className={`w-2.5 h-2.5 rounded-sm ${remaining > 0 ? 'bg-green-500' : 'bg-destructive'} animate-pulse`} />
              <span className="text-muted-foreground">
                {remaining > 0
                  ? `${remaining} of ${limit} free analyses remaining`
                  : "You've used all free analyses"}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Plan Cards */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.15 }}
              className="h-full"
            >
              <div className={`relative h-full flex flex-col rounded-xl border p-6 sm:p-8 transition-all ${
                plan.highlighted
                  ? 'border-primary/40 bg-gradient-to-b from-primary/[0.03] to-transparent shadow-lg shadow-primary/5'
                  : 'border-border/50 bg-card/50'
              }`}>
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl" />
                )}

                {/* Plan Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2.5 rounded-lg ${plan.highlighted ? 'bg-primary/10' : 'bg-muted/60'}`}>
                      <plan.icon className={`w-5 h-5 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    {plan.highlighted && (
                      <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-widest">
                        Popular
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-bold tracking-tight">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3.5 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 p-0.5 rounded-sm ${plan.highlighted ? 'bg-primary/10' : 'bg-muted/60'}`}>
                        <Check className={`w-3 h-3 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  className={`w-full h-12 rounded-lg text-sm font-semibold tracking-wide ${
                    plan.highlighted
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'
                      : ''
                  }`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                  disabled={plan.disabled}
                  onClick={plan.highlighted ? handleUpgrade : undefined}
                >
                  {plan.cta}
                  {plan.highlighted && !isPaidUser && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/50 mt-12"
        >
          Secure payments powered by Razorpay · Cancel anytime · No hidden fees
        </motion.p>
      </div>
    </div>
  );
};

export default Pricing;
