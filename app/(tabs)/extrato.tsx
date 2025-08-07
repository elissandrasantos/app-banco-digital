import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatCurrency, formatDate } from '@/utils/performance';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  description: string;
  amount: number;
  date: string;
  category: string;
}

// Função para gerar data otimizada
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Dados estáticos pré-calculados para melhor performance
const TRANSACTIONS_7_DAYS: Transaction[] = [
  { id: '1', type: 'entrada', description: 'Transferência recebida - João', amount: 150.00, date: getDateString(1), category: 'Transferência' },
  { id: '2', type: 'saida', description: 'Farmácia São Paulo', amount: 45.90, date: getDateString(2), category: 'Saúde' },
  { id: '3', type: 'saida', description: 'Uber', amount: 18.50, date: getDateString(3), category: 'Transporte' },
  { id: '4', type: 'saida', description: 'Restaurante Sabor & Arte', amount: 89.90, date: getDateString(4), category: 'Alimentação' },
  { id: '5', type: 'saida', description: 'Netflix', amount: 39.90, date: getDateString(5), category: 'Entretenimento' },
  { id: '6', type: 'saida', description: 'Supermercado Extra', amount: 156.78, date: getDateString(6), category: 'Alimentação' }
];

const TRANSACTIONS_30_DAYS: Transaction[] = [
  ...TRANSACTIONS_7_DAYS,
  { id: '7', type: 'entrada', description: 'Salário', amount: 3500.00, date: getDateString(10), category: 'Salário' },
  { id: '8', type: 'saida', description: 'Aluguel', amount: 1200.00, date: getDateString(12), category: 'Moradia' },
  { id: '9', type: 'saida', description: 'Conta de luz', amount: 156.78, date: getDateString(14), category: 'Contas' },
  { id: '10', type: 'saida', description: 'Conta de água', amount: 87.45, date: getDateString(14), category: 'Contas' }
];

