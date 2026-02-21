import { StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

export type TextType =
  | 'default'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyBold'
  | 'button'
  | 'label'
  | 'caption'
  | 'badge'
  | 'emailCounter'
  | 'link';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: TextType;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const linkColor = useThemeColor({}, 'accent');

  return (
    <Text
      style={[
        { color: type === 'link' ? linkColor : color },
        styles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -0.5,
    fontFamily: Fonts.bold,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: Fonts.semiBold,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: Fonts.semiBold,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.semiBold,
  },
  button: {
    fontSize: 16,
    lineHeight: 20,
    letterSpacing: 0.5,
    fontFamily: Fonts.semiBold,
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0.5,
    fontFamily: Fonts.semiBold,
    textTransform: 'uppercase',
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.regular,
  },
  badge: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.5,
    fontFamily: Fonts.bold,
    textTransform: 'uppercase',
  },
  emailCounter: {
    fontSize: 36,
    lineHeight: 40,
    fontFamily: Fonts.extraBold,
  },
  link: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Fonts.regular,
  },
});
