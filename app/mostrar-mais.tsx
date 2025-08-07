import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'pagamentos' | 'servicos' | 'seguros' | 'outros';
}

// Serviços disponíveis organizados por categoria
const SERVICES: ServiceOption[] = [
  // Pagamentos
  {
    id: '1',
    name: 'Pagar Boletos',
    description: 'Pague contas e boletos com facilidade',
    icon: 'barcode',
    color: '#FF9500',
    category: 'pagamentos'
  },
  {
    id: '2',
    name: 'Débito Automático',
    description: 'Configure pagamentos automáticos',
    icon: 'calendar',
    color: '#34C759',
    category: 'pagamentos'
  },
  {
    id: '3',
    name: 'Impostos e Taxas',
    description: 'Pague IPTU, IPVA e outros impostos',
    icon: 'doc.text',
    color: '#007AFF',
    category: 'pagamentos'
  },
  
  // Serviços
  {
    id: '4',
    name: 'Empréstimos',
    description: 'Simule e contrate empréstimos',
    icon: 'banknote',
    color: '#FF3B30',
    category: 'servicos'
  },
  {
    id: '5',
    name: 'Financiamentos',
    description: 'Financie seu carro ou imóvel',
    icon: 'house',
    color: '#32D74B',
    category: 'servicos'
  },
  {
    id: '6',
    name: 'Consórcio',
    description: 'Participe de grupos de consórcio',
    icon: 'handshake',
    color: '#AF52DE',
    category: 'servicos'
  },
  
  // Seguros
  {
    id: '7',
    name: 'Seguro Vida',
    description: 'Proteja sua família',
    icon: 'shield.checkered',
    color: '#FF6B6B',
    category: 'seguros'
  },
  {
    id: '8',
    name: 'Seguro Auto',
    description: 'Seguro para seu veículo',
    icon: 'creditcard',
    color: '#4ECDC4',
    category: 'seguros'
  },
  {
    id: '9',
    name: 'Seguro Residencial',
    description: 'Proteja seu lar',
    icon: 'house',
    color: '#45B7D1',
    category: 'seguros'
  },
  
  // Outros
  {
    id: '10',
    name: 'Câmbio',
    description: 'Compra e venda de moedas',
    icon: 'globe',
    color: '#F39C12',
    category: 'outros'
  },
  {
    id: '11',
    name: 'Atendimento',
    description: 'Fale conosco via chat ou telefone',
    icon: 'phone',
    color: '#9B59B6',
    category: 'outros'
  },
  {
    id: '12',
    name: 'Configurações',
    description: 'Ajustes da conta e preferências',
    icon: 'lock',
    color: '#95A5A6',
    category: 'outros'
  }
];

