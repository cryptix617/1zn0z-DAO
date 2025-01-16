import { ethers } from 'ethers';

export interface Proposal {
  id: number;
  proposer: string;
  description: string;
  votesFor: number;
  votesAgainst: number;
  deadline: number;
  executed: boolean;
}

export class DAOService {
  private daoEngine: ethers.Contract;

  constructor(contract: ethers.Contract) {
    this.daoEngine = contract;
  }

  async createProposal(
    description: string, 
    votingPeriod: number
  ): Promise<number> {
    try {
      const tx = await this.daoEngine.createProposal(description, votingPeriod);
      const receipt = await tx.wait();
      
      // Extract proposal ID from event logs
      const proposalCreatedEvent = receipt.events?.find(
        (event: any) => event.event === 'ProposalCreated'
      );
      
      return proposalCreatedEvent ? proposalCreatedEvent.args[0].toNumber() : -1;
    } catch (error) {
      console.error('Proposal creation failed', error);
      throw error;
    }
  }

  async voteOnProposal(
    proposalId: number, 
    support: boolean
  ): Promise<void> {
    try {
      const tx = await this.daoEngine.vote(proposalId, support);
      await tx.wait();
    } catch (error) {
      console.error('Voting failed', error);
      throw error;
    }
  }

  async executeProposal(proposalId: number): Promise<void> {
    try {
      const tx = await this.daoEngine.executeProposal(proposalId);
      await tx.wait();
    } catch (error) {
      console.error('Proposal execution failed', error);
      throw error;
    }
  }

  async getProposalDetails(proposalId: number): Promise<Proposal> {
    try {
      const proposal = await this.daoEngine.getProposalDetails(proposalId);
      return {
        id: proposalId,
        proposer: proposal.proposer,
        description: proposal.description,
        votesFor: proposal.votesFor.toNumber(),
        votesAgainst: proposal.votesAgainst.toNumber(),
        deadline: proposal.deadline.toNumber(),
        executed: proposal.executed
      };
    } catch (error) {
      console.error('Fetching proposal details failed', error);
      throw error;
    }
  }

  async assignContributorRole(contributorAddress: string): Promise<void> {
    try {
      const tx = await this.daoEngine.assignContributorRole(contributorAddress);
      await tx.wait();
    } catch (error) {
      console.error('Assigning contributor role failed', error);
      throw error;
    }
  }

  async isContributor(address: string): Promise<boolean> {
    try {
      return await this.daoEngine.isContributor(address);
    } catch (error) {
      console.error('Checking contributor status failed', error);
      throw error;
    }
  }
}
