import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatCurrency } from '@/utils/performance';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Investment {
  id: string;
  name: string;
  type: 'renda_fixa' | 'renda_variavel' | 'fundos';
  currentValue: number;
  invested: number;
  profitability: number;
  risk: 'baixo' | 'medio' | 'alto';
  icon: string;
  color: string;
}

interface InvestmentOption {
  id: string;
  name: string;
  type: 'renda_fixa' | 'renda_variavel' | 'fundos';
  minValue: number;
  profitability: string;
  risk: 'baixo' | 'medio' | 'alto';
  description: string;
  icon: string;
  color: string;
}

const USER_INVESTMENTS: Investment[] = [
  {
    id: '1',
    name: 'Tesouro Selic 2029',
    type: 'renda_fixa',
    currentValue: 5420.80,
    invested: 5000.00,
    profitability: 8.4,
    risk: 'baixo',
    icon: 'chart.line.uptrend.xyaxis',
    color: '#34C759'
  },
  {
    id: '2',
    name: 'CDB Banco XYZ',
    type: 'renda_fixa',
    currentValue: 2156.30,
    invested: 2000.00,
    profitability: 7.8,
    risk: 'baixo',
    icon: 'building.2',
    color: '#007AFF'
  },
  {
    id: '3',
    name: 'Fundo Multimercado',
    type: 'fundos',
    currentValue: 3890.45,
    invested: 4000.00,
    profitability: -2.7,
    risk: 'medio',
    icon: 'chart.pie',
    color: '#FF9500'
  }
];

const INVESTMENT_OPTIONS: InvestmentOption[] = [
  {
    id: '1',
    name: 'Tesouro Direto',
    type: 'renda_fixa',
    minValue: 100,
    profitability: '100% CDI',
    risk: 'baixo',
    description: 'Títulos públicos com garantia do governo',
    icon: 'landmark',
    color: '#34C759'
  },
  {
    id: '2',
    name: 'CDB',
    type: 'renda_fixa',
    minValue: 500,
    profitability: '110% CDI',
    risk: 'baixo',
    description: 'Certificado de Depósito Bancário',
    icon: 'university',
    color: '#007AFF'
  },
  {
    id: '3',
    name: 'LCI/LCA',
    type: 'renda_fixa',
    minValue: 1000,
    profitability: '95% CDI',
    risk: 'baixo',
    description: 'Isentos de Imposto de Renda',
    icon: 'certificate',
    color: '#32D74B'
  },
  {
    id: '4',
    name: 'Fundos de Investimento',
    type: 'fundos',
    minValue: 100,
    profitability: 'Variável',
    risk: 'medio',
    description: 'Diversificação profissional',
    icon: 'chart.pie',
    color: '#FF9500'
  },
  {
    id: '5',
    name: 'Ações',
    type: 'renda_variavel',
    minValue: 50,
    profitability: 'Variável',
    risk: 'alto',
    description: 'Participação em empresas',
    icon: 'chart.bar',
    color: '#FF3B30'
  },
  {
    id: '6',
    name: 'ETFs',
    type: 'renda_variavel',
    minValue: 100,
    profitability: 'Variável',
    risk: 'medio',
    description: 'Fundos de índice',
    icon: 'globe',
    color: '#AF52DE'
  }
];

