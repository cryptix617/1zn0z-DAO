'use client';

import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import { DAOService } from '../services/DAOService';

export default function Home() {
  const { 
    account, 
    connectWallet, 
    daoEngine, 
    isConnected 
  } = useWeb3();
  
  const [daoService, setDaoService] = useState<DAOService | null>(null);
  const [proposalDescription, setProposalDescription] = useState('');
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    if (daoEngine) {
      setDaoService(new DAOService(daoEngine));
    }
  }, [daoEngine]);

  const handleCreateProposal = async () => {
    if (!daoService) return;

    try {
      // 7 days voting period
      const proposalId = await daoService.createProposal(
        proposalDescription, 
        7 * 24 * 60 * 60
      );
      
      alert(`Proposal created with ID: ${proposalId}`);
      setProposalDescription('');
    } catch (error) {
      console.error('Proposal creation failed', error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          1zn0z DAO Dashboard
        </h1>

        {!isConnected ? (
          <div className="flex justify-center">
            <button 
              onClick={connectWallet}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Connect Wallet
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl mb-4">Connected Account</h2>
              <p className="text-gray-700">{account}</p>
            </div>

            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-2xl mb-4">Create Proposal</h2>
              <textarea
                value={proposalDescription}
                onChange={(e) => setProposalDescription(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter proposal description"
              />
              <button
                onClick={handleCreateProposal}
                className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
