import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  // Cor principal do app (azul)
  const primaryColor = Colors[colorScheme ?? 'light'].primary;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com logo MIROBANK */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>MIROBANK</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <IconSymbol name="eye" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <IconSymbol name="magnifyingglass" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <View style={styles.profileIcon}>
                <IconSymbol name="person.fill" size={24} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Seleção de país */}
        <View style={styles.countrySelector}>
          <TouchableOpacity style={[styles.countryButton, styles.activeCountry]}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>🇧🇷</Text>
            </View>
            <Text style={styles.countryText}>Brasil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.countryButton}>
            <View style={styles.flagContainer}>
              <Text style={styles.flagEmoji}>🇺🇸</Text>
            </View>
            <Text style={styles.countryText}>Global</Text>
          </TouchableOpacity>
        </View>

        {/* Conta Digital */}
        <View style={styles.accountCard}>
          <Text style={styles.accountLabel}>Conta Digital</Text>

          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>R$ 1.500,00</Text>
            <TouchableOpacity>
              <IconSymbol name="chevron.right" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Botões de ação rápida */}
          <View style={styles.quickActionButtons}>
            <TouchableOpacity style={styles.actionPill}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#333" />
              <Text style={styles.actionPillText}>Pix</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill}>
              <IconSymbol name="barcode" size={20} color="#333" />
              <Text style={styles.actionPillText}>Pagar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu de ícones */}
        <View style={styles.iconMenu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/cartao')}
          >
            <View style={styles.menuIconContainer}>
              <IconSymbol name="creditcard" size={24} color="#333" />
            </View>
            <Text style={styles.menuText}>Cartões</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconSymbol name="chart.line.uptrend.xyaxis" size={24} color="#333" />
            </View>
            <Text style={styles.menuText}>Investir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconSymbol name="phone" size={24} color="#333" />
            </View>
            <Text style={styles.menuText}>Recarga</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <IconSymbol name="ellipsis" size={24} color="#333" />
            </View>
            <Text style={styles.menuText}>Mostrar mais</Text>
          </TouchableOpacity>
        </View>

        {/* Extrato de Transações */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Extrato</Text>
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() => router.push('/(tabs)/extrato')}
            >
              <Text style={styles.seeAllText}>Ver tudo</Text>
              <IconSymbol name="chevron.right" size={16} color="#0000FF" />
            </TouchableOpacity>
          </View>

          {/* Lista de transações */}
          <View style={styles.transactionsList}>
            {/* Transação 1 */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                <IconSymbol name="arrow.down" size={18} color="#4CAF50" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Transferência recebida</Text>
                <Text style={styles.transactionDate}>Hoje • 14:32</Text>
              </View>
              <Text style={styles.transactionAmountPositive}>+ R$ 150,00</Text>
            </View>

            {/* Transação 2 */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                <IconSymbol name="arrow.up" size={18} color="#FF3B30" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Pagamento de boleto</Text>
                <Text style={styles.transactionDate}>Hoje • 10:15</Text>
              </View>
              <Text style={styles.transactionAmountNegative}>- R$ 89,90</Text>
            </View>

            {/* Transação 3 */}
            <View style={styles.transactionItem}>
              <View style={styles.transactionIconContainer}>
                <IconSymbol name="arrow.up" size={18} color="#FF3B30" />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>Compra com cartão</Text>
                <Text style={styles.transactionDate}>Ontem • 19:45</Text>
              </View>
              <Text style={styles.transactionAmountNegative}>- R$ 52,30</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoContainer: {
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0000FF', // Cor azul para o MIROBANK
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countrySelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  activeCountry: {
    backgroundColor: '#fff',
  },
  flagContainer: {
    marginRight: 8,
  },
  flagEmoji: {
    fontSize: 20,
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
  accountCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  accountLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  quickActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginRight: 10,
  },
  actionPillText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  iconMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  menuItem: {
    alignItems: 'center',
    width: '22%',
  },
  menuIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  // Estilos para a seção de extrato
  transactionsSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#0000FF',
    marginRight: 4,
  },
  transactionsList: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmountPositive: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  transactionAmountNegative: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
  },
});