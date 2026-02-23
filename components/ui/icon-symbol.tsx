// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'person.fill': 'person',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  // Categories
  'wrench.fill': 'build',
  'leaf.fill': 'eco',
  'car.fill': 'directions-car',
  'building.2.fill': 'account-balance',
  'shield.fill': 'shield',
  'ellipsis.circle.fill': 'more-horiz',
  // People
  'person.2.fill': 'people',
  // Actions
  'line.3.horizontal.decrease.circle': 'filter-list',
  'heart.fill': 'favorite',
  'envelope.fill': 'email',
  'mappin.circle.fill': 'location-on',
  'plus.circle.fill': 'add-circle',
  'list.bullet': 'format-list-bulleted',
  'doc.text.fill': 'description',
  // Misc
  'exclamationmark.triangle.fill': 'warning',
  'arrow.clockwise': 'refresh',
  'xmark.circle.fill': 'cancel',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
