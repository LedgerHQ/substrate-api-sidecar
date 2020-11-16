//import { Option, Raw } from '@polkadot/types';
import { BlockHash } from '@polkadot/types/interfaces';
import { IConstants } from 'src/types/responses';

import { AbstractService } from '../AbstractService';

export class RuntimeConstantsService extends AbstractService {
	/**
	 * Fetch constants in decoded JSON form.
	 *
	 * @param hash `BlockHash` to make call at
	 */
	async fetchConstants(hash: BlockHash): Promise<IConstants> {
		const { api } = this;
		const { number } = await this.api.rpc.chain.getHeader(hash)

		return {
			...api.consts,
			at: {
				height: number.unwrap().toString(10),
				hash,
			}
		};
	}
}
