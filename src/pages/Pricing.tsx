import { motion } from 'framer-motion';
import { Check, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10 mb-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simple pricing
          </motion.div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
            Unlock the full power of
            <br />
            <span className="gradient-text">WebVision</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Start free, upgrade when you need more. Cancel anytime.
          </p>

          {/* Usage indicator */}
          {!isPaidUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl border border-border/50 text-sm"
            >
              <div className={`w-2 h-2 rounded-full ${remaining > 0 ? 'bg-green-500' : 'bg-destructive'} animate-pulse`} />
              <span className="text-muted-foreground">
                {remaining > 0
                  ? `${remaining} of ${limit} free analyses remaining`
                  : "You've used all free analyses"}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Plan Cards */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.15 }}
            >
              <Card className={`relative overflow-hidden h-full ${
                plan.highlighted
                  ? 'border-primary/50 shadow-lg shadow-primary/10 bg-gradient-to-b from-primary/5 to-transparent'
                  : 'glass-card'
              }`}>
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/60" />
                )}

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-2 rounded-lg ${plan.highlighted ? 'bg-primary/10' : 'bg-muted/50'}`}>
                      <plan.icon className={`w-5 h-5 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    {plan.highlighted && (
                      <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full uppercase tracking-wider">
                        Popular
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-xs">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm">
                        <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full rounded-xl h-11 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25'
                        : ''
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    disabled={plan.disabled}
                    onClick={plan.highlighted ? handleUpgrade : undefined}
                  >
                    {plan.cta}
                    {plan.highlighted && !isPaidUser && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground/60 mt-10"
        >
          Secure payments powered by Razorpay · Cancel anytime · No hidden fees
        </motion.p>
      </div>
    </div>
  );
};

export default Pricing;
