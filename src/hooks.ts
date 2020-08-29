import { ApiPromise, WsProvider } from '@polkadot/api';
import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { useEffect, useState } from 'react';
import { u64 } from '@polkadot/types';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import { litentryTypes } from './constant';
import { parseBalance } from './utils';

const wsProvider = new WsProvider('wss://ws.litentry.com/');
let hooks: ApiPromise;
const encoder = new TextEncoder();

export function useApi(): boolean {
	const [isApiReady, setApiReady] = useState(false);
	useEffect(() => {
		async function init() {
			try {
				console.log('start connection');
				hooks = await ApiPromise.create({
					provider: wsProvider,
					types: litentryTypes
				});
				await cryptoWaitReady();
				setApiReady(true);
			} catch (error) {
				console.log('ws connect error: ', error);
			}
		}
		init();
	}, []);
	return isApiReady;
}

export async function getLastIdentity(account: string): Promise<string | void> {
	if (account === null || account === '') return;
	const totalNumbersRaw: u64 = await hooks.query.litentry.ownedIdentitiesCount<
		u64
	>(account);
	const totalNumbers = totalNumbersRaw.toNumber();
	const lastIdentityRaw = await hooks.query.litentry.ownedIdentitiesArray([
		account,
		totalNumbers - 1
	]);
	return lastIdentityRaw.toString();
}

export function useIdentities(account: string, updateIndex: number): string[] {
	const [identities, setIdentities] = useState<string[]>([]);
	useEffect(() => {
		async function queryTokenIdentity() {
			if (account === null || account === '') return;
			const totalNumbersRaw: u64 = await hooks.query.litentry.ownedIdentitiesCount<
				u64
			>(account);
			const totalNumbers = totalNumbersRaw.toNumber();
			const a = new Array(totalNumbers).fill(null);
			const promises = a.map((_, i) => {
				return hooks.query.litentry.ownedIdentitiesArray([account, i]);
			});
			console.log('promises are', promises);
			const results = await Promise.all(promises);
			const unwrappedResult: string[] = results.map(wrappedItem =>
				wrappedItem.toString()
			);
			setIdentities(unwrappedResult);
		}
		console.log('start fetch identities');
		queryTokenIdentity();
	}, [account, updateIndex]);
	return identities;
}

export function useReceivedTokens(account: string): string[] {
	const [tokens, setTokens] = useState<string[]>([]);
	useEffect(() => {
		async function fetchTokens() {
			if (account === null || account === '') return;
			const totalNumbersRaw = await hooks.query.litentry.ownedAuthorizedTokensCount<
				u64
			>(account);
			const totalNumbers = totalNumbersRaw.toNumber();
			const a = new Array(totalNumbers).fill(null);
			const promises = a.map((_, i) => {
				return hooks.query.litentry.ownedAuthorizedTokensArray([account, i]);
			});
			console.log('promises are', promises);
			const results = await Promise.all(promises);
			const unwrappedResult = results.map(wrappedItem =>
				wrappedItem.toString()
			);
			setTokens(unwrappedResult);
		}
		fetchTokens();
	}, [account]);
	return tokens;
}

export function useTokens(identityId: string): string[] {
	const [tokens, setTokens] = useState<string[]>([]);
	useEffect(() => {
		async function fetchTokens() {
			if (identityId === null || identityId === '') return;
			const totalNumbersRaw = await hooks.query.litentry.ownedAuthorizedTokensCount<
				u64
			>(identityId);
			const totalNumbers = totalNumbersRaw.toNumber();
			const a = new Array(totalNumbers).fill(null);
			const promises = a.map((_, i) => {
				return hooks.query.litentry.ownedAuthorizedTokensArray([identityId, i]);
			});
			console.log('promises are', promises);
			const results = await Promise.all(promises);
			const unwrappedResult = results.map(wrappedItem =>
				wrappedItem.toString()
			);
			setTokens(unwrappedResult);
		}
		fetchTokens();
	}, [identityId]);
	return tokens;
}

export function useTokenOwner(tokenId: string): string {
	const [owner, setOwner] = useState('');
	useEffect(() => {
		async function queryTokenIdentity(token: string) {
			const result = await hooks.query.litentry.authorizedTokenIdentity(token);
			console.log('get result', result);
			if (result.toString() !== '') {
				setOwner(result.toString());
			}
		}
		queryTokenIdentity(tokenId);
	}, [tokenId]);
	return owner;
}

export function useBalance(account: string): string {
	const [balance, setBalance] = useState('-');
	useEffect(() => {
		async function queryAccountBalance() {
			const { data } = await hooks.query.system.account(account);
			setBalance(parseBalance(data.free.toString()));
		}
		queryAccountBalance();
	}, [account]);
	return balance;
}

export async function getTokenIdentity(token: string) {
	return await hooks.query.litentry.authorizedTokenIdentity(token);
}

type LitentryExtrinsics = {
	registerIdentity: SubmittableExtrinsicFunction<'promise'>;
	issueToken: SubmittableExtrinsicFunction<'promise'>;
};

export function useExtrinsics(): LitentryExtrinsics {
	return {
		registerIdentity: hooks.tx.litentry.registerIdentity,
		issueToken: hooks.tx.litentry.issueToken
	};
}

export default {
	useApi,
	useIdentities,
	useTokens,
	useTokenOwner,
	useBalance,
	useExtrinsics,
	useReceivedTokens,
	getTokenIdentity,
	getLastIdentity
}
