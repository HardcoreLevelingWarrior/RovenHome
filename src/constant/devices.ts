import { ImageSourcePropType } from 'react-native';
import { useTranslation } from 'react-i18next';

// const { t } = useTranslation();

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
  brandName?: string;
  image?: ImageSourcePropType;
  setupGuide: (string | undefined)[];
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
        model: 'oven101',
        image: require('../assets/images/devices/oven.png'),
        setupGuide: [
          'please_turn_on_your_device',
          "reset_your_device_so_the_your_device_enters_it's_access_point_mode",

          'now_please_try_to_connect_your_mobile_phone_to_the_device_access_point',
          "once_you_are_connected_to_the_device's_Wi-Fi,_click_the_Connect_to_Device_button",
          ,
          'after_hitting_the_button_you_have_3_minutes_to_connect_to_the_device',
        ],
        connectionType: 'wifi',
      },
      {
        id: '102',
        name: 'hood',
        model: 'hood102',
        image: require('../assets/images/devices/hood.png'),
        setupGuide: [
          'please_turn_on_your_device',
          "reset_your_device_so_the_your_device_enters_it's_access_point_mode",

          'now_please_try_to_connect_your_mobile_phone_to_the_device_access_point',
          "once_you_are_connected_to_the_device's_Wi-Fi,_click_the_Connect_to_Device_button",
          ,
          'after_hitting_the_button_you_have_3_minutes_to_connect_to_the_device',
        ],
        connectionType: 'wifi',
      },
      {
        id: '103',
        name: 'stove',
        model: 'stove103',
        image: require('../assets/images/devices/stove.png'),
        setupGuide: [
          'please_turn_on_your_device',
          "reset_your_device_so_the_your_device_enters_it's_access_point_mode",

          'now_please_try_to_connect_your_mobile_phone_to_the_device_access_point',
          "once_you_are_connected_to_the_device's_Wi-Fi,_click_the_Connect_to_Device_button",
          ,
          'after_hitting_the_button_you_have_3_minutes_to_connect_to_the_device',
        ],
        connectionType: 'wifi',
      },
    ],
  },
];
