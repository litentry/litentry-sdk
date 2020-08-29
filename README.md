# Litentry SDK

This library provides useful functions to interact with the state on Litentry and user identity data related IPFS Storage.

It helps developer to build client side decentralized applications

## Getting Start 

```
yarn add litentry-sdk

import {hooks, query, ipfsApi} from 'litentry-sdk';

```

## React Hooks for Litentry

```typescript
//Api loading State
hooks.useApi(): boolean

//Get Identities, use updatedIndex to force refresh
hooks.useIdentities(account: string, updateIndex: number): string[]

//Get Identity current owned tokens
hooks.useTokens(identityHash: string): string[]

//Get the owner of the token 
hooks.useTokenOwner(tokenHash: string): string

//Get account balance of LTT 
hooks.useBalance(account: string): string

//Help async function for query issuer Identity of the token
hooks.getTokenIdentity(tokenHash: string): Promise<string>]

//Help async function for getting the last issued identity
hooks.getLastIdentity(account: string): Promise<string | void>

// react hooks for using native extrinsics on Litentry
hooks.useExtrinsics(): {
  	registerIdentity: SubmittableExtrinsicFunction<'promise'>;
  	issueToken: SubmittableExtrinsicFunction<'promise'>;
}

```

## Identity Data Query

Identity data are stored in the IPFS network and cached in Litentry GraphQL data server. 

functions to query the latest data on IPFS:

```typescript
ipfsApi.getAddress(identity: string): Promise<string | null>

ipfsApi.getData(identityId: string): Promise<string[]>

ipfsApi.registerIdentity(identity: string): void
```

functions to construct query http request  from GraphQL:

```typescript
query.getData(identity: string): string

query.setData(identity: string, data: string): string

query.method(methodName: string, identity: string): string 
```

## Develop

```
yarn lint:fix
yarn build
```

## LICENSE
Apache 2.0

