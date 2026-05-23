// src/screens/PickDeviceScreen/PickDeviceScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RouteProps';
import { RouteProp } from '@react-navigation/native';
import CustomText from '../../components/customText';
import { Brand, Devices } from '../../constant/devices';
import DeviceBox from './components/DeviceBox';
import { Routes } from '../../navigation/Routes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PickDeviceRouteProp = RouteProp<RootStackParamList, 'PickDeviceScreen'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export default function PickDeviceScreen() {
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const { t } = useTranslation();
  const route = useRoute<PickDeviceRouteProp>();

  const brand = route.params?.brand;
  const navigation = useNavigation<NavigationProp>();
  // const route = useRoute<RouteProp<RootStackParamList, typeof Routes.PickDeviceScreen>>();

  // const { brand } = route.params;   // حالا TypeScript مطمئن است که brand وجود دارد

  function onClick(device: Devices) {
    device.brandName = brand.name;
    navigation.navigate(Routes.SetupGuideScreen, {
      device: device,
    });
  }
  if (!brand) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomText>No brand selected</CustomText>
      </View>
    );
  } else {
    const selectedBrand = brand;
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomText
          style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
          weight="bold"
        >
          {t('pick_device_screen.pick_your_device')}
        </CustomText>

        {/* <FlatList
          data={selectedBrand.devices}
          numColumns={2}
          horizontal={false}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <DeviceBox
              onPress={() => onClick(item)}
              avatar={require('../../assets/images/devices/oven.png')}
              text={`${item.name} model : ${item.model}`}
            ></DeviceBox>
          )}
          // contentContainerStyle={{ margin: 5 }}
          showsVerticalScrollIndicator={false}
        ></FlatList> */}
        <FlatList
          data={brand.devices}
          numColumns={2} // ← مهم
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <DeviceBox
              onPress={() => onClick(item)}
              avatar={item.image}
              itemName={t(`device.${[item.name]}`)}
              itemModel={`${t('pick_device_screen.model')} : ${item.model}`}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    marginTop: 15,
  },
  screenHeader: {
    textAlign: 'center',
    marginVertical: 35,
  },
  // columnWrapper: {
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 8,
  //   marginBottom: 16,
  // },
  // listContent: {
  //   paddingHorizontal: 0,
  //   paddingBottom: 40,
  // },
  columnWrapper: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    // marginBottom: 2,
  },
  listContent: {
    paddingBottom: 40,
    paddingHorizontal: 8,
  },
});
