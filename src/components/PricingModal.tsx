import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Zap, Crown, ArrowRight, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { RazorpayCheckout } from "@/components/RazorpayCheckout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface PricingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
  const { user } = useAuth();
  const { usageCount, limit, remaining, isPaidUser } = useUsageLimits();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = () => {
    if (!user) {
      toast.info("Please sign in first to upgrade.");
      onOpenChange(false);
      navigate("/auth");
      return;
    }
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    onOpenChange(false);
    if (user) localStorage.setItem(`webvision_paid_${user.id}`, "true");
    toast.success("🎉 Welcome to Pro! You now have unlimited analyses.");
    window.location.reload();
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "/mo",
      description: "Get started with basic analysis",
      icon: Zap,
      features: [
        "2 analyses without login",
        "10 analyses with free account",
        "Basic score breakdown",
        "Color & font extraction",
        "Image gallery",
      ],
      cta: user ? "Current Plan" : "Sign Up Free",
      disabled: !!user && !isPaidUser,
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$3",
      period: "/mo",
      description: "Unlimited analyses & premium features",
      icon: Crown,
      features: [
        "Unlimited website analyses",
        "Detailed performance insights",
        "Export reports (PDF & JSON)",
        "Compare multiple websites",
        "Priority analysis speed",
        "History & saved analyses",
        "SEO & accessibility deep dive",
      ],
      cta: isPaidUser ? "Current Plan" : "Upgrade to Pro",
      disabled: isPaidUser,
      highlighted: true,
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl w-[calc(100vw-2rem)] p-0 overflow-hidden max-h-[90vh] flex flex-col">
          <div className="overflow-y-auto p-6 sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary text-xs font-medium rounded-lg border border-primary/10 mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                Simple pricing
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight mb-2">
                Unlock the full power of{" "}
                <span className="gradient-text">WebVision</span>
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Start free, upgrade when you need more. Cancel anytime.
              </p>

              {!isPaidUser && (
                <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-lg border border-border/40 text-xs">
                  <div
                    className={`w-2 h-2 rounded-sm ${
                      remaining > 0 ? "bg-green-500" : "bg-destructive"
                    } animate-pulse`}
                  />
                  <span className="text-muted-foreground">
                    {remaining > 0
                      ? `${remaining} of ${limit} free analyses remaining`
                      : "You've used all free analyses"}
                  </span>
                </div>
              )}
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.08 }}
                  className={`relative flex flex-col rounded-xl border p-5 sm:p-6 ${
                    plan.highlighted
                      ? "border-primary/40 bg-gradient-to-b from-primary/[0.04] to-transparent shadow-lg shadow-primary/5"
                      : "border-border/50 bg-card/50"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-t-xl" />
                  )}

                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`p-2 rounded-lg ${
                          plan.highlighted ? "bg-primary/10" : "bg-muted/60"
                        }`}
                      >
                        <plan.icon
                          className={`w-4 h-4 ${
                            plan.highlighted
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      {plan.highlighted && (
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-widest">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold mb-0.5">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {plan.period}
                    </span>
                  </div>

                  <ul className="space-y-2.5 mb-5 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-xs sm:text-sm"
                      >
                        <div
                          className={`mt-0.5 p-0.5 rounded-sm ${
                            plan.highlighted ? "bg-primary/10" : "bg-muted/60"
                          }`}
                        >
                          <Check
                            className={`w-3 h-3 ${
                              plan.highlighted
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-11 rounded-lg text-sm font-semibold ${
                      plan.highlighted
                        ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
                        : ""
                    }`}
                    variant={plan.highlighted ? "default" : "outline"}
                    disabled={plan.disabled}
                    onClick={plan.highlighted ? handleUpgrade : undefined}
                  >
                    {plan.cta}
                    {plan.highlighted && !isPaidUser && (
                      <ArrowRight className="w-4 h-4 ml-2" />
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-[11px] text-muted-foreground/60 mt-6">
              Secure payments powered by Razorpay · Cancel anytime · No hidden fees
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <RazorpayCheckout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handlePaymentSuccess}
        amount={3}
        planName="Pro"
      />
    </>
  );
}
