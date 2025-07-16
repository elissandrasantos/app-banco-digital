import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  description: string;
  amount: number;
  date: string;
  category: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'entrada',
    description: 'Transferência recebida',
    amount: 500.00,
    date: '2025-01-16',
    category: 'Transferência'
  },
  {
    id: '2',
    type: 'saida',
    description: 'Pagamento PIX - Supermercado',
    amount: 89.90,
    date: '2025-01-15',
    category: 'Alimentação'
  },
  {
    id: '3',
    type: 'saida',
    description: 'Conta de luz',
    amount: 156.78,
    date: '2025-01-14',
    category: 'Contas'
  },
  {
    id: '4',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: '2025-01-10',
    category: 'Salário'
  },
  {
    id: '5',
    type: 'saida',
    description: 'Transferência enviada',
    amount: 200.00,
    date: '2025-01-09',
    category: 'Transferência'
  },
];

export default function ExtratoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('30dias');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <View style={[styles.transactionItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={[
        styles.transactionIcon,
        { backgroundColor: item.type === 'entrada' ? '#E8F5E8' : '#FFF0F0' }
      ]}>
        <IconSymbol 
          name={item.type === 'entrada' ? 'arrow.down' : 'arrow.up'} 
          size={20} 
          color={item.type === 'entrada' ? '#34C759' : '#FF3B30'} 
        />
      </View>
      <View style={styles.transactionDetails}>
        <ThemedText style={styles.transactionTitle}>{item.description}</ThemedText>
        <ThemedText style={styles.transactionCategory}>{item.category}</ThemedText>
        <ThemedText style={styles.transactionDate}>{formatDate(item.date)}</ThemedText>
      </View>
      <ThemedText style={[
        styles.transactionAmount,
        { color: item.type === 'entrada' ? '#34C759' : '#FF3B30' }
      ]}>
        {item.type === 'entrada' ? '+' : '-'}{formatCurrency(item.amount)}
      </ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Extrato
        </ThemedText>
        <TouchableOpacity style={styles.filterButton}>
          <IconSymbol name="line.3.horizontal.decrease" size={24} color={isDark ? '#fff' : '#333'} />
        </TouchableOpacity>
      </ThemedView>

      {/* Período */}
      <ThemedView style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
          {['7dias', '30dias', '3meses', '6meses'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
                { backgroundColor: selectedPeriod === period ? '#007AFF' : (isDark ? '#1a1a1a' : '#fff') }
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <ThemedText style={[
                styles.periodText,
                selectedPeriod === period && { color: '#fff' }
              ]}>
                {period === '7dias' ? '7 dias' : 
                 period === '30dias' ? '30 dias' :
                 period === '3meses' ? '3 meses' : '6 meses'}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      {/* Resumo */}
      <ThemedView style={styles.summary}>
        <View style={[styles.summaryCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Entradas</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: '#34C759' }]}>
              +R$ 4.000,00
            </ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Saídas</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: '#FF3B30' }]}>
              -R$ 1.152,50
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Lista de Transações */}
      <FlatList
        data={MOCK_TRANSACTIONS}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.transactionsList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  periodScroll: {
    flexDirection: 'row',
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  periodButtonActive: {
    backgroundColor: '#007AFF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  summary: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  summaryLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  transactionsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: 12,
    opacity: 0.6,
    marginBottom: 2,
  },
  transactionDate: {
    fontSize: 12,
    opacity: 0.5,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});