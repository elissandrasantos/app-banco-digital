import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface MenuOption {
  id: string;
  title: string;
  icon: string;
  description?: string;
  action: () => void;
}

export default function PerfilScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleMenuPress = (title: string) => {
    Alert.alert('Funcionalidade', `${title} em desenvolvimento`);
  };

  const accountOptions: MenuOption[] = [
    {
      id: 'dados',
      title: 'Meus dados',
      icon: 'person',
      description: 'Informações pessoais e documentos',
      action: () => handleMenuPress('Meus dados')
    },
    {
      id: 'cartoes',
      title: 'Meus cartões',
      icon: 'creditcard',
      description: 'Gerenciar cartões de débito e crédito',
      action: () => handleMenuPress('Meus cartões')
    },
    {
      id: 'pix',
      title: 'Minhas chaves PIX',
      icon: 'qrcode',
      description: 'Gerenciar chaves PIX cadastradas',
      action: () => handleMenuPress('Minhas chaves PIX')
    },
    {
      id: 'limites',
      title: 'Limites e permissões',
      icon: 'shield',
      description: 'Configurar limites de transações',
      action: () => handleMenuPress('Limites e permissões')
    },
  ];

  const appOptions: MenuOption[] = [
    {
      id: 'notificacoes',
      title: 'Notificações',
      icon: 'bell',
      description: 'Configurar alertas e avisos',
      action: () => handleMenuPress('Notificações')
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      icon: 'lock',
      description: 'Biometria, senha e autenticação',
      action: () => handleMenuPress('Segurança')
    },
    {
      id: 'privacidade',
      title: 'Privacidade',
      icon: 'eye.slash',
      description: 'Controle de dados e privacidade',
      action: () => handleMenuPress('Privacidade')
    },
    {
      id: 'ajuda',
      title: 'Ajuda',
      icon: 'questionmark.circle',
      description: 'Central de ajuda e suporte',
      action: () => handleMenuPress('Ajuda')
    },
  ];

  const renderMenuItem = (item: MenuOption) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      onPress={item.action}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIcon, { backgroundColor: isDark ? '#333' : '#f0f0f0' }]}>
          <IconSymbol name={item.icon as any} size={20} color="#0000FF" />
        </View>
        <View style={styles.menuItemText}>
          <ThemedText style={styles.menuItemTitle}>{item.title}</ThemedText>
          {item.description && (
            <ThemedText style={styles.menuItemDescription}>{item.description}</ThemedText>
          )}
        </View>
      </View>
      <IconSymbol name="chevron.right" size={16} color={isDark ? '#888' : '#666'} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Perfil
          </ThemedText>
        </ThemedView>

        {/* Informações do Usuário */}
        <ThemedView style={[styles.userCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.userAvatar}>
            <ThemedText style={styles.userInitial}>JS</ThemedText>
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>Maria Silva</ThemedText>
            <ThemedText style={styles.userDetails}>CPF: 123.456.789-00</ThemedText>
            <ThemedText style={styles.userDetails}>Agência: 1234 • Conta: 56789-0</ThemedText>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <IconSymbol name="pencil" size={20} color="#0000FF" />
          </TouchableOpacity>
        </ThemedView>

        {/* Conta */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Minha conta</ThemedText>
          <View style={styles.menuGroup}>
            {accountOptions.map(renderMenuItem)}
          </View>
        </ThemedView>

        {/* Aplicativo */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Aplicativo</ThemedText>
          <View style={styles.menuGroup}>
            {appOptions.map(renderMenuItem)}
          </View>
        </ThemedView>

        {/* Ações */}
        <ThemedView style={styles.section}>
          <TouchableOpacity
            style={[styles.actionButton, styles.logoutButton]}
            onPress={() => Alert.alert('Sair', 'Deseja realmente sair da conta?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Sair', style: 'destructive', onPress: () => handleMenuPress('Logout') }
            ])}
          >
            <IconSymbol name="arrow.right.square" size={20} color="#FF3B30" />
            <ThemedText style={[styles.actionButtonText, { color: '#FF3B30' }]}>
              Sair da conta
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Informações do App */}
        <ThemedView style={styles.appInfo}>
          <ThemedText style={styles.appVersion}>Versão 1.0.0</ThemedText>
          <ThemedText style={styles.appCopyright}>© 2025 Meu Banco Digital</ThemedText>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0000FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInitial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  userDetails: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  editButton: {
    padding: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  menuGroup: {
    gap: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
    borderRadius: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    opacity: 0.6,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  appVersion: {
    fontSize: 14,
    opacity: 0.6,
    marginBottom: 4,
  },
  appCopyright: {
    fontSize: 12,
    opacity: 0.5,
  },
});