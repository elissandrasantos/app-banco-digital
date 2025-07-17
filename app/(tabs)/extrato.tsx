import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useMemo, useState } from 'react';
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

// Função para gerar data no formato ISO
const getDateString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

// Transações dos últimos 7 dias
const TRANSACTIONS_7_DAYS: Transaction[] = [
  {
    id: '1',
    type: 'entrada',
    description: 'Transferência recebida - João',
    amount: 150.00,
    date: getDateString(1),
    category: 'Transferência'
  },
  {
    id: '2',
    type: 'saida',
    description: 'Farmácia São Paulo',
    amount: 45.90,
    date: getDateString(2),
    category: 'Saúde'
  },
  {
    id: '3',
    type: 'saida',
    description: 'Uber',
    amount: 18.50,
    date: getDateString(3),
    category: 'Transporte'
  },
  {
    id: '4',
    type: 'saida',
    description: 'Restaurante Sabor & Arte',
    amount: 89.90,
    date: getDateString(4),
    category: 'Alimentação'
  },
  {
    id: '5',
    type: 'saida',
    description: 'Netflix',
    amount: 39.90,
    date: getDateString(5),
    category: 'Entretenimento'
  },
  {
    id: '6',
    type: 'saida',
    description: 'Supermercado Extra',
    amount: 156.78,
    date: getDateString(6),
    category: 'Alimentação'
  }
];

// Transações dos últimos 30 dias (inclui as dos 7 dias)
const TRANSACTIONS_30_DAYS: Transaction[] = [
  ...TRANSACTIONS_7_DAYS,
  {
    id: '7',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: getDateString(10),
    category: 'Salário'
  },
  {
    id: '8',
    type: 'saida',
    description: 'Aluguel',
    amount: 1200.00,
    date: getDateString(12),
    category: 'Moradia'
  },
  {
    id: '9',
    type: 'saida',
    description: 'Conta de luz',
    amount: 156.78,
    date: getDateString(14),
    category: 'Contas'
  },
  {
    id: '10',
    type: 'saida',
    description: 'Conta de água',
    amount: 87.45,
    date: getDateString(14),
    category: 'Contas'
  },
  {
    id: '11',
    type: 'saida',
    description: 'Internet',
    amount: 99.90,
    date: getDateString(15),
    category: 'Contas'
  },
  {
    id: '12',
    type: 'saida',
    description: 'Spotify',
    amount: 19.90,
    date: getDateString(18),
    category: 'Entretenimento'
  },
  {
    id: '13',
    type: 'saida',
    description: 'Academia',
    amount: 89.90,
    date: getDateString(20),
    category: 'Saúde'
  },
  {
    id: '14',
    type: 'entrada',
    description: 'Transferência recebida - Maria',
    amount: 250.00,
    date: getDateString(22),
    category: 'Transferência'
  },
  {
    id: '15',
    type: 'saida',
    description: 'Shopping Center',
    amount: 320.50,
    date: getDateString(25),
    category: 'Compras'
  },
  {
    id: '16',
    type: 'saida',
    description: 'Estacionamento',
    amount: 25.00,
    date: getDateString(28),
    category: 'Transporte'
  }
];

// Transações dos últimos 3 meses (inclui as dos 30 dias)
const TRANSACTIONS_3_MONTHS: Transaction[] = [
  ...TRANSACTIONS_30_DAYS,
  {
    id: '17',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: getDateString(40),
    category: 'Salário'
  },
  {
    id: '18',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: getDateString(70),
    category: 'Salário'
  },
  {
    id: '19',
    type: 'saida',
    description: 'Aluguel',
    amount: 1200.00,
    date: getDateString(42),
    category: 'Moradia'
  },
  {
    id: '20',
    type: 'saida',
    description: 'Aluguel',
    amount: 1200.00,
    date: getDateString(72),
    category: 'Moradia'
  },
  {
    id: '21',
    type: 'saida',
    description: 'IPTU',
    amount: 450.00,
    date: getDateString(45),
    category: 'Impostos'
  },
  {
    id: '22',
    type: 'saida',
    description: 'Seguro do carro',
    amount: 180.00,
    date: getDateString(50),
    category: 'Transporte'
  },
  {
    id: '23',
    type: 'entrada',
    description: 'Reembolso médico',
    amount: 350.00,
    date: getDateString(55),
    category: 'Saúde'
  },
  {
    id: '24',
    type: 'saida',
    description: 'Manutenção do carro',
    amount: 450.00,
    date: getDateString(60),
    category: 'Transporte'
  },
  {
    id: '25',
    type: 'saida',
    description: 'Presente de aniversário',
    amount: 150.00,
    date: getDateString(65),
    category: 'Compras'
  },
  {
    id: '26',
    type: 'entrada',
    description: 'Dividendos',
    amount: 120.00,
    date: getDateString(75),
    category: 'Investimentos'
  },
  {
    id: '27',
    type: 'saida',
    description: 'Curso online',
    amount: 397.00,
    date: getDateString(80),
    category: 'Educação'
  }
];