// Componente de item de transação memoizado
const TransactionItem = memo(({
  item,
  isDark,
  onPress
}: {
  item: Transaction;
  isDark: boolean;
  onPress: (item: Transaction) => void;
}) => {
  const handlePress = useCallback(() => onPress(item), [item, onPress]);

  return (
    <TouchableOpacity
      style={[styles.transactionItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      onPress={handlePress}
    >
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
    </TouchableOpacity>
  );
});

export default function ExtratoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('30dias');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Selecionar transações por período (memoizado)
  const transactionsByPeriod = useMemo(() => {
    switch (selectedPeriod) {
      case '7dias':
        return TRANSACTIONS_7_DAYS;
      case '30dias':
        return TRANSACTIONS_30_DAYS;
      default:
        return TRANSACTIONS_30_DAYS;
    }
  }, [selectedPeriod]);

  // Filtrar transações (otimizado)
  const filteredTransactions = useMemo(() => {
    let filtered = transactionsByPeriod;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedCategories.includes(transaction.category)
      );
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedTypes.includes(transaction.type)
      );
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactionsByPeriod, searchQuery, selectedCategories, selectedTypes]);

  // Calcular totais (otimizado)
  const totals = useMemo(() => {
    let entrada = 0;
    let saida = 0;

    for (const transaction of filteredTransactions) {
      if (transaction.type === 'entrada') {
        entrada += transaction.amount;
      } else {
        saida += transaction.amount;
      }
    }

    return { entrada, saida };
  }, [filteredTransactions]);

  // Categorias únicas (memoizado)
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    TRANSACTIONS_30_DAYS.forEach(transaction => {
      uniqueCategories.add(transaction.category);
    });
    return Array.from(uniqueCategories).sort();
  }, []);

  // Callbacks memoizados
  const handleExport = useCallback(() => {
    Alert.alert(
      "Exportar Extrato",
      "Escolha o formato de exportação",
      [
        { text: "PDF", onPress: () => Alert.alert("Sucesso", "Extrato exportado como PDF") },
        { text: "CSV", onPress: () => Alert.alert("Sucesso", "Extrato exportado como CSV") },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  }, []);

  const handleTransactionPress = useCallback((item: Transaction) => {
    Alert.alert(
      "Detalhes",
      `${item.description}\nValor: ${formatCurrency(item.amount)}\nData: ${formatDate(item.date)}\nCategoria: ${item.category}`
    );
  }, []);

  const toggleSearch = useCallback(() => {
    setShowSearch(prev => !prev);
  }, []);

  const toggleFilterModal = useCallback(() => {
    setShowFilterModal(prev => !prev);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const toggleCategoryFilter = useCallback((category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleTypeFilter = useCallback((type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedTypes([]);
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>Extrato</ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={toggleSearch}>
            <IconSymbol name="magnifyingglass" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleFilterModal}>
            <IconSymbol name="line.3.horizontal.decrease" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
            <IconSymbol name="arrow.down.doc" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>
      </ThemedView>

      {/* Barra de busca */}
      {showSearch && (
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <IconSymbol name="magnifyingglass" size={20} color={isDark ? '#999' : '#666'} />
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#fff' : '#000' }]}
            placeholder="Buscar transações..."
            placeholderTextColor={isDark ? '#999' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <IconSymbol name="xmark.circle.fill" size={20} color={isDark ? '#999' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Período */}
      <ThemedView style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['7dias', '30dias'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
                { backgroundColor: selectedPeriod === period ? '#0000FF' : (isDark ? '#1a1a1a' : '#fff') }
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <ThemedText style={[
                styles.periodText,
                selectedPeriod === period && { color: '#fff' }
              ]}>
                {period === '7dias' ? '7 dias' : '30 dias'}
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
              +{formatCurrency(totals.entrada)}
            </ThemedText>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <ThemedText style={styles.summaryLabel}>Saídas</ThemedText>
            <ThemedText style={[styles.summaryValue, { color: '#FF3B30' }]}>
              -{formatCurrency(totals.saida)}
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Lista de Transações */}
      {filteredTransactions.length > 0 ? (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          >
            {filteredTransactions.map((item) => (
              <TransactionItem
                key={item.id}
                item={item}
                isDark={isDark}
                onPress={handleTransactionPress}
              />
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <IconSymbol name="doc.text" size={48} color={isDark ? '#666' : '#ccc'} />
          <ThemedText style={styles.emptyStateText}>Nenhuma transação encontrada</ThemedText>
        </View>
      )}

      {/* Modal de Filtros */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={toggleFilterModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Filtros</ThemedText>
              <TouchableOpacity onPress={toggleFilterModal}>
                <IconSymbol name="xmark" size={24} color={isDark ? '#fff' : '#333'} />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.filterSectionTitle}>Tipo de transação</ThemedText>
            <View style={styles.filterOptions}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedTypes.includes('entrada') && styles.filterOptionSelected,
                  { borderColor: isDark ? '#333' : '#e0e0e0' }
                ]}
                onPress={() => toggleTypeFilter('entrada')}
              >
                <ThemedText style={[
                  styles.filterOptionText,
                  selectedTypes.includes('entrada') && { color: '#0000FF' }
                ]}>Entradas</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedTypes.includes('saida') && styles.filterOptionSelected,
                  { borderColor: isDark ? '#333' : '#e0e0e0' }
                ]}
                onPress={() => toggleTypeFilter('saida')}
              >
                <ThemedText style={[
                  styles.filterOptionText,
                  selectedTypes.includes('saida') && { color: '#0000FF' }
                ]}>Saídas</ThemedText>
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.filterSectionTitle}>Categorias</ThemedText>
            <ScrollView style={{ maxHeight: 200 }}>
              <View style={styles.filterCategories}>
                {categories.map(category => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterCategory,
                      selectedCategories.includes(category) && styles.filterCategorySelected,
                      { borderColor: isDark ? '#333' : '#e0e0e0' }
                    ]}
                    onPress={() => toggleCategoryFilter(category)}
                  >
                    <ThemedText style={[
                      styles.filterCategoryText,
                      selectedCategories.includes(category) && { color: '#0000FF' }
                    ]}>{category}</ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOutline]}
                onPress={clearFilters}
              >
                <ThemedText style={styles.modalButtonOutlineText}>Limpar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonFilled]}
                onPress={toggleFilterModal}
              >
                <ThemedText style={styles.modalButtonFilledText}>Aplicar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  periodContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  periodButtonActive: {
    backgroundColor: '#0000FF',
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
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterOptionSelected: {
    borderColor: '#0000FF',
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
  },
  filterOptionText: {
    fontSize: 14,
  },
  filterCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  filterCategory: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  filterCategorySelected: {
    borderColor: '#0000FF',
    backgroundColor: 'rgba(0, 0, 255, 0.1)',
  },
  filterCategoryText: {
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonOutline: {
    borderWidth: 1,
    borderColor: '#0000FF',
    marginRight: 8,
  },
  modalButtonOutlineText: {
    color: '#0000FF',
    fontWeight: '600',
  },
  modalButtonFilled: {
    backgroundColor: '#0000FF',
    marginLeft: 8,
  },
  modalButtonFilledText: {
    color: '#fff',
    fontWeight: '600',
  },
});