import { ApiPromise } from '@polkadot/api';
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AccountId, EraIndex, RewardPoint } from '@polkadot/types/interfaces';
import { IIdentity, IValidator } from 'src/types/responses';

import { AbstractService } from '../AbstractService';
import { IdentitiesService } from '../identities';

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
		addresses?: AccountId[],
		detailed: Boolean = false
	): Promise<IValidator[]> {
		const { api } = this;

		const [activeOpt, stashes, elected, nextElected] = await Promise.all([
			api.query.staking.activeEra(),
			api.derive.staking.stashes(),
			api.query.session.validators(),
			api.derive.staking.nextElected(),
		]);

		const { index: activeEra } = activeOpt.unwrapOrDefault();

		((_a, _b, _c, _d, _e) => null)(
			activeEra,
			stashes,
			elected,
			nextElected
		);

		const rewards = await this.fetchRewardsPoints(activeEra);

		const stashIds = addresses || elected;

		const [validators, identities] = await Promise.all([
			api.derive.staking.accounts(stashIds),
			this.identitiesService.multiIdentities(stashIds),
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

		const [validator, identity] = await Promise.all([
			api.derive.staking.account(accountId),
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
		validator: DeriveStakingAccount,
		identity: IIdentity,
		rewards: Map<String, RewardPoint>,
		elected: AccountId[],
		detailed: Boolean = false
	): IValidator {
		return {
			accountId: validator.accountId,
			controllerId: validator.controllerId,
			identity,
			own: validator.exposure.own,
			total: validator.exposure.total,
			nominatorsCount: validator.exposure.others.length,
			nominators: detailed ? validator.exposure.others : undefined,
			commission: validator.validatorPrefs.commission,
			redeemable: validator.redeemable,
			rewardsPoints: rewards.get(validator.accountId.toString()) || null,
			isElected: elected.includes(validator.accountId),
		};
	}
}
