import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { FinancialDataService, formatCurrency, formatPercentage } from '@/utils/financialData';
import { useRouter } from 'expo-router';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Animated, InteractionManager, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente de menu memoizado e otimizado
const MenuButton = memo(({ icon, text, onPress }: { icon: string; text: string; onPress?: () => void }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIconContainer}>
      <IconSymbol name={icon as any} size={24} color="#333" />
    </View>
    <Text style={styles.menuText}>{text}</Text>
  </TouchableOpacity>
));

// Componente de transação simplificado e memoizado
const TransactionItem = memo(({ 
  icon, 
  iconColor, 
  title, 
  date, 
  amount, 
  isPositive 
}: {
  icon: string;
  iconColor: string;
  title: string;
  date: string;
  amount: string;
  isPositive: boolean;
}) => (
  <View style={styles.transactionItem}>
    <View style={styles.transactionIconContainer}>
      <IconSymbol name={icon as any} size={18} color={iconColor} />
    </View>
    <View style={styles.transactionInfo}>
      <Text style={styles.transactionTitle}>{title}</Text>
      <Text style={styles.transactionDate}>{date}</Text>
    </View>
    <Text style={isPositive ? styles.transactionAmountPositive : styles.transactionAmountNegative}>
      {amount}
    </Text>
  </View>
));

// Dados estáticos para evitar recriação
const RECENT_TRANSACTIONS = [
  {
    id: '1',
    icon: 'arrow.down',
    iconColor: '#4CAF50',
    title: 'Transferência recebida',
    date: 'Hoje • 14:32',
    amount: '+ R$ 150,00',
    isPositive: true
  },
  {
    id: '2',
    icon: 'arrow.up',
    iconColor: '#FF3B30',
    title: 'Pagamento de boleto',
    date: 'Hoje • 10:15',
    amount: '- R$ 89,90',
    isPositive: false
  },
  {
    id: '3',
    icon: 'arrow.up',
    iconColor: '#FF3B30',
    title: 'Compra com cartão',
    date: 'Ontem • 19:45',
    amount: '- R$ 52,30',
    isPositive: false
  }
];

// Interface para dados econômicos
interface EconomicData {
  selic: string;
  ipca: string;
  cdi: string;
  dolar: string;
}

// Interface para dicas financeiras
interface FinancialTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

// Componente de dica financeira memoizado
const FinancialTipCard = memo(({ tip, onPress }: { tip: FinancialTip; onPress: () => void }) => (
  <TouchableOpacity style={styles.tipCard} onPress={onPress}>
    <View style={styles.tipIconContainer}>
      <IconSymbol name={tip.icon as any} size={24} color="#0000FF" />
    </View>
    <View style={styles.tipContent}>
      <Text style={styles.tipTitle}>{tip.title}</Text>
      <Text style={styles.tipDescription}>{tip.description}</Text>
      <Text style={styles.tipCategory}>{tip.category}</Text>
    </View>
    <IconSymbol name="chevron.right" size={16} color="#666" />
  </TouchableOpacity>
));

