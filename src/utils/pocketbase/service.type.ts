import { TAuthProvider } from './auth.type';
import { TAuthorizeProvider } from './authorize.type';
import { TDataProvider } from './data.type';
export type TServiceProvider = TDataProvider &
  TAuthProvider &
  TAuthorizeProvider;
