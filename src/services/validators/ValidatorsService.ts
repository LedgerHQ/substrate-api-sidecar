import { ApiPromise } from '@polkadot/api';
import { DeriveStakingQuery } from '@polkadot/api-derive/types';
import { AccountId, EraIndex, RewardPoint } from '@polkadot/types/interfaces';
import { BadRequest } from 'http-errors';
import { IIdentity, IValidator } from 'src/types/responses';

import { AbstractService } from '../AbstractService';
import { IdentitiesService } from '../identities';

const QUERY_OPTS = {
	withExposure: true,
	withLedger: true,
	withPrefs: true,
};

export class ValidatorsService extends AbstractService {
	identitiesService: IdentitiesService;
	/**
	 * Construct the serivce with another dependant service
	 * @param api
	 */
	constructor(protected api: ApiPromise) {
		super(api);
		this.identitiesService = new IdentitiesService(api);
	}

	/**
	 * Fetch the list of all validators
	 */
	async fetchValidatorsList(
		status = 'all',
		addresses?: string[],
		detailed: Boolean = false
	): Promise<IValidator[]> {
		const { api } = this;

		const [
			activeOpt,
			allStashes,
			elected,
			nextElected,
		] = await Promise.all([
			api.query.staking.activeEra(),
			api.derive.staking.stashes(),
			api.query.session.validators(),
			api.derive.staking.nextElected(),
		]);

		const { index: activeEra } = activeOpt.unwrapOrDefault();

		const rewards = await this.fetchRewardsPoints(activeEra);

		let selected: string[] = [];
		const allIds = allStashes.map((s) => s.toString());
		const electedIds = elected.map((s) => s.toString());

		if (status) {
			switch (status) {
				case 'elected':
					selected = electedIds;
					break;
				case 'waiting': {
					const waitingIds = allIds.filter(
						(v) => !electedIds.includes(v)
					);
					selected = waitingIds;
					break;
				}
				case 'nextElected':
					selected = nextElected.map((s) => s.toString());
					break;
				case 'all': {
					const waitingIds = allIds.filter(
						(v) => !electedIds.includes(v)
					);
					// Keep order of elected validators
					selected = [...electedIds, ...waitingIds];
					break;
				}
				default:
					throw new BadRequest(`Status ${status} is unknown`);
			}
		}

		if (addresses) {
			selected = addresses
				.map((a) => a.toString())
				.filter((address) => selected.includes(address.toString()));
		}

		const [validators, identities] = await Promise.all([
			api.derive.staking.queryMulti(selected, QUERY_OPTS),
			this.identitiesService.multiIdentities(selected),
		]);

		return validators.map((validator, index) =>
			this.formatValidator(
				validator,
				identities[index],
				rewards,
				elected,
				detailed
			)
		);
	}

	/**
	 * Fetch a single validator
	 *
	 * @param accountId - validator's address
	 */
	async fetchValidatorDetail(
		accountId: AccountId | string
	): Promise<IValidator> {
		const { api } = this;

		const [activeOpt, elected] = await Promise.all([
			api.query.staking.activeEra(),
			api.query.session.validators(),
		]);

		const { index: activeEra } = activeOpt.unwrapOrDefault();

		const rewards = await this.fetchRewardsPoints(activeEra);

		const [[validator], identity] = await Promise.all([
			api.derive.staking.queryMulti([accountId], QUERY_OPTS),
			this.identitiesService.fetchIdentity(accountId),
		]);

		return this.formatValidator(
			validator,
			identity,
			rewards,
			elected,
			true
		);
	}

	private async fetchRewardsPoints(
		activeEra: EraIndex
	): Promise<Map<String, RewardPoint>> {
		const { individual } = await this.api.query.staking.erasRewardPoints(
			activeEra
		);

		// recast BTreeMap<AccountId,RewardPoint> to Map<String, RewardPoint> because strict equality does not work
		const rewards = new Map<String, RewardPoint>(
			[...individual.entries()].map(([k, v]) => [k.toString(), v])
		);

		return rewards;
	}

	private formatValidator(
		validator: DeriveStakingQuery,
		identity: IIdentity,
		rewards: Map<String, RewardPoint>,
		elected: AccountId[],
		detailed: Boolean = false
	): IValidator {
		const maxNominatorRewardedPerValidator = this.api.consts?.staking
			?.maxNominatorRewardedPerValidator;

		return {
			accountId: validator.accountId,
			controllerId: validator.controllerId,
			identity,
			own: validator.exposure.own,
			total: validator.exposure.total,
			nominatorsCount: validator.exposure.others.length,
			nominators: detailed ? validator.exposure.others : undefined,
			commission: validator.validatorPrefs.commission,
			rewardsPoints: rewards.get(validator.accountId.toString()) || null,
			isElected: elected.includes(validator.accountId),
			isOversubscribed: maxNominatorRewardedPerValidator
				? validator.exposure.others.length >
				  Number(maxNominatorRewardedPerValidator)
				: false,
		};
	}
}
