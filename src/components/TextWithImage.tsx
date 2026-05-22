import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import CustomText from './customText';

const isRTLText = (text: string) => {
  const rtlRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return rtlRegex.test(text);
};

export const TextWithImage = ({
  imageSource,
  text,
  imageStyle,
}: {
  imageSource: ImageSourcePropType;
  text: string;
  imageStyle?: object;
}) => {
  const isRTL = isRTLText(text);

  return (
    <View style={styles.container}>
      {!isRTL && (
        <Image source={imageSource} style={[styles.image, imageStyle]} />
      )}
      {/* <Text style={styles.text}>{text}</Text> */}
      <CustomText style={styles.text}>{text}</CustomText>
      {isRTL && (
        <Image source={imageSource} style={[styles.image, imageStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    // flexWrap: 'wrap',
  },
  text: {
    // flexShrink: 1,
    // fontSize: 16,
    width: '100%',
  },
  image: {
    width: 24,
    height: 24,
    marginHorizontal: 4,
  },
});
