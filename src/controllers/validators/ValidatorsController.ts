import { ApiPromise } from '@polkadot/api';
import { RequestHandler } from 'express';

import { ValidatorsService } from '../../services';
import AbstractController from '../AbstractController';

/**
 * GET information about the Substrates node's implementation and versioning.
 *
 * Returns:
 * - `clientVersion`: Node binary version.
 * - `clientImplName`: Node's implementation name.
 * - `chain`: Node's chain name.
 */
export default class ValidatorsController extends AbstractController<
	ValidatorsService
> {
	constructor(api: ApiPromise) {
		super(api, '/validators', new ValidatorsService(api));
		this.initRoutes();
	}

	protected initRoutes(): void {
		this.safeMountAsyncGetHandlers([
			['', this.getValidatorsList],
			['/:address', this.getValidatorDetail],
		]);
	}

	/**
	 * GET information about the Substrates node's implementation and versioning.
	 *
	 * @param _req Express Request
	 * @param res Express Response
	 */
	getValidatorsList: RequestHandler = async (_req, res): Promise<void> => {
		ValidatorsController.sanitizedSend(
			res,
			await this.service.fetchValidatorsList()
		);
	};

	/**
	 * GET information about the Substrates node's implementation and versioning.
	 *
	 * @param _req Express Request
	 * @param res Express Response
	 */
	getValidatorDetail: RequestHandler = async (
		{ params: { address } },
		res
	): Promise<void> => {
		ValidatorsController.sanitizedSend(
			res,
			await this.service.fetchValidatorDetail(address)
		);
	};
}
