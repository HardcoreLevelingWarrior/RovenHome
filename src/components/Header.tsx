import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

interface Props {
  headerText: string;
}

function Header({ headerText }: Props) {
  return (
    <View>
      <Text>{headerText}</Text>
    </View>
  );
}
export default Header;
