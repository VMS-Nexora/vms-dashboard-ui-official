import { baseConfigs } from '@/configs/main-menu.config';
import { AppConfigItem } from '@/types/app-config-item';
import { processConfigItems } from '@/utils/path-menu';

export const useGenerateRoutes = () => {
  // Process the configuration to add paths
  const appConfigsElements = processConfigItems(baseConfigs);

  //  function to get menu items (for Antd Menu)
  const getMenuItems = (configs: AppConfigItem[]): AppConfigItem[] => {
    return configs.map((config) => ({
      key: config.key,
      icon: config.icon,
      label: config.label,
      children: config.children ? getMenuItems(config.children) : undefined,
    }));
  };

  //  function to get all routes flat array
  const getAllRoutes = (configs: AppConfigItem[]): AppConfigItem[] => {
    const routes: AppConfigItem[] = [];

    const extractRoutes = (items: AppConfigItem[]) => {
      items.forEach((item) => {
        if (item.element) {
          routes.push(item);
        }
        if (item.children) {
          extractRoutes(item.children);
        }
      });
    };

    extractRoutes(configs);
    return routes;
  };

  // Find default child route
  const getDefaultChildRoute = (key: string): string | undefined => {
    const findItem = (items: AppConfigItem[]): AppConfigItem | undefined => {
      for (const item of items) {
        if (item.key === key) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
    };

    const item = findItem(appConfigsElements);
    if (item?.children?.length) {
      return item.children[0].path;
    }
    return undefined;
  };
  return {
    getMenuItems,
    getAllRoutes,
    getDefaultChildRoute,
    appConfigsElements,
  };
};
