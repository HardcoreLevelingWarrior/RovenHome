import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RouteProps';
import { Routes } from './Routes';
import HomeScreen from '../screens/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name={Routes.HomeScreen} component={HomeScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigation;
