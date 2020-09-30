import { Compact, Vec } from '@polkadot/types';
import {
	AccountId,
	Balance,
	IndividualExposure,
	Perbill,
	RewardPoint,
} from '@polkadot/types/interfaces';

import { IAt, IIdentity } from '.';

export interface IValidator {
	at?: IAt;
	accountId: AccountId;
	controllerId?: AccountId | null;
	identity: IIdentity;
	own: Compact<Balance>;
	total: Compact<Balance>;
	nominatorsCount: number;
	nominators?: Vec<IndividualExposure>;
	commission: Compact<Perbill>;
	redeemable: Balance | undefined;
	rewardsPoints: RewardPoint | null;
	isElected: Boolean;
}
