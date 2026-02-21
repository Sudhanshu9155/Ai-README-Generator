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
  Line
} from 'recharts';
import { getDashboardStats } from '../../api/analyticsApi';
import Loader from '../common/Loader';

// const COLORS = ['#6366F1', '#8B5CF6', '#06B6D4', '#F59E0B', '#EF4444'];
const COLORS = [
  '#4F46E5', // Indigo
  '#0EA5E9', // Sky Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444'  // Soft Red
];

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
            label: isNaN(dateObj)
              ? d.date
              : formatter.format(dateObj),
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
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [data, series]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md text-center">
        <p className="text-gray-500 text-sm">No analytics data</p>
      </div>
    );
  }

  /* =========================
     LINE CHART LOGIC
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
      .map((title) => ({
        title,
        key: projectMap[title]
      }))
      // 🔥 remove projects with all zero values
      .filter((project) =>
        chartData.some((d) =>
          (d.projects || []).some(
            (p) =>
              p.title === project.title &&
              p.lines > 0
          )
        )
      );

    // fallback single line
    if (!projectList.length) {
      return (
        <LineChart data={chartData}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      );
    }

    const transformed = chartData.map((d) => {
      const row = { label: d.label };

      projectList.forEach((p) => {
        const found = (d.projects || []).find(
          (x) => x.title === p.title
        );
        row[p.key] = found ? found.lines : 0;
      });

      return row;
    });

    const CustomTooltip = ({ active, payload, label }) => {
      if (!active || !payload) return null;

      const visible = payload.filter((p) => p.value > 0);
      if (!visible.length) return null;

      return (
        <div className="bg-white p-2 rounded shadow text-sm">
          <div className="font-semibold mb-1">{label}</div>
          {visible.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center"
            >
              <span>{p.name}</span>
              <span>{p.value}</span>
            </div>
          ))}
        </div>
      );
    };

    return (
      <LineChart data={transformed}>
        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {projectList.map((p, i) => (
          <Line
            key={p.key}
            type="monotone"
            dataKey={p.key}
            name={p.title}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        ))}
      </LineChart>
    );
  };

  /* =========================
     RENDER
  ==========================*/

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        {title}
      </h3>

      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          {type === 'line' ? (
            buildLineChart()
          ) : type === 'bar' ? (
            <BarChart data={chartData}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                innerRadius={40}
                outerRadius={70}
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;