// Fallback for using various icon sets on Android and web.

import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], {
  iconSet: 'MaterialIcons' | 'FontAwesome' | 'FontAwesome5' | 'Ionicons' | 'MaterialCommunityIcons';
  iconName: string;
}>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to various icon sets mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navegação e UI básica
  'house.fill': { iconSet: 'MaterialIcons', iconName: 'home' },
  'paperplane.fill': { iconSet: 'MaterialIcons', iconName: 'send' },
  'chevron.left.forwardslash.chevron.right': { iconSet: 'MaterialIcons', iconName: 'code' },
  'chevron.right': { iconSet: 'MaterialIcons', iconName: 'chevron-right' },
  'arrow.left': { iconSet: 'MaterialIcons', iconName: 'arrow-back' },
  'eye': { iconSet: 'Ionicons', iconName: 'eye-outline' },
  'eye.slash': { iconSet: 'Ionicons', iconName: 'eye-off-outline' },
  'magnifyingglass': { iconSet: 'Ionicons', iconName: 'search-outline' },
  'person.fill': { iconSet: 'Ionicons', iconName: 'person' },
  'list.bullet': { iconSet: 'Ionicons', iconName: 'list' },
  'arrow.left.arrow.right': { iconSet: 'Ionicons', iconName: 'swap-horizontal' },
  'ellipsis': { iconSet: 'Ionicons', iconName: 'ellipsis-horizontal' },

  // Ícones financeiros
  'creditcard': { iconSet: 'FontAwesome5', iconName: 'credit-card' },
  'creditcard.fill': { iconSet: 'FontAwesome5', iconName: 'credit-card' },
  'qrcode': { iconSet: 'FontAwesome5', iconName: 'qrcode' },
  'doc.text': { iconSet: 'Ionicons', iconName: 'document-text-outline' },
  'doc.on.doc': { iconSet: 'Ionicons', iconName: 'copy-outline' },
  'chart.line.uptrend.xyaxis': { iconSet: 'FontAwesome5', iconName: 'chart-line' },
  'arrow.triangle.2.circlepath': { iconSet: 'Ionicons', iconName: 'sync-outline' },
  'barcode': { iconSet: 'Ionicons', iconName: 'barcode-outline' },
  'phone': { iconSet: 'Ionicons', iconName: 'phone-portrait-outline' },
  'calendar': { iconSet: 'Ionicons', iconName: 'calendar-outline' },
  'lock': { iconSet: 'Ionicons', iconName: 'lock-closed-outline' },
  'bell': { iconSet: 'Ionicons', iconName: 'notifications-outline' },
} as IconMapping;

/**
 * An icon component that uses different icon sets based on the mapping.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to the appropriate icon set.
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
  const iconConfig = MAPPING[name];

  if (!iconConfig) {
    console.warn(`Icon "${name}" not found in mapping`);
    return null;
  }

  switch (iconConfig.iconSet) {
    case 'MaterialIcons':
      return <MaterialIcons name={iconConfig.iconName} size={size} color={color} style={style} />;
    case 'FontAwesome':
      return <FontAwesome name={iconConfig.iconName} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconConfig.iconName} size={size} color={color} style={style} />;
    case 'Ionicons':
      return <Ionicons name={iconConfig.iconName} size={size} color={color} style={style} />;
    case 'MaterialCommunityIcons':
      return <MaterialCommunityIcons name={iconConfig.iconName} size={size} color={color} style={style} />;
    default:
      return <MaterialIcons name="error" size={size} color={color} style={style} />;
  }
}