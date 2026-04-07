import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, Building2, Shield, Check, Loader2, Receipt, Mail, Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface RazorpayCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
  planName: string;
}

type PaymentMethod = 'card' | 'upi' | 'netbanking';
type CheckoutStep = 'form' | 'processing' | 'receipt';

export function RazorpayCheckout({ isOpen, onClose, onSuccess, amount, planName }: RazorpayCheckoutProps) {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<CheckoutStep>('form');
  const [txnId] = useState(() => `txn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`);
  const [emailSent, setEmailSent] = useState(false);

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI
  const [upiId, setUpiId] = useState('');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('');

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isFormValid = () => {
    if (method === 'card') {
      return cardNumber.replace(/\s/g, '').length === 16 && expiry.length === 5 && cvv.length === 3 && cardName.length > 1;
    }
    if (method === 'upi') return upiId.includes('@');
    if (method === 'netbanking') return selectedBank.length > 0;
    return false;
  };

  const getPaymentMethodLabel = () => {
    if (method === 'card') return `Card ending ••••${cardNumber.replace(/\s/g, '').slice(-4)}`;
    if (method === 'upi') return `UPI · ${upiId}`;
    const bank = banks.find(b => b.id === selectedBank);
    return `Netbanking · ${bank?.name || ''}`;
  };

  const handlePay = async () => {
    setStep('processing');
    await new Promise(r => setTimeout(r, 2200));
    setStep('receipt');
  };

  const handleContinue = () => {
    onSuccess();
    resetState();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  const resetState = () => {
    setStep('form');
    setCardNumber('');
    setExpiry('');
    setCvv('');
    setCardName('');
    setUpiId('');
    setSelectedBank('');
    setEmailSent(false);
  };

  const banks = [
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
    { id: 'kotak', name: 'Kotak Mahindra Bank' },
  ];

  const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
    { id: 'card', label: 'Card', icon: CreditCard },
    { id: 'upi', label: 'UPI', icon: Smartphone },
    { id: 'netbanking', label: 'Netbanking', icon: Building2 },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Processing State */}
          {step === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-12 text-center"
            >
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-1">Processing Payment</h3>
              <p className="text-sm text-muted-foreground">Please wait while we verify your payment...</p>
            </motion.div>
          )}

          {/* Receipt State */}
          {step === 'receipt' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="overflow-hidden"
            >
              {/* Success header */}
              <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-6 text-center border-b border-border/40">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.1, damping: 12 }}
                  className="w-14 h-14 mx-auto mb-3 rounded-full bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center"
                >
                  <Check className="w-7 h-7 text-emerald-500" />
                </motion.div>
                <h3 className="text-lg font-bold text-foreground">Payment Successful!</h3>
                <p className="text-xs text-muted-foreground mt-1">Your {planName} plan is now active</p>
              </div>

              {/* Receipt details */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Receipt</span>
                </div>

                <div className="rounded-lg border border-border/60 divide-y divide-border/40">
                  <div className="flex justify-between items-center p-3">
                    <span className="text-xs text-muted-foreground">Transaction ID</span>
                    <span className="text-xs font-mono text-foreground">{txnId}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-xs text-muted-foreground">Date</span>
                    <span className="text-xs text-foreground">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-xs text-muted-foreground">Plan</span>
                    <span className="text-xs font-medium text-foreground">{planName} — ${amount}/mo</span>
                  </div>
                  <div className="flex justify-between items-center p-3">
                    <span className="text-xs text-muted-foreground">Payment Method</span>
                    <span className="text-xs text-foreground">{getPaymentMethodLabel()}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/30">
                    <span className="text-xs font-semibold text-foreground">Amount Paid</span>
                    <span className="text-sm font-bold text-foreground">${amount}.00</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 rounded-lg text-xs gap-1.5"
                    onClick={handleSendEmail}
                    disabled={emailSent}
                  >
                    {emailSent ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Email Sent!
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        Email Receipt
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-10 rounded-lg text-xs gap-1.5"
                    onClick={() => {
                      const text = `WebVision Receipt\nTxn: ${txnId}\nPlan: ${planName} - $${amount}/mo\nDate: ${new Date().toLocaleDateString()}`;
                      const blob = new Blob([text], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `webvision-receipt-${txnId}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>

                <Button
                  className="w-full h-11 rounded-lg text-sm font-semibold gap-2"
                  onClick={handleContinue}
                >
                  Continue to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>

                <div className="flex items-center justify-center gap-1.5">
                  <Shield className="w-3 h-3 text-muted-foreground/40" />
                  <span className="text-[10px] text-muted-foreground/40">
                    Secured by Razorpay · Demo Mode
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Payment Form */}
          {step === 'form' && (
            <>
              {/* Header - Razorpay-style */}
              <div className="bg-[#1a1f36] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">WebVision</p>
                    <p className="text-white/60 text-xs">{planName} Plan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">${amount}</p>
                  <p className="text-white/50 text-[10px]">per month</p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-white/40 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Payment Methods */}
              <div className="border-b border-border">
                <div className="flex">
                  {methods.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setMethod(m.id)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-medium transition-all border-b-2 ${
                        method === m.id
                          ? 'border-primary text-primary bg-primary/5'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <m.icon className="w-3.5 h-3.5" />
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Body */}
              <div className="p-5 space-y-4">
                {method === 'card' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Card Number</label>
                      <Input
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                        className="h-11 rounded-lg text-sm font-mono"
                        maxLength={19}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">Cardholder Name</label>
                      <Input
                        placeholder="John Doe"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        className="h-11 rounded-lg text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Expiry</label>
                        <Input
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={e => setExpiry(formatExpiry(e.target.value))}
                          className="h-11 rounded-lg text-sm font-mono"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">CVV</label>
                        <Input
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                          className="h-11 rounded-lg text-sm font-mono"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {method === 'upi' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="text-xs text-muted-foreground mb-1.5 block">UPI ID</label>
                      <Input
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={e => setUpiId(e.target.value)}
                        className="h-11 rounded-lg text-sm"
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground/60">
                      A payment request will be sent to your UPI app
                    </p>
                  </motion.div>
                )}

                {method === 'netbanking' && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-xs text-muted-foreground mb-1 block">Select Bank</label>
                    {banks.map(bank => (
                      <button
                        key={bank.id}
                        onClick={() => setSelectedBank(bank.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-sm text-left transition-all ${
                          selectedBank === bank.id
                            ? 'border-primary bg-primary/5 text-foreground'
                            : 'border-border/50 hover:border-border text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <Building2 className="w-4 h-4 shrink-0" />
                        {bank.name}
                        {selectedBank === bank.id && <Check className="w-3.5 h-3.5 ml-auto text-primary" />}
                      </button>
                    ))}
                  </motion.div>
                )}

                {/* Pay Button */}
                <Button
                  className="w-full h-12 rounded-lg text-sm font-semibold"
                  disabled={!isFormValid()}
                  onClick={handlePay}
                >
                  {`Pay $${amount}`}
                </Button>

                {/* Security footer */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <Shield className="w-3 h-3 text-muted-foreground/40" />
                  <span className="text-[10px] text-muted-foreground/40">
                    Secured by Razorpay · 256-bit encryption (Demo Mode)
                  </span>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
