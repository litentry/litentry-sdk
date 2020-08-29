import {networkSpecs} from './constant';

export function parseBalance(rawBalance: string): string {
	const networkDecimals = networkSpecs.decimals;
	const integer = rawBalance.slice(0, -networkDecimals);
	const decimal = rawBalance.slice(-networkDecimals, rawBalance.length);
	return `${integer}.${decimal}`;
}
