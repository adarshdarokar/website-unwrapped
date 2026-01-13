import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Save, 
  Loader2, 
  ArrowLeft, 
  Camera,
  Shield,
  Bell,
  Palette,
  Globe,
  Trash2,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';

const Settings = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  
  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [analysisAlerts, setAnalysisAlerts] = useState(true);
  const [autoSaveAnalysis, setAutoSaveAnalysis] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }
    
    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setDisplayName(data.display_name || '');
        setAvatarUrl(data.avatar_url || '');
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: displayName,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleDeleteAccount = async () => {
    toast.error('Account deletion requires contacting support');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U';
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 50, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-accent/10 via-secondary/5 to-transparent rounded-full blur-3xl"
          animate={{ 
            x: [0, -40, 0],
            y: [0, -30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-display font-bold">Settings</h1>
              <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card-elevated overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-2xl font-bold shadow-lg shadow-primary/25">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Avatar" 
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        getInitials(displayName || user?.email || 'User')
                      )}
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-muted rounded-lg border border-border hover:bg-accent transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{displayName || 'Set your display name'}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <Separator />

                {/* Form */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Your name"
                        className="pl-10 h-11 bg-muted/50 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user?.email || ''}
                        disabled
                        className="pl-10 h-11 bg-muted/30 rounded-xl opacity-60 cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="h-11 bg-muted/50 rounded-xl"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to your profile picture
                  </p>
                </div>

                <Button 
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="h-11 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg shadow-primary/25"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card-elevated overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-accent/50 rounded-xl">
                    <Bell className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="space-y-0.5">
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your analyses</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="space-y-0.5">
                    <p className="font-medium">Analysis Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when analysis completes</p>
                  </div>
                  <Switch
                    checked={analysisAlerts}
                    onCheckedChange={setAnalysisAlerts}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="space-y-0.5">
                    <p className="font-medium">Auto-save Analyses</p>
                    <p className="text-sm text-muted-foreground">Automatically save analysis results</p>
                  </div>
                  <Switch
                    checked={autoSaveAnalysis}
                    onCheckedChange={setAutoSaveAnalysis}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Appearance Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card-elevated overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-secondary rounded-xl">
                    <Palette className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Appearance</CardTitle>
                    <CardDescription>Customize how WebVision looks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="space-y-0.5">
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Connected Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="glass-card-elevated overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-muted rounded-xl">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Connected Accounts</CardTitle>
                    <CardDescription>Manage your connected services</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Google</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.app_metadata?.provider === 'google' 
                          ? 'Connected' 
                          : 'Not connected'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="rounded-lg"
                    disabled={user?.app_metadata?.provider === 'google'}
                  >
                    {user?.app_metadata?.provider === 'google' ? 'Connected' : 'Connect'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="glass-card-elevated overflow-hidden border-destructive/20">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-destructive/10 rounded-xl">
                    <Shield className="w-5 h-5 text-destructive" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security & Account</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full justify-start h-12 rounded-xl"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-12 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
