import { graphqlServer } from './constant';

const recordKey = 'playgroundRecord';

export function constructDataInsertion(identity: string, data: string): string {
	return `https://${graphqlServer}:4000/graphql?query={addData(identityId:%22${identity}%22,data:"${data}")}`;
}

export function constructGetData(identity: string): string {
	return `https://${graphqlServer}:4000/graphql?query={getData(identityId:%22${identity}%22){${recordKey}}}`;
}

export function constructQuery(methodName: string, identity: string): string {
	return `https://${graphqlServer}:4000/graphql?query={${methodName}(identityId:%22${identity}%22)}`;
}

export default {
	setData: constructDataInsertion,
	getData: constructGetData,
	method: constructQuery
};
