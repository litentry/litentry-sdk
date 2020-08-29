import { constructGetData, constructQuery } from './query';

export async function getAddress(identity: string): Promise<string | null> {
	const maximalQuery = 5;
	let query = 0;
	let result = null;
	const queryUrl = constructQuery('determineAddress', identity);
	while (query < maximalQuery) {
		try {
			const response = await fetch(queryUrl);
			const json = await response.json();
			const fetchedData = json.data.determineAddress;
			if (fetchedData.indexOf('/orbitdb') !== -1) {
				result = fetchedData;
				break;
			} else {
				query++;
			}
		} catch (error) {
			return null;
		}
	}
	return result;
}

export function registerIdentity(identity: string): void {
	const queryUrl = constructQuery('registerIdentity', identity);
	fetch(queryUrl);
}

export async function getData(identityId: string): Promise<string[]> {
	const queryUrl = constructGetData(identityId);
	try {
		const response = await fetch(queryUrl);
		const json = await response.json();
		return json.data.getData;
	} catch (e) {
		return [];
	}
}

export default {
	registerIdentity,
	getData,
	getAddress
};
