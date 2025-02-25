/* eslint-disable @typescript-eslint/no-explicit-any */
import { SendOptions } from 'pocketbase';
import { HttpError } from './auth.type';

export type Params<T = { [key: string]: any }> = {
  collection: string;
  id: string;
  params: T;
  signal?: AbortSignal; // Add signal here if you need it for canceling requests
};

export type Response<T> = {
  data: T;
};

export type BaseVariable = {
  [key: string]: any;
};

export interface Pagination {
  pageCurrent?: number;
  pageSize?: number;
  totalItems?: number;
  totalPages?: number;
}

export type CrudSort = {
  field: string;
  order: 'asc' | 'desc';
};

export type GetListResponse<TData> = Pagination & {
  data: TData[];
};

export type CrudOperators =
  | 'eq' // `=` Equal
  | 'ne' // `!=` Not Equal
  | 'gt' //  `>` Great than
  | 'gte' // `>=` Greater than or equal
  | 'lt' // `<` Less than
  | 'lte' // `<=` Less than or equal
  | 'contains' // `~` Contains
  | 'ncontains' // `!~` Not contains
  | 'in'
  | 'nin'
  | 'ina'
  | 'nina'
  | 'containss'
  | 'ncontainss'
  | 'between'
  | 'nbetween'
  | 'null'
  | 'nnull'
  | 'startswith'
  | 'nstartswith'
  | 'startswiths'
  | 'nstartswiths'
  | 'endswith'
  | 'nendswith'
  | 'endswiths'
  | 'nendswiths'
  | 'or'
  | 'and'
  | 'gtAny'
  | 'gteAny'
  | 'ltAny'
  | 'lteAny'
  | 'containsAny'
  | 'ncontainsAny';

export type TLogicOperator = 'and' | 'or';

export type CrudFilter = {
  field: string;
  operator: CrudOperators;
  value: string;
  logicalOperator?: TLogicOperator;
};

export interface GetListParams {
  resource: string;
  pagination?: Pagination;
  sorters?: CrudSort[];
  sortString?: string;
  filters?: CrudFilter[];
  filterString?: string;
  signal?: AbortSignal;
  expand?: string;
}

export interface GetOneParams {
  resource: string;
  id: string;
  expand?: string;
  signal?: AbortSignal;
}

export interface GetOneResponse<TData> {
  data: TData;
}

export interface CreateParams<TVariables = unknown> {
  resource: string;
  variables: TVariables;
}

export interface CreateResponse<TData> {
  data: TData;
}

export const handleError = (error: any) => {
  const customError: HttpError = {
    ...error,
    message: error.message,
    statusCode: Number.parseInt(error.code),
  };
  return Promise.reject(customError);
};

export interface ISubscribeParams {
  topic?: string;
  collection: string;
  filterQuery?: string;
  callback: (event: any) => void;
  options?: SendOptions;
}

export interface IUnsubscribeParams {
  collection: string;
}

export type TDataProvider = {
  getList: <TData>(params: GetListParams) => Promise<GetListResponse<TData>>;
  getOne: <TData>(params: GetOneParams) => Promise<GetOneResponse<TData>>;
  create: <TData, TVariables extends BaseVariable>(
    params: CreateParams<TVariables>
  ) => Promise<CreateResponse<TData>>;
  update: <TData, ReqParam>(args: Params<ReqParam>) => Promise<Response<TData>>;
  delete: (args: Params<any>) => Promise<null>;
  sub: (params: ISubscribeParams) => void;
  unSub: (params: IUnsubscribeParams) => void;
};

export interface MapData {
  title: string;
  link: string;
}

export type TGlobalSearchProvider = {
  get: (params: { search: string }) => Promise<MapData[]>;
};
