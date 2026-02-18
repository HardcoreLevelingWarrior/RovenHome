import { Text, TextProps } from 'react-native';
import { useFontFamily } from '../hooks/useFontFamily';
import { useTheme } from '../context/themeContext';

interface CustomTextProps extends TextProps {
  weight?: 'regular' | 'bold';
  children: React.ReactNode;
}

export default function CustomText({
  weight = 'regular',
  style,
  children,
  ...props
}: CustomTextProps) {
  const fontFamily = useFontFamily(weight);
  const { theme } = useTheme();

  return (
    <Text
      style={[{ fontFamily, color: theme.colors.textPrimary }, style]}
      {...props}
    >
      {children}
    </Text>
  );
}
