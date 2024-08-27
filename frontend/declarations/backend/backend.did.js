export const idlFactory = ({ IDL }) => {
  const TaxPayer = IDL.Record({
    'tid' : IDL.Text,
    'address' : IDL.Text,
    'lastName' : IDL.Text,
    'firstName' : IDL.Text,
  });
  return IDL.Service({
    'createTaxPayer' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [],
        [],
      ),
    'getTaxPayers' : IDL.Func([], [IDL.Vec(TaxPayer)], ['query']),
    'searchTaxPayer' : IDL.Func([IDL.Text], [IDL.Opt(TaxPayer)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
