import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Proposal {
  _id: string;
  title: string;
  description: string;
  status: string;
  votesFor: number;
  votesAgainst: number;
  category: string;
  createdAt: string;
}

export default function Governance() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(
          `${apiUrl}/governance/proposals?status=${filter}`
        );
        setProposals(response.data);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [filter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'passed':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8"
    >
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Governance</h1>
        <p className="text-slate-400">Quadratic Voting System</p>
      </header>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-8">
        {['active', 'passed', 'rejected', 'all'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : proposals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No proposals found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {proposals.map((proposal, index) => (
            <motion.div
              key={proposal._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{proposal.title}</h3>
                  <p className="text-slate-300 text-sm mb-3">{proposal.description}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="bg-slate-600 text-slate-200 text-xs px-3 py-1 rounded">
                      {proposal.category}
                    </span>
                    <span className={`${getStatusColor(proposal.status)} text-white text-xs px-3 py-1 rounded`}>
                      {proposal.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Voting Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-600">
                <div>
                  <p className="text-slate-400 text-sm mb-1">For</p>
                  <p className="text-green-400 font-bold text-lg">{proposal.votesFor}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Against</p>
                  <p className="text-red-400 font-bold text-lg">{proposal.votesAgainst}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Date</p>
                  <p className="text-slate-300 font-bold text-lg">
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
