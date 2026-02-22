import { useState } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Fonts } from '@/constants/theme';
import { BorderRadius, Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';

type TextInputProps = RNTextInputProps & {
  label?: string;
  error?: string;
};

export function TextInput({ label, error, style, onFocus, onBlur, ...rest }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'textSecondary');
  const backgroundColor = useThemeColor({}, 'surface');
  const borderDefault = useThemeColor({}, 'border');
  const borderFocus = useThemeColor({}, 'accent');
  const borderError = useThemeColor({}, 'error');
  const errorColor = useThemeColor({}, 'error');

  const borderColor = error ? borderError : isFocused ? borderFocus : borderDefault;

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText type="label" style={styles.label}>
          {label}
        </ThemedText>
      ) : null}
      <RNTextInput
        style={[
          styles.input,
          { color: textColor, backgroundColor, borderColor },
          style,
        ]}
        placeholderTextColor={placeholderColor}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? (
        <ThemedText type="caption" style={[styles.error, { color: errorColor }]}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    marginBottom: Spacing.xxs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
    fontFamily: Fonts.regular,
  },
  error: {
    marginTop: Spacing.xxs,
  },
});
