import { CrudOperators } from './data.type';

export const operatorMapping: Record<CrudOperators, string | undefined> = {
  eq: '=', // Equal
  ne: '!=', // Not Equal
  gt: '>', // Greater than
  gte: '>=', // Greater than or equal
  lt: '<', // Less than
  lte: '<=', // Less than or equal
  contains: '~', // Like/Contains
  ncontains: '!~', // Not Like/Contains
  in: '?=',
  nin: '?!=',
  ina: undefined,
  nina: undefined,
  containss: undefined,
  ncontainss: undefined,
  between: undefined,
  nbetween: undefined,
  null: undefined,
  nnull: undefined,
  startswith: undefined,
  nstartswith: undefined,
  startswiths: undefined,
  nstartswiths: undefined,
  endswith: undefined,
  nendswith: undefined,
  endswiths: undefined,
  nendswiths: undefined,
  or: undefined,
  and: undefined,
  gtAny: '?>',
  gteAny: '?>=',
  ltAny: '?<',
  lteAny: '?<=',
  containsAny: '?~',
  ncontainsAny: '?!~',
};
