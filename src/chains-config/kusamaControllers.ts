import { ControllerConfig } from '../types/chains-config';
import { initLRUCache } from './cache/lruCache';

/**
 * Kusama configuration for Sidecar.
 */
export const kusamaControllers: ControllerConfig = {
	controllers: [
		'AccountsBalanceInfo',
		'AccountsIdentity',
		'AccountsNominations',
		'AccountsStakingInfo',
		'AccountsStakingPayouts',
		'AccountsValidate',
		'AccountsVestingInfo',
		'Blocks',
		'BlocksExtrinsics',
		'BlocksTrace',
		'NodeNetwork',
		'NodeTransactionPool',
		'NodeVersion',
		'PalletsStakingProgress',
		'PalletsStorage',
		'Paras',
		'RuntimeCode',
		'RuntimeConstants',
		'RuntimeMetadata',
		'RuntimeSpec',
		'TransactionDryRun',
		'TransactionFeeEstimate',
		'TransactionMaterial',
		'TransactionSubmit',
		'Validators',
	],
	options: {
		finalizes: true,
		minCalcFeeRuntime: 1062,
		blockStore: initLRUCache(),
	},
};
