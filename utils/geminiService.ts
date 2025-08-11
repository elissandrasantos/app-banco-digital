import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FinancialDataService,
  formatCurrency,
  formatPercentage,
} from "./financialData";

// Configuração da API do Gemini
const GEMINI_API_KEY = "AIzaSyAkn_iLzm9-vZEsiuo5q0i1RbE3EJHvRbc";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export class GeminiService {
  private static instance: GeminiService;
  private model: any;
  private financialService: FinancialDataService;

  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.financialService = FinancialDataService.getInstance();
  }

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  // Contexto bancário para o Gemini
  private getBankingContext(): string {
    return `
Você é o Miro, assistente virtual do MIROBANK, um banco digital brasileiro.

REGRAS DE CUMPRIMENTOS:
- Você deve cumprimentar o usuário apenas no PRIMEIRO contato da conversa
- Após o cumprimento inicial, responda diretamente às perguntas sem repetir saudações como 'Olá', 'Oi', 'Bom dia' ou similares
- PRIMEIRA mensagem da conversa: Use cumprimento apropriado (Olá, Oi, Bom dia, etc.)
- MENSAGENS SUBSEQUENTES: Vá direto ao ponto, sem saudações repetitivas
- Se o usuário reiniciar explicitamente a conversa ou disser 'oi' novamente após longo período, você pode cumprimentar brevemente
- Mantenha um tom cordial e profissional sem soar repetitivo ou robotizado

EXEMPLO CORRETO:
Usuário: 'Olá, preciso de ajuda com investimentos'
Bot: 'Olá! Como posso ajudá-lo com investimentos?'
Usuário: 'Qual é a taxa Selic atual?'
Bot: 'A taxa Selic atual é de 11,25% ao ano...'
Usuário: 'E o Tesouro Direto?'
Bot: 'O Tesouro Direto oferece títulos que rendem 100% da Selic...'

PERSONALIDADE:
- Seja empático, acolhedor e use linguagem simples
- Use emojis para tornar a conversa mais amigável
- Explique conceitos financeiros de forma didática
- Mantenha tom conversacional e próximo
- Seja direto e objetivo nas respostas

ESPECIALIDADES:
- Educação financeira brasileira
- Investimentos (Tesouro Direto, CDB, Poupança, Ações, FIIs)
- Serviços bancários (PIX, boletos, cartões, contas)
- Indicadores econômicos brasileiros (Selic, IPCA, Dólar)
- Planejamento financeiro pessoal

DIRETRIZES:
- Use dados reais quando disponível
- Seja honesto sobre limitações
- Evite termos técnicos complexos
- Dê exemplos práticos
- Foque no mercado brasileiro
- Sempre priorize segurança financeira
- Responda diretamente à pergunta do usuário
- Seja objetivo e útil

IMPORTANTE:
- Nunca invente informações
- Se não souber algo, admita e sugira alternativas
- Mantenha respostas concisas mas completas
- Use formatação clara com emojis e bullets
- NÃO repita cumprimentos em cada resposta
- Foque na pergunta do usuário e seja direto
`;
  }

  // Função principal para processar perguntas com Gemini
  async processQuestion(question: string): Promise<string> {
    try {
      // Primeiro, tenta responder com dados locais para perguntas específicas
      const localResponse = await this.tryLocalResponse(question);
      if (localResponse) {
        return localResponse;
      }

      // Se não conseguir responder localmente, usa o Gemini
      const context = this.getBankingContext();
      const prompt = `${context}\n\nPergunta do cliente: ${question}\n\nResponda como MiroAI:`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      let text = response.text();

      // Pós-processamento para garantir consistência
      text = this.postProcessResponse(text);

      return text;
    } catch (error) {
      console.error("Erro ao processar pergunta com Gemini:", error);
      return this.getFallbackResponse();
    }
  }

  // Tenta responder com dados locais primeiro (para informações específicas)
  private async tryLocalResponse(question: string): Promise<string | null> {
    const lowerQuestion = question.toLowerCase();

    try {
      // Dados econômicos atuais
      if (lowerQuestion.includes("selic") && lowerQuestion.includes("atual")) {
        const economicData =
          await this.financialService.getEconomicIndicators();
        return `A taxa Selic atual é de ${formatPercentage(
          economicData.selic
        )} ao ano! 📊

Esta é a taxa básica de juros do Brasil, definida pelo Banco Central. Ela influencia todos os outros investimentos do país.

💡 **Por que é importante para você:**
• Tesouro Selic rende 100% dessa taxa
• CDBs geralmente rendem uma porcentagem dela
• Quanto maior a Selic, melhor para renda fixa

Quer saber mais sobre como aproveitar essa taxa nos seus investimentos?`;
      }

      // IPCA atual
      if (
        lowerQuestion.includes("ipca") ||
        lowerQuestion.includes("inflação")
      ) {
        const economicData =
          await this.financialService.getEconomicIndicators();
        return `O IPCA (nossa inflação oficial) está em ${formatPercentage(
          economicData.ipca
        )} nos últimos 12 meses! 📈

💡 **O que isso significa:**
É quanto os preços subiram no último ano. Para seus investimentos renderem de verdade, eles precisam ganhar mais que isso!

🎯 **Dica importante:** Procure investimentos que rendam acima da inflação, como o Tesouro IPCA+ que te protege da alta de preços.

Quer que eu calcule quanto você precisa investir para não perder para a inflação?`;
      }

      // Cotação do dólar
      if (lowerQuestion.includes("dólar")) {
        const economicData =
          await this.financialService.getEconomicIndicators();
        return `O dólar está cotado a ${formatCurrency(
          economicData.dolar
        )} hoje! 💵

🌍 **Por que acompanhar o dólar:**
• Afeta preços de produtos importados
• Influencia investimentos internacionais
• Pode impactar a inflação

💡 **Para investidores:** Ter uma pequena parte em dólar pode ser uma boa proteção. Fundos cambiais são uma forma simples de fazer isso!

Quer saber mais sobre como se proteger da variação do dólar?`;
      }

      return null; // Não conseguiu responder localmente
    } catch (error) {
      return null;
    }
  }

  // Pós-processamento para garantir consistência
  private postProcessResponse(text: string): string {
    // Remove possíveis prefixos indesejados
    text = text.replace(/^(MiroAI:|Assistente:|IA:)/i, "").trim();

    // Garante que não seja muito longo
    if (text.length > 1500) {
      text =
        text.substring(0, 1500) +
        "...\n\nQuer que eu detalhe algum ponto específico?";
    }

    // Adiciona quebras de linha para melhor formatação
    text = text.replace(/\n\n/g, "\n\n");

    return text;
  }

  // Resposta de fallback em caso de erro
  private getFallbackResponse(): string {
    const fallbacks = [
      `Ops! Tive um probleminha técnico aqui! 🤖

Mas não se preocupe, posso te ajudar com:
• Informações sobre investimentos
• Dados econômicos atuais
• Simulações de rendimento
• Dúvidas sobre PIX, boletos e cartões

Que tal tentar fazer sua pergunta novamente?`,

      `Desculpa, algo deu errado por aqui! ⚙️

Enquanto isso, posso te ajudar com:
• Taxa Selic e inflação atuais
• Como começar a investir
• Calculadora de investimentos
• Serviços bancários

Pode repetir sua pergunta? Prometo caprichar na resposta!`,

      `Eita! Deu uma travadinha aqui! 🔧

Mas estou funcionando para:
• Educação financeira
• Simulações de investimento
• Informações econômicas
• Dúvidas bancárias

Tenta perguntar de novo? Vou fazer o meu melhor!`,
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Função para calcular simulações com contexto do Gemini
  async calculateInvestmentWithAdvice(
    initialAmount: number,
    monthlyAmount: number,
    months: number
  ): Promise<string> {
    try {
      const economicData = await this.financialService.getEconomicIndicators();
      const simulation = this.financialService.calculateInvestmentSimulation(
        initialAmount,
        monthlyAmount,
        economicData.selic,
        months
      );

      const prompt = `
Como MiroAI, analise esta simulação de investimento e dê conselhos personalizados:

DADOS DA SIMULAÇÃO:
- Valor inicial: ${formatCurrency(initialAmount)}
- Aporte mensal: ${formatCurrency(monthlyAmount)}
- Período: ${months} meses
- Taxa Selic atual: ${formatPercentage(economicData.selic)}
- Valor final: ${formatCurrency(simulation.finalAmount)}
- Rendimento: ${formatCurrency(simulation.totalReturn)}

Dê uma resposta completa com:
1. Análise dos resultados
2. Recomendação de investimento adequada
3. Dicas personalizadas baseadas no perfil
4. Comparação com outras opções

Mantenha tom amigável e use emojis.
`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      // Fallback para cálculo simples
      const economicData = await this.financialService.getEconomicIndicators();
      const simulation = this.financialService.calculateInvestmentSimulation(
        initialAmount,
        monthlyAmount,
        economicData.selic,
        months
      );

      return `📊 **Resultado da Sua Simulação**

💵 **Seus valores:**
• Investimento inicial: ${formatCurrency(initialAmount)}
• Aporte mensal: ${formatCurrency(monthlyAmount)}
• Período: ${months} meses

📈 **Resultados:**
• Total investido: ${formatCurrency(simulation.totalInvested)}
• Valor final: ${formatCurrency(simulation.finalAmount)}
• Rendimento: ${formatCurrency(simulation.totalReturn)}

🎯 **Recomendação:** Para essa simulação, o Tesouro Selic é uma excelente opção!`;
    }
  }
}
