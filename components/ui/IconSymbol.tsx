// Optimized icon component for better performance

import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import React from 'react';
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
  'arrow.up': { iconSet: 'Ionicons', iconName: 'arrow-up' },
  'arrow.down': { iconSet: 'Ionicons', iconName: 'arrow-down' },
  'eye': { iconSet: 'Ionicons', iconName: 'eye-outline' },
  'eye.slash': { iconSet: 'Ionicons', iconName: 'eye-off-outline' },
  'magnifyingglass': { iconSet: 'Ionicons', iconName: 'search-outline' },
  'person.fill': { iconSet: 'Ionicons', iconName: 'person' },
  'list.bullet': { iconSet: 'Ionicons', iconName: 'list' },
  'arrow.left.arrow.right': { iconSet: 'Ionicons', iconName: 'swap-horizontal' },
  'ellipsis': { iconSet: 'Ionicons', iconName: 'ellipsis-horizontal' },
  'line.3.horizontal.decrease': { iconSet: 'Ionicons', iconName: 'filter-outline' },
  'arrow.down.doc': { iconSet: 'Ionicons', iconName: 'download-outline' },
  'xmark': { iconSet: 'Ionicons', iconName: 'close-outline' },
  'xmark.circle.fill': { iconSet: 'Ionicons', iconName: 'close-circle' },
  'building.2': { iconSet: 'FontAwesome5', iconName: 'building' },
  'doc': { iconSet: 'Ionicons', iconName: 'document-outline' },

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
  
  // Ícones específicos para investimentos
  'shield.checkered': { iconSet: 'FontAwesome5', iconName: 'shield-alt' },
  'chart.pie': { iconSet: 'FontAwesome5', iconName: 'chart-pie' },
  'chart.bar': { iconSet: 'FontAwesome5', iconName: 'chart-bar' },
  'globe': { iconSet: 'FontAwesome5', iconName: 'globe' },
  'house': { iconSet: 'FontAwesome5', iconName: 'home' },
  'banknote': { iconSet: 'FontAwesome5', iconName: 'money-bill-wave' },
  'coins': { iconSet: 'FontAwesome5', iconName: 'coins' },
  'landmark': { iconSet: 'FontAwesome5', iconName: 'landmark' },
  'certificate': { iconSet: 'FontAwesome5', iconName: 'certificate' },
  'piggybank': { iconSet: 'FontAwesome5', iconName: 'piggy-bank' },
  'safe': { iconSet: 'FontAwesome5', iconName: 'lock' },
  'trending.up': { iconSet: 'FontAwesome5', iconName: 'trending-up' },
  'wallet': { iconSet: 'FontAwesome5', iconName: 'wallet' },
  'university': { iconSet: 'FontAwesome5', iconName: 'university' },
  'handshake': { iconSet: 'FontAwesome5', iconName: 'handshake' },
  'questionmark.circle': { iconSet: 'Ionicons', iconName: 'help-circle-outline' },
  
  // Ícones para IA e assistente virtual
  'brain.head.profile': { iconSet: 'FontAwesome5', iconName: 'brain' },
  'robot': { iconSet: 'FontAwesome5', iconName: 'robot' },
  'microchip': { iconSet: 'FontAwesome5', iconName: 'microchip' },
  'cpu': { iconSet: 'Ionicons', iconName: 'hardware-chip-outline' },
  'sparkles': { iconSet: 'Ionicons', iconName: 'sparkles-outline' },
  'wand.and.stars': { iconSet: 'FontAwesome5', iconName: 'magic' },
  'lightbulb': { iconSet: 'Ionicons', iconName: 'bulb-outline' },
  'chat.bubble': { iconSet: 'Ionicons', iconName: 'chatbubble-outline' },
  'message.circle': { iconSet: 'Ionicons', iconName: 'chatbubbles-outline' },
  'headphones': { iconSet: 'FontAwesome5', iconName: 'headphones' },
  'calculator': { iconSet: 'FontAwesome5', iconName: 'calculator' },
  'list.clipboard': { iconSet: 'FontAwesome5', iconName: 'clipboard-list' },
  'building.columns': { iconSet: 'FontAwesome5', iconName: 'columns' },
  'dollarsign.circle': { iconSet: 'FontAwesome5', iconName: 'dollar-sign' },
  'arrow.right': { iconSet: 'Ionicons', iconName: 'arrow-forward' },
  'chevron.left': { iconSet: 'Ionicons', iconName: 'chevron-back' },
  'minus': { iconSet: 'Ionicons', iconName: 'remove' },
} as IconMapping;

/**
 * An icon component that uses different icon sets based on the mapping.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to the appropriate icon set.
 */
export const IconSymbol = React.memo(({
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
}) => {
  const iconConfig = MAPPING[name];

  if (!iconConfig) {
    return null; // Remove console.warn para melhor performance
  }

  switch (iconConfig.iconSet) {
    case 'MaterialIcons':
      return <MaterialIcons name={iconConfig.iconName} size={size} color={color} style={style} />;
    case 'FontAwesome5':
      return <FontAwesome5 name={iconConfig.iconName} size={size} color={color} style={style} />;
    case 'Ionicons':
      return <Ionicons name={iconConfig.iconName} size={size} color={color} style={style} />;
    default:
      return <MaterialIcons name="error" size={size} color={color} style={style} />;
  }
});