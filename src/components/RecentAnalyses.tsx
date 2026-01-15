import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

interface RecentAnalysis {
  id: string;
  url: string;
  score: number | null;
  created_at: string;
  share_id: string | null;
}

export function RecentAnalyses() {
  const [analyses, setAnalyses] = useState<RecentAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchRecent();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecent = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('id, url, score, created_at, share_id')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setAnalyses(data || []);
    } catch (error) {
      console.error('Failed to fetch recent analyses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-destructive';
  };

  if (!user || loading || analyses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="mt-12 max-w-md mx-auto"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-muted-foreground">Recent</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/history')}
          className="text-xs text-muted-foreground hover:text-foreground h-auto p-0"
        >
          View all
          <ArrowRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {analyses.map((analysis, index) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            onClick={() => navigate(`/share/${analysis.share_id}`)}
            className="flex items-center gap-3 p-3 bg-card border border-border rounded-xl cursor-pointer hover:bg-muted/30 transition-colors"
          >
            <div className="p-2 bg-muted rounded-lg">
              <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {analysis.url.replace(/^https?:\/\//, '').split('/')[0]}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {format(new Date(analysis.created_at), 'MMM d, h:mm a')}
              </p>
            </div>
            <span className={`text-sm font-semibold ${getScoreColor(analysis.score || 0)}`}>
              {analysis.score || 0}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
