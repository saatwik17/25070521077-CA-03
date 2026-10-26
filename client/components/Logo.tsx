import React from 'react';

interface LogoProps {
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ light = false }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5">
      <div className="w-[38px] h-8 relative shrink-0">
        {/* SVG 1: Main Shape */}
        <svg
          width="38"
          height="32"
          viewBox="0 0 38 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[38px] h-8 absolute left-0 top-0"
        >
          <g filter="url(#filter0_i_335_1931)">
            <path
              d="M0.0464142 31.2758L5.85383 18.699C5.93557 18.5219 6.11278 18.4086 6.30777 18.4086H13.9599L18.3891 27.2155C18.5778 27.5907 19.1169 27.5802 19.2909 27.198L23.1575 18.7015C23.2386 18.5231 23.4166 18.4086 23.6125 18.4086H31.378C31.5758 18.4086 31.755 18.5252 31.8351 18.706L37.4075 31.2829C37.5539 31.6135 37.3119 31.9855 36.9503 31.9855H29.9788C29.7885 31.9855 29.6147 31.8774 29.5304 31.7068L27.833 28.2684C27.6455 27.8886 27.1002 27.8994 26.9279 28.2864L25.4129 31.6888C25.3326 31.8692 25.1536 31.9855 24.9561 31.9855H12.5369C12.3473 31.9855 12.174 31.8782 12.0894 31.7085L9.89898 27.3129L7.90145 31.6929C7.82019 31.8711 7.64237 31.9855 7.44653 31.9855H0.500357C0.135423 31.9855 -0.106573 31.6072 0.0464142 31.2758Z"
              fill="url(#paint0_linear_335_1931)"
            />
            <path
              d="M14.7006 16.271H7.61596C7.24313 16.271 7.00195 15.8757 7.16587 15.5408C9.79841 10.1629 10.3974 6.90536 14.0824 1.745C14.8272 0.701929 16.0128 0.278703 17.3485 0.107962C18.2986 -0.0134926 18.8619 -0.0568579 19.8043 0.107962C21.0429 0.32456 22.7351 1.3622 22.7351 1.3622L30.3681 15.5339C30.5475 15.8671 30.3063 16.271 29.9279 16.271H23.0452C22.8553 16.271 22.6817 16.1634 22.5973 15.9933L18.7339 8.20905L15.1547 15.9802C15.0731 16.1575 14.8957 16.271 14.7006 16.271Z"
              fill="url(#paint1_linear_335_1931)"
            />
          </g>
          <defs>
            <filter
              id="filter0_i_335_1931"
              x="0"
              y="0"
              width="37.4512"
              height="35.9854"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2.5" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.0571402 0 0 0 0 0.0207359 0 0 0 0 0.663879 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_335_1931"
              />
            </filter>
            <linearGradient
              id="paint0_linear_335_1931"
              x1="18.7188"
              y1="0"
              x2="18.7188"
              y2="31.9855"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6C64FD" />
              <stop offset="1" stopColor="#2B20ED" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_335_1931"
              x1="18.7188"
              y1="0"
              x2="18.7188"
              y2="31.9855"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6C64FD" />
              <stop offset="1" stopColor="#2B20ED" />
            </linearGradient>
          </defs>
        </svg>

        {/* SVG 2: Overlay Shape */}
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 absolute left-[7px] top-0"
        >
          <g filter="url(#filter0_i_335_1932)">
            <path
              d="M12.9324 0.251248C11.0323 -0.336594 9.49665 0.269894 8.75232 0.430844C8.70713 0.440614 8.66312 0.455213 8.62177 0.475888L7.86374 0.854957C7.81827 0.877695 7.77653 0.907236 7.73997 0.94256L7.01819 1.63986C6.99841 1.65897 6.98023 1.67969 6.96386 1.70179L6.21603 2.71106L4.3155 5.97478L2.78866 9.28742L0.0432571 15.5544C-0.10147 15.8848 0.140559 16.255 0.501238 16.255H7.48344C7.67422 16.255 7.84837 16.1465 7.93237 15.9752L11.6611 8.37128L15.3703 1.72872C15.4774 1.53695 15.4444 1.29851 15.2575 1.18306C14.9219 0.975706 14.2583 0.661448 12.9324 0.251248Z"
              fill="url(#paint0_linear_335_1932)"
            />
          </g>
          <defs>
            <filter
              id="filter0_i_335_1932"
              x="-2"
              y="0"
              width="17.4316"
              height="20.2549"
              filterUnits="userSpaceOnUse"
              colorInterpolationFilters="sRGB"
            >
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="BackgroundImageFix"
                result="shape"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dx="-2" dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite
                in2="hardAlpha"
                operator="arithmetic"
                k2="-1"
                k3="1"
              />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.073582 0 0 0 0 0.0255287 0 0 0 0 0.874471 0 0 0 1 0"
              />
              <feBlend
                mode="normal"
                in2="shape"
                result="effect1_innerShadow_335_1932"
              />
            </filter>
            <linearGradient
              id="paint0_linear_335_1932"
              x1="7.64342"
              y1="0"
              x2="7.64342"
              y2="16.255"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6C64FD" />
              <stop offset="1" stopColor="#2B20ED" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <span className={`font-sans text-xs md:text-sm font-black tracking-[0.04em] whitespace-nowrap uppercase ${light ? 'text-white' : 'text-[#09036A] dark:text-white'}`}>
        AMBITIOUS PEDIA
      </span>
    </div>
  );
};