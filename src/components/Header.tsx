import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Props {
  headerText: string;
  brandName?: string;
}

function Header({ headerText, brandName }: Props) {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerText}>
        {brandName ? brandName : headerText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 0,
    height: 120,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    textAlign: 'center',
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '70%',
    height: '70%',
  },
});
export default Header;
