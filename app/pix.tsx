import { IconSymbol } from '@/components/ui/IconSymbol';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tipos de chave PIX
type PixKeyType = 'cpf' | 'email' | 'phone' | 'random';

// Contatos recentes para PIX
const RECENT_PIX_CONTACTS = [
  { name: 'Maria Silva', key: 'maria@email.com', type: 'email' as PixKeyType },
  { name: 'João Santos', key: '(11) 99999-9999', type: 'phone' as PixKeyType },
  { name: 'Ana Costa', key: '123.456.789-00', type: 'cpf' as PixKeyType },
  { name: 'Pedro Lima', key: 'pedro@gmail.com', type: 'email' as PixKeyType },
];

// Componente de contato recente memoizado
const RecentContact = memo(({ contact, onPress }: { 
  contact: typeof RECENT_PIX_CONTACTS[0]; 
  onPress: (contact: typeof RECENT_PIX_CONTACTS[0]) => void;
}) => (
  <TouchableOpacity 
    style={styles.contactCard}
    onPress={() => onPress(contact)}
  >
    <View style={styles.contactAvatar}>
      <Text style={styles.contactInitial}>
        {contact.name.charAt(0).toUpperCase()}
      </Text>
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{contact.name}</Text>
      <Text style={styles.contactKey}>{contact.key}</Text>
    </View>
    <IconSymbol name="chevron.right" size={16} color="#666" />
  </TouchableOpacity>
));

