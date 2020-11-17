import { ControllerConfig } from '../types/chains-config';
import { initLRUCache } from './cache/lruCache';

/**
 * Controllers for mandala, acala's test network.
 */
export const mandalaControllers: ControllerConfig = {
	controllers: [
		'AccountsBalanceInfo',
		'AccountsIdentity',
		'AccountsNominations',
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
		minCalcFeeRuntime: null,
		blockWeightStore: {},
		blockStore: initLRUCache(),
	},
};
