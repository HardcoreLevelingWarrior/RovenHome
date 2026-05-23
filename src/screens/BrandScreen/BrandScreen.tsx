import { Text, View, Image, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/customText';
import BrandBox from './components/BrandBox';
import { Brand, brands } from '../../constant/devices';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';

// function BrandScreen() {
//   const { theme } = useTheme();
//   const navigation = useNavigation<any>();
//   const { t } = useTranslation();

//   const { colors, typography } = theme; // اضافه کنید تا null-safe نباشد

//   function onClick(item: Brand) {
//     navigation.navigate(Routes.PickDeviceScreen, { brand: item });
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <CustomText
//         children={t('brand_screen.pick_your_desired_brand')}
//         style={[
//           styles.screenHeader,
//           {
//             fontSize: typography.fontSize.xxl,
//             letterSpacing: -1,
//             marginTop: 20,
//           },
//         ]}
//         weight="bold"
//       />
//       <FlatList
//         data={brands}
//         numColumns={2}
//         // keyExtractor={item => item.id}
//         keyExtractor={(item, index) => item?.id?.toString() || `key-${index}`}
//         renderItem={({ item }) => (
//           <BrandBox onClick={() => onClick(item)} avatar={item.logo} />
//         )}
//         contentContainerStyle={{
//           justifyContent: 'center',
//           paddingHorizontal: 10,
//           paddingBottom: 20,
//         }}
//         columnWrapperStyle={{
//           justifyContent: 'space-between',
//           marginBottom: 15,
//         }}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// }

function BrandScreen() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { colors, typography } = theme;

  function onClick(item: Brand) {
    navigation.navigate(Routes.PickDeviceScreen, {
      brand: item,
    });
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme?.colors.background }]}
    >
      <CustomText
        children={t('brand_screen.pick_your_desired_brand')}
        style={[
          styles.screenHeader,
          {
            fontSize: theme?.typography.fontSize.xxl,
            letterSpacing: -1,
            display: 'flex',
            marginTop: 20,
          },
        ]}
        // weight="bold"
      ></CustomText>

      {/* <FlatList
        data={brands}
        horizontal={false}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BrandBox onClick={() => onClick(item)} avatar={item.logo}></BrandBox>
        )}
        contentContainerStyle={{ margin: 'auto' }}
      /> */}
      <FlatList
        data={brands}
        numColumns={2}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BrandBox onClick={() => onClick(item)} avatar={item.logo} />
        )}
        contentContainerStyle={{
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          marginBottom: 15,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // height: '100%',
    flex: 1,
  },
  screenHeader: {
    textAlign: 'center',
    marginVertical: 35,
  },
});
export default BrandScreen;
