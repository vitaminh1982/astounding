import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Users, TrendingUp, Clock, Zap, Target } from 'lucide-react';
import { MIRANKI_TEAM, MIRANKI_AGENTS, MIRANKI_MILESTONES } from './mirankiMockData';

export default function MirankiOverview() {
  return (
    <div className="space-y-5">
      {/* Project Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 border border-slate-700"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-bold text-white">Miranki</h3>
            <p className="text-sm text-slate-400 mt-0.5">Building a Collective SuperIntelligence Platform</p>
          </div>
          <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-green-900/50 text-green-400 border border-green-700/50">
            Active
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          AI startup development targeting the consulting sector. Starting with Project Managers, expanding to all consultant types and methodologies.
        </p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <p className="text-xl font-bold text-white">35%</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Overall</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">5yr</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Duration</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-white">Y1</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Current</p>
          </div>
        </div>
      </motion.div>

      {/* Key Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'AI Agents', value: '5', icon: Bot, color: 'text-amber-400' },
          { label: 'Team', value: '3', icon: Users, color: 'text-indigo-400' },
          { label: 'Tasks Done', value: '1,670', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Avg Speed', value: '3.1h', icon: Clock, color: 'text-cyan-400' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-slate-800/80 border border-slate-700/50 rounded-lg p-3 flex items-center gap-3"
          >
            <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
            <div>
              <p className="text-sm font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Core Team</h4>
        <div className="space-y-2">
          {MIRANKI_TEAM.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 rounded-lg p-2.5"
            >
              <div className={`w-8 h-8 rounded-full ${member.bgColor} flex items-center justify-center`}>
                <span className={`text-xs font-bold ${member.textColor}`}>{member.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{member.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{member.role.split('&')[0].trim()}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Agent Quick Status */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Agent Status</h4>
        <div className="space-y-1.5">
          {MIRANKI_AGENTS.map((agent) => (
            <div key={agent.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-800/30">
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                agent.status === 'active' ? 'bg-green-500' :
                agent.status === 'processing' ? 'bg-amber-500' : 'bg-slate-500'
              }`} />
              <span className="text-xs font-semibold text-slate-300">{agent.name}</span>
              <span className="text-[10px] text-slate-500 truncate flex-1">{agent.currentTask.slice(0, 40)}...</span>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Roadmap</h4>
        <div className="space-y-2">
          {MIRANKI_MILESTONES.map((milestone) => (
            <div key={milestone.id} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">P{milestone.phase}</span>
                  <span className="text-xs font-medium text-slate-300">{milestone.name}</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  milestone.status === 'in-progress' ? 'bg-blue-900/50 text-blue-400' :
                  milestone.status === 'upcoming' ? 'bg-amber-900/50 text-amber-400' :
                  'bg-slate-700/50 text-slate-500'
                }`}>
                  {milestone.status === 'in-progress' ? 'Active' : milestone.status === 'upcoming' ? 'Next' : 'Planned'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all"
                    style={{ width: `${milestone.progress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-500 w-7 text-right">{milestone.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
