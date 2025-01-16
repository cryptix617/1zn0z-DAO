declare module '*.json' {
  const value: {
    abi: any[];
    bytecode: string;
  };
  export default value;
}

interface ContractABI {
  abi: any[];
  bytecode: string;
}

declare module '@contracts/1zn0zToken.json' {
  const TokenContract: ContractABI;
  export default TokenContract;
}

declare module '@contracts/CommunityDAO.json' {
  const DAOContract: ContractABI;
  export default DAOContract;
}

declare module '@contracts/ContributorPool.json' {
  const ContributorPoolContract: ContractABI;
  export default ContributorPoolContract;
}
