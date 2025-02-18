import { Icon } from '@iconify/react';
import type { CSSProperties } from 'react';

interface Props {
  readonly className?: string;
  readonly icon?: string;
  readonly localIcon?: string;
  readonly style?: CSSProperties;
}
const SvgIcon = ({ icon, localIcon, ...props }: Props) => {
  return localIcon || !icon ? (
    <img
      src={localIcon}
      alt=""
      style={{ width: '1rem', height: '1em', ...props.style }}
      className={props.className}
    />
  ) : (
    <Icon
      icon={icon}
      {...props}
    />
  );
};

export default SvgIcon;
