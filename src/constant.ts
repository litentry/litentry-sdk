export const graphqlServer = 'graphql.litentry.com';
export const litentryTypes = {
	Address: 'AccountId',
	LookupSource: 'AccountId',
	IdentityOf: {
		id: 'Hash'
	},
	AuthorizedTokenOf: {
		id: 'Hash',
		cost: 'Balance',
		data: 'u64',
		datatype: 'u64',
		expired: 'u64'
	}
};

export const networkSpecs = {
	decimals: 15,
	genesisHash: '0x004db9e47072af71639ed82c43fef1972d324178cb23330a04eac5c3a19b74f8',
	pathId: 'litentry',
	prefix: 0,
	unit: 'LTT'
}
