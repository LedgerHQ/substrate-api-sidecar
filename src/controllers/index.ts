import {
	AccountsAssets,
	AccountsBalanceInfo,
	AccountsIdentity,
	AccountsStakingInfo,
	AccountsStakingPayouts,
	AccountsValidate,
	AccountsVestingInfo,
} from './accounts';
import { Blocks, BlocksExtrinsics, BlocksTrace } from './blocks';
import { NodeNetwork, NodeTransactionPool, NodeVersion } from './node';
import {
	PalletsAssets,
	PalletsStakingProgress,
	PalletsStorage,
} from './pallets';
import { Paras } from './paras';
import {
	RuntimeCode,
	RuntimeConstants,
	RuntimeMetadata,
	RuntimeSpec,
} from './runtime';
import {
	TransactionDryRun,
	TransactionFeeEstimate,
	TransactionMaterial,
	TransactionSubmit,
} from './transaction';

/**
 * Object containing every controller class definition.
 */
export const controllers = {
	Blocks,
	BlocksExtrinsics,
	BlocksTrace,
	AccountsAssets,
	AccountsBalanceInfo,
	AccountsIdentity,
	AccountsStakingInfo,
	AccountsValidate,
	AccountsVestingInfo,
	AccountsStakingPayouts,
	PalletsAssets,
	PalletsStakingProgress,
	PalletsStorage,
	NodeNetwork,
	NodeTransactionPool,
	NodeVersion,
	RuntimeCode,
	RuntimeConstants,
	RuntimeMetadata,
	RuntimeSpec,
	TransactionDryRun,
	TransactionFeeEstimate,
	TransactionMaterial,
	TransactionSubmit,
	Paras,
};
