import { IconSymbol } from '@/components/ui/IconSymbol';
import { GeminiService } from '@/utils/geminiService';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
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

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'text' | 'data' | 'tip';
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  query: string;
}

// Componente simples para os pontos de digitação
const TypingDots = React.memo(() => {
  return (
    <View style={styles.typingIndicator}>
      <View style={[styles.typingDot, { opacity: 0.4 }]} />
      <View style={[styles.typingDot, { opacity: 0.7 }]} />
      <View style={[styles.typingDot, { opacity: 1 }]} />
    </View>
  );
});

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: '1',
    title: 'Taxa Selic Atual',
    icon: 'chart.line.uptrend.xyaxis',
    query: 'Qual é a taxa Selic atual?'
  },
  {
    id: '2',
    title: 'Como Investir',
    icon: 'dollarsign.circle',
    query: 'Como começar a investir?'
  },
  {
    id: '3',
    title: 'Calculadora',
    icon: 'calculator',
    query: 'Simular investimento'
  },
  {
    id: '4',
    title: 'Reserva de Emergência',
    icon: 'shield.checkered',
    query: 'Como fazer uma reserva de emergência?'
  },
  {
    id: '5',
    title: 'Tesouro Direto',
    icon: 'building.columns',
    query: 'O que é Tesouro Direto?'
  }
];

export default function EducacaoFinanceiraScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingDots, setTypingDots] = useState('.');
  const [hasShownIntro, setHasShownIntro] = useState(false);
  const geminiService = GeminiService.getInstance();

  // Rola para o final quando novas mensagens são adicionadas
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Efeito animado dos pontos "digitando..."
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setTypingDots((prev) => (prev.length >= 3 ? '.' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Apresentação automática do MiroAI ao abrir o chat
  useEffect(() => {
    if (!hasShownIntro) {
      const showIntroduction = async () => {
        // Pequeno delay para a tela carregar
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mostra o efeito "digitando"
        setIsLoading(true);
        
        // Simula tempo de digitação
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // Adiciona a mensagem de apresentação
        const introMessage: ChatMessage = {
          id: 'intro-1',
          text: 'Oi! 👋 Sou o MiroAI e vou te auxiliar com tudo sobre finanças e investimentos. Pode me fazer qualquer pergunta!',
          isUser: false,
          timestamp: new Date(),
          type: 'text'
        };

        setMessages([introMessage]);
        setIsLoading(false);
        setHasShownIntro(true);
      };

      showIntroduction();
    }
  }, [hasShownIntro]);

  // Função para calcular tempo de "pensamento" baseado no tamanho da pergunta
  const calculateThinkingTime = useCallback((question: string): number => {
    const baseTime = 1500; // 1.5 segundos base
    const wordsCount = question.trim().split(' ').length;
    const complexityBonus = wordsCount * 100; // 100ms por palavra
    const randomVariation = Math.random() * 1000; // até 1 segundo de variação

    return Math.min(baseTime + complexityBonus + randomVariation, 4000); // máximo 4 segundos
  }, []);

  // Função para processar perguntas do usuário com Gemini
  const processUserQuestion = useCallback(async (question: string): Promise<string> => {
    try {
      return await geminiService.processQuestion(question);
    } catch (error) {
      console.error('Erro ao processar pergunta:', error);
      return 'Ops! Tive um probleminha técnico aqui! 🤖 Pode tentar fazer sua pergunta novamente? Estou aqui para te ajudar!';
    }
  }, [geminiService]);

  // Função para enviar mensagem com delay realista
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Calcula o tempo de "pensamento" baseado na complexidade da pergunta
      const thinkingTime = calculateThinkingTime(text.trim());

      // Simula o tempo de processamento/pensamento
      await new Promise(resolve => setTimeout(resolve, thinkingTime));

      const response = await processUserQuestion(text.trim());

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Tente novamente.',
        isUser: false,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, processUserQuestion, calculateThinkingTime]);

  // Função para ações rápidas
  const handleQuickAction = useCallback((action: QuickAction) => {
    sendMessage(action.query);
  }, [sendMessage]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>MiroAI - Assistente IA</Text>
          <Text style={styles.headerSubtitle}>Powered by Google Gemini</Text>
        </View>
        <View style={styles.headerIcon}>
          <IconSymbol name="robot" size={24} color="#0000FF" />
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        decelerationRate={0.7}
        bounces={true}
        bouncesZoom={false}
        alwaysBounceVertical={true}
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        nestedScrollEnabled={false}
        overScrollMode="auto"
        maximumZoomScale={1}
        minimumZoomScale={1}
        snapToAlignment="center"
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.botMessage
            ]}
          >
            {!message.isUser && (
              <View style={styles.botAvatar}>
                <IconSymbol name="robot" size={16} color="#0000FF" />
              </View>
            )}
            <View
              style={[
                styles.messageBubble,
                message.isUser ? styles.userBubble : styles.botBubble
              ]}
            >
              <Text style={[
                styles.messageText,
                message.isUser ? styles.userText : styles.botText
              ]}>
                {message.text}
              </Text>
              <Text style={styles.messageTime}>
                {message.timestamp.toLocaleTimeString('pt-BR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageContainer, styles.botMessage]}>
            <View style={styles.botAvatar}>
              <IconSymbol name="robot" size={16} color="#0000FF" />
            </View>
            <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
              <View style={styles.typingContainer}>
                <Text style={styles.typingText}>MiroAI está digitando</Text>
                <Text style={styles.typingDots}>{typingDots}</Text>
              </View>
              <TypingDots />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Perguntas frequentes:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={100}
          decelerationRate={0.7}
          bounces={true}
          contentInsetAdjustmentBehavior="automatic"
          overScrollMode="auto"
          snapToAlignment="start"
          scrollEventThrottle={32}
          decelerationRate="normal"
          bounces={true}
          contentInsetAdjustmentBehavior="automatic"
        >
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionButton}
              onPress={() => handleQuickAction(action)}
            >
              <IconSymbol name={action.icon as any} size={16} color="#0000FF" />
              <Text style={styles.quickActionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Digite sua pergunta sobre finanças..."
            multiline
            maxLength={500}
            editable={!isLoading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || isLoading) && styles.sendButtonDisabled
            ]}
            onPress={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <IconSymbol
              name="paperplane.fill"
              size={20}
              color={(!inputText.trim() || isLoading) ? "#999" : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  headerIcon: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  botMessage: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0000FF10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#0000FF',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
  },
  loadingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  // Estilos para o efeito "digitando"
  typingBubble: {
    minHeight: 50,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  typingDots: {
    fontSize: 12,
    color: '#0000FF',
    fontWeight: 'bold',
    marginLeft: 4,
    minWidth: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0000FF',
    marginHorizontal: 2,
  },

  quickActionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  quickActionsTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#0000FF20',
  },
  quickActionText: {
    fontSize: 12,
    color: '#0000FF',
    marginLeft: 6,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0000FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ddd',
  },
});