// Transações dos últimos 6 meses (inclui as dos 3 meses)
const TRANSACTIONS_6_MONTHS: Transaction[] = [
  ...TRANSACTIONS_3_MONTHS,
  {
    id: '28',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: getDateString(100),
    category: 'Salário'
  },
  {
    id: '29',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: getDateString(130),
    category: 'Salário'
  },
  {
    id: '30',
    type: 'entrada',
    description: 'Salário',
    amount: 3500.00,
    date: getDateString(160),
    category: 'Salário'
  },
  {
    id: '31',
    type: 'saida',
    description: 'Aluguel',
    amount: 1200.00,
    date: getDateString(102),
    category: 'Moradia'
  },
  {
    id: '32',
    type: 'saida',
    description: 'Aluguel',
    amount: 1200.00,
    date: getDateString(132),
    category: 'Moradia'
  },
  {
    id: '33',
    type: 'saida',
    description: 'Aluguel',
    amount: 1200.00,
    date: getDateString(162),
    category: 'Moradia'
  },
  {
    id: '34',
    type: 'saida',
    description: 'Viagem de férias',
    amount: 2500.00,
    date: getDateString(110),
    category: 'Lazer'
  },
  {
    id: '35',
    type: 'saida',
    description: 'Compra de notebook',
    amount: 3200.00,
    date: getDateString(140),
    category: 'Eletrônicos'
  },
  {
    id: '36',
    type: 'entrada',
    description: 'Restituição IR',
    amount: 1200.00,
    date: getDateString(150),
    category: 'Impostos'
  },
  {
    id: '37',
    type: 'saida',
    description: 'Conserto do ar condicionado',
    amount: 350.00,
    date: getDateString(155),
    category: 'Moradia'
  },
  {
    id: '38',
    type: 'entrada',
    description: 'Venda de item usado',
    amount: 450.00,
    date: getDateString(165),
    category: 'Vendas'
  },
  {
    id: '39',
    type: 'saida',
    description: 'Presente de casamento',
    amount: 300.00,
    date: getDateString(170),
    category: 'Presentes'
  },
  {
    id: '40',
    type: 'saida',
    description: 'Plano de saúde',
    amount: 450.00,
    date: getDateString(175),
    category: 'Saúde'
  }
];

export default function ExtratoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selectedPeriod, setSelectedPeriod] = useState('30dias');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Selecionar o conjunto de transações com base no período
  const getTransactionsByPeriod = () => {
    switch (selectedPeriod) {
      case '7dias':
        return TRANSACTIONS_7_DAYS;
      case '30dias':
        return TRANSACTIONS_30_DAYS;
      case '3meses':
        return TRANSACTIONS_3_MONTHS;
      case '6meses':
        return TRANSACTIONS_6_MONTHS;
      default:
        return TRANSACTIONS_30_DAYS;
    }
  };

  // Filtrar transações com base no período, busca e filtros
  const filteredTransactions = useMemo(() => {
    let filtered = [...getTransactionsByPeriod()];

    // Filtrar por busca
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(query) ||
        transaction.category.toLowerCase().includes(query)
      );
    }

    // Filtrar por categorias selecionadas
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedCategories.includes(transaction.category)
      );
    }

    // Filtrar por tipos selecionados
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedTypes.includes(transaction.type)
      );
    }

    // Ordenar por data (mais recente primeiro)
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedPeriod, searchQuery, selectedCategories, selectedTypes]);

  // Calcular totais
  const totals = useMemo(() => {
    const entrada = filteredTransactions.reduce((sum, transaction) =>
      transaction.type === 'entrada' ? sum + transaction.amount : sum, 0);
    const saida = filteredTransactions.reduce((sum, transaction) =>
      transaction.type === 'saida' ? sum + transaction.amount : sum, 0);
    return { entrada, saida };
  }, [filteredTransactions]);

  // Extrair categorias únicas para o filtro
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    TRANSACTIONS_6_MONTHS.forEach(transaction => {
      uniqueCategories.add(transaction.category);
    });
    return Array.from(uniqueCategories).sort();
  }, []);

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

  const handleExport = () => {
    Alert.alert(
      "Exportar Extrato",
      "Escolha o formato de exportação",
      [
        { text: "PDF", onPress: () => Alert.alert("Sucesso", "Extrato exportado como PDF") },
        { text: "CSV", onPress: () => Alert.alert("Sucesso", "Extrato exportado como CSV") },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleTypeFilter = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.transactionItem, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      onPress={() => Alert.alert("Detalhes", `${item.description}\nValor: ${formatCurrency(item.amount)}\nData: ${formatDate(item.date)}\nCategoria: ${item.category}`)}
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      {/* Header */}
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Extrato
        </ThemedText>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowSearch(!showSearch)}
          >
            <IconSymbol name="magnifyingglass" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowFilterModal(true)}
          >
            <IconSymbol name="line.3.horizontal.decrease" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExport}
          >
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
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol name="xmark.circle.fill" size={20} color={isDark ? '#999' : '#666'} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Período */}
      <ThemedView style={styles.periodContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.periodScroll}>
          {['7dias', '30dias', '3meses', '6meses'].map((period) => (
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
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            decelerationRate="normal"
          >
            {filteredTransactions.map((item) => renderTransactionItem({ item }))}
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
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Filtros</ThemedText>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
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

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonOutline]}
                onPress={() => {
                  setSelectedCategories([]);
                  setSelectedTypes([]);
                }}
              >
                <ThemedText style={styles.modalButtonOutlineText}>Limpar</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonFilled]}
                onPress={() => setShowFilterModal(false)}
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
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
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