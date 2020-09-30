import { ControllerConfig } from '../types/chains-config';
import { initLRUCache } from './cache/lruCache';
import { getBlockWeight } from './metadata-consts';

/**
 * Westend configuration for Sidecar.
 */
export const westendControllers: ControllerConfig = {
	controllers: [
		'AccountsBalanceInfo',
		'AccountsIdentity',
		'AccountsStakingInfo',
		'AccountsStakingPayouts',
		'AccountsVestingInfo',
		'Blocks',
		'BlocksExtrinsics',
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
		minCalcFeeRuntime: 6,
		blockWeightStore: getBlockWeight('westend'),
		blockStore: initLRUCache(),
	},
};
