import { IconSymbol } from '@/components/ui/IconSymbol';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tipos de pagamento
type PaymentType = 'barcode' | 'bills' | 'taxes' | 'services';

// Contas favoritas
const FAVORITE_BILLS = [
  { id: '1', name: 'Energia Elétrica', company: 'CPFL', icon: 'house.fill', color: '#FF9500' },
  { id: '2', name: 'Água e Esgoto', company: 'SABESP', icon: 'house', color: '#007AFF' },
  { id: '3', name: 'Gás Natural', company: 'Comgás', icon: 'house.fill', color: '#FF3B30' },
  { id: '4', name: 'Internet', company: 'Vivo Fibra', icon: 'globe', color: '#8E4EC6' },
  { id: '5', name: 'Telefone', company: 'Tim', icon: 'phone', color: '#34C759' },
  { id: '6', name: 'TV por Assinatura', company: 'Sky', icon: 'house.fill', color: '#FF2D92' },
];

// Serviços públicos
const PUBLIC_SERVICES = [
  { id: '1', name: 'IPTU', description: 'Imposto Predial', icon: 'house', color: '#FF9500' },
  { id: '2', name: 'IPVA', description: 'Imposto Veicular', icon: 'house.fill', color: '#007AFF' },
  { id: '3', name: 'Multas de Trânsito', description: 'DETRAN', icon: 'xmark.circle.fill', color: '#FF3B30' },
  { id: '4', name: 'Taxas Municipais', description: 'Prefeitura', icon: 'building.2', color: '#34C759' },
];

// Componente de conta favorita memoizado
const FavoriteBill = memo(({ bill, onPress }: { 
  bill: typeof FAVORITE_BILLS[0]; 
  onPress: (bill: typeof FAVORITE_BILLS[0]) => void;
}) => (
  <TouchableOpacity 
    style={styles.billCard}
    onPress={() => onPress(bill)}
  >
    <View style={[styles.billIcon, { backgroundColor: bill.color + '20' }]}>
      <IconSymbol name={bill.icon as any} size={24} color={bill.color} />
    </View>
    <View style={styles.billInfo}>
      <Text style={styles.billName}>{bill.name}</Text>
      <Text style={styles.billCompany}>{bill.company}</Text>
    </View>
    <IconSymbol name="chevron.right" size={16} color="#666" />
  </TouchableOpacity>
));

// Componente de serviço público memoizado
const PublicService = memo(({ service, onPress }: { 
  service: typeof PUBLIC_SERVICES[0]; 
  onPress: (service: typeof PUBLIC_SERVICES[0]) => void;
}) => (
  <TouchableOpacity 
    style={styles.serviceCard}
    onPress={() => onPress(service)}
  >
    <View style={[styles.serviceIcon, { backgroundColor: service.color + '20' }]}>
      <IconSymbol name={service.icon as any} size={24} color={service.color} />
    </View>
    <View style={styles.serviceInfo}>
      <Text style={styles.serviceName}>{service.name}</Text>
      <Text style={styles.serviceDescription}>{service.description}</Text>
    </View>
    <IconSymbol name="chevron.right" size={16} color="#666" />
  </TouchableOpacity>
));

