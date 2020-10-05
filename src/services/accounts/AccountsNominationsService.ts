import { ApiPromise } from '@polkadot/api';
import { BlockHash, Nominations } from '@polkadot/types/interfaces';
import { BadRequest } from 'http-errors';
import {
	IAt,
	INomination,
	INominations,
	IValidator,
} from 'src/types/responses';

import { AbstractService } from '../AbstractService';
import { ValidatorsService } from '../validators';

export class AccountsNominationsService extends AbstractService {
	validatorsService: ValidatorsService;
	/**
	 * Construct the service with another dependant service
	 * @param api
	 */
	constructor(protected api: ApiPromise) {
		super(api);
		this.validatorsService = new ValidatorsService(api);
	}

	/**
	 * Fetch nominations for an account at a given block.
	 *
	 * @param hash `BlockHash` to make call at
	 * @param address address of the account to get the vesting info of
	 */
	async fetchNominations(
		hash: BlockHash,
		address: string
	): Promise<INominations | null> {
		const { api } = this;

		const [{ number }, nominationsOpt] = await Promise.all([
			api.rpc.chain.getHeader(hash),
			api.query.staking.nominators.at(hash, address),
		]);

		const at = {
			hash,
			height: number.toNumber().toString(10),
		};

		if (nominationsOpt.isNone) {
			throw new BadRequest(`The account ${address} has no nominations`);
		}

		const nominations = nominationsOpt.unwrap();

		const validators = await this.validatorsService.fetchValidatorsList(
			nominations.targets,
			true
		);

		return this.formatNomination(at, address, nominations, validators);
	}

	private formatNomination(
		at: IAt,
		address: string,
		nominations: Nominations,
		validators: IValidator[]
	): INominations {
		return {
			at,
			submittedIn: nominations.submittedIn,
			nominations: validators.map(
				(v): INomination => {
					const { nominators, ...validator } = v;
					const nominator = nominators?.find(
						(n) => n.who.toString() === address
					);

					const value = nominator?.value || null;

					const status = validator.isElected
						? nominator
							? 'active'
							: 'inactive'
						: 'waiting';

					return {
						value,
						status,
						validator,
					};
				}
			),
		};
	}
}