// Componente de indicador econômico memoizado
const EconomicIndicator = memo(({ label, value, trend }: { label: string; value: string; trend: 'up' | 'down' | 'stable' }) => (
  <View style={styles.indicatorCard}>
    <Text style={styles.indicatorLabel}>{label}</Text>
    <View style={styles.indicatorValueContainer}>
      <Text style={styles.indicatorValue}>{value}</Text>
      <IconSymbol 
        name={trend === 'up' ? 'arrow.up' : trend === 'down' ? 'arrow.down' : 'minus'} 
        size={12} 
        color={trend === 'up' ? '#FF3B30' : trend === 'down' ? '#4CAF50' : '#666'} 
      />
    </View>
  </View>
));

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [economicData, setEconomicData] = useState<EconomicData | null>(null);
  const [financialTips, setFinancialTips] = useState<FinancialTip[]>([]);
  const [loadingEconomicData, setLoadingEconomicData] = useState(false);
  
  // Animações para o botão flutuante
  const floatAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  
  // Ref para controle do scroll
  const scrollViewRef = useRef<ScrollView>(null);

  // Função para buscar dados econômicos do Banco Central usando APIs reais
  const fetchEconomicData = useCallback(async () => {
    if (loadingEconomicData) return;
    
    setLoadingEconomicData(true);
    try {
      const indicators = await FinancialDataService.getInstance().getEconomicIndicators();
      const formattedData: EconomicData = {
        selic: formatPercentage(indicators.selic),
        ipca: formatPercentage(indicators.ipca),
        cdi: formatPercentage(indicators.cdi),
        dolar: formatCurrency(indicators.dolar)
      };
      
      setEconomicData(formattedData);
    } catch (error) {
      console.error('Erro ao buscar dados econômicos:', error);
      // Dados de fallback
      setEconomicData({
        selic: '11,25%',
        ipca: '4,68%',
        cdi: '11,15%',
        dolar: 'R$ 5,43'
      });
    } finally {
      setLoadingEconomicData(false);
    }
  }, [loadingEconomicData]);

  // Função para carregar dicas financeiras
  const loadFinancialTips = useCallback(() => {
    const tips: FinancialTip[] = [
      {
        id: '1',
        title: 'Reserve sua Emergência',
        description: 'Mantenha de 3 a 6 meses de gastos guardados para imprevistos',
        icon: 'shield.checkered',
        category: 'Planejamento'
      },
      {
        id: '2',
        title: 'Diversifique Investimentos',
        description: 'Não coloque todos os ovos na mesma cesta. Varie seus investimentos',
        icon: 'chart.pie',
        category: 'Investimentos'
      },
      {
        id: '3',
        title: 'Controle seus Gastos',
        description: 'Acompanhe onde seu dinheiro está sendo gasto mensalmente',
        icon: 'list.clipboard',
        category: 'Controle'
      },
      {
        id: '4',
        title: 'Invista no Tesouro Direto',
        description: 'Uma das formas mais seguras de investir com rentabilidade',
        icon: 'building.columns',
        category: 'Investimentos'
      }
    ];
    setFinancialTips(tips);
  }, []);

  // Carregamento assíncrono após a tela estar pronta
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
      fetchEconomicData();
      loadFinancialTips();
    });
  }, [fetchEconomicData, loadFinancialTips]);

  // Animação de flutuação (movimento vertical suave)
  useEffect(() => {
    const startFloatAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnimation, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startFloatAnimation();
  }, [floatAnimation]);

  // Animação de pulsação (escala suave)
  useEffect(() => {
    const startPulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    // Inicia a pulsação após um pequeno delay
    const timer = setTimeout(startPulseAnimation, 1000);
    return () => clearTimeout(timer);
  }, [pulseAnimation]);

  // Callbacks memoizados
  const navigateToCard = useCallback(() => {
    router.push('/cartao');
  }, [router]);

  const navigateToExtrato = useCallback(() => {
    router.push('/(tabs)/extrato');
  }, [router]);

  const navigateToInvestir = useCallback(() => {
    router.push('/investir');
  }, [router]);

  const navigateToRecarga = useCallback(() => {
    router.push('/recarga');
  }, [router]);

  const navigateToMostrarMais = useCallback(() => {
    router.push('/mostrar-mais');
  }, [router]);

  const navigateToEducacaoFinanceira = useCallback(() => {
    router.push('/educacao-financeira');
  }, [router]);

  const navigateToPix = useCallback(() => {
    router.push('/pix');
  }, [router]);

  const navigateToPagar = useCallback(() => {
    router.push('/pagar');
  }, [router]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#f5f5f5' }]}>
      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        decelerationRate={0.7}
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={true}
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={true}
        nestedScrollEnabled={false}
        overScrollMode="auto"
        scrollsToTop={true}
        maximumZoomScale={1}
        minimumZoomScale={1}
        snapToAlignment="center"
        snapToInterval={0}
        pagingEnabled={false}
      >
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
            <TouchableOpacity style={styles.actionPill} onPress={navigateToPix}>
              <IconSymbol name="arrow.triangle.2.circlepath" size={20} color="#333" />
              <Text style={styles.actionPillText}>Pix</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionPill} onPress={navigateToPagar}>
              <IconSymbol name="barcode" size={20} color="#333" />
              <Text style={styles.actionPillText}>Pagar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Destaque para Investimentos */}
        <View style={styles.investmentHighlight}>
          <View style={styles.investmentCard}>
            <View style={styles.investmentHeader}>
              <View style={styles.investmentIconContainer}>
                <IconSymbol name="chart.line.uptrend.xyaxis" size={32} color="#0000FF" />
              </View>
              <View style={styles.investmentTextContainer}>
                <Text style={styles.investmentTitle}>Faça seu dinheiro render</Text>
                <Text style={styles.investmentSubtitle}>Investimentos a partir de R$ 50</Text>
                <Text style={styles.investmentPromo}>🚀 Rentabilidade até 15% ao ano</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.investButton}
              onPress={navigateToInvestir}
            >
              <Text style={styles.investButtonText}>Começar a Investir</Text>
              <IconSymbol name="chevron.right" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu de ícones */}
        <View style={styles.iconMenu}>
          <MenuButton icon="creditcard" text="Cartões" onPress={navigateToCard} />
          <MenuButton icon="chart.line.uptrend.xyaxis" text="Investir" onPress={navigateToInvestir} />
          <MenuButton icon="phone" text="Recarga" onPress={navigateToRecarga} />
          <MenuButton icon="ellipsis" text="Mostrar mais" onPress={navigateToMostrarMais} />
        </View>

        {/* Seção de Educação Financeira */}
        {isReady && (
          <View style={styles.educationSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💡 Educação Financeira</Text>
            </View>

            {/* Indicadores Econômicos */}
            {economicData && (
              <View style={styles.economicIndicators}>
                <Text style={styles.indicatorsTitle}>📊 Indicadores Econômicos</Text>
                <View style={styles.indicatorsGrid}>
                  <EconomicIndicator label="Taxa Selic" value={economicData.selic} trend="up" />
                  <EconomicIndicator label="IPCA (12m)" value={economicData.ipca} trend="down" />
                  <EconomicIndicator label="CDI" value={economicData.cdi} trend="stable" />
                  <EconomicIndicator label="Dólar" value={economicData.dolar} trend="up" />
                </View>
              </View>
            )}

            {/* Dicas Financeiras */}
            <View style={styles.financialTips}>
              <Text style={styles.tipsTitle}>💰 Dicas para sua Vida Financeira</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.tipsScroll}
                scrollEventThrottle={100}
                decelerationRate={0.7}
                bounces={true}
                contentInsetAdjustmentBehavior="automatic"
                overScrollMode="auto"
                snapToAlignment="start"
              >
                {financialTips.map((tip) => (
                  <FinancialTipCard
                    key={tip.id}
                    tip={tip}
                    onPress={() => {
                      Alert.alert(
                        tip.title,
                        tip.description + '\n\nCategoria: ' + tip.category,
                        [{ text: 'Entendi', style: 'default' }]
                      );
                    }}
                  />
                ))}
              </ScrollView>
            </View>

            {/* Calculadora de Investimentos */}
            <View style={styles.calculatorCard}>
              <View style={styles.calculatorHeader}>
                <IconSymbol name="calculator" size={24} color="#0000FF" />
                <Text style={styles.calculatorTitle}>Calculadora de Investimentos</Text>
              </View>
              <Text style={styles.calculatorDescription}>
                Simule quanto seu dinheiro pode render com diferentes tipos de investimento
              </Text>
              <TouchableOpacity 
                style={styles.calculatorButton}
                onPress={() => {
                  Alert.alert(
                    'Calculadora de Investimentos',
                    'Use o assistente MiroAI (botão flutuante) para fazer simulações personalizadas de investimentos!',
                    [{ text: 'Entendi', style: 'default' }]
                  );
                }}
              >
                <Text style={styles.calculatorButtonText}>Calcular Rendimento</Text>
                <IconSymbol name="arrow.right" size={16} color="#0000FF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Extrato de Transações - Carrega apenas quando pronto */}
        {isReady && (
          <View style={styles.transactionsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Extrato</Text>
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={navigateToExtrato}
              >
                <Text style={styles.seeAllText}>Ver tudo</Text>
                <IconSymbol name="chevron.right" size={16} color="#0000FF" />
              </TouchableOpacity>
            </View>

            {/* Lista de transações */}
            <View style={styles.transactionsList}>
              {RECENT_TRANSACTIONS.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  icon={transaction.icon}
                  iconColor={transaction.iconColor}
                  title={transaction.title}
                  date={transaction.date}
                  amount={transaction.amount}
                  isPositive={transaction.isPositive}
                />
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Botão Flutuante do MiroAI com Animações */}
      <Animated.View
        style={[
          styles.floatingAIButton,
          {
            transform: [
              {
                translateY: floatAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -8], // Move 8px para cima e para baixo
                }),
              },
              {
                scale: pulseAnimation,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.floatingButtonTouchable}
          onPress={navigateToEducacaoFinanceira}
          activeOpacity={0.8}
        >
          <View style={styles.floatingButtonContent}>
            <IconSymbol name="robot" size={28} color="#fff" />
            <Animated.View 
              style={[
                styles.floatingButtonBadge,
                {
                  transform: [
                    {
                      scale: pulseAnimation.interpolate({
                        inputRange: [1, 1.1],
                        outputRange: [1, 1.2], // Badge pulsa mais que o botão
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.floatingButtonBadgeText}>IA</Text>
            </Animated.View>
          </View>
        </TouchableOpacity>
      </Animated.View>
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
    color: '#0000FF',
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
  // Estilos para o destaque de investimentos
  investmentHighlight: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  investmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#0000FF',
  },
  investmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  investmentIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0000FF20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  investmentTextContainer: {
    flex: 1,
  },
  investmentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  investmentSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  investmentPromo: {
    fontSize: 12,
    color: '#0000FF',
    fontWeight: '600',
  },
  investButton: {
    backgroundColor: '#0000FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  investButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Estilos para a seção de educação financeira
  educationSection: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  economicIndicators: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  indicatorsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  indicatorsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  indicatorCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  indicatorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  indicatorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  financialTips: {
    marginBottom: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  tipsScroll: {
    paddingLeft: 4,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0000FF10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
    marginRight: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
  tipCategory: {
    fontSize: 10,
    color: '#0000FF',
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  calculatorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculatorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  calculatorDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0000FF20',
  },
  calculatorButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0000FF',
  },

  // Estilos para o botão flutuante do MiroAI
  floatingAIButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#0000FF',
    shadowColor: '#0000FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  floatingButtonTouchable: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingButtonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  floatingButtonBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#00FF88',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: '#fff',
    minWidth: 24,
    alignItems: 'center',
  },
  floatingButtonBadgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});