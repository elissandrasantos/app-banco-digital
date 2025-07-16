import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransferenciaScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [selectedType, setSelectedType] = useState<'pix' | 'ted' | 'doc'>('pix');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');

  const transferTypes = [
    { id: 'pix', name: 'PIX', icon: 'qrcode', description: 'Instantâneo e gratuito' },
    { id: 'ted', name: 'TED', icon: 'building.2', description: 'Mesmo dia - R$ 15,00' },
    { id: 'doc', name: 'DOC', icon: 'doc', description: 'Próximo dia útil - R$ 8,00' },
  ];

  const handleTransfer = () => {
    if (!amount || !recipient) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }
    
    Alert.alert(
      'Confirmar Transferência',
      `Transferir R$ ${amount} via ${selectedType.toUpperCase()}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert('Sucesso', 'Transferência realizada com sucesso!');
            setAmount('');
            setRecipient('');
            setDescription('');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Transferir
          </ThemedText>
        </ThemedView>

        {/* Saldo Disponível */}
        <ThemedView style={[styles.balanceCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <ThemedText style={styles.balanceLabel}>Saldo disponível</ThemedText>
          <ThemedText type="subtitle" style={styles.balanceAmount}>
            R$ 2.847,50
          </ThemedText>
        </ThemedView>

        {/* Tipo de Transferência */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Tipo de transferência</ThemedText>
          <View style={styles.transferTypes}>
            {transferTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.transferTypeButton,
                  selectedType === type.id && styles.transferTypeButtonActive,
                  { 
                    backgroundColor: selectedType === type.id ? '#007AFF' : (isDark ? '#1a1a1a' : '#fff'),
                    borderColor: selectedType === type.id ? '#007AFF' : (isDark ? '#333' : '#e0e0e0')
                  }
                ]}
                onPress={() => setSelectedType(type.id as 'pix' | 'ted' | 'doc')}
              >
                <IconSymbol 
                  name={type.icon as any} 
                  size={24} 
                  color={selectedType === type.id ? '#fff' : '#007AFF'} 
                />
                <ThemedText style={[
                  styles.transferTypeName,
                  selectedType === type.id && { color: '#fff' }
                ]}>
                  {type.name}
                </ThemedText>
                <ThemedText style={[
                  styles.transferTypeDescription,
                  selectedType === type.id && { color: '#fff', opacity: 0.8 }
                ]}>
                  {type.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </ThemedView>

        {/* Formulário */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Dados da transferência</ThemedText>
          
          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>
              {selectedType === 'pix' ? 'Chave PIX ou dados do destinatário' : 'Dados do destinatário'}
            </ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#1a1a1a' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#333' : '#e0e0e0'
                }
              ]}
              placeholder={selectedType === 'pix' ? 'CPF, e-mail, telefone ou chave aleatória' : 'Nome e dados bancários'}
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={recipient}
              onChangeText={setRecipient}
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Valor</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#1a1a1a' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#333' : '#e0e0e0'
                }
              ]}
              placeholder="0,00"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.inputLabel}>Descrição (opcional)</ThemedText>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: isDark ? '#1a1a1a' : '#fff',
                  color: isDark ? '#fff' : '#000',
                  borderColor: isDark ? '#333' : '#e0e0e0'
                }
              ]}
              placeholder="Motivo da transferência"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </ThemedView>

        {/* Contatos Recentes */}
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Contatos recentes</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.recentContacts}>
              {['Maria Silva', 'Maria Santos', 'Ana Costa'].map((name, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.contactButton, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}
                  onPress={() => setRecipient(name)}
                >
                  <View style={styles.contactAvatar}>
                    <ThemedText style={styles.contactInitial}>
                      {name.split(' ').map(n => n[0]).join('')}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.contactName}>{name}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </ThemedView>

        {/* Botão de Transferir */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.transferButton,
              (!amount || !recipient) && styles.transferButtonDisabled
            ]}
            onPress={handleTransfer}
            disabled={!amount || !recipient}
          >
            <ThemedText style={styles.transferButtonText}>
              Continuar
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  balanceCard: {
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceLabel: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  transferTypes: {
    gap: 12,
  },
  transferTypeButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  transferTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  transferTypeName: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  transferTypeDescription: {
    fontSize: 12,
    opacity: 0.7,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  recentContacts: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  contactInitial: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contactName: {
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  transferButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  transferButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});