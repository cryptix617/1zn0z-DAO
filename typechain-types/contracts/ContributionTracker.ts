/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface ContributionTrackerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "contributionCount"
      | "contributions"
      | "getContributorContributions"
      | "logContribution"
      | "owner"
      | "renounceOwnership"
      | "rewardContribution"
      | "rewardRates"
      | "rewardToken"
      | "transferOwnership"
      | "updateRewardRate"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ContributionLogged"
      | "ContributionRewarded"
      | "OwnershipTransferred"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "contributionCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "contributions",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getContributorContributions",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "logContribution",
    values: [AddressLike, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "rewardContribution",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "rewardRates", values: [string]): string;
  encodeFunctionData(
    functionFragment: "rewardToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateRewardRate",
    values: [string, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "contributionCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "contributions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getContributorContributions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "logContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardContribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardRates",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "rewardToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateRewardRate",
    data: BytesLike
  ): Result;
}

export namespace ContributionLoggedEvent {
  export type InputTuple = [
    contributionId: BigNumberish,
    contributor: AddressLike,
    contributionType: string,
    value: BigNumberish
  ];
  export type OutputTuple = [
    contributionId: bigint,
    contributor: string,
    contributionType: string,
    value: bigint
  ];
  export interface OutputObject {
    contributionId: bigint;
    contributor: string;
    contributionType: string;
    value: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ContributionRewardedEvent {
  export type InputTuple = [
    contributionId: BigNumberish,
    contributor: AddressLike,
    rewardAmount: BigNumberish
  ];
  export type OutputTuple = [
    contributionId: bigint,
    contributor: string,
    rewardAmount: bigint
  ];
  export interface OutputObject {
    contributionId: bigint;
    contributor: string;
    rewardAmount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace OwnershipTransferredEvent {
  export type InputTuple = [previousOwner: AddressLike, newOwner: AddressLike];
  export type OutputTuple = [previousOwner: string, newOwner: string];
  export interface OutputObject {
    previousOwner: string;
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface ContributionTracker extends BaseContract {
  connect(runner?: ContractRunner | null): ContributionTracker;
  waitForDeployment(): Promise<this>;

  interface: ContributionTrackerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  contributionCount: TypedContractMethod<[], [bigint], "view">;

  contributions: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, bigint, boolean] & {
        contributor: string;
        contributionType: string;
        value: bigint;
        timestamp: bigint;
        rewarded: boolean;
      }
    ],
    "view"
  >;

  getContributorContributions: TypedContractMethod<
    [_contributor: AddressLike],
    [bigint[]],
    "view"
  >;

  logContribution: TypedContractMethod<
    [
      _contributor: AddressLike,
      _contributionType: string,
      _value: BigNumberish
    ],
    [bigint],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  renounceOwnership: TypedContractMethod<[], [void], "nonpayable">;

  rewardContribution: TypedContractMethod<
    [_contributionId: BigNumberish],
    [void],
    "nonpayable"
  >;

  rewardRates: TypedContractMethod<[arg0: string], [bigint], "view">;

  rewardToken: TypedContractMethod<[], [string], "view">;

  transferOwnership: TypedContractMethod<
    [newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateRewardRate: TypedContractMethod<
    [_contributionType: string, _newRate: BigNumberish],
    [void],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "contributionCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "contributions"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, bigint, boolean] & {
        contributor: string;
        contributionType: string;
        value: bigint;
        timestamp: bigint;
        rewarded: boolean;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "getContributorContributions"
  ): TypedContractMethod<[_contributor: AddressLike], [bigint[]], "view">;
  getFunction(
    nameOrSignature: "logContribution"
  ): TypedContractMethod<
    [
      _contributor: AddressLike,
      _contributionType: string,
      _value: BigNumberish
    ],
    [bigint],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "renounceOwnership"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rewardContribution"
  ): TypedContractMethod<[_contributionId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "rewardRates"
  ): TypedContractMethod<[arg0: string], [bigint], "view">;
  getFunction(
    nameOrSignature: "rewardToken"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateRewardRate"
  ): TypedContractMethod<
    [_contributionType: string, _newRate: BigNumberish],
    [void],
    "nonpayable"
  >;

  getEvent(
    key: "ContributionLogged"
  ): TypedContractEvent<
    ContributionLoggedEvent.InputTuple,
    ContributionLoggedEvent.OutputTuple,
    ContributionLoggedEvent.OutputObject
  >;
  getEvent(
    key: "ContributionRewarded"
  ): TypedContractEvent<
    ContributionRewardedEvent.InputTuple,
    ContributionRewardedEvent.OutputTuple,
    ContributionRewardedEvent.OutputObject
  >;
  getEvent(
    key: "OwnershipTransferred"
  ): TypedContractEvent<
    OwnershipTransferredEvent.InputTuple,
    OwnershipTransferredEvent.OutputTuple,
    OwnershipTransferredEvent.OutputObject
  >;

  filters: {
    "ContributionLogged(uint256,address,string,uint256)": TypedContractEvent<
      ContributionLoggedEvent.InputTuple,
      ContributionLoggedEvent.OutputTuple,
      ContributionLoggedEvent.OutputObject
    >;
    ContributionLogged: TypedContractEvent<
      ContributionLoggedEvent.InputTuple,
      ContributionLoggedEvent.OutputTuple,
      ContributionLoggedEvent.OutputObject
    >;

    "ContributionRewarded(uint256,address,uint256)": TypedContractEvent<
      ContributionRewardedEvent.InputTuple,
      ContributionRewardedEvent.OutputTuple,
      ContributionRewardedEvent.OutputObject
    >;
    ContributionRewarded: TypedContractEvent<
      ContributionRewardedEvent.InputTuple,
      ContributionRewardedEvent.OutputTuple,
      ContributionRewardedEvent.OutputObject
    >;

    "OwnershipTransferred(address,address)": TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
    OwnershipTransferred: TypedContractEvent<
      OwnershipTransferredEvent.InputTuple,
      OwnershipTransferredEvent.OutputTuple,
      OwnershipTransferredEvent.OutputObject
    >;
  };
}
