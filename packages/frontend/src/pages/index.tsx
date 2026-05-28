import React from 'react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800"
    >
      <header className="px-6 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Mars Society Kenya DAO</h1>
        <p className="text-xl text-slate-300">Decentralized Governance for Space Exploration</p>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Dashboard Cards */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-700 rounded-lg p-6 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-white mb-2">Governance</h2>
            <p className="text-slate-300">Vote on proposals and shape the future</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-700 rounded-lg p-6 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-white mb-2">Treasury</h2>
            <p className="text-slate-300">Multi-crypto fund management</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-700 rounded-lg p-6 cursor-pointer"
          >
            <h2 className="text-xl font-bold text-white mb-2">Projects</h2>
            <p className="text-slate-300">Space exploration initiatives</p>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}
