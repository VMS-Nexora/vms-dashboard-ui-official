import { Button } from 'antd';
import { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';

type ExceptionType = '403' | '404' | '500';

interface Props {
  /**
   * Exception type
   *
   * - 403: no permission
   * - 404: not found
   * - 500: service error
   */
  type: ExceptionType;
}
// Import each SVG directly
import noPermissionIcon from '@/assets/svg-icon/no-permission.svg?url';
import notFoundIcon from '@/assets/svg-icon/not-found.svg?url';
import serviceErrorIcon from '@/assets/svg-icon/service-error.svg?url';

const iconMap: Record<ExceptionType, string> = {
  '403': noPermissionIcon,
  '404': notFoundIcon,
  '500': serviceErrorIcon,
};

const ExceptionBase: FC<Props> = memo(({ type }) => {
  const nav = useNavigate();

  const onClick = () => {
    nav('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <div className="max-w-md w-full">
        <div className="flex justify-center">
          <img
            src={iconMap[type]}
            alt=""
          />
        </div>
        <p className="text-lg text-gray-600">
          {type === '403' && 'You do not have permission to access this page.'}
          {type === '404' && 'The page you are looking for does not exist.'}
          {type === '500' &&
            'An unexpected error occurred. Please try again later.'}
        </p>
        <Button
          type="primary"
          className="mt-6"
          onClick={onClick}>
          Back home
        </Button>
      </div>
    </div>
  );
});

export default ExceptionBase;
