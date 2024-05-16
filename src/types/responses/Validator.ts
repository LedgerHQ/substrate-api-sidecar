import { Compact, u128 } from '@polkadot/types';
import {
	AccountId,
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
	own: Compact<u128>;
	total: Compact<u128>;
	nominatorsCount: number;
	nominators?: IndividualExposure[];
	commission: Compact<Perbill>;
	rewardsPoints: RewardPoint | null;
	isElected: Boolean;
	isOversubscribed: Boolean;
}
