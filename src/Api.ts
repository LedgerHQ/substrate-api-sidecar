import { ApiPromise } from '@polkadot/api';
import { WsProvider } from '@polkadot/rpc-provider';

import { ISidecarConfigSubstrate } from './types/config';

const RETRY_DELAY = 1000;

export async function createApi(
	SubstrateConfig: ISidecarConfigSubstrate
): Promise<ApiPromise> {
	const wsHeaders = SubstrateConfig.WS_AUTHORIZATION
		? { Authorization: SubstrateConfig.WS_AUTHORIZATION }
		: undefined;

	const api = await ApiPromise.create({
		provider: new WsProvider(
			SubstrateConfig.WS_URL,
			RETRY_DELAY,
			wsHeaders
		),
		types: {
			...SubstrateConfig.CUSTOM_TYPES,
		},
	});

	// Gather some basic details about the node so we can display a nice message
	const [chainName, { implName }] = await Promise.all([
		api.rpc.system.chain(),
		api.rpc.state.getRuntimeVersion(),
	]);

	console.info(
		`Connected to chain ${chainName.toString()} on the ${implName.toString()} client at ${
			SubstrateConfig.WS_URL
		}`
	);

	return api;
}
