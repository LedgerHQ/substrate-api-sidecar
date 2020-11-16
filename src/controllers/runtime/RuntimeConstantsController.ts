import { ApiPromise } from '@polkadot/api';
import { RequestHandler } from 'express';

import { RuntimeConstantsService } from '../../services';
import AbstractController from '../AbstractController';

/**
 * Get blockchain constants of the Substrate runtime.
 *
 * Query:
 * - (Optional)`at`: Block at which to retrieve runtime constants information. Block
 * 		identifier, as the block height or block hash. Defaults to most recent block.
 *
 * TODO
 * 
 * Returns:
 * - `at`: Block number and hash at which the call was made.
 * - `authoringVersion`: The version of the authorship interface. An authoring node
 *    will not attempt to author blocks unless this is equal to its native runtime.
 * - `chainType`: Type of the chain.
 * - `implVersion`: Version of the implementation specification. Non-consensus-breaking
 * 		optimizations are about the only changes that could be made which would
 * 		result in only the `impl_version` changing. The `impl_version` is set to 0
 * 		when `spec_version` is incremented.
 * - `specName`: Identifies the spec name for the current runtime.
 * - `specVersion`: Version of the runtime specification.
 * - `transactionVersion`: All existing dispatches are fully compatible when this
 * 		number doesn't change. This number must change when an existing dispatchable
 * 		(module ID, dispatch ID) is changed, either through an alteration in its
 * 		user-level semantics, a parameter added/removed/changed, a dispatchable
 * 		its index.
 * - `properties`: Arbitrary properties defined in the chain spec.
 */
export default class RuntimeConstantsController extends AbstractController<
	RuntimeConstantsService
> {
	constructor(api: ApiPromise) {
		super(api, '/runtime/constants', new RuntimeConstantsService(api)); // TODO
		this.initRoutes();
	}

	protected initRoutes(): void {
		this.safeMountAsyncGetHandlers([['', this.getConstants]]);
	}

	private getConstants: RequestHandler = async ({ query: { at } }, res) => {
		const hash = await this.getHashFromAt(at);

		RuntimeConstantsController.sanitizedSend(
			res,
			await this.service.fetchConstants(hash)
		);
	};
}
