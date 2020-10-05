import { Compact } from '@polkadot/types';
import { Balance, EraIndex } from '@polkadot/types/interfaces';

import { IAt, IValidator } from '.';

export interface INominations {
	at?: IAt;
	submittedIn: EraIndex;
	nominations: INomination[];
}

export interface INomination {
	value: Compact<Balance> | null;
	status: 'active' | 'inactive' | 'waiting';
	validator: IValidator;
}
