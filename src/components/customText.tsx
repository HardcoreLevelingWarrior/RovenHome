import { Text, TextProps } from 'react-native';
import { useFontFamily } from '../hooks/useFontFamily';
import { useTheme } from '../context/themeContext';
import { usePersistedLanguage } from '../hooks/usePersistedLanguage';

interface CustomTextProps extends TextProps {
  weight?: 'regular' | 'bold';
  children: React.ReactNode;
  marginHorizontal?: number;
  marginVertical?: number;
}

export default function CustomText({
  weight = 'regular',
  style,
  marginHorizontal,
  marginVertical,
  children,
  ...props
}: CustomTextProps) {
  const fontFamily = useFontFamily(weight);
  const { theme } = useTheme();

  const { currentLanguage, isLanguageReady } = usePersistedLanguage();
  return (
    <Text
      style={[
        {
          fontFamily,
          color: theme.colors.textPrimary,
          textAlign: currentLanguage.startsWith('fa') ? 'right' : 'left',
          writingDirection: currentLanguage.startsWith('fa') ? 'rtl' : 'ltr',
          marginHorizontal,
          marginVertical,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}
