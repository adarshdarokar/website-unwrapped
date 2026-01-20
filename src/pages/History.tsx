import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History as HistoryIcon, Search, Filter, Calendar, Globe, Trash2, ExternalLink, Eye, Grid, List, SortAsc, SortDesc, Clock, Star, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface SavedAnalysis {
  id: string;
  url: string;
  score: number | null;
  created_at: string;
  share_id: string | null;
  is_public: boolean | null;
  analysis_data: any;
}

const History = () => {
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score_high' | 'score_low'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [scoreFilter, setScoreFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      fetchAnalyses();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [analyses, searchQuery, sortBy, scoreFilter]);

  const fetchAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error: any) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.url.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Score filter
    if (scoreFilter !== 'all') {
      filtered = filtered.filter(a => {
        const score = a.score || 0;
        if (scoreFilter === 'high') return score >= 70;
        if (scoreFilter === 'medium') return score >= 40 && score < 70;
        if (scoreFilter === 'low') return score < 40;
        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'score_high':
          return (b.score || 0) - (a.score || 0);
        case 'score_low':
          return (a.score || 0) - (b.score || 0);
        default:
          return 0;
      }
    });

    setFilteredAnalyses(filtered);
  };

  const deleteAnalysis = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setAnalyses(prev => prev.filter(a => a.id !== id));
      toast.success('Analysis deleted');
    } catch (error: any) {
      toast.error('Failed to delete analysis');
    }
  };

  const togglePublic = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('saved_analyses')
        .update({ is_public: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      setAnalyses(prev => prev.map(a => 
        a.id === id ? { ...a, is_public: !currentStatus } : a
      ));
      toast.success(!currentStatus ? 'Analysis is now public' : 'Analysis is now private');
    } catch (error: any) {
      toast.error('Failed to update visibility');
    }
  };

  const copyShareLink = async (shareId: string) => {
    const link = `${window.location.origin}/share/${shareId}`;
    await navigator.clipboard.writeText(link);
    toast.success('Share link copied!');
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 70) return 'from-green-500/20 to-emerald-500/20';
    if (score >= 40) return 'from-yellow-500/20 to-orange-500/20';
    return 'from-red-500/20 to-rose-500/20';
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-0 left-1/4 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="p-4 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl w-fit mx-auto mb-6">
              <HistoryIcon className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold mb-3">Sign in to view history</h1>
            <p className="text-muted-foreground mb-6">Your saved analyses will appear here</p>
            <Link to="/">
              <Button className="rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full blur-3xl"
          animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-gradient-to-tr from-accent/10 via-secondary/5 to-transparent rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="relative z-10">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-20">
          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6"
          >
            {[
              { label: 'Total Analyses', value: analyses.length, icon: Globe },
              { label: 'Avg Score', value: analyses.length > 0 ? Math.round(analyses.reduce((acc, a) => acc + (a.score || 0), 0) / analyses.length) : 0, icon: Star },
              { label: 'Public', value: analyses.filter(a => a.is_public).length, icon: Share2 },
              { label: 'This Month', value: analyses.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length, icon: Calendar },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <stat.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Filters */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 mb-6"
          >
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by URL..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 rounded-xl border-border/50 bg-background/50"
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={scoreFilter} onValueChange={(v: any) => setScoreFilter(v)}>
                  <SelectTrigger className="w-32 rounded-xl border-border/50 bg-background/50">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Scores</SelectItem>
                    <SelectItem value="high">High (70+)</SelectItem>
                    <SelectItem value="medium">Medium (40-69)</SelectItem>
                    <SelectItem value="low">Low (&lt;40)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="w-36 rounded-xl border-border/50 bg-background/50">
                    {sortBy.includes('high') || sortBy === 'oldest' ? (
                      <SortDesc className="w-4 h-4 mr-2" />
                    ) : (
                      <SortAsc className="w-4 h-4 mr-2" />
                    )}
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="score_high">Highest Score</SelectItem>
                    <SelectItem value="score_low">Lowest Score</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex rounded-xl border border-border/50 bg-background/50 p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-lg h-8 w-8"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                    size="icon"
                    className="rounded-lg h-8 w-8"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          {filteredAnalyses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="p-4 bg-muted/50 rounded-full w-fit mx-auto mb-4">
                <HistoryIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || scoreFilter !== 'all' ? 'No matching analyses' : 'No saved analyses yet'}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {searchQuery || scoreFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Start analyzing websites to build your history'}
              </p>
              {!searchQuery && scoreFilter === 'all' && (
                <Link to="/">
                  <Button className="rounded-xl">Analyze a Website</Button>
                </Link>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' 
                ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-4'
                : 'space-y-3'
              }
            >
              <AnimatePresence>
                {filteredAnalyses.map((analysis, index) => (
                  <motion.div
                    key={analysis.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className={`glass-card overflow-hidden group ${
                      viewMode === 'list' ? 'flex items-center gap-4 p-4' : ''
                    }`}
                  >
                    {viewMode === 'grid' ? (
                      <>
                        {/* Score Banner */}
                        <div className={`h-2 bg-gradient-to-r ${getScoreBg(analysis.score || 0)}`} />
                        
                        <div className="p-4">
                          {/* URL */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                              <a 
                                href={analysis.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium truncate hover:text-primary transition-colors"
                              >
                                {analysis.url.replace(/^https?:\/\//, '').split('/')[0]}
                              </a>
                            </div>
                            <span className={`text-lg font-bold ${getScoreColor(analysis.score || 0)}`}>
                              {analysis.score || 0}
                            </span>
                          </div>

                          {/* Meta */}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                            <Clock className="w-3 h-3" />
                            <span>{format(new Date(analysis.created_at), 'MMM d, yyyy')}</span>
                            {analysis.is_public && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                                Public
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 rounded-lg text-xs"
                              onClick={() => navigate(`/share/${analysis.share_id}`)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            {analysis.share_id && (
                              <Button
                                variant="outline"
                                size="icon"
                                className="rounded-lg h-8 w-8"
                                onClick={() => copyShareLink(analysis.share_id!)}
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-lg h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => deleteAnalysis(analysis.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* List View */}
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getScoreBg(analysis.score || 0)} flex items-center justify-center flex-shrink-0`}>
                          <span className={`font-bold ${getScoreColor(analysis.score || 0)}`}>
                            {analysis.score || 0}
                          </span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <a 
                              href={analysis.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-medium truncate hover:text-primary transition-colors"
                            >
                              {analysis.url.replace(/^https?:\/\//, '').split('/')[0]}
                            </a>
                            <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            {analysis.is_public && (
                              <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-[10px]">
                                Public
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(analysis.created_at), 'MMMM d, yyyy at h:mm a')}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-lg"
                            onClick={() => navigate(`/share/${analysis.share_id}`)}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          {analysis.share_id && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="rounded-lg h-8 w-8"
                              onClick={() => copyShareLink(analysis.share_id!)}
                            >
                              <Share2 className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteAnalysis(analysis.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default History;