// Componente de serviço memoizado
const ServiceCard = memo(({ 
  service, 
  isDark, 
  onPress 
}: { 
  service: ServiceOption; 
  isDark: boolean; 
  onPress: (service: ServiceOption) => void;
}) => {
  const handlePress = useCallback(() => onPress(service), [service, onPress]);

  return (
    <TouchableOpacity
      style={[styles.serviceCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
      onPress={handlePress}
    >
      <View style={[styles.serviceIcon, { backgroundColor: `${service.color}20` }]}>
        <IconSymbol name={service.icon as any} size={24} color={service.color} />
      </View>
      <View style={styles.serviceInfo}>
        <ThemedText style={styles.serviceName}>{service.name}</ThemedText>
        <ThemedText style={styles.serviceDescription}>{service.description}</ThemedText>
      </View>
      <IconSymbol name="chevron.right" size={20} color={isDark ? '#666' : '#999'} />
    </TouchableOpacity>
  );
});

export default function MostrarMaisScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const handleServicePress = useCallback((service: ServiceOption) => {
    // Simular funcionalidades diferentes para cada serviço
    switch (service.id) {
      case '1': // Pagar Boletos
        Alert.alert(
          'Pagar Boletos',
          'Escaneie o código de barras do boleto ou digite o código manualmente.',
          [
            { text: 'Escanear Código', onPress: () => Alert.alert('Scanner', 'Funcionalidade de scanner em desenvolvimento') },
            { text: 'Digitar Código', onPress: () => Alert.alert('Código', 'Funcionalidade de digitação em desenvolvimento') },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
        break;
        
      case '2': // Débito Automático
        Alert.alert(
          'Débito Automático',
          'Configure pagamentos automáticos para suas contas recorrentes.',
          [
            { text: 'Configurar', onPress: () => Alert.alert('Configuração', 'Funcionalidade em desenvolvimento') },
            { text: 'Ver Configurados', onPress: () => Alert.alert('Lista', 'Nenhum débito automático configurado') },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
        break;
        
      case '4': // Empréstimos
        Alert.alert(
          'Empréstimos',
          'Simule um empréstimo pessoal com as melhores taxas do mercado.',
          [
            { text: 'Simular', onPress: () => Alert.alert('Simulação', 'Taxa a partir de 2,99% a.m.\nValor máximo: R$ 50.000\nParcelas: até 60x') },
            { text: 'Contratar', onPress: () => Alert.alert('Contratação', 'Funcionalidade em desenvolvimento') },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
        break;
        
      case '7': // Seguro Vida
        Alert.alert(
          'Seguro de Vida',
          'Proteja sua família com nosso seguro de vida.',
          [
            { text: 'Simular', onPress: () => Alert.alert('Simulação', 'Cobertura: R$ 100.000\nPrêmio mensal: R$ 29,90\nIdade: 18-65 anos') },
            { text: 'Contratar', onPress: () => Alert.alert('Contratação', 'Funcionalidade em desenvolvimento') },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
        break;
        
      case '10': // Câmbio
        Alert.alert(
          'Câmbio',
          'Cotações atuais das principais moedas:',
          [
            { text: 'Ver Cotações', onPress: () => Alert.alert('Cotações', 'USD: R$ 5,12\nEUR: R$ 5,58\nGBP: R$ 6,45\nARS: R$ 0,0057') },
            { text: 'Comprar/Vender', onPress: () => Alert.alert('Operação', 'Funcionalidade em desenvolvimento') },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
        break;
        
      case '11': // Atendimento
        Alert.alert(
          'Atendimento',
          'Como podemos ajudar você hoje?',
          [
            { text: 'Chat Online', onPress: () => Alert.alert('Chat', 'Conectando com atendente...') },
            { text: 'Telefone', onPress: () => Alert.alert('Telefone', 'Central de Atendimento:\n0800 123 4567\nHorário: 24h') },
            { text: 'FAQ', onPress: () => Alert.alert('FAQ', 'Acesse nossa central de ajuda online') },
            { text: 'Cancelar', style: 'cancel' }
          ]
        );
        break;
        
      default:
        Alert.alert(
          service.name,
          `${service.description}\n\nEsta funcionalidade está em desenvolvimento e estará disponível em breve.`,
          [{ text: 'OK' }]
        );
    }
  }, []);

  // Agrupar serviços por categoria
  const servicesByCategory = {
    pagamentos: SERVICES.filter(s => s.category === 'pagamentos'),
    servicos: SERVICES.filter(s => s.category === 'servicos'),
    seguros: SERVICES.filter(s => s.category === 'seguros'),
    outros: SERVICES.filter(s => s.category === 'outros')
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'pagamentos': return 'Pagamentos';
      case 'servicos': return 'Serviços Financeiros';
      case 'seguros': return 'Seguros';
      case 'outros': return 'Outros Serviços';
      default: return '';
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: '#0000FF20' }]}
          >
            <IconSymbol name="arrow.left" size={20} color="#0000FF" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Mais Serviços</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {Object.entries(servicesByCategory).map(([category, services]) => (
            <View key={category} style={styles.categorySection}>
              <ThemedText style={styles.categoryTitle}>
                {getCategoryTitle(category)}
              </ThemedText>
              
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isDark={isDark}
                  onPress={handleServicePress}
                />
              ))}
            </View>
          ))}

          {/* Informações adicionais */}
          <View style={[styles.infoCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
            <View style={[styles.infoIcon, { backgroundColor: '#0000FF20' }]}>
              <IconSymbol name="bell" size={24} color="#0000FF" />
            </View>
            <View style={styles.infoContent}>
              <ThemedText style={styles.infoTitle}>Novidades em breve!</ThemedText>
              <ThemedText style={styles.infoDescription}>
                Estamos trabalhando em novos serviços para facilitar ainda mais sua vida financeira.
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  backButton: { padding: 10, borderRadius: 20, width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: 'bold' },
  placeholder: { width: 40 },
  content: { flex: 1, paddingHorizontal: 20 },
  categorySection: { marginBottom: 32 },
  categoryTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16, color: '#0000FF' },
  serviceCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  serviceIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  serviceDescription: { fontSize: 14, opacity: 0.7 },
  infoCard: { flexDirection: 'row', padding: 20, borderRadius: 12, marginTop: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  infoIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  infoDescription: { fontSize: 14, opacity: 0.7 }
});