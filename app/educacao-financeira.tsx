import { IconSymbol } from '@/components/ui/IconSymbol';
import { FinancialDataService, formatCurrency, formatPercentage } from '@/utils/financialData';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Oi! Tudo bem por aí? 👋 Eu sou seu assistente virtual MiroAI e tô aqui pra facilitar seu dia a dia bancário. O que posso fazer por você agora?\n\nPosso te ajudar com informações sobre investimentos, taxas atuais, simulações financeiras e muito mais! Fique à vontade para me perguntar qualquer coisa. 😊',
      isUser: false,
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const financialService = FinancialDataService.getInstance();

  // Rola para o final quando novas mensagens são adicionadas
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  // Função para processar perguntas do usuário
  const processUserQuestion = useCallback(async (question: string): Promise<string> => {
    const lowerQuestion = question.toLowerCase().trim();

    try {
      // Saudações e cumprimentos
      if (lowerQuestion.includes('oi') || lowerQuestion.includes('olá') || lowerQuestion.includes('bom dia') || lowerQuestion.includes('boa tarde') || lowerQuestion.includes('boa noite')) {
        const greetings = [
          'Oi! 👋 Que bom te ver aqui! Posso te ajudar com qualquer dúvida sobre seu banco. Seja sobre investimentos, contas, cartões ou qualquer serviço. Me conta, o que você precisa? 😊',
          'Olá! 😊 Fico muito feliz em te ajudar! Estou aqui para facilitar sua vida bancária. Pode me perguntar sobre qualquer coisa - prometo explicar de um jeito bem simples!',
          'E aí! 🤖 Que legal te ver por aqui! Sou o MiroAI e estou aqui para te ajudar com tudo que você precisar do banco. Qual sua dúvida hoje?'
        ];
        return greetings[Math.floor(Math.random() * greetings.length)];
      }

      // Agradecimentos
      if (lowerQuestion.includes('obrigado') || lowerQuestion.includes('obrigada') || lowerQuestion.includes('valeu')) {
        const thanks = [
          'Imagina! 😊 Fico muito feliz em te ajudar! Se tiver mais dúvidas, pode perguntar à vontade, tá?',
          'De nada mesmo! 🤖 Adorei poder esclarecer isso para você. Tem mais alguma coisa que você gostaria de saber?',
          'Que isso! 👍 Foi um prazer! Qualquer dúvida que aparecer, é só me chamar!'
        ];
        return thanks[Math.floor(Math.random() * thanks.length)];
      }

      // Perguntas sobre taxa Selic
      if (lowerQuestion.includes('selic') || (lowerQuestion.includes('taxa') && lowerQuestion.includes('juros'))) {
        const economicData = await financialService.getEconomicIndicators();
        const responses = [
          `Claro! Já te explico :) 🏦 

Consultei a API do Banco Central agora e a taxa Selic atual está em ${formatPercentage(economicData.selic)}.

Ah, deixa eu te explicar de um jeito bem simples: a Selic é como o "termômetro" da nossa economia. A cada 45 dias, o pessoal do Banco Central se reúne e decide se ela sobe, desce ou fica igual.

Por que isso importa para você? Porque ela influencia praticamente tudo - desde o rendimento da sua poupança até a taxa do seu financiamento!

💡 Com a Selic nesse patamar, o Tesouro Selic está uma ótima opção - rende bem e é super seguro!`,

          `Ótima pergunta! Aqui está a informação que encontrei 📊

A Selic hoje está em ${formatPercentage(economicData.selic)} ao ano (dados oficiais do Banco Central).

Sabe, muita gente acha que isso é coisa de economista, mas na verdade mexe com o seu bolso todos os dias! É tipo a "taxa mãe" - todas as outras seguem ela.

🎯 Te dou um exemplo prático: com a Selic assim, investimentos em renda fixa ficam bem atrativos. Por isso tanta gente está saindo da poupança para o Tesouro Selic!

E o legal é que você pode começar com só R$ 30 e ter a garantia do governo brasileiro. Bem seguro, né?`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }

      // Perguntas sobre inflação
      if (lowerQuestion.includes('inflação') || lowerQuestion.includes('ipca')) {
        const economicData = await financialService.getEconomicIndicators();
        return `Ah, entendi! Deixa eu te mostrar isso 📈

Consultei a API do Banco Central e o IPCA atual está em ${formatPercentage(economicData.ipca)} nos últimos 12 meses.

Sabe quando você vai no mercado e percebe que tudo está mais caro que no mês passado? Pois é, isso é a inflação! O IPCA mede exatamente quanto os preços subiram.

🎯 A meta do governo é 3,25% ao ano (com uma tolerância de 1,5% para mais ou menos)

💡 Aqui vai uma dica importante: se seu dinheiro render menos que a inflação, você está ficando mais pobre na prática! Por exemplo, se a inflação está em ${formatPercentage(economicData.ipca)} e seu investimento rende só 3%, você está perdendo poder de compra.

🛡️ Dica de ouro: O Tesouro IPCA+ é perfeito para se proteger da inflação! Ele garante inflação + juros reais por cima.`;
      }

      // Perguntas sobre dólar
      if (lowerQuestion.includes('dólar') || lowerQuestion.includes('câmbio') || lowerQuestion.includes('moeda')) {
        const economicData = await financialService.getEconomicIndicators();
        return `Ah, o dólar! 💵 Hoje ele está cotado a ${formatCurrency(economicData.dolar)}.

Sabe, o dólar é como aquele amigo que influencia todo mundo na turma! Quando ele sobe ou desce, mexe com a economia inteira. Deixa eu te explicar de um jeito bem prático:

🛒 **Quando o dólar sobe:**
• Aquele iPhone que você quer fica mais caro
• Gasolina pode subir (petróleo é cotado em dólar)
• Suas férias no exterior ficam mais caras
• Mas se você tem investimentos em dólar, eles se valorizam!

💡 **Dica esperta:**
Muita gente só pensa no dólar quando vai viajar, mas ele afeta seu bolso todos os dias! Por isso, ter uma pequena parte dos investimentos protegida em dólar pode ser uma boa ideia.

🎯 **Como se proteger:** Fundos cambiais ou ETFs internacionais são formas simples de ter essa proteção sem complicação!`;
      }

      // Perguntas sobre como investir
      if (lowerQuestion.includes('como investir') || lowerQuestion.includes('começar investir') || lowerQuestion.includes('primeiros passos')) {
        const tips = [
          `Que legal que você quer começar a investir! 🚀 Sabe, essa é uma das melhores decisões que alguém pode tomar. Vou te contar um segredo: não precisa ser rico para começar, precisa só dar o primeiro passo!

**Vou te guiar passo a passo:**

1️⃣ **Primeiro, organize a casa**
Sabe aquela dívida do cartão que tá te incomodando? Quite ela primeiro! Cartão de crédito cobra juros absurdos (tipo 400% ao ano). Não faz sentido investir ganhando 11% se você tá pagando 400%, né?

2️⃣ **Monte seu "colchão de segurança"**
Antes de pensar em ficar rico, pense em ficar tranquilo! Guarde de 3 a 6 meses dos seus gastos numa aplicação que você possa sacar a qualquer momento. O Tesouro Selic é perfeito para isso!

3️⃣ **Defina seus sonhos**
Quer comprar um carro em 2 anos? Ou está pensando na aposentadoria? Cada objetivo tem um investimento ideal. Curto prazo = segurança. Longo prazo = pode arriscar mais.

4️⃣ **Comece devagar**
Com R$ 30 você já pode investir no Tesouro Direto! Não precisa esperar ter milhares. O importante é começar e ir aprendendo.

Quer que eu te ajude com algum desses passos específicos?`,

          `Olha que bacana! 💰 Você decidiu cuidar do seu futuro financeiro! Isso me deixa muito feliz mesmo.

Vou te contar como eu orientaria um amigo meu:

🎯 **O mais importante:** Quite primeiro as dívidas que te "comem vivo" - cartão, cheque especial, essas coisas. É como tentar encher um balde furado!

🛡️ **Segundo passo:** Monte sua reserva de emergência. Sabe por quê? Porque a vida acontece! Carro quebra, geladeira pifa, às vezes rola um perrengue no trabalho... Com uma reserva, você não precisa se desesperar.

📈 **Terceiro:** Invista todo mês, mesmo que seja pouquinho. R$ 50, R$ 100, o que couber no seu orçamento. O segredo não é o valor, é a constância!

📚 **E nunca pare de estudar!** Cada real que você investe em conhecimento te dá retorno para a vida toda.

**Minha sugestão para começar:**
• 70% no Tesouro Selic (super seguro)
• 20% em CDB ou LCI/LCA (um pouquinho mais de risco)
• 10% em fundo de ações (para ir aprendendo sobre renda variável)

Lembra: começar com R$ 100 é melhor que não começar nunca!`
        ];
        return tips[Math.floor(Math.random() * tips.length)];
      }

      // Perguntas sobre reserva de emergência
      if (lowerQuestion.includes('reserva') || lowerQuestion.includes('emergência')) {
        const responses = [
          `Ah, a reserva de emergência! 🛡️ Essa é uma das coisas mais importantes que você pode fazer pelo seu futuro, sério mesmo!

Sabe, eu sempre digo que a reserva de emergência é como ter um super-herói no seu bolso. Quando a vida resolve te dar aqueles sustos - e ela sempre dá! - você não precisa entrar em pânico.

**Vou te contar como funciona:**
Se você gasta R$ 3.000 por mês (aluguel, comida, contas, essas coisas), você deveria ter entre R$ 9.000 e R$ 18.000 guardados. Parece muito? Calma, não precisa juntar tudo de uma vez!

💡 **Minha dica de ouro:** Comece guardando o equivalente a 1 mês de gastos. Depois vai para 2, depois 3... Até chegar nos 6 meses. É como subir uma escada, degrau por degrau.

🎯 **E onde guardar?** No Tesouro Selic! Rende bem, é seguro e você pode sacar a qualquer momento. É perfeito para isso!`,

          `Olha, vou te contar uma coisa: emergências financeiras são como chuva - todo mundo sabe que vai chover, mas ninguém quer sair de casa molhado! 🚨

Já passou por aquela situação? Carro quebrou bem quando você estava sem grana, ou a geladeira resolveu pifar no pior momento possível? Pois é, a vida é assim mesmo!

**Por isso sua reserva precisa ser:**
✅ **Líquida:** Conseguir o dinheiro na hora que precisar
✅ **Segura:** Sem risco de perder nem um centavo
✅ **Rentável:** Pelo menos render alguma coisa enquanto está parada

**Onde eu colocaria meu dinheiro:**
1. Tesouro Selic (minha primeira opção sempre!)
2. CDB com liquidez diária de um banco grande
3. Conta remunerada que renda bem

❌ **O que eu evitaria:** Poupança (rende muito pouco) e ações (podem desvalorizar justo quando você precisar)

Lembra: ter uma reserva não é paranoia, é inteligência financeira!`
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      }

      // Perguntas sobre Tesouro Direto
      if (lowerQuestion.includes('tesouro direto') || lowerQuestion.includes('tesouro')) {
        return `Ah, o Tesouro Direto! 🏛️ Esse é meu xodó quando o assunto é investimento seguro!

Sabe, muita gente acha que investimento é coisa complicada, mas o Tesouro Direto é literalmente o mais simples e seguro que existe. É como se você emprestasse dinheiro para o governo brasileiro e ele te pagasse juros por isso.

**Vou te explicar os 3 principais tipos:**

🟢 **Tesouro Selic** (meu favorito para começar!)
É como uma poupança turbinada! Rende 100% da Selic, você pode sacar quando quiser e nunca perde dinheiro. Perfeito para sua reserva de emergência.

🔵 **Tesouro IPCA+** (o protetor contra a inflação!)
Esse é esperto: ele te garante que você sempre vai ganhar da inflação + um juro real por cima. É ideal para objetivos de longo prazo, como aposentadoria.

🟡 **Tesouro Prefixado** (para os mais estratégicos!)
Aqui você já sabe exatamente quanto vai receber no final. É bom quando você acha que a Selic vai cair, mas tem um porém: se precisar sacar antes do vencimento, pode ter surpresas.

💡 **O que mais me impressiona:** Com apenas R$ 30 você já pode começar! E não tem taxa de administração. É o governo brasileiro garantindo seu dinheiro!

Qual desses faz mais sentido para o seu momento de vida?`;
      }

      // Perguntas sobre tipos de investimento
      if (lowerQuestion.includes('tipos de investimento') || lowerQuestion.includes('onde investir') || lowerQuestion.includes('opções de investimento')) {
        const tips = await financialService.getInvestmentTips();
        let response = `💼 **Principais Tipos de Investimento:**\n\n`;

        tips.slice(0, 4).forEach((tip, index) => {
          response += `${index + 1}️⃣ **${tip.title}**\n`;
          response += `${tip.description}\n`;
          response += `💰 Retorno: ${tip.expectedReturn}\n`;
          response += `💵 Mínimo: ${formatCurrency(tip.minimumAmount)}\n`;
          response += `⚠️ Risco: ${tip.riskLevel}\n\n`;
        });

        return response + `🎯 **Dica:** Comece pelos investimentos de menor risco e vá evoluindo conforme ganha experiência!`;
      }

      // Perguntas sobre simulação/calculadora de investimentos
      if (lowerQuestion.includes('simular') || lowerQuestion.includes('calcular') || lowerQuestion.includes('rendimento') || lowerQuestion.includes('quanto rende')) {
        return `Claro! Vou te ajudar com os cálculos! 🧮 

Sou especialista em fazer simulações financeiras personalizadas para você. Me diga os valores que você tem em mente e eu calculo tudo certinho!

📝 **Pode me falar assim:**
• "Simular 1000 inicial + 300 mensais por 12 meses"
• "Calcular 500 inicial + 200 mensais por 24 meses"  
• "Quanto rende 2000 inicial + 400 mensais por 36 meses"
• "Tenho 5000 para investir, quanto rende em 1 ano?"

💡 **Vou te mostrar:**
✅ Quanto você vai investir no total
✅ Quanto vai render (usando dados reais da Selic)
✅ Qual o valor final
✅ Qual a melhor opção de investimento para seu caso

🎯 **Dica especial:** Vou usar a taxa Selic atual (dados oficiais do Banco Central) para te dar o cálculo mais preciso possível!

Me conta seus valores que eu faço toda a conta para você! 😊`;
      }

      // Processamento de simulações específicas
      const simulationMatch = lowerQuestion.match(/(?:simular|calcular|quanto rende).*?(\d+).*?inicial.*?(\d+).*?mensais?.*?(\d+).*?meses?/i) ||
        lowerQuestion.match(/(\d+).*?inicial.*?(\d+).*?mensais?.*?(\d+).*?meses?/i) ||
        lowerQuestion.match(/tenho\s+(\d+).*?investir.*?(\d+)\s+(?:meses?|anos?)/i) ||
        lowerQuestion.match(/(\d+).*?reais?.*?(\d+)\s+(?:meses?|anos?)/i);

      if (simulationMatch) {
        const [, initial, monthly, months] = simulationMatch;
        const initialAmount = parseFloat(initial);
        const monthlyAmount = parseFloat(monthly) || 0;
        const monthsCount = parseInt(months);

        if (initialAmount > 0 && monthsCount > 0) {
          const economicData = await financialService.getEconomicIndicators();
          const annualRate = economicData.selic;

          const simulation = financialService.calculateInvestmentSimulation(
            initialAmount,
            monthlyAmount,
            annualRate,
            monthsCount
          );

          // Calcula diferentes cenários para comparação
          const poupancaRate = economicData.selic * 0.7;
          const poupancaSimulation = financialService.calculateInvestmentSimulation(
            initialAmount,
            monthlyAmount,
            poupancaRate,
            monthsCount
          );

          return `Pronto! Calculei tudo para você! 📊

💵 **Seus valores:**
• Investimento inicial: ${formatCurrency(initialAmount)}
• Aporte mensal: ${formatCurrency(monthlyAmount)}
• Período: ${monthsCount} meses (${Math.round(monthsCount / 12 * 10) / 10} anos)

📈 **Resultados no Tesouro Selic (${formatPercentage(annualRate)} ao ano):**
• Total investido: ${formatCurrency(simulation.totalInvested)}
• Valor final: ${formatCurrency(simulation.finalAmount)}
• Rendimento: ${formatCurrency(simulation.totalReturn)}
• Rentabilidade: ${formatPercentage((simulation.totalReturn / simulation.totalInvested) * 100)}

💡 **Comparação com a poupança:**
• Na poupança você teria: ${formatCurrency(poupancaSimulation.finalAmount)}
• Diferença a seu favor: ${formatCurrency(simulation.finalAmount - poupancaSimulation.finalAmount)}

🎯 **Minha recomendação personalizada:**
${initialAmount >= 10000 ?
              'Com esse valor, você pode diversificar! Sugiro 60% Tesouro Selic, 30% CDB e 10% para aprender sobre fundos.' :
              initialAmount >= 1000 ?
                'Perfeito para começar! Tesouro Selic é ideal - seguro e rende bem!' :
                'Ótimo começo! Todo grande investidor começou assim. Tesouro Selic com R$ 30 já é possível!'
            }

Quer que eu calcule outros cenários ou te ajude a escolher onde investir?`;
        }
      }

      // Cálculos de reserva de emergência personalizada
      const reservaMatch = lowerQuestion.match(/gasto\s+(\d+).*?reserva/i) ||
        lowerQuestion.match(/reserva.*?(\d+).*?gastos?/i) ||
        lowerQuestion.match(/preciso.*?(\d+).*?emergência/i);

      if (reservaMatch) {
        const [, gastoMensal] = reservaMatch;
        const gastos = parseFloat(gastoMensal);

        if (gastos > 0) {
          const reservaMinima = gastos * 3;
          const reservaIdeal = gastos * 6;
          const economicData = await financialService.getEconomicIndicators();

          return `Perfeito! Vou calcular sua reserva de emergência personalizada! 🛡️

💰 **Baseado nos seus gastos de ${formatCurrency(gastos)} por mês:**

📊 **Sua reserva deve ser:**
• Mínima (3 meses): ${formatCurrency(reservaMinima)}
• Ideal (6 meses): ${formatCurrency(reservaIdeal)}

💡 **Plano para montar sua reserva:**
1️⃣ **Meta inicial:** ${formatCurrency(gastos)} (1 mês de gastos)
2️⃣ **Segunda meta:** ${formatCurrency(gastos * 2)} (2 meses)
3️⃣ **Meta final:** ${formatCurrency(reservaIdeal)} (6 meses)

🎯 **Onde guardar:** Tesouro Selic
• Rendimento atual: ${formatPercentage(economicData.selic)} ao ano
• Liquidez: Pode sacar a qualquer momento
• Segurança: Garantido pelo governo

📈 **Quanto sua reserva vai render:**
Se você guardar ${formatCurrency(reservaIdeal)} no Tesouro Selic, em 1 ano renderá aproximadamente ${formatCurrency(reservaIdeal * (economicData.selic / 100))}.

Quer que eu te ajude a fazer um plano mensal para juntar essa reserva?`;
        }
      }

      // Cálculos de aposentadoria
      if (lowerQuestion.includes('aposentadoria') || lowerQuestion.includes('aposentar')) {
        return `Que responsabilidade! Pensar na aposentadoria é uma das coisas mais inteligentes que você pode fazer! 👴👵

Vou te ajudar a calcular! Me diga:

📝 **Para fazer um cálculo personalizado, preciso saber:**
• Quantos anos você tem hoje?
• Com quantos anos quer se aposentar?
• Quanto você gostaria de receber por mês na aposentadoria?
• Quanto pode investir por mês hoje?

💡 **Exemplo prático:**
Se você tem 30 anos, quer se aposentar aos 60 e receber R$ 5.000/mês:
• Precisará de aproximadamente R$ 1.200.000 investidos
• Investindo R$ 500/mês no Tesouro IPCA+, chegará lá!

🎯 **Dica de ouro:** Quanto mais cedo começar, menos precisa investir por mês. Os juros compostos fazem mágica no longo prazo!

Me conta sua situação que eu faço um cálculo detalhado para você! 😊`;
      }

      // Análise de perfil de investidor
      if (lowerQuestion.includes('perfil') || lowerQuestion.includes('que tipo de investidor')) {
        return `Ótima pergunta! Conhecer seu perfil é fundamental! 🎯

Vou te ajudar a descobrir! Responda mentalmente:

🤔 **Pergunta 1:** Se seus investimentos caíssem 20% em um mês, você:
a) Venderia tudo com medo
b) Ficaria preocupado mas manteria
c) Compraria mais aproveitando a queda

💰 **Pergunta 2:** Seu objetivo principal é:
a) Preservar o dinheiro (não perder)
b) Crescimento moderado e seguro
c) Máximo crescimento possível

⏰ **Pergunta 3:** Quando vai precisar do dinheiro:
a) Em menos de 2 anos
b) Entre 2 e 5 anos
c) Mais de 5 anos

📊 **Resultados:**
• **Maioria A = Conservador:** Tesouro Selic, CDB, LCI/LCA
• **Maioria B = Moderado:** Mix de renda fixa + fundos multimercado
• **Maioria C = Arrojado:** Ações, FIIs, investimentos internacionais

🎯 **Minha recomendação:** Independente do perfil, SEMPRE comece com reserva de emergência no Tesouro Selic!

Qual perfil mais combina com você? Posso sugerir uma carteira personalizada!`;
      }

      // Perguntas sobre poupança
      if (lowerQuestion.includes('poupança')) {
        const economicData = await financialService.getEconomicIndicators();
        return `Ah, a poupança! 💰 Olha, vou ser bem honesto com você: ela foi uma boa opção lá nos anos 80, mas hoje em dia... não é mais a melhor escolha.

Sabe por quê? A poupança só rende 70% da Selic quando ela está acima de 8,5%. E com a Selic atual, isso significa que você está literalmente perdendo dinheiro!

📊 **Vou te mostrar na prática:**
• Sua poupança hoje rende: ~${formatPercentage(economicData.selic * 0.7)} ao ano
• O Tesouro Selic rende: ${formatPercentage(economicData.selic)} ao ano
• Você está perdendo: ${formatPercentage(economicData.selic * 0.3)} ao ano!

💡 **Exemplo real:** Se você tem R$ 10.000:
• Na poupança: vai render ~R$ ${(10000 * (economicData.selic * 0.7 / 100)).toFixed(0)} em 1 ano
• No Tesouro Selic: vai render ~R$ ${(10000 * (economicData.selic / 100)).toFixed(0)} em 1 ano

A diferença é de R$ ${(10000 * (economicData.selic * 0.3 / 100)).toFixed(0)}! É dinheiro que você está deixando na mesa!

🎯 **Minha dica:** Migre para o Tesouro Selic! É tão seguro quanto a poupança, mas rende muito mais. E você pode sacar quando quiser!`;
      }

      // Perguntas sobre CDB
      if (lowerQuestion.includes('cdb')) {
        return `Ah, o CDB! 🏦 Esse é um dos meus favoritos para quem quer dar um passo além do Tesouro Direto!

Deixa eu te explicar de um jeito simples: CDB é como se você emprestasse dinheiro para o banco e ele te pagasse juros por isso. É tipo ser o "agiota do bem" do banco! 😄

🛡️ **E o melhor:** É super seguro! O FGC (uma espécie de seguro dos bancos) garante até R$ 250.000 por CPF por banco. Ou seja, se o banco quebrar, você não perde nada!

**Vou te explicar os tipos:**

💚 **CDB Pós-fixado** (o mais comum)
Rende uma porcentagem do CDI. Por exemplo, "110% do CDI" significa que você ganha 10% a mais que a taxa básica. É o que eu mais recomendo!

💙 **CDB Prefixado** (para os estratégicos)
Você já sabe exatamente quanto vai ganhar. Tipo "12% ao ano". É bom quando você acha que os juros vão cair.

💛 **CDB IPCA+** (o protetor)
Garante que você sempre ganha da inflação + um juro real. Perfeito para longo prazo!

💰 **Dica esperta:** Bancos menores geralmente pagam mais (tipo 120% do CDI) porque precisam "competir" com os grandes. Mas lembra do limite do FGC!

⚠️ **Só uma coisa:** Quanto mais tempo deixar o dinheiro, menos imposto paga. Depois de 2 anos, é só 15%!`;
      }

      // Perguntas sobre ações
      if (lowerQuestion.includes('ações') || lowerQuestion.includes('bolsa') || lowerQuestion.includes('b3')) {
        return `📈 **Ações - Renda Variável**

**O que são:** Pequenas partes de empresas que você pode comprar

⚠️ **Risco:** Alto - podem subir ou descer muito
🎯 **Retorno:** Potencial de ganhos maiores no longo prazo

💡 **Para iniciantes:**
1. Comece com pouco (5-10% da carteira)
2. Estude as empresas antes de comprar
3. Pense em longo prazo (5+ anos)
4. Diversifique entre setores

🏆 **Empresas populares:**
• Bancos: ITUB4, BBDC4
• Varejo: MGLU3, AMER3
• Energia: PETR4, VALE3

📚 **Antes de investir:**
• Tenha reserva de emergência
• Entenda que pode ter prejuízo
• Estude análise fundamentalista

Quer dicas de como escolher boas ações?`;
      }

      // Perguntas sobre fundos imobiliários
      if (lowerQuestion.includes('fii') || lowerQuestion.includes('fundos imobiliários') || lowerQuestion.includes('imobiliário')) {
        return `🏢 **Fundos Imobiliários (FIIs)**

**O que são:** Fundos que investem em imóveis e pagam dividendos mensais

💰 **Vantagens:**
• Dividendos mensais isentos de IR
• Diversificação imobiliária
• Liquidez (compra/vende na bolsa)
• A partir de ~R$ 100

📊 **Tipos principais:**
• **Tijolo:** Imóveis físicos (shoppings, escritórios)
• **Papel:** CRIs, LCIs (recebíveis imobiliários)
• **Híbridos:** Mix de tijolo e papel

🎯 **Dividend Yield típico:** 6% a 12% ao ano

⚠️ **Riscos:**
• Vacância dos imóveis
• Variação do preço das cotas
• Concentração setorial

💡 **Para começar:**
• HGLG11 (híbrido, diversificado)
• XPML11 (shoppings)
• KNRI11 (logística)

Quer saber como analisar um FII?`;
      }

      // Perguntas variadas sobre economia
      if (lowerQuestion.includes('economia') || lowerQuestion.includes('cenário econômico')) {
        const economicData = await financialService.getEconomicIndicators();
        return `📊 **Cenário Econômico Atual**

🏦 **Indicadores principais:**
• Selic: ${formatPercentage(economicData.selic)}
• IPCA: ${formatPercentage(economicData.ipca)}
• Dólar: ${formatCurrency(economicData.dolar)}

💡 **O que isso significa:**
• Selic alta favorece renda fixa
• Inflação controlada é positivo
• Dólar estável ajuda a economia

🎯 **Para investidores:**
• Momento favorável para renda fixa
• Diversificação sempre importante
• Foque no longo prazo

Quer entender melhor algum indicador específico?`;
      }

      // Perguntas sobre serviços bancários comuns
      if (lowerQuestion.includes('boleto') || lowerQuestion.includes('emitir boleto')) {
        return `Você quer saber como emitir um boleto? Sem problema, aqui vai o passo a passo! 📄

**Como emitir um boleto no MIROBANK:**

1️⃣ **Pelo app:** Vá em "Pagamentos" → "Gerar Boleto"
2️⃣ **Preencha os dados:** Nome do pagador, valor, vencimento
3️⃣ **Confirme:** Revise tudo e clique em "Gerar"
4️⃣ **Pronto!** Você pode compartilhar por WhatsApp, email ou imprimir

💡 **Dica:** O boleto fica salvo no seu histórico para consultar depois!

Precisa de mais alguma coisa sobre boletos?`;
      }

      if (lowerQuestion.includes('pix') || lowerQuestion.includes('transferir')) {
        return `Ah, o PIX! É super fácil e rápido! ⚡

**Como fazer um PIX:**

1️⃣ **Abra o app** e vá em "PIX"
2️⃣ **Escolha como quer pagar:** CPF, telefone, email ou chave aleatória
3️⃣ **Digite o valor** e uma mensagem (se quiser)
4️⃣ **Confirme** com sua senha ou biometria
5️⃣ **Pronto!** O dinheiro chega na hora!

� **Lembrando:** PIX é gratuito para pessoas físicas e funciona 24h, até nos fins de semana!

Quer saber mais alguma coisa sobre PIX?`;
      }

      if (lowerQuestion.includes('cartão') || lowerQuestion.includes('limite') || lowerQuestion.includes('fatura')) {
        return `Sobre cartão, posso te ajudar! 💳

**Dúvidas mais comuns:**

🔍 **Ver limite:** App → "Cartões" → Seu cartão → "Limite disponível"
📱 **Aumentar limite:** App → "Cartões" → "Solicitar aumento"
📄 **Ver fatura:** App → "Cartões" → "Fatura atual"
💰 **Pagar fatura:** App → "Pagamentos" → "Fatura do cartão"

💡 **Dica importante:** Sempre pague a fatura total para não pagar juros altos!

Qual dessas opções você precisa ou tem outra dúvida sobre cartão?`;
      }

      if (lowerQuestion.includes('conta') || lowerQuestion.includes('saldo') || lowerQuestion.includes('extrato')) {
        return `Sobre sua conta, vou te ajudar! 🏦

**Informações da conta:**

💰 **Ver saldo:** Logo na tela inicial do app
📊 **Extrato:** App → "Extrato" → Escolha o período
📱 **Dados da conta:** App → "Perfil" → "Dados bancários"
🔒 **Bloquear conta:** App → "Segurança" → "Bloquear conta"

💡 **Dica:** Você pode baixar o extrato em PDF para usar como comprovante!

O que você precisa saber sobre sua conta?`;
      }

      // Respostas empáticas para perguntas não reconhecidas
      const defaultResponses = [
        `Essa informação não está disponível no momento, mas você pode tentar novamente mais tarde ou falar com o suporte! 😊

**Enquanto isso, posso te ajudar com:**
• Investimentos e aplicações
• Informações sobre taxas atuais
• Simulações de rendimento
• Dúvidas sobre PIX, boletos e cartões

O que você gostaria de saber?`,

        `Hmm, não tenho essa informação específica agora, mas posso te ajudar com várias outras coisas! 🤖

**Sou especialista em:**
• Como começar a investir (bem simples!)
• Calcular quanto seu dinheiro pode render
• Explicar sobre Tesouro Direto, CDB e poupança
• Tirar dúvidas sobre serviços do banco

Sobre qual desses assuntos você gostaria de conversar?`,

        `Essa informação não está disponível no momento, mas você pode tentar novamente mais tarde ou falar com o suporte! 💡

**Posso te ajudar com:**
• Planejamento financeiro pessoal
• Simulações de investimento
• Informações econômicas atualizadas (Selic, inflação, dólar)
• Dúvidas sobre conta, cartão e PIX

Qual dessas opções te interessa mais?`
      ];

      return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];

    } catch (error) {
      console.error('Erro ao processar pergunta:', error);
      const errorResponses = [
        'Ops! Tive um problema técnico. Pode repetir sua pergunta? 🤖',
        'Desculpe, algo deu errado. Tente novamente em alguns segundos! ⚙️',
        'Erro temporário! Que tal tentar uma das ações rápidas abaixo? 🔧'
      ];
      return errorResponses[Math.floor(Math.random() * errorResponses.length)];
    }
  }, [financialService]);

  // Função para calcular tempo de "pensamento" baseado no tamanho da pergunta
  const calculateThinkingTime = useCallback((question: string): number => {
    const baseTime = 1500; // 1.5 segundos base
    const wordsCount = question.trim().split(' ').length;
    const complexityBonus = wordsCount * 100; // 100ms por palavra
    const randomVariation = Math.random() * 1000; // até 1 segundo de variação

    return Math.min(baseTime + complexityBonus + randomVariation, 4000); // máximo 4 segundos
  }, []);

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
          <Text style={styles.headerTitle}>Educação Financeira</Text>
          <Text style={styles.headerSubtitle}>Assistente IA</Text>
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
            <View style={[styles.messageBubble, styles.botBubble]}>
              <ActivityIndicator size="small" color="#0000FF" />
              <Text style={styles.loadingText}>Pensando...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Actions */}
      <View style={styles.quickActionsContainer}>
        <Text style={styles.quickActionsTitle}>Perguntas frequentes:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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