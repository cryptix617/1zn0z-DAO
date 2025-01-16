import React, { useState, useEffect, useCallback } from 'react';
import { useMetaMask } from '@metamask/sdk-react';
import { ethers } from 'ethers';

// Import contract ABIs
import TokenABI from '@contracts/1zn0zToken.json';
import DAOAbi from '@contracts/CommunityDAO.json';
import ContributorPoolABI from '@contracts/ContributorPool.json';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request?: (...args: any[]) => Promise<void>;
    };
  }
}

// Contract addresses from deployment
const CONTRACT_ADDRESSES = {
  token: '0x...',  // Replace with actual deployed address
  dao: '0x...',
  contributorPool: '0x...'
};

const App: React.FC = () => {
  const { metaState, connect } = useMetaMask();
  const [dashboardData, setDashboardData] = useState({
    tokenPrice: 0,
    totalSupply: 0,
    circulatingSupply: 0,
    governanceStats: {
      activeProposals: 0,
      totalProposals: 0,
      participationRate: 0
    },
    contributorPool: {
      totalContributors: 0,
      totalFunds: 0
    }
  });

  const [userRole, setUserRole] = useState({
    isAdmin: false,
    isContributor: false,
    tokenBalance: 0
  });

  const [contracts, setContracts] = useState<{
    token: ethers.Contract | null,
    dao: ethers.Contract | null,
    contributorPool: ethers.Contract | null
  }>({
    token: null,
    dao: null,
    contributorPool: null
  });

  const initializeContracts = useCallback(async () => {
    if (metaState.isConnected && window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();

      const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES.token, 
        TokenABI.abi, 
        signer
      );

      const daoContract = new ethers.Contract(
        CONTRACT_ADDRESSES.dao, 
        DAOAbi.abi, 
        signer
      );

      const contributorPoolContract = new ethers.Contract(
        CONTRACT_ADDRESSES.contributorPool, 
        ContributorPoolABI.abi, 
        signer
      );

      setContracts({
        token: tokenContract,
        dao: daoContract,
        contributorPool: contributorPoolContract
      });

      // Example of fetching user role
      try {
        const account = await signer.getAddress();
        const isAdmin = await daoContract.isAdmin(account);
        const isContributor = await contributorPoolContract.isContributor(account);
        
        setUserRole({
          isAdmin,
          isContributor,
          tokenBalance: await tokenContract.balanceOf(account)
        });
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    }
  }, [metaState.isConnected]);

  useEffect(() => {
    initializeContracts();
  }, [initializeContracts]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Implement real-time data fetching from contracts
      // This is a placeholder - replace with actual contract interactions
      if (contracts.token && contracts.dao && contracts.contributorPool) {
        const totalSupply = await contracts.token.totalSupply();
        const circulatingSupply = await contracts.token.circulatingSupply();
        const activeProposals = await contracts.dao.getActiveProposals();
        const totalProposals = await contracts.dao.getTotalProposals();
        const participationRate = await contracts.dao.getParticipationRate();
        const totalContributors = await contracts.contributorPool.getTotalContributors();
        const totalFunds = await contracts.contributorPool.getTotalFunds();

        setDashboardData({
          tokenPrice: 0.05, // Example
          totalSupply: totalSupply.toNumber(),
          circulatingSupply: circulatingSupply.toNumber(),
          governanceStats: {
            activeProposals: activeProposals.toNumber(),
            totalProposals: totalProposals.toNumber(),
            participationRate: participationRate.toNumber()
          },
          contributorPool: {
            totalContributors: totalContributors.toNumber(),
            totalFunds: totalFunds.toNumber()
          }
        });
      }
    };

    if (metaState.isConnected) {
      fetchDashboardData();
    }
  }, [metaState.isConnected, contracts]);

  const renderAdminPanel = () => (
    <div className="admin-panel">
      <h2>Admin Management</h2>
      <div className="admin-actions">
        <button>Mint Tokens</button>
        <button>Manage Contributors</button>
        <button>Update Governance Parameters</button>
      </div>
    </div>
  );

  const renderContributorDashboard = () => (
    <div className="contributor-dashboard">
      <h2>Contributor Dashboard</h2>
      <div className="contribution-stats">
        <p>Total Contributors: {dashboardData.contributorPool.totalContributors}</p>
        <p>Available Funds: ${dashboardData.contributorPool.totalFunds.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="dao-management-dashboard">
      <header>
        <h1>1zn0z DAO Control Center</h1>
        {!metaState.isConnected ? (
          <button onClick={() => connect()}>Connect Wallet</button>
        ) : (
          <div className="wallet-info">
            <p>Connected: {metaState.account}</p>
          </div>
        )}
      </header>

      <main>
        <section className="overview-metrics">
          <div className="metric-card">
            <h3>Token Price</h3>
            <p>${dashboardData.tokenPrice.toFixed(2)}</p>
          </div>
          <div className="metric-card">
            <h3>Total Supply</h3>
            <p>{dashboardData.totalSupply.toLocaleString()}</p>
          </div>
          <div className="metric-card">
            <h3>Governance Participation</h3>
            <p>{dashboardData.governanceStats.participationRate}%</p>
          </div>
        </section>

        {userRole.isAdmin && renderAdminPanel()}
        {userRole.isContributor && renderContributorDashboard()}
      </main>

      <footer>
        <p>1zn0z DAO - Decentralized Governance Platform</p>
      </footer>
    </div>
  );
};

export default App;