export default function PagarScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<PaymentType>('barcode');
  const [barcode, setBarcode] = useState('');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [scannedCode, setScannedCode] = useState('');

  // Função para processar código de barras
  const handleBarcodeSubmit = useCallback(() => {
    if (!barcode.trim()) {
      Alert.alert('Erro', 'Digite ou escaneie um código de barras válido');
      return;
    }

    // Simula processamento do código de barras
    Alert.alert(
      'Boleto Encontrado! 📄',
      `Empresa: Exemplo Ltda\nValor: R$ 89,90\nVencimento: 15/12/2024\n\nDeseja prosseguir com o pagamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Pagar', 
          onPress: () => {
            Alert.alert(
              'Pagamento Realizado! ✅',
              'Boleto pago com sucesso!\n\nComprovante disponível no extrato.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  }, [barcode, router]);

  // Função para simular escaneamento
  const handleScanBarcode = useCallback(() => {
    setShowBarcodeModal(true);
    // Simula escaneamento após 2 segundos
    setTimeout(() => {
      const mockBarcode = '34191790010104351004791020150008291070026000';
      setScannedCode(mockBarcode);
      setBarcode(mockBarcode);
      setShowBarcodeModal(false);
      Alert.alert('Código Escaneado! 📱', 'Código de barras capturado com sucesso!');
    }, 2000);
  }, []);

  // Função para pagar conta favorita
  const handlePayFavoriteBill = useCallback((bill: typeof FAVORITE_BILLS[0]) => {
    Alert.alert(
      `Pagar ${bill.name}`,
      `${bill.company}\n\nValor: R$ 127,45\nVencimento: 20/12/2024\n\nConfirmar pagamento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Pagar', 
          onPress: () => {
            Alert.alert(
              'Pagamento Realizado! ✅',
              `${bill.name} paga com sucesso!\n\nComprovante disponível no extrato.`,
              [{ text: 'OK' }]
            );
          }
        }
      ]
    );
  }, []);

  // Função para pagar serviço público
  const handlePayPublicService = useCallback((service: typeof PUBLIC_SERVICES[0]) => {
    Alert.alert(
      `Consultar ${service.name}`,
      `${service.description}\n\nDigite seu CPF ou número do documento para consultar débitos.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Consultar', 
          onPress: () => {
            Alert.alert(
              'Débitos Encontrados! 📋',
              `${service.name}\nValor: R$ 234,67\nVencimento: 31/12/2024\n\nDeseja pagar?`,
              [
                { text: 'Não', style: 'cancel' },
                { 
                  text: 'Pagar', 
                  onPress: () => {
                    Alert.alert(
                      'Pagamento Realizado! ✅',
                      `${service.name} pago com sucesso!`,
                      [{ text: 'OK' }]
                    );
                  }
                }
              ]
            );
          }
        }
      ]
    );
  }, []);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'Pagar',
          headerShown: true,
          headerStyle: { backgroundColor: '#0000FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'barcode' && styles.activeTab]}
              onPress={() => setSelectedTab('barcode')}
            >
              <IconSymbol name="barcode" size={20} color={selectedTab === 'barcode' ? '#fff' : '#0000FF'} />
              <Text style={[styles.tabText, selectedTab === 'barcode' && styles.activeTabText]}>
                Código
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'bills' && styles.activeTab]}
              onPress={() => setSelectedTab('bills')}
            >
              <IconSymbol name="doc.text" size={20} color={selectedTab === 'bills' ? '#fff' : '#0000FF'} />
              <Text style={[styles.tabText, selectedTab === 'bills' && styles.activeTabText]}>
                Contas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, selectedTab === 'taxes' && styles.activeTab]}
              onPress={() => setSelectedTab('taxes')}
            >
              <IconSymbol name="building.2" size={20} color={selectedTab === 'taxes' ? '#fff' : '#0000FF'} />
              <Text style={[styles.tabText, selectedTab === 'taxes' && styles.activeTabText]}>
                Impostos
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {selectedTab === 'barcode' && (
              <View style={styles.barcodeContainer}>
                {/* Scanner de Código */}
                <View style={styles.scannerCard}>
                  <IconSymbol name="barcode" size={48} color="#0000FF" />
                  <Text style={styles.scannerTitle}>Escaneie o Código de Barras</Text>
                  <Text style={styles.scannerDescription}>
                    Aponte a câmera para o código de barras do boleto
                  </Text>
                  <TouchableOpacity
                    style={styles.scanButton}
                    onPress={handleScanBarcode}
                  >
                    <IconSymbol name="qrcode" size={20} color="#fff" />
                    <Text style={styles.scanButtonText}>Escanear Código</Text>
                  </TouchableOpacity>
                </View>

                {/* Digitar Código */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Ou digite o código de barras</Text>
                  <TextInput
                    style={styles.barcodeInput}
                    placeholder="Digite os números do código de barras"
                    value={barcode}
                    onChangeText={setBarcode}
                    keyboardType="numeric"
                    maxLength={48}
                  />
                  <TouchableOpacity
                    style={[styles.payButton, !barcode && styles.disabledButton]}
                    onPress={handleBarcodeSubmit}
                    disabled={!barcode}
                  >
                    <Text style={styles.payButtonText}>Continuar</Text>
                    <IconSymbol name="arrow.right" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedTab === 'bills' && (
              <View style={styles.billsContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contas Favoritas</Text>
                  {FAVORITE_BILLS.map((bill) => (
                    <FavoriteBill
                      key={bill.id}
                      bill={bill}
                      onPress={handlePayFavoriteBill}
                    />
                  ))}
                </View>
              </View>
            )}

            {selectedTab === 'taxes' && (
              <View style={styles.taxesContainer}>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Impostos e Taxas</Text>
                  {PUBLIC_SERVICES.map((service) => (
                    <PublicService
                      key={service.id}
                      service={service}
                      onPress={handlePayPublicService}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal de Escaneamento */}
        <Modal
          visible={showBarcodeModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.scannerModal}>
              <View style={styles.scannerFrame}>
                <View style={styles.scannerCorner} />
                <View style={[styles.scannerCorner, styles.topRight]} />
                <View style={[styles.scannerCorner, styles.bottomLeft]} />
                <View style={[styles.scannerCorner, styles.bottomRight]} />
              </View>
              <Text style={styles.scannerModalText}>
                Posicione o código de barras dentro da moldura
              </Text>
              <TouchableOpacity
                style={styles.cancelScanButton}
                onPress={() => setShowBarcodeModal(false)}
              >
                <Text style={styles.cancelScanText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: '#0000FF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0000FF',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  barcodeContainer: {
    paddingBottom: 50,
  },
  billsContainer: {
    paddingBottom: 50,
  },
  taxesContainer: {
    paddingBottom: 50,
  },
  scannerCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  scannerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#0000FF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  barcodeInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: '#0000FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  billIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  billInfo: {
    flex: 1,
  },
  billName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  billCompany: {
    fontSize: 14,
    color: '#666',
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannerModal: {
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 150,
    position: 'relative',
    marginBottom: 32,
  },
  scannerCorner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#0000FF',
    borderWidth: 3,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    top: 0,
    left: 0,
  },
  topRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    top: 0,
    right: 0,
    left: 'auto',
  },
  bottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderTopWidth: 0,
    borderRightWidth: 0,
    bottom: 0,
    left: 0,
    top: 'auto',
  },
  bottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    bottom: 0,
    right: 0,
    top: 'auto',
    left: 'auto',
  },
  scannerModalText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  cancelScanButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  cancelScanText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});