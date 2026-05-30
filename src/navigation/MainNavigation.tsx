import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Image } from 'react-native';
import { Routes } from './Routes';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AddDeviceScreen from '../screens/AddDeviceScreen/AddDeviceScreen';
import DeviceScreen from '../screens/DeviceScreen/DeviceScreen';
import Setting from '../screens/Setting/Setting';
import BrandScreen from '../screens/BrandScreen/BrandScreen';
import PickDeviceScreen from '../screens/pickDeviceScreen/PickDeviceScreen';
import PairingScreen from '../screens/PairingScreen/PairingScreen';
import OvenControlScreen from '../screens/OvenControlScreen/OvenControlScreen';
import HoodControlScreen from '../screens/HoodControlScreen/HoodControlScreen';
import StoveControlScreen from '../screens/StoveControlScreen/StoveControlScreen';

import Icon from 'react-native-vector-icons/Ionicons';

import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/themeContext';
import SetupGuideScreen from '../screens/setupGuideScreen/SetUpGuideScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarLabel: t(route.name),

        tabBarStyle: {
          height: 80,
          position: 'absolute',
          bottom: 15,
          left: 15,
          right: 15,
          paddingBottom: 15,
          paddingTop: 10,
          // backgroundColor: '#ffffff',
          // borderTopWidth: 0,

          backgroundColor: colors.surface, // یا colors.background
          borderTopColor: colors.divider,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,

          //shadow style
          // elevation: 20,
          // shadowColor: '#000',
          // shadowOffset: { width: 0, height: -4 },
          // shadowOpacity: 0.1,
          // shadowRadius: 10,
          borderRadius: 25,
          // width: '90%',
          marginHorizontal: 25,
          alignSelf: 'center',
        },

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 10,
        },

        tabBarIconStyle: {
          marginBottom: -5, // تراز کردن آیکون
        },

        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'help-circle';

          if (route.name === Routes.HomeScreen) {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === Routes.DeviceScreen) {
            iconName = focused ? 'phone-portrait' : 'phone-portrait-outline';
          } else if (route.name === Routes.Setting) {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        // tabBarActiveTintColor: 'tomato',
        // tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name={Routes.HomeScreen} component={HomeScreen} />
      <Tab.Screen name={Routes.DeviceScreen} component={DeviceScreen} />
      <Tab.Screen name={Routes.Setting} component={Setting} />
    </Tab.Navigator>
  );
};

const MainNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{ header: () => null, headerShown: false }}
      initialRouteName="MainTab"
    >
      <Stack.Screen name="MainTab" component={TabNavigator} />

      <Stack.Screen name={Routes.HomeScreen} component={HomeScreen} />
      <Stack.Screen name={Routes.AddDeviceScreen} component={AddDeviceScreen} />
      <Stack.Screen name={Routes.BrandScreen} component={BrandScreen} />
      <Stack.Screen
        name={Routes.PickDeviceScreen}
        component={PickDeviceScreen}
      />
      <Stack.Screen
        name={Routes.SetupGuideScreen}
        component={SetupGuideScreen}
      />
      <Stack.Screen name={Routes.PairingScreen} component={PairingScreen} />
      <Stack.Screen
        name={Routes.OvenControlScreen}
        component={OvenControlScreen}
      />
      <Stack.Screen
        name={Routes.HoodControlScreen}
        component={HoodControlScreen}
      />
      <Stack.Screen
        name={Routes.StoveControlScreen}
        component={StoveControlScreen}
      />

      {/* <Stack.Screen name="HoodControl" component={HoodControlScreen} />
<Stack.Screen name="FridgeControl" component={FridgeControlScreen} />
<Stack.Screen name="DeviceDetail" component={DeviceDetailScreen} /> */}
    </Stack.Navigator>
  );
};

export default MainNavigation;
