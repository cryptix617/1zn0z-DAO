declare module '@metamask/sdk-react' {
  export interface MetaMaskState {
    account: string | null;
    chainId: number | null;
    isConnected: boolean;
  }

  export interface MetaMaskContextValue {
    metaState: MetaMaskState;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
  }

  export function useMetaMask(): MetaMaskContextValue;
}

declare global {
  interface Window {
    ethereum?: {
      request: (request: { method: string; params?: any[] }) => Promise<any>;
      isMetaMask: boolean;
    };
  }
}
