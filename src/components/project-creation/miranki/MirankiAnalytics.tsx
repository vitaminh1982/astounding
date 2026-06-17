import React from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { WEEKLY_ACTIVITY, TASK_DISTRIBUTION, PROJECT_HEALTH } from './mirankiMockData';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend, Filler);

export default function MirankiAnalytics() {
  const lineData = {
    labels: WEEKLY_ACTIVITY.map((w) => w.week),
    datasets: [
      { label: 'ARIA', data: WEEKLY_ACTIVITY.map((w) => w.ARIA), borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.1)', tension: 0.4, pointRadius: 2 },
      { label: 'NEXUS', data: WEEKLY_ACTIVITY.map((w) => w.NEXUS), borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.1)', tension: 0.4, pointRadius: 2 },
      { label: 'FORGE', data: WEEKLY_ACTIVITY.map((w) => w.FORGE), borderColor: '#f97316', backgroundColor: 'rgba(249,115,22,0.1)', tension: 0.4, pointRadius: 2 },
      { label: 'DELTA', data: WEEKLY_ACTIVITY.map((w) => w.DELTA), borderColor: '#14b8a6', backgroundColor: 'rgba(20,184,166,0.1)', tension: 0.4, pointRadius: 2 },
      { label: 'ORACLE', data: WEEKLY_ACTIVITY.map((w) => w.ORACLE), borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.1)', tension: 0.4, pointRadius: 2 },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' as const, labels: { boxWidth: 8, padding: 8, font: { size: 9 }, color: '#94a3b8' } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8', borderColor: '#334155', borderWidth: 1 },
    },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 9 } } },
      y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 9 } } },
    },
  };

  const doughnutData = {
    labels: TASK_DISTRIBUTION.map((d) => d.agent),
    datasets: [{
      data: TASK_DISTRIBUTION.map((d) => d.tasks),
      backgroundColor: TASK_DISTRIBUTION.map((d) => d.color),
      borderWidth: 0,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' as const, labels: { boxWidth: 8, padding: 6, font: { size: 9 }, color: '#94a3b8' } },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
    },
    cutout: '60%',
  };

  const healthData = {
    labels: PROJECT_HEALTH.map((h) => h.label),
    datasets: [{
      data: PROJECT_HEALTH.map((h) => h.value),
      backgroundColor: PROJECT_HEALTH.map((h) => h.color + '80'),
      borderColor: PROJECT_HEALTH.map((h) => h.color),
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const healthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#1e293b', titleColor: '#f1f5f9', bodyColor: '#94a3b8' },
    },
    scales: {
      x: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 9 } }, max: 100 },
      y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } },
    },
  };

  return (
    <div className="space-y-4">
      {/* Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4"
      >
        <h4 className="text-xs font-semibold text-slate-300 mb-3">Agent Activity (Last 12 Weeks)</h4>
        <div className="h-48">
          <Line data={lineData} options={lineOptions} />
        </div>
      </motion.div>

      {/* Task Distribution & Health */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4"
        >
          <h4 className="text-xs font-semibold text-slate-300 mb-3">Task Distribution</h4>
          <div className="h-36">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/80 border border-slate-700/50 rounded-xl p-4"
        >
          <h4 className="text-xs font-semibold text-slate-300 mb-3">Project Health</h4>
          <div className="h-36">
            <Bar data={healthData} options={healthOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
