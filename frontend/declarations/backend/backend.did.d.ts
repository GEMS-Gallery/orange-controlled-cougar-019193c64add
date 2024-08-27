import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface TaxPayer {
  'tid' : string,
  'address' : string,
  'lastName' : string,
  'firstName' : string,
}
export interface _SERVICE {
  'createTaxPayer' : ActorMethod<[string, string, string, string], undefined>,
  'deleteTaxPayer' : ActorMethod<[string], boolean>,
  'getTaxPayers' : ActorMethod<[], Array<TaxPayer>>,
  'searchTaxPayer' : ActorMethod<[string], [] | [TaxPayer]>,
  'updateTaxPayer' : ActorMethod<[string, string, string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
