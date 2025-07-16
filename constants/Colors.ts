/**
 * Cores do tema para o app de banco digital
 */

const tintColorLight = '#0000FF'; // Azul principal
const tintColorDark = '#4040FF';  // Azul mais claro para modo escuro

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#666666',
    tabIconDefault: '#999999',
    tabIconSelected: tintColorLight,
    card: '#ffffff',
    border: '#e0e0e0',
    success: '#4CAF50',
    error: '#FF3B30',
    warning: '#FF9500',
    primary: '#0000FF',
    primaryLight: '#4040FF',
    primaryDark: '#0000CC',
    grayText: '#666666',
    lightGrayText: '#999999',
  },
  dark: {
    text: '#ffffff',
    background: '#ffffff', // Mantendo fundo branco mesmo no modo escuro para seguir o design da imagem
    tint: tintColorDark,
    icon: '#888888',
    tabIconDefault: '#666666',
    tabIconSelected: tintColorDark,
    card: '#ffffff',
    border: '#e0e0e0',
    success: '#4CAF50',
    error: '#FF3B30',
    warning: '#FF9500',
    primary: '#4040FF',
    primaryLight: '#6060FF',
    primaryDark: '#0000CC',
    grayText: '#666666',
    lightGrayText: '#999999',
  },
};
