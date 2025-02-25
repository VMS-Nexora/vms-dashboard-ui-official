export type TPermission = string;

export type TGetUserPermissionParams = {
  resource: string; // It's a resource or endpoint of the API
  expand?: string;
};

export type TAuthorizeProvider = {
  getUserPermissions: (
    params: TGetUserPermissionParams
  ) => Promise<TPermission[]>;
};
