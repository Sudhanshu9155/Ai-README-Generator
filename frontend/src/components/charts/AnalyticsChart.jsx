import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { getDashboardStats } from '../../api/analyticsApi';
import Loader from '../common/Loader';

// Neural Theme Colors
const COLORS = ['#8B5CF6', '#6366F1', '#0EA5E9', '#10B981', '#F43F5E'];

const AnalyticsChart = ({
  data,
  title = 'Analytics',
  type = 'bar',
  series = null
}) => {
  const [chartData, setChartData] = useState(data || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setChartData(data);
      return;
    }

    if (!series) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const stats = await getDashboardStats();
        const last7 = stats.last7Days || [];
        const formatter = new Intl.DateTimeFormat(undefined, {
          day: '2-digit',
          month: 'short'
        });

        let mapped = last7.map((d) => {
          const dateObj = new Date(d.date);
          return {
            label: isNaN(dateObj) ? d.date : formatter.format(dateObj),
            value: series === 'lines' ? d.lines : d.projects,
            projects: d.projectList || []
          };
        });

        if (!mapped.length) {
          const today = new Date();
          mapped = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(today);
            d.setDate(today.getDate() - (6 - i));
            return {
              label: formatter.format(d),
              value: 0,
              projects: []
            };
          });
        }

        setChartData(mapped);
      } catch (err) {
        setError('Failed to load neural analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [data, series]);

  /* =========================
      THEME STYLES
  ==========================*/
  const axisStyle = {
    fontSize: '9px',
    fontWeight: '700',
    fill: '#64748b',
    fontFamily: 'Inter, sans-serif'
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    const visible = payload.filter((p) => p.value > 0);

    return (
      <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl z-50">
        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">
          {label}
        </div>
        {visible.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-4 py-0.5">
            <span className="text-[10px] font-bold text-slate-200">{p.name}:</span>
            <span className="text-[10px] font-black" style={{ color: p.stroke || p.fill || '#fff' }}>
              {p.value.toLocaleString()}
            </span>
          </div>
        ))}
        {!visible.length && <div className="text-[9px] text-slate-600 italic font-medium">No activity logged</div>}
      </div>
    );
  };

  /* =========================
      CHART BUILDERS
  ==========================*/

  const buildLineChart = () => {
    const projectMap = {};
    chartData.forEach((d) => {
      (d.projects || []).forEach((p) => {
        if (!projectMap[p.title]) {
          projectMap[p.title] = `key_${Object.keys(projectMap).length}`;
        }
      });
    });

    const projectList = Object.keys(projectMap)
      .map((title) => ({ title, key: projectMap[title] }))
      .filter((project) =>
        chartData.some((d) =>
          (d.projects || []).some((p) => p.title === project.title && p.lines > 0)
        )
      );

    // Dynamic data transformation for multi-line support
    const transformed = chartData.map((d) => {
      const row = { label: d.label };
      projectList.forEach((p) => {
        const found = (d.projects || []).find((x) => x.title === p.title);
        row[p.key] = found ? found.lines : 0;
      });
      return row;
    });

    const displayData = projectList.length > 0 ? transformed : chartData;

    return (
      <LineChart data={displayData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisStyle} interval="preserveStartEnd" minTickGap={15} />
        <YAxis axisLine={false} tickLine={false} tick={axisStyle} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 2 }} />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
        
        {projectList.length > 0 ? (
          projectList.map((p, i) => (
            <Line
              key={p.key}
              type="monotone"
              dataKey={p.key}
              name={p.title}
              stroke={COLORS[i % COLORS.length]}
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 2, stroke: '#030712', fill: COLORS[i % COLORS.length] }}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey="value"
            name={series === 'lines' ? 'Lines' : 'Projects'}
            stroke="#8B5CF6"
            strokeWidth={3}
            dot={{ r: 3, fill: '#8B5CF6', strokeWidth: 2, stroke: '#030712' }}
          />
        )}
      </LineChart>
    );
  };

  if (loading) return <div className="h-[250px] flex items-center justify-center"><Loader /></div>;

  if (error || !chartData.length) {
    return (
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center">
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
          {error || 'No Neural Data Found'}
        </p>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 p-4 md:p-6 rounded-[2rem] shadow-2xl transition-all hover:border-white/20">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
            {title}
          </h3>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        <div style={{ width: '100%', height: 250 }}>
          <ResponsiveContainer>
            {type === 'line' ? (
              buildLineChart()
            ) : type === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={axisStyle} />
                <YAxis axisLine={false} tickLine={false} tick={axisStyle} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="value" name={series === 'lines' ? 'Lines' : 'Projects'} radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '9px', fontWeight: 'bold' }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;