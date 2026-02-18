import { Text, View, Image, StyleSheet, FlatList } from 'react-native';
import { useTheme } from '../../context/themeContext';
import { useTranslation } from 'react-i18next';
import CustomText from '../../components/customText';
import BrandBox from './components/BrandBox';
import { Brand, brands } from '../../constant/devices';
import { useNavigation } from '@react-navigation/native';
import { Routes } from '../../navigation/Routes';

function BrandScreen() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { colors, typography } = theme;
  const navigation = useNavigation<any>();

  function onClick(item: Brand) {
    navigation.navigate(Routes.PickDeviceScreen, {
      brand: item,
    });
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomText
        children={t('Pick your device from the list :')}
        style={[styles.screenHeader, { fontSize: typography.fontSize.xxl }]}
        // weight="bold"
      ></CustomText>

      <FlatList
        data={brands}
        horizontal={false}
        numColumns={2}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <BrandBox onClick={() => onClick(item)} avatar={item.logo}></BrandBox>
        )}
        contentContainerStyle={{ margin: 'auto' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  screenHeader: {
    textAlign: 'center',
    marginVertical: 35,
  },
});
export default BrandScreen;