const InvestmentCard = memo(({ investment, isDark, onPress }: { investment: Investment; isDark: boolean; onPress: (investment: Investment) => void }) => {
  const handlePress = useCallback(() => onPress(investment), [investment, onPress]);
  const profit = investment.currentValue - investment.invested;
  const isProfit = profit >= 0;

  return (
    <TouchableOpacity style={[styles.investmentCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]} onPress={handlePress}>
      <View style={styles.investmentHeader}>
        <View style={[styles.investmentIcon, { backgroundColor: `${investment.color}20` }]}>
          <IconSymbol name={investment.icon as any} size={24} color={investment.color} />
        </View>
        <View style={styles.investmentInfo}>
          <ThemedText style={styles.investmentName}>{investment.name}</ThemedText>
          <ThemedText style={styles.investmentType}>
            {investment.type === 'renda_fixa' ? 'Renda Fixa' : investment.type === 'renda_variavel' ? 'Renda Variável' : 'Fundos'}
          </ThemedText>
        </View>
        <View style={styles.riskBadge}>
          <ThemedText style={[styles.riskText, { color: investment.risk === 'baixo' ? '#34C759' : investment.risk === 'medio' ? '#FF9500' : '#FF3B30' }]}>
            {investment.risk === 'baixo' ? 'Baixo' : investment.risk === 'medio' ? 'Médio' : 'Alto'}
          </ThemedText>
        </View>
      </View>
      <View style={styles.investmentValues}>
        <View style={styles.valueRow}>
          <ThemedText style={styles.valueLabel}>Valor atual</ThemedText>
          <ThemedText style={styles.currentValue}>{formatCurrency(investment.currentValue)}</ThemedText>
        </View>
        <View style={styles.valueRow}>
          <ThemedText style={styles.valueLabel}>Investido</ThemedText>
          <ThemedText style={styles.investedValue}>{formatCurrency(investment.invested)}</ThemedText>
        </View>
        <View style={styles.valueRow}>
          <ThemedText style={styles.valueLabel}>Rentabilidade</ThemedText>
          <ThemedText style={[styles.profitValue, { color: isProfit ? '#34C759' : '#FF3B30' }]}>
            {isProfit ? '+' : ''}{formatCurrency(profit)} ({investment.profitability > 0 ? '+' : ''}{investment.profitability.toFixed(1)}%)
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const InvestmentOption = memo(({ option, isDark, onPress }: { option: InvestmentOption; isDark: boolean; onPress: (option: InvestmentOption) => void }) => {
  const handlePress = useCallback(() => onPress(option), [option, onPress]);

  return (
    <View style={[styles.optionCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
        <IconSymbol name={option.icon as any} size={28} color={option.color} />
      </View>
      <View style={styles.optionInfo}>
        <ThemedText style={styles.optionName}>{option.name}</ThemedText>
        <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
        <View style={styles.optionDetails}>
          <ThemedText style={styles.optionProfitability}>{option.profitability}</ThemedText>
          <View style={[styles.optionRisk, { backgroundColor: option.risk === 'baixo' ? '#34C75920' : option.risk === 'medio' ? '#FF950020' : '#FF3B3020' }]}>
            <ThemedText style={[styles.optionRiskText, { color: option.risk === 'baixo' ? '#34C759' : option.risk === 'medio' ? '#FF9500' : '#FF3B30' }]}>
              Risco {option.risk === 'baixo' ? 'Baixo' : option.risk === 'medio' ? 'Médio' : 'Alto'}
            </ThemedText>
          </View>
        </View>
        <ThemedText style={styles.minValue}>Mín: {formatCurrency(option.minValue)}</ThemedText>
        <TouchableOpacity style={[styles.investirButton, { backgroundColor: '#0000FF' }]} onPress={handlePress}>
          <ThemedText style={styles.investirButtonText}>Investir</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function InvestirScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'portfolio' | 'opcoes'>('portfolio');
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<InvestmentOption | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [isInvesting, setIsInvesting] = useState(false);

  const portfolioTotals = useMemo(() => {
    const totalInvested = USER_INVESTMENTS.reduce((sum, inv) => sum + inv.invested, 0);
    const totalCurrent = USER_INVESTMENTS.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalProfit = totalCurrent - totalInvested;
    const profitPercentage = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;
    return { totalInvested, totalCurrent, totalProfit, profitPercentage };
  }, []);

  const handleInvestmentPress = useCallback((investment: Investment) => {
    Alert.alert(
      investment.name,
      `Valor atual: ${formatCurrency(investment.currentValue)}\nInvestido: ${formatCurrency(investment.invested)}\nRentabilidade: ${investment.profitability.toFixed(1)}%`,
      [
        { text: 'Resgatar', onPress: () => Alert.alert('Resgate', 'Funcionalidade em desenvolvimento') },
        { text: 'Aportar', onPress: () => Alert.alert('Aporte', 'Funcionalidade em desenvolvimento') },
        { text: 'Fechar', style: 'cancel' }
      ]
    );
  }, []);

  const handleOptionPress = useCallback((option: InvestmentOption) => {
    setSelectedOption(option);
    setShowInvestModal(true);
    setInvestAmount('');
  }, []);

  const handleInvest = useCallback(async () => {
    if (!selectedOption) return;
    const investValue = parseFloat(investAmount.replace(',', '.')) || 0;
    if (investValue < selectedOption.minValue) {
      Alert.alert('Erro', `Valor mínimo para investimento: ${formatCurrency(selectedOption.minValue)}`);
      return;
    }
    setIsInvesting(true);
    setTimeout(() => {
      setIsInvesting(false);
      setShowInvestModal(false);
      Alert.alert('Investimento Realizado!', `Parabéns! Seu investimento foi processado com sucesso!\n\nProduto: ${selectedOption.name}\nValor investido: ${formatCurrency(investValue)}\nVocê pode acompanhar seu investimento na aba "Meus Investimentos".`, [{ text: 'OK' }]);
    }, 2500);
  }, [selectedOption, investAmount]);

  const closeInvestModal = useCallback(() => {
    setShowInvestModal(false);
    setSelectedOption(null);
    setInvestAmount('');
  }, []);

  const handleTabChange = useCallback((tab: 'portfolio' | 'opcoes') => {
    setSelectedTab(tab);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: '#0000FF20' }]}>
            <IconSymbol name="arrow.left" size={20} color="#0000FF" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Investimentos</ThemedText>
          <TouchableOpacity style={styles.helpButton}>
            <IconSymbol name="questionmark.circle" size={24} color="#0000FF" />
          </TouchableOpacity>
        </View>

        <ThemedView style={[styles.portfolioSummary, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <ThemedText style={styles.summaryTitle}>Meu Portfólio</ThemedText>
          <ThemedText style={styles.totalValue}>{formatCurrency(portfolioTotals.totalCurrent)}</ThemedText>
          <View style={styles.profitRow}>
            <ThemedText style={[styles.profitText, { color: portfolioTotals.totalProfit >= 0 ? '#34C759' : '#FF3B30' }]}>
              {portfolioTotals.totalProfit >= 0 ? '+' : ''}{formatCurrency(portfolioTotals.totalProfit)}
            </ThemedText>
            <ThemedText style={[styles.profitPercentage, { color: portfolioTotals.totalProfit >= 0 ? '#34C759' : '#FF3B30' }]}>
              ({portfolioTotals.profitPercentage >= 0 ? '+' : ''}{portfolioTotals.profitPercentage.toFixed(1)}%)
            </ThemedText>
          </View>
        </ThemedView>

        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, selectedTab === 'portfolio' && styles.activeTab, { backgroundColor: selectedTab === 'portfolio' ? '#0000FF' : 'transparent' }]} onPress={() => handleTabChange('portfolio')}>
            <ThemedText style={[styles.tabText, selectedTab === 'portfolio' && { color: '#fff' }]}>Meus Investimentos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, selectedTab === 'opcoes' && styles.activeTab, { backgroundColor: selectedTab === 'opcoes' ? '#0000FF' : 'transparent' }]} onPress={() => handleTabChange('opcoes')}>
            <ThemedText style={[styles.tabText, selectedTab === 'opcoes' && { color: '#fff' }]}>Opções de Investimento</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {selectedTab === 'portfolio' ? (
            <View style={styles.portfolioContent}>
              {USER_INVESTMENTS.length > 0 ? (
                USER_INVESTMENTS.map((investment) => (
                  <InvestmentCard key={investment.id} investment={investment} isDark={isDark} onPress={handleInvestmentPress} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <IconSymbol name="chart.line.uptrend.xyaxis" size={48} color={isDark ? '#666' : '#ccc'} />
                  <ThemedText style={styles.emptyStateText}>Você ainda não possui investimentos</ThemedText>
                  <TouchableOpacity style={styles.startInvestingButton} onPress={() => handleTabChange('opcoes')}>
                    <ThemedText style={styles.startInvestingText}>Começar a investir</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.optionsContent}>
              <ThemedText style={styles.sectionTitle}>Escolha seu investimento</ThemedText>
              {INVESTMENT_OPTIONS.map((option) => (
                <InvestmentOption key={option.id} option={option} isDark={isDark} onPress={handleOptionPress} />
              ))}
            </View>
          )}
        </ScrollView>

        <Modal visible={showInvestModal} transparent={true} animationType="slide" onRequestClose={closeInvestModal}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
              <View style={styles.modalHeader}>
                <ThemedText style={styles.modalTitle}>Investir</ThemedText>
                <TouchableOpacity onPress={closeInvestModal}>
                  <IconSymbol name="xmark" size={24} color={isDark ? '#fff' : '#333'} />
                </TouchableOpacity>
              </View>
              {selectedOption && (
                <>
                  <View style={[styles.productSummary, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa' }]}>
                    <View style={styles.productHeader}>
                      <View style={[styles.productIcon, { backgroundColor: `${selectedOption.color}20` }]}>
                        <IconSymbol name={selectedOption.icon as any} size={32} color={selectedOption.color} />
                      </View>
                      <View style={styles.productInfo}>
                        <ThemedText style={styles.productName}>{selectedOption.name}</ThemedText>
                        <ThemedText style={styles.productDescription}>{selectedOption.description}</ThemedText>
                      </View>
                    </View>
                  </View>
                  <View style={styles.investAmountSection}>
                    <ThemedText style={styles.sectionLabel}>Quanto você quer investir?</ThemedText>
                    <TextInput style={[styles.investAmountInput, { backgroundColor: isDark ? '#2a2a2a' : '#f8f9fa', color: isDark ? '#fff' : '#000', borderColor: isDark ? '#333' : '#e0e0e0' }]} placeholder="0,00" placeholderTextColor={isDark ? '#888' : '#666'} value={investAmount} onChangeText={setInvestAmount} keyboardType="numeric" />
                    <ThemedText style={styles.minValueText}>Mínimo: {formatCurrency(selectedOption.minValue)}</ThemedText>
                  </View>
                  <View style={styles.modalActions}>
                    <TouchableOpacity style={[styles.modalButton, styles.modalButtonOutline]} onPress={closeInvestModal}>
                      <ThemedText style={styles.modalButtonOutlineText}>Cancelar</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.modalButtonFilled, isInvesting && styles.modalButtonDisabled]} onPress={handleInvest} disabled={isInvesting}>
                      <ThemedText style={styles.modalButtonFilledText}>{isInvesting ? 'Processando...' : 'Confirmar Investimento'}</ThemedText>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 10, borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  helpButton: { padding: 8 },
  portfolioSummary: { marginHorizontal: 20, marginBottom: 20, padding: 24, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  summaryTitle: { fontSize: 16, opacity: 0.7, marginBottom: 8 },
  totalValue: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  profitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profitText: { fontSize: 18, fontWeight: '600' },
  profitPercentage: { fontSize: 16, fontWeight: '500' },
  tabContainer: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, backgroundColor: '#f0f0f0', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  activeTab: { backgroundColor: '#0000FF' },
  tabText: { fontSize: 14, fontWeight: '600' },
  content: { flex: 1, paddingHorizontal: 20 },
  portfolioContent: { gap: 16 },
  investmentCard: { padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  investmentHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  investmentIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  investmentInfo: { flex: 1 },
  investmentName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  investmentType: { fontSize: 14, opacity: 0.7 },
  riskBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, backgroundColor: '#f0f0f0' },
  riskText: { fontSize: 12, fontWeight: '500' },
  investmentValues: { gap: 8 },
  valueRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  valueLabel: { fontSize: 14, opacity: 0.7 },
  currentValue: { fontSize: 16, fontWeight: '600' },
  investedValue: { fontSize: 14, opacity: 0.8 },
  profitValue: { fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyStateText: { fontSize: 16, marginTop: 16, marginBottom: 24, opacity: 0.7, textAlign: 'center' },
  startInvestingButton: { backgroundColor: '#0000FF', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  startInvestingText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  optionsContent: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  optionCard: { flexDirection: 'row', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  optionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  optionInfo: { flex: 1 },
  optionName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  optionDescription: { fontSize: 14, opacity: 0.7, marginBottom: 8 },
  optionDetails: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  optionProfitability: { fontSize: 14, fontWeight: '500', color: '#0000FF' },
  optionRisk: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  optionRiskText: { fontSize: 12, fontWeight: '500' },
  minValue: { fontSize: 12, opacity: 0.6, marginBottom: 12 },
  investirButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  investirButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold' },
  productSummary: { padding: 16, borderRadius: 12, marginBottom: 20 },
  productHeader: { flexDirection: 'row', alignItems: 'center' },
  productIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  productInfo: { flex: 1 },
  productName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  productDescription: { fontSize: 14, opacity: 0.7 },
  investAmountSection: { marginBottom: 20 },
  sectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  investAmountInput: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  minValueText: { fontSize: 12, opacity: 0.6 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  modalButtonOutline: { borderWidth: 1, borderColor: '#0000FF', backgroundColor: 'transparent' },
  modalButtonOutlineText: { color: '#0000FF', fontSize: 16, fontWeight: '600' },
  modalButtonFilled: { backgroundColor: '#0000FF' },
  modalButtonFilledText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  modalButtonDisabled: { backgroundColor: '#ccc', opacity: 0.6 }
});