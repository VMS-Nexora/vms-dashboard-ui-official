/* eslint-disable @typescript-eslint/no-explicit-any */
import PocketBase, { RecordListOptions } from 'pocketbase';
import { AuthActionResponse, TAuthProvider } from './auth.type';
import {
  TAuthorizeProvider,
  TGetUserPermissionParams,
  TPermission,
} from './authorize.type';
import {
  BaseVariable,
  CreateParams,
  CreateResponse,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  handleError,
  ISubscribeParams,
  IUnsubscribeParams,
  Params,
  TDataProvider,
} from './data.type';
import { TServiceProvider } from './service.type';
import { operatorMapping } from './pb.type';
import { TUser } from './auth.type';
import { getHash } from '../hashing-string';

export class PocketBaseProvider implements TServiceProvider {
  client: PocketBase;

  constructor(_pocketBaseURL: string) {
    this.client = new PocketBase(_pocketBaseURL);
  }

  // Getter methods for backend and auth providers
  get data(): TDataProvider {
    return {
      getList: this.getList.bind(this),
      getOne: this.getOne.bind(this),
      create: this.create.bind(this),
      update: this.update.bind(this),
      delete: this.delete.bind(this),
      sub: this.sub.bind(this),
      unSub: this.unSub.bind(this),
    };
  }

  get auth(): TAuthProvider {
    return {
      login: this.login.bind(this),
      loginWithUserNamePassWord: this.loginWithUserNamePassWord.bind(this),
      logout: this.logout.bind(this),
    };
  }

  get authorize(): TAuthorizeProvider {
    return {
      getUserPermissions: this.getUserPermissions.bind(this),
    };
  }

  async loginWithUserNamePassWord(params: {
    username: string;
    password: string;
  }): Promise<AuthActionResponse & TUser> {
    try {
      const result = await this.client
        .collection('users')
        .authWithPassword(params.username, params.password);

      if (!result?.token) {
        throw new Error('Invalid email or password');
      }

      return {
        success: true,
        avatar:
          `${this.client.baseUrl}/api/files/_pb_users_auth_/${result.record.id}/` +
          result.record.avatar,
        name: result.record.name ?? params.username,
        token: result.record.token,
      };
    } catch (err) {
      console.error(err);
      throw new Error('Invalid email or password');
    }
  }

  async login() {
    try {
      // Your login logic here
      return {
        success: true,
      };
    } catch (err) {
      console.error(err);
      throw new Error('Invalid email or password');
    }
  }

  async logout(): Promise<AuthActionResponse> {
    try {
      this.client.authStore.clear();
      return { success: true };
    } catch (err) {
      console.error(err);
      throw new Error('Logout failed');
    }
  }

  async getUserPermissions(
    params: TGetUserPermissionParams
  ): Promise<TPermission[]> {
    const rs: Set<TPermission> = new Set();
    const result = await this.client
      .collection(params.resource)
      .getFullList({ expand: params.expand });

    result?.[0]?.expand?.roles?.forEach((item: any) => {
      item?.expand?.pages?.forEach((page: any) => {
        rs.add(page?.path);
      });
    });
    return Array.from(rs) as TPermission[];
  }

  async getList<TData>({
    resource,
    pagination,
    sorters,
    sortString,
    filters,
    filterString,
    expand,
  }: GetListParams): Promise<GetListResponse<TData>> {
    try {
      let filterStr = '';
      if (filters) {
        filterStr = filters
          .map((filter, i) => {
            const operator = operatorMapping[filter.operator];
            if (operator && filter.value) {
              return `${
                i !== 0 ? (filter.logicalOperator === 'or' ? '||' : '&&') : ''
              } ${filter.field}${operator}${`"${filter.value}"`}`;
            }
            return ''; // Return an empty string if the operator or value is missing
          })
          .filter((filter) => filter !== '')
          .join(' '); // Remove any empty strings
      }

      const sortStr = sorters
        ? sorters
            .map(
              (sorter) => `${sorter.order === 'asc' ? '' : '-'}${sorter.field}`
            )
            .join(',')
        : '';

      const uniqueRequestKey = `getList-${resource}-${JSON.stringify({
        pagination,
        sorters,
        filters,
      })}-${Math.random()}`;

      const options: RecordListOptions = {
        requestKey: uniqueRequestKey,
        headers: {
          'nex-api-key': 'UMlFExY3SGhshyC2Rpk',
        },
      };

      if (expand) {
        options.expand = expand;
      }

      if (sortStr || sortString) {
        options.sort = sortStr || sortString;
      }

      if (filterString || filterStr) {
        options.filter = filterString || filterStr;
      }

      const data = await this.client
        .collection(resource)
        .getList(
          pagination?.pageCurrent || 1,
          pagination?.pageSize || 1000,
          options
        );

      return {
        data: data.items as TData[],
        pageCurrent: data.page,
        pageSize: data.perPage,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async getOne<TData>({
    resource,
    id,
    expand,
  }: GetOneParams): Promise<GetOneResponse<TData>> {
    try {
      const uniqueRequestKey = `getOne-${resource}-${id}-${JSON.stringify(
        expand
      )}-${Math.random()}`;
      const data = await this.client.collection(resource).getOne(id, {
        requestKey: uniqueRequestKey,
        headers: {
          'nex-api-key': 'UMlFExY3SGhshyC2Rpk',
        },
      });

      return { data: data as TData };
    } catch (error) {
      return handleError(error);
    }
  }

  async create<TData, TVariables extends BaseVariable>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> {
    try {
      const response = await this.client
        .collection(resource)
        .create(variables, {
          headers: {
            'nex-api-key': 'UMlFExY3SGhshyC2Rpk',
          },
        });

      if (response.error) {
        return handleError(response.error);
      }

      return {
        data: response as TData,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async update<TData, ReqParam>(args: Params<ReqParam>) {
    try {
      const response = await this.client
        .collection(args.collection)
        .update(args.id, args.params as object, {
          headers: {
            'nex-api-key': 'UMlFExY3SGhshyC2Rpk',
          },
        });

      return {
        data: response as TData,
      };
    } catch (error) {
      return handleError(error);
    }
  }

  async delete(args: Params<any>) {
    try {
      await this.client.collection(args.collection).delete(args.id, {
        headers: {
          'nex-api-key': 'UMlFExY3SGhshyC2Rpk',
        },
      });

      return null; // Handle message code if wanted
    } catch (error) {
      return handleError(error);
    }
  }
  sub(params: ISubscribeParams) {
    this.client.collection(params.collection).subscribe(
      params?.topic ? params?.topic : '*',
      (event) => {
        params.callback(event);
      },
      {
        filter: params.filterQuery,
        uniqueRequestKey: `sub_${params.collection}/${getHash(
          `sub_${params?.collection}`
        )}`,
        ...params.options,
      }
    );
  }

  unSub(params: IUnsubscribeParams) {
    this.client.realtime.unsubscribe(params.collection);
  }
}

export default PocketBaseProvider;
