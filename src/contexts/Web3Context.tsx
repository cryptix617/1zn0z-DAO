'use client';

import React, { 
  createContext, 
  useState, 
  useContext, 
  useEffect, 
  ReactNode 
} from 'react';
import { ethers } from 'ethers';
import DAOEngineABI from '../../artifacts/contracts/DAOEngine.sol/DAOEngine.json';
import ContributionTrackerABI from '../../artifacts/contracts/ContributionTracker.sol/ContributionTracker.json';

// Define types for context
interface Web3ContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  daoEngine: ethers.Contract | null;
  contributionTracker: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  daoEngine: null,
  contributionTracker: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
});

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [daoEngine, setDaoEngine] = useState<ethers.Contract | null>(null);
  const [contributionTracker, setContributionTracker] = useState<ethers.Contract | null>(null);

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!(window as any).ethereum) {
        alert('Please install MetaMask');
        return;
      }

      // Request account access
      const accounts = await (window as any).ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      const web3Provider = new ethers.providers.Web3Provider((window as any).ethereum);
      const signer = web3Provider.getSigner();

      // Initialize contracts
      const daoEngineContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DAO_ENGINE_CONTRACT!, 
        DAOEngineABI.abi, 
        signer
      );

      const contributionTrackerContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRIBUTION_TRACKER_CONTRACT!, 
        ContributionTrackerABI.abi, 
        signer
      );

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setDaoEngine(daoEngineContract);
      setContributionTracker(contributionTrackerContract);

    } catch (error) {
      console.error('Wallet connection failed', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setDaoEngine(null);
    setContributionTracker(null);
  };

  // Listen for account changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        disconnectWallet();
      }
    };

    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  return (
    <Web3Context.Provider value={{
      account,
      provider,
      daoEngine,
      contributionTracker,
      connectWallet,
      disconnectWallet,
      isConnected: !!account
    }}>
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook for using Web3 context
export const useWeb3 = () => useContext(Web3Context);
