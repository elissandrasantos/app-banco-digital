import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
  id: string;
  store: string;
  category: string;
  date: string;
  value: number;
  icon: string;
  color: string;
}

interface InvoiceData {
  status: 'paga' | 'aberta' | 'atrasada' | 'futura';
  value: number;
  paymentDate?: string;
  dueDate: string;
  transactions: Transaction[];
}

export default function FaturasScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('Maio/22');

  // Cor principal do app (azul)
  const primaryColor = isDark ? '#4040FF' : '#0000FF';

  // Meses disponíveis
  const months = ['Abril/22', 'Maio/22', 'Junho/22', 'Julho/22'];

  // Dados das faturas por mês
  const invoicesData: Record<string, InvoiceData> = {
    'Abril/22': {
      status: 'paga',
      value: 1756.45,
      paymentDate: '03/04/2022',
      dueDate: '10/04/2022',
      transactions: [
        {
          id: '1',
          store: 'Supermercado Extra',
          category: 'Alimentação - Final 1999',
          date: '25/03/2022',
          value: 352.78,
          icon: 'cart',
          color: '#4CAF50',
        },
        {
          id: '2',
          store: 'Netflix',
          category: 'Streaming - Final 1999',
          date: '20/03/2022',
          value: 39.90,
          icon: 'tv',
          color: '#E50914',
        },
        {
          id: '3',
          store: 'Posto Shell',
          category: 'Combustível - Final 1999',
          date: '18/03/2022',
          value: 150.00,
          icon: 'fuelpump',
          color: '#FFCC00',
        },
      ],
    },
    'Maio/22': {
      status: 'paga',
      value: 2888.90,
      paymentDate: '05/05/2022',
      dueDate: '15/05/2022',
      transactions: [
        {
          id: '1',
          store: 'PPRO Adobe',
          category: 'Outros - Final 1999',
          date: '19/04/2022',
          value: 89.90,
          icon: 'square.and.pencil',
          color: '#333333',
        },
        {
          id: '2',
          store: 'Cinemark',
          category: 'Lazer - Final 1999',
          date: '15/04/2022',
          value: 58.00,
          icon: 'ticket',
          color: '#F5C518',
        },
        {
          id: '3',
          store: '99pop - TRIP',
          category: 'Transporte - Final 1999',
          date: '10/04/2022',
          value: 24.90,
          icon: 'car',
          color: '#F5C518',
        },
      ],
    },
    'Junho/22': {
      status: 'aberta',
      value: 1245.67,
      dueDate: '15/06/2022',
      transactions: [
        {
          id: '1',
          store: 'Amazon',
          category: 'Compras - Final 1999',
          date: '28/05/2022',
          value: 459.90,
          icon: 'bag',
          color: '#FF9900',
        },
        {
          id: '2',
          store: 'Farmácia',
          category: 'Saúde - Final 1999',
          date: '22/05/2022',
          value: 87.65,
          icon: 'cross',
          color: '#4CAF50',
        },
        {
          id: '3',
          store: 'Restaurante Outback',
          category: 'Alimentação - Final 1999',
          date: '15/05/2022',
          value: 198.50,
          icon: 'fork.knife',
          color: '#8B4513',
        },
      ],
    },
    'Julho/22': {
      status: 'futura',
      value: 0,
      dueDate: '15/07/2022',
      transactions: [],
    },
  };

  // Obter os dados da fatura selecionada
  const currentInvoice = invoicesData[selectedMonth];

  // Determinar a cor e o texto do status
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'paga':
        return { color: '#4CAF50', text: 'Fatura paga' };
      case 'aberta':
        return { color: primaryColor, text: 'Fatura aberta' };
      case 'atrasada':
        return { color: '#FF3B30', text: 'Fatura atrasada' };
      case 'futura':
        return { color: '#999999', text: 'Fatura futura' };
      default:
        return { color: '#999999', text: 'Status desconhecido' };
    }
  };

  const statusInfo = getStatusInfo(currentInvoice.status);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: `${primaryColor}20` }]}
          >
            <IconSymbol name="arrow.left" size={20} color={primaryColor} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Faturas</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Month Selector */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthsContainer}
          >
            {months.map((month) => (
              <TouchableOpacity
                key={month}
                style={[
                  styles.monthButton,
                  selectedMonth === month && { borderBottomColor: primaryColor, borderBottomWidth: 2 }
                ]}
                onPress={() => setSelectedMonth(month)}
              >
                <ThemedText style={[
                  styles.monthText,
                  selectedMonth === month && { color: primaryColor, fontWeight: 'bold' }
                ]}>
                  {month}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Invoice Summary */}
          <View style={styles.invoiceSummary}>
            <View style={styles.statusContainer}>
              <ThemedText style={[styles.statusText, { color: statusInfo.color }]}>
                {statusInfo.text}
              </ThemedText>
            </View>
            
            <ThemedText style={styles.invoiceValue}>
              R$ {currentInvoice.value.toFixed(2).replace('.', ',')}
            </ThemedText>
            
            <View style={styles.dateContainer}>
              {currentInvoice.paymentDate && (
                <View style={styles.dateItem}>
                  <ThemedText style={styles.dateLabel}>Pagamento</ThemedText>
                  <ThemedText style={styles.dateValue}>{currentInvoice.paymentDate}</ThemedText>
                </View>
              )}
              <View style={styles.dateItem}>
                <ThemedText style={styles.dateLabel}>Vencimento</ThemedText>
                <ThemedText style={styles.dateValue}>{currentInvoice.dueDate}</ThemedText>
              </View>
            </View>
          </View>

          {/* Summary Button */}
          <TouchableOpacity style={styles.summaryButton}>
            <ThemedText style={[styles.summaryButtonText, { color: primaryColor }]}>
              Resumo e encargos
            </ThemedText>
            <IconSymbol name="chevron.right" size={16} color={primaryColor} />
          </TouchableOpacity>

          {/* Transactions */}
          <View style={styles.transactionsContainer}>
            <ThemedText style={styles.transactionsTitle}>Compras e pagamentos</ThemedText>
            
            {currentInvoice.transactions.length > 0 ? (
              currentInvoice.transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItem}>
                  <View style={[styles.transactionIcon, { backgroundColor: transaction.color }]}>
                    <IconSymbol name={transaction.icon as any} size={20} color="#fff" />
                  </View>
                  <View style={styles.transactionDetails}>
                    <ThemedText style={styles.transactionStore}>{transaction.store}</ThemedText>
                    <ThemedText style={styles.transactionCategory}>{transaction.category}</ThemedText>
                    <ThemedText style={styles.transactionDate}>{transaction.date}</ThemedText>
                  </View>
                  <ThemedText style={styles.transactionValue}>
                    R$ {transaction.value.toFixed(2).replace('.', ',')}
                  </ThemedText>
                </View>
              ))
            ) : (
              <View style={styles.emptyTransactions}>
                <IconSymbol name="doc.text" size={40} color="#ccc" />
                <ThemedText style={styles.emptyText}>
                  Não há transações para este período
                </ThemedText>
              </View>
            )}
          </View>

          {/* Download Button */}
          {currentInvoice.status !== 'futura' && (
            <TouchableOpacity 
              style={[styles.downloadButton, { backgroundColor: primaryColor }]}
            >
              <ThemedText style={styles.downloadButtonText}>
                {currentInvoice.status === 'aberta' ? 'Pagar fatura' : 'Baixar fatura'}
              </ThemedText>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
  backButton: {
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  monthsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  monthButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  monthText: {
    fontSize: 16,
    color: '#666',
  },
  invoiceSummary: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  statusContainer: {
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  invoiceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  dateItem: {
    marginRight: 24,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: '#333',
  },
  summaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 24,
  },
  summaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionStore: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: '#999',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  downloadButton: {
    marginHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 100,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  emptyTransactions: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
});