import { motion } from 'framer-motion';
import { 
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { TrendingUp, BarChart3, Target, Activity } from 'lucide-react';

const radarData = [
  { subject: 'Typography', value: 78 },
  { subject: 'Colors', value: 85 },
  { subject: 'Images', value: 62 },
  { subject: 'Motion', value: 70 },
  { subject: 'SEO', value: 90 },
  { subject: 'Performance', value: 82 },
  { subject: 'Accessibility', value: 75 },
  { subject: 'Icons', value: 68 },
];

const categoryScores = [
  { name: 'Visual Design', score: 82, fill: 'hsl(var(--chart-1))' },
  { name: 'Performance', score: 90, fill: 'hsl(var(--chart-2))' },
  { name: 'SEO', score: 88, fill: 'hsl(var(--chart-3))' },
  { name: 'Accessibility', score: 75, fill: 'hsl(var(--chart-4))' },
  { name: 'Best Practices', score: 85, fill: 'hsl(var(--chart-5))' },
];

const distributionData = [
  { name: 'Colors', value: 35, fill: 'hsl(var(--chart-1))' },
  { name: 'Fonts', value: 20, fill: 'hsl(var(--chart-2))' },
  { name: 'Animations', value: 17, fill: 'hsl(var(--chart-3))' },
  { name: 'Images', value: 28, fill: 'hsl(var(--chart-4))' },
];

const evaluationPoints = [
  { label: 'HTTPS Security', status: 'pass' as const, points: '+15' },
  { label: 'Mobile Viewport', status: 'pass' as const, points: '+10' },
  { label: 'Image Alt Text', status: 'warn' as const, points: '-5' },
  { label: 'Font Loading', status: 'pass' as const, points: '+10' },
  { label: 'Color Contrast', status: 'pass' as const, points: '+8' },
  { label: 'Preconnect Hints', status: 'fail' as const, points: '-3' },
];

export function DemoAnalytics() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-12 sm:mt-16 max-w-4xl mx-auto"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5 text-center">
        Sample Analysis Dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar Chart - Strength Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-primary/70" />
            <span className="text-xs font-semibold">Strength Map</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Radar
                dataKey="value"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.15}
                strokeWidth={1.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Scores Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary/70" />
            <span className="text-xs font-semibold">Category Scores</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={categoryScores} layout="vertical" margin={{ left: 0, right: 16, top: 4, bottom: 4 }}>
              <XAxis type="number" domain={[0, 100]} hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={90} 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '11px',
                }}
              />
              <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                {categoryScores.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} fillOpacity={0.7} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Distribution Donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-4 h-4 text-primary/70" />
            <span className="text-xs font-semibold">Asset Distribution</span>
          </div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={52}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} fillOpacity={0.75} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {distributionData.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: item.fill, opacity: 0.75 }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Evaluation Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary/70" />
            <span className="text-xs font-semibold">Evaluation Details</span>
          </div>
          <div className="space-y-2">
            {evaluationPoints.map((point, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + i * 0.05 }}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-muted/20"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    point.status === 'pass' ? 'bg-success' : 
                    point.status === 'warn' ? 'bg-warning' : 'bg-destructive'
                  }`} />
                  <span className="text-xs text-muted-foreground">{point.label}</span>
                </div>
                <span className={`text-xs font-mono font-semibold ${
                  point.points.startsWith('+') ? 'text-success' : 'text-destructive'
                }`}>
                  {point.points}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
