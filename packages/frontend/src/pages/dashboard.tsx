import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface DashboardStats {
  totalMembers: number;
  activeProposals: number;
  treasuryValue: number;
  communityContributions: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    activeProposals: 0,
    treasuryValue: 0,
    communityContributions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const [membersRes, proposalsRes, balancesRes] = await Promise.all([
          axios.get(`${apiUrl}/members`),
          axios.get(`${apiUrl}/governance/proposals`),
          axios.get(`${apiUrl}/treasury/balances`),
        ]);

        setStats({
          totalMembers: membersRes.data.length,
          activeProposals: proposalsRes.data.filter((p: any) => p.status === 'active').length,
          treasuryValue: Object.values(balancesRes.data).reduce((acc: number, val: any) => {
            return typeof val === 'number' ? acc + val : acc;
          }, 0),
          communityContributions: membersRes.data.reduce((acc: number, member: any) => {
            return acc + (member.contributionCredits || 0);
          }, 0),
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers, icon: '👥' },
    { label: 'Active Proposals', value: stats.activeProposals, icon: '📋' },
    { label: 'Treasury Value', value: `$${stats.treasuryValue.toLocaleString()}`, icon: '💰' },
    { label: 'Total Contributions', value: stats.communityContributions, icon: '🌟' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">MSK DAO Community Overview</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-slate-700 to-slate-600 rounded-lg p-6 cursor-pointer shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-white text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="text-4xl">{stat.icon}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Proposals */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-700 rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Recent Proposals</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-600 rounded">
              <p className="text-slate-300">Increase research budget</p>
              <span className="text-green-400 text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-600 rounded">
              <p className="text-slate-300">Launch education program</p>
              <span className="text-green-400 text-sm">Voting</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-600 rounded">
              <p className="text-slate-300">Mission fund allocation</p>
              <span className="text-orange-400 text-sm">Draft</span>
            </div>
          </div>
        </motion.div>

        {/* Treasury Overview */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-slate-700 rounded-lg p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Treasury Distribution</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Bitcoin (Reserve)</span>
                <span className="text-orange-400">25%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Ethereum (Operations)</span>
                <span className="text-blue-400">20%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Solana (Rewards)</span>
                <span className="text-purple-400">15%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">USDT (Stablecoin)</span>
                <span className="text-green-400">35%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300">Dogecoin (Community)</span>
                <span className="text-yellow-400">5%</span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
