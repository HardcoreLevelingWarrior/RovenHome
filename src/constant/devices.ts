import { ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

export type Brand = {
  id: string;
  name: string;
  logo: ImageSourcePropType;
  devices: Devices[];
};
export type Devices = {
  id: string;
  name: string;
  model: string;
  image?: ImageSourcePropType;
  setupGuide: string[];
  connectionType: 'wifi';
};

export const brands: Brand[] = [
  {
    id: 'rahavard',
    name: 'rahavard',
    logo: require('../assets/images/brands/rahavard.png'),
    devices: [
      {
        id: '101',
        name: 'oven',
        model: 'test',
        setupGuide: [
          t(`Please turn on the oven.`),
          t(`Reset your oven so, the device enters it's access point mode.`),
          t(
            `Now please try to conenct your mobile phone to the device access point `,
          ),
          t(`Now you have 3 minutes to connect to the device`),
        ],
        connectionType: 'wifi',
      },
      //   {
      //     id: '102',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [
      //       t(`Please turn on the oven.`),
      //       t(`Reset your oven so, the device enters it's access point mode.`),
      //       t(
      //         `Now please try to conenct your mobile phone to the device access point `,
      //       ),
      //       t(`Now you have 3 minutes to connect to the device`),
      //     ],
      //     connectionType: 'wifi',
      //   },
      //   {
      //     id: '103',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [
      //       t(`Please turn on the oven.`),
      //       t(`Reset your oven so, the device enters it's access point mode.`),
      //       t(
      //         `Now please try to conenct your mobile phone to the device access point `,
      //       ),
      //       t(`Now you have 3 minutes to connect to the device`),
      //     ],
      //     connectionType: 'wifi',
      //   },
      //   {
      //     id: '104',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [],
      //     connectionType: 'wifi',
      //   },
      //   {
      //     id: '105',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [],
      //     connectionType: 'wifi',
      //   },
      //   {
      //     id: '106',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [],
      //     connectionType: 'wifi',
      //   },
      //   {
      //     id: '107',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [],
      //     connectionType: 'wifi',
      //   },
      //   {
      //     id: '108',
      //     name: 'oven',
      //     model: 'toster',
      //     setupGuide: [],
      //     connectionType: 'wifi',
      //   },
    ],
  },
  // {
  //   id: 'rahavard1',
  //   name: 'rahavard',
  //   logo: require('../assets/images/brands/rahavard.png'),
  //   devices: [
  //     {
  //       id: '101',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '102',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '103',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '104',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '105',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '106',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '107',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //     {
  //       id: '108',
  //       name: 'oven',
  //       model: 'toster',
  //       setupGuide: [],
  //       connectionType: 'wifi',
  //     },
  //   ],
  // },
];
