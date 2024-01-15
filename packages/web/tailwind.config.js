/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,js,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        antDaybreakBlue: {
          1: '#e6f4ff',
          2: '#bae0ff',
          3: '#91caff',
          4: '#69b1ff',
          5: '#4096ff',
          6: '#1677ff',
          7: '#0958d9',
          8: '#003eb3',
          9: '#002c8c',
          10: '#001d66',
        },
        wechatBrand: {
          1: '#069A4D',
          2: '#06AE57',
          3: '#07C160',
          4: '#39CD80',
          5: '#B4ECCF',
        },
        wechatLightGreen: {
          1: '#77BD54',
          2: '#86D55F',
          3: '#95EC69',
          4: '#AAF087',
          5: '#DFF9D2',
        },
        wechatYellow: {
          1: '#CC9C00',
          2: '#E6B000',
          3: '#FFC300',
          4: '#FFCF33',
          5: '#FFEDB2',
        },
        wechatOrange: {
          1: '#C87E2F',
          2: '#E18E35',
          3: '#FA9D3B',
          4: '#FBB162',
          5: '#FDE1C4',
        },
        wechatBG: {
          1: '#000',
          2: '#333',
          3: '#EDEDED',
          4: '#F7F7F7',
          5: '#fff',
        },
        wechatLink: {
          1: '#465677',
          2: '#4E6186',
          3: '#576B95',
          4: '#7989AA',
          5: '#CCD2DF',
        },
        wechatRed: {
          1: '#C84141',
          2: '#E14949',
          3: '#FA5151',
          4: '#FB7474',
          5: '#FDCACA',
        },
      },
      height: {
        17: '4.25rem',
        18: '4.5rem',
        34: '8.5rem',
      },
      width: {
        17: '4.25rem',
        18: '4.5rem',
        34: '8.5rem',
      },
      padding: {
        18: '4.5rem',
      },
      spacing: {
        1.5: '0.375rem',
      },
      scale: {
        60: '.60',
        80: '.80',
        85: '.85',
      },
      saturate: {
        60: '.60',
      },
      zIndex: {
        100: '100',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio'), require('tailwindcss-animated')],
  corePlugins: {
    preflight: false,
    aspectRatio: false,
  },
};
