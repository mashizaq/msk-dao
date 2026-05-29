import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface Balance {
  currency: string;
  amount: number;
  chain: string;
}

interface TreasuryData {
  BTC: number;
  ETH: number;
  SOL: number;
  USDT: number;
  DOGE: number;
  balances: Balance[];
}

export default function Treasury() {
  const [treasury, setTreasury] = useState<TreasuryData>({
    BTC: 0,
    ETH: 0,
    SOL: 0,
    USDT: 0,
    DOGE: 0,
    balances: [],
  });
  const [loading, setLoading] = useState(true);
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        const [balancesRes, pricesRes] = await Promise.all([
          axios.get(`${apiUrl}/treasury/balances`),
          axios.get(`${apiUrl}/crypto/prices`),
        ]);

        setTreasury(balancesRes.data);
        
        const priceMap: { [key: string]: number } = {};
        pricesRes.data.forEach((price: any) => {
          priceMap[price.currency] = price.price;
        });
        setPrices(priceMap);
      } catch (error) {
        console.error('Error fetching treasury data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', color: 'from-orange-600 to-orange-400', description: 'Reserve/Cold Storage' },
    { symbol: 'ETH', name: 'Ethereum', color: 'from-blue-600 to-blue-400', description: 'Governance & Contracts' },
    { symbol: 'SOL', name: 'Solana', color: 'from-purple-600 to-purple-400', description: 'Rewards Distribution' },
    { symbol: 'USDT', name: 'Tether', color: 'from-green-600 to-green-400', description: 'Operational Funds' },
    { symbol: 'DOGE', name: 'Dogecoin', color: 'from-yellow-600 to-yellow-400', description: 'Community Engagement' },
  ];

  const calculateUSDValue = (amount: number, currency: string) => {
    return (amount * (prices[currency] || 0)).toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-8"
    >
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">Treasury</h1>
        <p className="text-slate-400">Multi-Crypto Fund Management</p>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {cryptoAssets.map((asset, index) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${asset.color} rounded-lg p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">{asset.name}</h3>
                  <span className="text-2xl font-bold opacity-80">{asset.symbol}</span>
                </div>
                <p className="text-sm opacity-80 mb-3">{asset.description}</p>
                <div className="bg-black bg-opacity-20 rounded p-3">
                  <p className="text-sm opacity-70">Balance</p>
                  <p className="text-2xl font-bold">
                    {treasury[asset.symbol as keyof TreasuryData].toFixed(4)} {asset.symbol}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    ≈ ${calculateUSDValue(
                      treasury[asset.symbol as keyof TreasuryData],
                      asset.symbol
                    )}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Balances Table */}
          <motion.div
            className="bg-slate-700 rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-600 border-b border-slate-500">
                    <th className="px-6 py-4 text-left text-slate-200 font-semibold">Currency</th>
                    <th className="px-6 py-4 text-left text-slate-200 font-semibold">Balance</th>
                    <th className="px-6 py-4 text-left text-slate-200 font-semibold">USD Value</th>
                    <th className="px-6 py-4 text-left text-slate-200 font-semibold">Chain</th>
                  </tr>
                </thead>
                <tbody>
                  {treasury.balances.map((balance, index) => (
                    <tr key={index} className="border-b border-slate-600 hover:bg-slate-600 transition-colors">
                      <td className="px-6 py-4 text-white font-semibold">{balance.currency}</td>
                      <td className="px-6 py-4 text-slate-300">{balance.amount.toFixed(4)}</td>
                      <td className="px-6 py-4 text-green-400">
                        ${calculateUSDValue(balance.amount, balance.currency)}
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-sm">{balance.chain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
