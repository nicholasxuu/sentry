import * as React from 'react';

import SvgIcon, {SVGIconProps} from './svgIcon';

const IconAlertCritical = React.forwardRef<SVGSVGElement, SVGIconProps>(
  ({...props}, ref) => {
    return (
      <SvgIcon {...props} ref={ref}>
        <rect
          width="11.7333"
          height="11.7333"
          rx="2"
          transform="scale(1.01739 .9823) rotate(45 4.2962 9.2981)"
          fill="#F55459"
        />
        <g clip-path="url(#a)">
          <path
            d="M8.0108 11.8205c-.9072-.0013-1.7769-.3502-2.418-.9701-.641-.6199-1.001-1.46-1.001-2.336a2.3825 2.3825 0 0 1 .2827-1.2126c.2005-.374.4974-.6919.8621-.923a.4178.4178 0 0 1 .3643 0c.07.0382.1263.096.1614.1659.037-.5925.2542-1.1612.6245-1.635.3703-.4737.8772-.8313 1.457-1.028a.398.398 0 0 1 .1834-.017.393.393 0 0 1 .1706.0672.372.372 0 0 1 .126.1323.3568.3568 0 0 1 .0457.1742v.1557A7.3174 7.3174 0 0 0 9.01 6.2985a1.8945 1.8945 0 0 1 .51-.5426 1.9672 1.9672 0 0 1 .687-.3116.3981.3981 0 0 1 .1792-.0096.3919.3919 0 0 1 .1642.0699.38.38 0 0 1 .1149.133.3662.3662 0 0 1 .0412.1685 3.037 3.037 0 0 0 .3851 1.427c.2188.395.3399.8335.3539 1.2812 0 .435-.0889.8658-.2616 1.2676a3.3012 3.3012 0 0 1-.745 1.0738 3.4357 3.4357 0 0 1-1.1145.7161 3.5306 3.5306 0 0 1-1.3136.2487ZM5.6742 7.4541a2.0802 2.0802 0 0 0-.307 1.0602c0 .6757.278 1.3236.7727 1.8014.4949.4777 1.166.7461 1.8657.7461.6998 0 1.3709-.2684 1.8657-.7461.4948-.4778.7728-1.1257.7728-1.8014a2.2512 2.2512 0 0 0-.281-.9747 3.923 3.923 0 0 1-.3955-1.1658 1.01 1.01 0 0 0-.3396.4285.9728.9728 0 0 0-.0611.5363.3659.3659 0 0 1-.0464.2349.3858.3858 0 0 1-.1834.1606.4033.4033 0 0 1-.2466.0218.3926.3926 0 0 1-.2106-.1259c-.7025-.7939-.7806-1.6883-.791-2.8037C7.048 5.4744 6.97 6.625 7.0012 7.7657a3.6501 3.6501 0 0 1 0 .5778.364.364 0 0 1-.073.1912.3834.3834 0 0 1-.1664.1253.414.414 0 0 1-.2054.0234.4081.4081 0 0 1-.19-.0786c-.3436-.309-.5845-.7094-.6922-1.1507Z"
            fill="#fff"
          />
        </g>
        <defs>
          <clipPath id="a">
            <path
              fill="#fff"
              transform="translate(3.806 3.8212)"
              d="M0 0h8.3265v8.0394H0z"
            />
          </clipPath>
        </defs>
      </SvgIcon>
    );
  }
);

IconAlertCritical.displayName = 'IconAlertCritical';

export {IconAlertCritical};
