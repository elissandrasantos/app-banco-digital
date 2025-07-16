import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = CARD_WIDTH * 0.6;

export default function CartaoScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [showCardDetails, setShowCardDetails] = useState(false);

  // Cor principal do app (azul)
  const primaryColor = isDark ? '#4040FF' : '#0000FF';
  
  // Dados do cartão
  const cardData = {
    type: 'Cartão físico',
    number: '•••• •••• •••• 8425',
    fullNumber: '5678 8425 6423',
    name: 'Maria Silva',
    expiry: '12/28',
    cvv: '088',
    international: 'Internacional',
    bank: 'Banco XYZ'
  };

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: '#fff' }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={[styles.backButton, { backgroundColor: `${primaryColor}20` }]}
          >
            <IconSymbol name="arrow.left" size={20} color={primaryColor} />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Cartão físico</ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Card */}
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: primaryColor }]}>
              {/* Bank Logo */}
              <View style={styles.bankLogoContainer}>
                <ThemedText style={styles.bankLogo}>Banco XYZ</ThemedText>
              </View>
              
              {/* International Badge */}
              <View style={styles.internationalBadge}>
                <ThemedText style={styles.internationalText}>Internacional</ThemedText>
              </View>
              
              {/* Card Number */}
              <View style={styles.cardNumberContainer}>
                <ThemedText style={styles.cardNumber}>
                  {showCardDetails ? cardData.fullNumber : cardData.number}
                </ThemedText>
              </View>
              
              {/* Card Holder */}
              <View style={styles.cardHolderContainer}>
                <ThemedText style={styles.cardHolderLabel}>TITULAR DO CARTÃO</ThemedText>
                <ThemedText style={styles.cardHolderName}>{cardData.name}</ThemedText>
              </View>
              
              {/* Card Logo */}
              <View style={styles.cardLogoContainer}>
                <View style={styles.cardLogo}>
                  <IconSymbol name="creditcard.fill" size={24} color="#fff" />
                </View>
              </View>
            </View>
          </View>

          {/* Card Details */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>Nº do cartão</ThemedText>
              <ThemedText style={styles.detailValue}>
                {showCardDetails ? cardData.fullNumber : cardData.number}
              </ThemedText>
              <TouchableOpacity style={styles.copyButton}>
                <IconSymbol name="doc.on.doc" size={18} color={primaryColor} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.detailRow}>
              <ThemedText style={styles.detailLabel}>CVV</ThemedText>
              <ThemedText style={styles.detailValue}>
                {showCardDetails ? cardData.cvv : '•••'}
              </ThemedText>
              <TouchableOpacity style={styles.copyButton}>
                <IconSymbol name="doc.on.doc" size={18} color={primaryColor} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Toggle Card Details */}
          <View style={styles.toggleContainer}>
            <ThemedText style={styles.toggleLabel}>Mostrar dados do cartão</ThemedText>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                { backgroundColor: showCardDetails ? primaryColor : '#e0e0e0' }
              ]}
              onPress={toggleCardDetails}
            >
              <View style={[
                styles.toggleKnob, 
                { transform: [{ translateX: showCardDetails ? 20 : 0 }] }
              ]} />
            </TouchableOpacity>
          </View>

          {/* Card Actions */}
          <View style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: `${primaryColor}20` }]}>
                  <IconSymbol name="lock" size={20} color={primaryColor} />
                </View>
                <ThemedText style={styles.actionText}>Bloquear Temporário</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: `${primaryColor}20` }]}>
                  <IconSymbol name="creditcard" size={20} color={primaryColor} />
                </View>
                <ThemedText style={styles.actionText}>Solicitar 2ª via</ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Credentials */}
          <View style={styles.credentialsContainer}>
            <ThemedText style={styles.credentialsTitle}>Credenciais</ThemedText>
            <View style={styles.credentialsToggle}>
              <ThemedText style={styles.credentialsLabel}>Credenciais físicas</ThemedText>
              <TouchableOpacity style={[styles.toggleButton, { backgroundColor: primaryColor }]}>
                <View style={[styles.toggleKnob, { transform: [{ translateX: 20 }] }]} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
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
  backButton: {
    padding: 10,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  cardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  bankLogoContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  bankLogo: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  internationalBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  internationalText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  cardNumberContainer: {
    position: 'absolute',
    bottom: 70,
    left: 20,
  },
  cardNumber: {
    color: '#fff',
    fontSize: 18,
    letterSpacing: 2,
  },
  cardHolderContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  cardHolderLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardHolderName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cardLogoContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  cardLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  copyButton: {
    padding: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  toggleLabel: {
    fontSize: 16,
    color: '#333',
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 5,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  actionsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    width: '48%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  credentialsContainer: {
    marginHorizontal: 20,
    marginBottom: 100,
  },
  credentialsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  credentialsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  credentialsLabel: {
    fontSize: 16,
    color: '#333',
  },
});