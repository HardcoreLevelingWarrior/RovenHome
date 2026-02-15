import { TouchableOpacity, Text } from 'react-native';

interface Props {
  labelText: string;
  // fn: () => void;
}

function SettingTab({ labelText }: Props) {
  return (
    <TouchableOpacity>
      <Text>{labelText}</Text>
    </TouchableOpacity>
  );
}

export default SettingTab;
