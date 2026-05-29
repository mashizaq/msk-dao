import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Member {
  _id: string;
  username: string;
  email: string;
  walletAddress: string;
  contributionCredits: number;
  role: string;
  profile: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
  };
  governance: {
    votingPower: number;
    proposalsCreated: number;
    votesParticipated: number;
  };
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await axios.get(`${apiUrl}/members`);
        setMembers(response.data);
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500';
      case 'council':
        return 'bg-purple-500';
      default:
        return 'bg-blue-500';
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
        <h1 className="text-4xl font-bold text-white mb-2">Community Members</h1>
        <p className="text-slate-400">Total Members: {members.length}</p>
      </header>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-slate-700 text-white rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-700 rounded-lg p-6 hover:bg-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white">
                    {member.profile.firstName} {member.profile.lastName}
                  </h3>
                  <p className="text-slate-400 text-sm">@{member.username}</p>
                </div>
                <span className={`${getRoleColor(member.role)} text-white text-xs px-3 py-1 rounded-full font-semibold`}>
                  {member.role}
                </span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-slate-600">
                <p className="text-slate-300 text-sm truncate">{member.email}</p>
                <p className="text-slate-400 text-xs truncate font-mono">{member.walletAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Credits</p>
                  <p className="text-white font-bold text-lg">{member.contributionCredits}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Voting Power</p>
                  <p className="text-blue-400 font-bold text-lg">
                    {Math.sqrt(member.contributionCredits).toFixed(1)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Proposals</p>
                  <p className="text-green-400 font-bold">{member.governance.proposalsCreated}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Votes</p>
                  <p className="text-purple-400 font-bold">{member.governance.votesParticipated}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
