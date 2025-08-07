import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { formatCurrency } from '@/utils/performance';
import { Stack, useRouter } from 'expo-router';
import React, { memo, useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface RechargeOption {
  id: string;
  name: string;
  type: 'celular' | 'transporte' | 'tv' | 'games';
  icon: string;
  color: string;
  description: string;
}

// Opções de recarga disponíveis
const RECHARGE_OPTIONS: RechargeOption[] = [
  {
    id: '1',
    name: 'Recarga de Celular',
    type: 'celular',
    icon: 'phone',
    color: '#34C759',
    description: 'Recarregue seu celular pré-pago'
  },
  {
    id: '2',
    name: 'Bilhete Único',
    type: 'transporte',
    icon: 'creditcard',
    color: '#007AFF',
    description: 'Recarregue seu cartão de transporte'
  },
  {
    id: '3',
    name: 'TV por Assinatura',
    type: 'tv',
    icon: 'house',
    color: '#FF9500',
    description: 'Pague sua mensalidade de TV'
  },
  {
    id: '4',
    name: 'Games e Apps',
    type: 'games',
    icon: 'globe',
    color: '#AF52DE',
    description: 'Créditos para jogos e aplicativos'
  }
];

// Valores pré-definidos para recarga de celular
const PHONE_VALUES = [10, 15, 20, 25, 30, 50];

// Componente de opção de recarga memoizado
const RechargeOption = memo(({ 
  option, 
  isDark, 
  onPress 
}: { 
  option: RechargeOption; 
  isDark: boolean; 
  onPress: (option: RechargeOption) => void;
}) => {
  const handlePress = useCallback(() => onPress(option), [option, onPress]);

  return (
    <View style={[styles.optionCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
      <View style={[styles.optionIcon, { backgroundColor: `${option.color}20` }]}>
        <IconSymbol name={option.icon as any} size={28} color={option.color} />
      </View>
      <View style={styles.optionInfo}>
        <ThemedText style={styles.optionName}>{option.name}</ThemedText>
        <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
        <TouchableOpacity 
          style={[styles.rechargeButton, { backgroundColor: '#0000FF' }]}
          onPress={handlePress}
        >
          <ThemedText style={styles.rechargeButtonText}>Recarregar</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default function RecargaScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<RechargeOption | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOptionPress = useCallback((option: RechargeOption) => {
    setSelectedOption(option);
    setPhoneNumber('');
    setSelectedValue(null);
    setCustomValue('');
  }, []);

  const handleValueSelect = useCallback((value: number) => {
    setSelectedValue(value);
    setCustomValue('');
  }, []);

  const handleRecharge = useCallback(async () => {
    if (!selectedOption) return;

    if (selectedOption.type === 'celular') {
      if (!phoneNumber || phoneNumber.length < 10) {
        Alert.alert('Erro', 'Digite um número de telefone válido');
        return;
      }
      if (!selectedValue && !customValue) {
        Alert.alert('Erro', 'Selecione um valor para recarga');
        return;
      }
    }

    const rechargeValue = selectedValue || parseFloat(customValue.replace(',', '.')) || 0;
    
    if (rechargeValue <= 0) {
      Alert.alert('Erro', 'Digite um valor válido para recarga');
      return;
    }

    // Verificar saldo disponível (simulado)
    const availableBalance = 1500; // R$ 1.500 simulado
    if (rechargeValue > availableBalance) {
      Alert.alert('Erro', `Saldo insuficiente. Saldo disponível: ${formatCurrency(availableBalance)}`);
      return;
    }

    setIsProcessing(true);

    // Simular processamento da recarga
    setTimeout(() => {
      setIsProcessing(false);
      
      let successMessage = '';
      switch (selectedOption.type) {
        case 'celular':
          successMessage = `Recarga de ${formatCurrency(rechargeValue)} realizada com sucesso para o número ${phoneNumber}!`;
          break;
        case 'transporte':
          successMessage = `Bilhete Único recarregado com ${formatCurrency(rechargeValue)}!`;
          break;
        case 'tv':
          successMessage = `Pagamento de ${formatCurrency(rechargeValue)} realizado para TV por assinatura!`;
          break;
        case 'games':
          successMessage = `Crédito de ${formatCurrency(rechargeValue)} adicionado para games e apps!`;
          break;
      }

      Alert.alert(
        'Recarga Realizada!',
        successMessage + '\n\nO valor foi debitado da sua conta.',
        [{ 
          text: 'OK', 
          onPress: () => {
            setSelectedOption(null);
            setPhoneNumber('');
            setSelectedValue(null);
            setCustomValue('');
          }
        }]
      );
    }, 2500);
  }, [selectedOption, phoneNumber, selectedValue, customValue]);

  const goBack = useCallback(() => {
    if (selectedOption) {
      setSelectedOption(null);
    } else {
      router.back();
    }
  }, [selectedOption, router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={goBack} 
            style={[styles.backButton, { backgroundColor: '#0000FF20' }]}
          >
            <IconSymbol name="arrow.left" size={20} color="#0000FF" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>
            {selectedOption ? selectedOption.name : 'Recarga'}
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        {/* Saldo Disponível */}
        <ThemedView style={[styles.balanceCard, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
          <ThemedText style={styles.balanceLabel}>Saldo disponível</ThemedText>
          <ThemedText style={styles.balanceAmount}>R$ 1.500,00</ThemedText>
        </ThemedView>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {!selectedOption ? (
            // Lista de opções de recarga
            <View style={styles.optionsContent}>
              <ThemedText style={styles.sectionTitle}>Escolha o tipo de recarga</ThemedText>
              {RECHARGE_OPTIONS.map((option) => (
                <RechargeOption
                  key={option.id}
                  option={option}
                  isDark={isDark}
                  onPress={handleOptionPress}
                />
              ))}
            </View>
          ) : (
            // Formulário de recarga
            <View style={styles.rechargeForm}>
              {selectedOption.type === 'celular' && (
                <View style={styles.inputSection}>
                  <ThemedText style={styles.inputLabel}>Número do celular</ThemedText>
                  <TextInput
                    style={[
                      styles.input,
                      { 
                        backgroundColor: isDark ? '#1a1a1a' : '#fff',
                        color: isDark ? '#fff' : '#000',
                        borderColor: isDark ? '#333' : '#e0e0e0'
                      }
                    ]}
                    placeholder="(11) 99999-9999"
                    placeholderTextColor={isDark ? '#888' : '#666'}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    maxLength={15}
                  />
                </View>
              )}

              <View style={styles.inputSection}>
                <ThemedText style={styles.inputLabel}>Valor da recarga</ThemedText>
                
                {selectedOption.type === 'celular' && (
                  <View style={styles.valueButtons}>
                    {PHONE_VALUES.map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={[
                          styles.valueButton,
                          selectedValue === value && styles.valueButtonSelected,
                          { 
                            backgroundColor: selectedValue === value ? '#0000FF' : (isDark ? '#1a1a1a' : '#fff'),
                            borderColor: isDark ? '#333' : '#e0e0e0'
                          }
                        ]}
                        onPress={() => handleValueSelect(value)}
                      >
                        <ThemedText style={[
                          styles.valueButtonText,
                          selectedValue === value && { color: '#fff' }
                        ]}>
                          {formatCurrency(value)}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <ThemedText style={styles.orText}>ou digite outro valor</ThemedText>
                
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
                  value={customValue}
                  onChangeText={setCustomValue}
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isProcessing && styles.confirmButtonDisabled
                ]}
                onPress={handleRecharge}
                disabled={isProcessing}
              >
                <ThemedText style={styles.confirmButtonText}>
                  {isProcessing ? 'Processando...' : 'Confirmar Recarga'}
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
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
  balanceCard: { marginHorizontal: 20, marginBottom: 20, padding: 20, borderRadius: 12, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  balanceLabel: { fontSize: 14, opacity: 0.7, marginBottom: 4 },
  balanceAmount: { fontSize: 24, fontWeight: 'bold', color: '#34C759' },
  content: { flex: 1, paddingHorizontal: 20 },
  optionsContent: { gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  optionCard: { flexDirection: 'row', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  optionIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  optionInfo: { flex: 1 },
  optionName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  optionDescription: { fontSize: 14, opacity: 0.7, marginBottom: 12 },
  rechargeButton: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rechargeButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  rechargeForm: { gap: 20 },
  inputSection: { gap: 12 },
  inputLabel: { fontSize: 16, fontWeight: '600' },
  input: { borderWidth: 1, borderRadius: 12, padding: 16, fontSize: 16 },
  valueButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  valueButton: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1 },
  valueButtonSelected: { backgroundColor: '#0000FF' },
  valueButtonText: { fontSize: 14, fontWeight: '600' },
  orText: { fontSize: 14, opacity: 0.7, textAlign: 'center', marginVertical: 8 },
  confirmButton: { backgroundColor: '#0000FF', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  confirmButtonDisabled: { backgroundColor: '#ccc', opacity: 0.6 },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});