import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Image } from 'react-native';
import { Routes } from './Routes';
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import AddDeviceScreen from '../screens/AddDeviceScreen/AddDeviceScreen';
import DeviceScreen from '../screens/DeviceScreen/DeviceScreen';
import Setting from '../screens/Setting/Setting';

import Icon from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
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
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
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
    </Stack.Navigator>
  );
};

export default MainNavigation;
