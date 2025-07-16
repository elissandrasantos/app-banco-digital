import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  // Cor principal do app (azul)
  const primaryColor = isDark ? '#4040FF' : '#0000FF';

  // Dados do usuário
  const userData = {
    name: 'Maria Silva',
  };

  // Dados do cartão
  const cardData = {
    totalLimit: 10000.00,
    usedLimit: 8000.00,
    availableLimit: 2000.00,
    invoiceValue: 2723.03,
    invoiceDueDate: '15/09/2022',
    purchaseDay: 11,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: `${primaryColor}20` }]}>
              <IconSymbol name="person.fill" size={24} color={primaryColor} />
            </View>
            <ThemedText style={styles.userName}>{userData.name}</ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <IconSymbol name="eye" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <IconSymbol name="bell" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Credit Card Limit */}
        <View style={[styles.limitCard, { backgroundColor: primaryColor }]}>
          <View style={styles.limitHeader}>
            <ThemedText style={styles.limitTitle}>Limite total</ThemedText>
            <View style={styles.bankLogo}>
              <ThemedText style={styles.bankLogoText}>XYZ</ThemedText>
            </View>
          </View>

          <ThemedText style={styles.limitValue}>
            R$ {cardData.totalLimit.toFixed(2).replace('.', ',')}
          </ThemedText>

          <View style={styles.limitDetails}>
            <View style={styles.limitItem}>
              <ThemedText style={styles.limitItemTitle}>Limite utilizado</ThemedText>
              <ThemedText style={styles.limitItemValue}>
                R$ {cardData.usedLimit.toFixed(2).replace('.', ',')}
              </ThemedText>
            </View>
            <View style={styles.limitItem}>
              <ThemedText style={styles.limitItemTitle}>Limite disponível</ThemedText>
              <ThemedText style={styles.limitItemValue}>
                R$ {cardData.availableLimit.toFixed(2).replace('.', ',')}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('cartao')}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${primaryColor}20` }]}>
              <IconSymbol name="qrcode" size={24} color={primaryColor} />
            </View>
            <ThemedText style={styles.actionText}>Pagar com QR Code</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('faturas')}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${primaryColor}20` }]}>
              <IconSymbol name="doc.text" size={24} color={primaryColor} />
            </View>
            <ThemedText style={styles.actionText}>Últimas faturas</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('cartao')}
          >
            <View style={[styles.actionIcon, { backgroundColor: `${primaryColor}20` }]}>
              <IconSymbol name="creditcard" size={24} color={primaryColor} />
            </View>
            <ThemedText style={styles.actionText}>Cartão virtual</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Current Invoice */}
        <View style={styles.invoiceSection}>
          <ThemedText style={styles.sectionTitle}>Fatura aberta</ThemedText>

          <View style={styles.invoiceDetails}>
            <View style={styles.invoiceRow}>
              <ThemedText style={styles.invoiceLabel}>Valor previsto da fatura</ThemedText>
              <ThemedText style={styles.invoiceValue}>
                R$ {cardData.invoiceValue.toFixed(2).replace('.', ',')}
              </ThemedText>
            </View>

            <View style={styles.invoiceRow}>
              <ThemedText style={styles.invoiceLabel}>Vencimento</ThemedText>
              <ThemedText style={styles.invoiceValue}>{cardData.invoiceDueDate}</ThemedText>
            </View>
          </View>

          <View style={styles.purchaseInfo}>
            <IconSymbol name="calendar" size={20} color="#666" />
            <ThemedText style={styles.purchaseText}>
              Compras a partir do dia {cardData.purchaseDay} entrarão na próxima fatura.
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[styles.invoiceButton, { backgroundColor: primaryColor }]}
            onPress={() => router.push('faturas')}
          >
            <ThemedText style={styles.invoiceButtonText}>Ver fatura</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Removida a barra de navegação manual para evitar duplicação */}
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  limitCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  limitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  limitTitle: {
    fontSize: 16,
    color: '#fff',
  },
  bankLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankLogoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  limitValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  limitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  limitItem: {
    flex: 1,
  },
  limitItemTitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  limitItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    width: '30%',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  invoiceSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  invoiceDetails: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  invoiceLabel: {
    fontSize: 14,
    color: '#666',
  },
  invoiceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  purchaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  purchaseText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  invoiceButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  invoiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonActive: {
    borderTopWidth: 2,
    borderTopColor: '#0000FF',
    paddingTop: 2,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#999',
  },
});