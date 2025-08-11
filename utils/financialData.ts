// Utilitário para buscar dados financeiros de APIs públicas brasileiras

export interface EconomicIndicators {
  selic: number;
  ipca: number;
  cdi: number;
  dolar: number;
  lastUpdate: string;
}

export interface FinancialNews {
  id: string;
  title: string;
  summary: string;
  category: 'economia' | 'investimentos' | 'mercado' | 'educacao';
  date: string;
  source: string;
}

export interface InvestmentTip {
  id: string;
  title: string;
  description: string;
  category: 'iniciante' | 'intermediario' | 'avancado';
  riskLevel: 'baixo' | 'medio' | 'alto';
  expectedReturn: string;
  minimumAmount: number;
}

// Classe para gerenciar dados financeiros
export class FinancialDataService {
  private static instance: FinancialDataService;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  static getInstance(): FinancialDataService {
    if (!FinancialDataService.instance) {
      FinancialDataService.instance = new FinancialDataService();
    }
    return FinancialDataService.instance;
  }

  private isValidCache(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Busca dados econômicos do Banco Central (APIs reais)
  async getEconomicIndicators(): Promise<EconomicIndicators> {
    const cacheKey = 'economic_indicators';
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      // Busca dados reais das APIs do Banco Central com timeout
      const [selicData, ipcaData, dolarData] = await Promise.allSettled([
        Promise.race([
          this.fetchSelicRate(),
          new Promise<number>((_, reject) => setTimeout(() => reject(new Error('Timeout Selic')), 8000))
        ]),
        Promise.race([
          this.fetchIPCARate(),
          new Promise<number>((_, reject) => setTimeout(() => reject(new Error('Timeout IPCA')), 8000))
        ]),
        Promise.race([
          this.fetchDollarRate(),
          new Promise<number>((_, reject) => setTimeout(() => reject(new Error('Timeout Dólar')), 8000))
        ])
      ]);

      // Valores de fallback atualizados e realistas
      const fallbackValues = {
        selic: 11.25,
        ipca: 4.68,
        dolar: 5.43
      };

      const indicators: EconomicIndicators = {
        selic: selicData.status === 'fulfilled' && !isNaN(selicData.value) ? selicData.value : fallbackValues.selic,
        ipca: ipcaData.status === 'fulfilled' && !isNaN(ipcaData.value) ? ipcaData.value : fallbackValues.ipca,
        cdi: selicData.status === 'fulfilled' && !isNaN(selicData.value) ? selicData.value - 0.1 : fallbackValues.selic - 0.1,
        dolar: dolarData.status === 'fulfilled' && !isNaN(dolarData.value) ? dolarData.value : fallbackValues.dolar,
        lastUpdate: new Date().toISOString()
      };

      // Log para debug (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.log('Indicadores econômicos:', {
          selic: `${selicData.status} - ${selicData.status === 'fulfilled' ? selicData.value : 'fallback'}`,
          ipca: `${ipcaData.status} - ${ipcaData.status === 'fulfilled' ? ipcaData.value : 'fallback'}`,
          dolar: `${dolarData.status} - ${dolarData.status === 'fulfilled' ? dolarData.value : 'fallback'}`
        });
      }

      this.setCache(cacheKey, indicators);
      return indicators;
    } catch (error) {
      console.error('Erro geral ao buscar indicadores econômicos:', error);
      // Retorna dados de fallback seguros
      return {
        selic: 11.25,
        ipca: 4.68,
        cdi: 11.15,
        dolar: 5.43,
        lastUpdate: new Date().toISOString()
      };
    }
  }

  // Busca taxa Selic da API do Banco Central
  private async fetchSelicRate(): Promise<number> {
    try {
      // API do Banco Central para taxa Selic (série 432)
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json');
      const data = await response.json();
      
      if (data && data.length > 0) {
        return parseFloat(data[0].valor);
      }
      throw new Error('Dados não encontrados');
    } catch (error) {
      console.error('Erro ao buscar taxa Selic:', error);
      return 11.25; // Fallback
    }
  }

  // Busca IPCA da API do Banco Central
  private async fetchIPCARate(): Promise<number> {
    try {
      // API do Banco Central para IPCA acumulado 12 meses (série 13522)
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.13522/dados/ultimos/1?formato=json');
      const data = await response.json();
      
      if (data && data.length > 0) {
        return parseFloat(data[0].valor);
      }
      throw new Error('Dados não encontrados');
    } catch (error) {
      console.error('Erro ao buscar IPCA:', error);
      return 4.68; // Fallback
    }
  }

  // Busca cotação do dólar da API do Banco Central
  private async fetchDollarRate(): Promise<number> {
    try {
      // Tenta primeiro uma API mais simples e confiável
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 segundos de timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      
      // Verifica se a resposta não está vazia
      if (!text || text.trim() === '') {
        throw new Error('Resposta vazia da API');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Erro ao fazer parse do JSON:', parseError);
        throw new Error('JSON inválido recebido da API');
      }
      
      if (data && Array.isArray(data) && data.length > 0 && data[0].valor) {
        const valor = parseFloat(data[0].valor);
        if (!isNaN(valor) && valor > 0) {
          return valor;
        }
      }
      
      // Se a primeira API falhar, tenta uma API alternativa mais simples
      return await this.fetchDollarRateAlternative();
      
    } catch (error) {
      console.error('Erro ao buscar cotação do dólar (API principal):', error);
      
      // Tenta API alternativa
      try {
        return await this.fetchDollarRateAlternative();
      } catch (alternativeError) {
        console.error('Erro ao buscar cotação do dólar (API alternativa):', alternativeError);
        return 5.43; // Fallback com valor realista
      }
    }
  }

  // API alternativa para cotação do dólar
  private async fetchDollarRateAlternative(): Promise<number> {
    try {
      // Usa uma API mais simples do Banco Central
      const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.10813/dados/ultimos/1?formato=json', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 3000,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0 && data[0].valor) {
        const valor = parseFloat(data[0].valor);
        if (!isNaN(valor) && valor > 0) {
          return valor;
        }
      }
      
      throw new Error('Dados inválidos da API alternativa');
    } catch (error) {
      console.error('Erro na API alternativa do dólar:', error);
      throw error;
    }
  }

  // Busca notícias financeiras (simulado)
  async getFinancialNews(): Promise<FinancialNews[]> {
    const cacheKey = 'financial_news';
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      // Em produção, integrar com APIs de notícias financeiras
      const news: FinancialNews[] = [
        {
          id: '1',
          title: 'Banco Central mantém Selic em 11,25%',
          summary: 'Copom decide manter taxa básica de juros inalterada pela segunda reunião consecutiva',
          category: 'economia',
          date: new Date().toISOString(),
          source: 'Banco Central'
        },
        {
          id: '2',
          title: 'Tesouro Direto: Como investir com segurança',
          summary: 'Guia completo para iniciantes investirem em títulos públicos',
          category: 'educacao',
          date: new Date(Date.now() - 86400000).toISOString(),
          source: 'Tesouro Nacional'
        },
        {
          id: '3',
          title: 'Dólar fecha em alta de 0,8%',
          summary: 'Moeda americana encerra o dia cotada a R$ 5,43',
          category: 'mercado',
          date: new Date(Date.now() - 172800000).toISOString(),
          source: 'B3'
        }
      ];

      this.setCache(cacheKey, news);
      return news;
    } catch (error) {
      console.error('Erro ao buscar notícias financeiras:', error);
      return [];
    }
  }

  // Busca dicas de investimento personalizadas
  async getInvestmentTips(userProfile: 'conservador' | 'moderado' | 'arrojado' = 'moderado'): Promise<InvestmentTip[]> {
    const cacheKey = `investment_tips_${userProfile}`;
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      const allTips: InvestmentTip[] = [
        {
          id: '1',
          title: 'Tesouro Selic',
          description: 'Investimento mais seguro do país, ideal para reserva de emergência',
          category: 'iniciante',
          riskLevel: 'baixo',
          expectedReturn: '100% do CDI',
          minimumAmount: 30
        },
        {
          id: '2',
          title: 'CDB de Bancos Grandes',
          description: 'Certificado de Depósito Bancário com garantia do FGC',
          category: 'iniciante',
          riskLevel: 'baixo',
          expectedReturn: '95% a 110% do CDI',
          minimumAmount: 1000
        },
        {
          id: '3',
          title: 'Fundos de Renda Fixa',
          description: 'Diversificação em títulos de renda fixa com gestão profissional',
          category: 'intermediario',
          riskLevel: 'medio',
          expectedReturn: '105% a 120% do CDI',
          minimumAmount: 100
        },
        {
          id: '4',
          title: 'Fundos Imobiliários (FIIs)',
          description: 'Investimento em imóveis com distribuição mensal de dividendos',
          category: 'intermediario',
          riskLevel: 'medio',
          expectedReturn: '8% a 12% ao ano',
          minimumAmount: 100
        },
        {
          id: '5',
          title: 'Ações de Dividendos',
          description: 'Ações de empresas sólidas que pagam bons dividendos',
          category: 'avancado',
          riskLevel: 'alto',
          expectedReturn: '10% a 15% ao ano',
          minimumAmount: 100
        }
      ];

      // Filtra dicas baseado no perfil do usuário
      let filteredTips = allTips;
      if (userProfile === 'conservador') {
        filteredTips = allTips.filter(tip => tip.riskLevel === 'baixo');
      } else if (userProfile === 'moderado') {
        filteredTips = allTips.filter(tip => tip.riskLevel !== 'alto');
      }

      this.setCache(cacheKey, filteredTips);
      return filteredTips;
    } catch (error) {
      console.error('Erro ao buscar dicas de investimento:', error);
      return [];
    }
  }

  // Calcula simulação de investimento
  calculateInvestmentSimulation(
    initialAmount: number,
    monthlyAmount: number,
    annualRate: number,
    months: number
  ): {
    finalAmount: number;
    totalInvested: number;
    totalReturn: number;
    monthlyData: Array<{ month: number; amount: number; invested: number }>;
  } {
    const monthlyRate = annualRate / 100 / 12;
    let currentAmount = initialAmount;
    const totalInvested = initialAmount + (monthlyAmount * months);
    const monthlyData = [];

    for (let month = 1; month <= months; month++) {
      currentAmount = currentAmount * (1 + monthlyRate) + monthlyAmount;
      monthlyData.push({
        month,
        amount: currentAmount,
        invested: initialAmount + (monthlyAmount * month)
      });
    }

    return {
      finalAmount: currentAmount,
      totalInvested,
      totalReturn: currentAmount - totalInvested,
      monthlyData
    };
  }

  // Busca cotação de criptomoedas (simulado)
  async getCryptoRates(): Promise<Array<{ symbol: string; name: string; price: number; change24h: number }>> {
    const cacheKey = 'crypto_rates';
    
    if (this.isValidCache(cacheKey)) {
      return this.cache.get(cacheKey)!.data;
    }

    try {
      // Em produção, usar APIs como CoinGecko ou CoinMarketCap
      const cryptos = [
        { symbol: 'BTC', name: 'Bitcoin', price: 245000, change24h: 2.5 },
        { symbol: 'ETH', name: 'Ethereum', price: 12500, change24h: -1.2 },
        { symbol: 'BNB', name: 'Binance Coin', price: 1250, change24h: 0.8 }
      ];

      this.setCache(cacheKey, cryptos);
      return cryptos;
    } catch (error) {
      console.error('Erro ao buscar cotações de criptomoedas:', error);
      return [];
    }
  }
}

// Funções utilitárias para formatação
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value / 100);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
};