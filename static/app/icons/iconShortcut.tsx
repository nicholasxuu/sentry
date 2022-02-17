import * as React from 'react';

import SvgIcon from './svgIcon';

type Props = React.ComponentProps<typeof SvgIcon>;

const IconShortcut = React.forwardRef(function IconShortcut(
  props: Props,
  ref: React.Ref<SVGSVGElement>
) {
  return (
    <SvgIcon {...props} ref={ref}>
      <g>
        <path d="M16 4.00001C16 1.79041 14.2096 4.68664e-06 12 4.68664e-06H4C3.47462 -0.00080122 2.95427 0.102338 2.46891 0.303481C1.98356 0.504625 1.5428 0.799799 1.172 1.17201C-0.39 2.73401 -0.39 5.26601 1.172 6.82801L2.5966 8.25261C1.0798 8.82241 0 10.2858 0 12C0 14.2096 1.7904 16 4 16H12C13.023 16 14.0478 15.61 14.828 14.828C16.39 13.266 16.39 10.734 14.828 9.17201L13.4034 7.74741C14.9202 7.17941 16 5.71601 16 4.00001ZM2.2696 13.732C2.04148 13.5054 1.86062 13.2358 1.73751 12.9387C1.61439 12.6417 1.55147 12.3232 1.5524 12.0016C1.5524 11.3476 1.8064 10.7324 2.2696 10.2712C2.70266 9.83575 3.28435 9.58013 3.898 9.55561L8.7916 14.4492H4C3.67858 14.4494 3.36028 14.3862 3.06335 14.2632C2.76641 14.1401 2.49668 13.9597 2.2696 13.7322V13.732ZM13.7304 10.2696C13.9585 10.4962 14.1394 10.7659 14.2625 11.0629C14.3856 11.3599 14.4485 11.6785 14.4476 12C14.4476 12.654 14.1936 13.2692 13.7304 13.7304C13.5038 13.9585 13.2341 14.1394 12.9371 14.2625C12.6401 14.3856 12.3215 14.4485 12 14.4476C11.346 14.4476 10.7308 14.1936 10.2696 13.7304L2.2696 5.73201C2.04148 5.5054 1.86062 5.23576 1.73751 4.93871C1.61439 4.64167 1.55147 4.32315 1.5524 4.00161C1.5524 3.34761 1.8064 2.73261 2.2696 2.27121C2.49621 2.04309 2.76585 1.86223 3.06289 1.73911C3.35993 1.616 3.67846 1.55308 4 1.55401C4.654 1.55401 5.2692 1.80801 5.7304 2.27121L13.7304 10.2696ZM13.7304 5.73201C13.2973 6.16747 12.7156 6.42309 12.102 6.44761L7.2084 1.55241H12C12.654 1.55241 13.2692 1.80641 13.7304 2.26961C13.9585 2.49621 14.1394 2.76586 14.2625 3.0629C14.3856 3.35994 14.4485 3.67846 14.4476 4.00001C14.4476 4.65401 14.1936 5.26921 13.7304 5.73201Z" />
      </g>
    </SvgIcon>
  );
});

IconShortcut.displayName = 'IconShortcut';

export {IconShortcut};