export default function PixScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'send' | 'receive'>('send');
  const [pixKey, setPixKey] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [keyType, setKeyType] = useState<PixKeyType>('cpf');

  // Função para detectar tipo de chave PIX
  const detectKeyType = useCallback((key: string): PixKeyType => {
    if (key.includes('@')) return 'email';
    if (key.match(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)) return 'phone';
    if (key.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) return 'cpf';
    return 'random';
  }, []);

  // Função para formatar valor monetário
  const formatCurrency = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
    return formattedValue;
  }, []);

  // Função para lidar com mudança no valor
  const handleAmountChange = useCallback((text: string) => {
    const numericValue = text.replace(/\D/g, '');
    if (numericValue.length <= 8) { // Limite de R$ 999.999,99
      setAmount(numericValue);
    }
  }, []);

  // Função para enviar PIX
  const handleSendPix = useCallback(() => {
    if (!pixKey.trim()) {
      Alert.alert('Erro', 'Digite uma chave PIX válida');
      return;
    }
    if (!amount || parseInt(amount) === 0) {
      Alert.alert('Erro', 'Digite um valor válido');
      return;
    }

    const formattedAmount = formatCurrency(amount);
    const detectedType = detectKeyType(pixKey);
    
    Alert.alert(
      'Confirmar PIX',
      `Enviar ${formattedAmount} para:\n${pixKey}\n\nDescrição: ${description || 'Sem descrição'}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert(
              'PIX Enviado! ✅',
              `${formattedAmount} foi enviado com sucesso!\n\nComprovante disponível no extrato.`,
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  }, [pixKey, amount, description, formatCurrency, detectKeyType, router]);

  // Função para selecionar contato recente
  const handleSelectContact = useCallback((contact: typeof RECENT_PIX_CONTACTS[0]) => {
    setPixKey(contact.key);
    setKeyType(contact.type);
  }, []);

  // Função para copiar chave PIX (receber)
  const handleCopyPixKey = useCallback(() => {
    const myPixKey = 'usuario@mirobank.com.br';
    Alert.alert(
      'Chave PIX Copiada! 📋',
      `Sua chave PIX foi copiada:\n${myPixKey}\n\nCompartilhe com quem vai te enviar dinheiro.`,
      [{ text: 'OK' }]
    );
  }, []);

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: 'PIX',
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
              style={[styles.tab, selectedTab === 'send' && styles.activeTab]}
              onPress={() => setSelectedTab('send')}
            >
              <IconSymbol name="arrow.up" size={20} color={selectedTab === 'send' ? '#fff' : '#0000FF'} />
              <Text style={[styles.tabText, selectedTab === 'send' && styles.activeTabText]}>
                Enviar
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'receive' && styles.activeTab]}
              onPress={() => setSelectedTab('receive')}
            >
              <IconSymbol name="arrow.down" size={20} color={selectedTab === 'receive' ? '#fff' : '#0000FF'} />
              <Text style={[styles.tabText, selectedTab === 'receive' && styles.activeTabText]}>
                Receber
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {selectedTab === 'send' ? (
              <View style={styles.sendContainer}>
                {/* Contatos Recentes */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Contatos Recentes</Text>
                  {RECENT_PIX_CONTACTS.map((contact, index) => (
                    <RecentContact
                      key={index}
                      contact={contact}
                      onPress={handleSelectContact}
                    />
                  ))}
                </View>

                {/* Chave PIX */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Chave PIX do Destinatário</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="CPF, e-mail, telefone ou chave aleatória"
                    value={pixKey}
                    onChangeText={setPixKey}
                    keyboardType="default"
                    autoCapitalize="none"
                  />
                </View>

                {/* Valor */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Valor</Text>
                  <TextInput
                    style={[styles.input, styles.amountInput]}
                    placeholder="R$ 0,00"
                    value={amount ? formatCurrency(amount) : ''}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                  />
                </View>

                {/* Descrição */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Descrição (opcional)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Para que é esse PIX?"
                    value={description}
                    onChangeText={setDescription}
                    maxLength={140}
                  />
                </View>

                {/* Botão Enviar */}
                <TouchableOpacity
                  style={[styles.sendButton, (!pixKey || !amount) && styles.disabledButton]}
                  onPress={handleSendPix}
                  disabled={!pixKey || !amount}
                >
                  <Text style={styles.sendButtonText}>Enviar PIX</Text>
                  <IconSymbol name="paperplane.fill" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.receiveContainer}>
                {/* Receber PIX */}
                <View style={styles.receiveCard}>
                  <View style={styles.receiveHeader}>
                    <IconSymbol name="qrcode" size={48} color="#0000FF" />
                    <Text style={styles.receiveTitle}>Receber PIX</Text>
                  </View>
                  
                  <Text style={styles.receiveDescription}>
                    Compartilhe sua chave PIX ou mostre o QR Code para receber dinheiro
                  </Text>

                  <View style={styles.pixKeyContainer}>
                    <Text style={styles.pixKeyLabel}>Sua chave PIX:</Text>
                    <Text style={styles.pixKeyValue}>usuario@mirobank.com.br</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={handleCopyPixKey}
                  >
                    <IconSymbol name="doc.on.doc" size={20} color="#0000FF" />
                    <Text style={styles.copyButtonText}>Copiar Chave PIX</Text>
                  </TouchableOpacity>
                </View>

                {/* QR Code Placeholder */}
                <View style={styles.qrCodeCard}>
                  <Text style={styles.qrCodeTitle}>QR Code PIX</Text>
                  <View style={styles.qrCodePlaceholder}>
                    <IconSymbol name="qrcode" size={80} color="#0000FF" />
                    <Text style={styles.qrCodeText}>QR Code para receber PIX</Text>
                  </View>
                  <Text style={styles.qrCodeDescription}>
                    Mostre este QR Code para quem vai te enviar dinheiro
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
    fontSize: 16,
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
  sendContainer: {
    paddingBottom: 100,
  },
  receiveContainer: {
    paddingBottom: 50,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0000FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactKey: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  amountInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0000FF',
  },
  sendButton: {
    backgroundColor: '#0000FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  receiveCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  receiveHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  receiveDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  pixKeyContainer: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
  },
  pixKeyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  pixKeyValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0000FF',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  copyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0000FF',
  },
  qrCodeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  qrCodeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  qrCodeDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});