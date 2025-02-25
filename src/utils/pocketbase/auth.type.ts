/* eslint-disable @typescript-eslint/no-explicit-any */
export type TUser = {
  name: string;
  avatar: string;
  token: string;
};
export interface ValidationErrors {
  [field: string]:
    | string
    | string[]
    | boolean
    | { key: string; message: string };
}

export interface HttpError extends Record<string, any> {
  message: string;
  statusCode: number;
  errors?: ValidationErrors;
}

export type AuthActionResponse = {
  success: boolean;
  redirectTo?: string;
  error?: HttpError | Error;
  [key: string]: unknown;
};

export type LoginWithUsernameAndPasswordParams = {
  username: string;
  password: string;
};

export type TAuthProvider = {
  login: (params: any) => Promise<AuthActionResponse>;
  loginWithUserNamePassWord: (
    params: LoginWithUsernameAndPasswordParams
  ) => Promise<AuthActionResponse & TUser>;
  logout: (params: any) => Promise<AuthActionResponse>;
};
