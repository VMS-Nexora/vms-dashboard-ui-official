import { AppConfigItem } from '@/types/app-config-item';

// Helper function to generate paths
export const generatePath = (key: string, parentKey?: string): string => {
  return parentKey ? `${parentKey}/${key}` : `/${key}`;
};

// Function to process config items and add paths
export const processConfigItems = (
  items: AppConfigItem[],
  parentPath: string = ''
): AppConfigItem[] => {
  return items.map((item) => {
    const currentPath = generatePath(item.key, parentPath);
    return {
      ...item,
      path: currentPath,
      children: item.children
        ? processConfigItems(item.children, currentPath)
        : undefined,
    };
  });
};
