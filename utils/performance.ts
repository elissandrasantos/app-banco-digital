// Utilitários de performance para o app MIROBANK

import { InteractionManager } from 'react-native';

// Cache para formatação de moeda
const currencyCache = new Map<number, string>();

// Formatador de moeda otimizado com cache
export const formatCurrency = (value: number): string => {
  if (currencyCache.has(value)) {
    return currencyCache.get(value)!;
  }
  
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
  
  // Limitar o cache para evitar vazamento de memória
  if (currencyCache.size > 100) {
    const firstKey = currencyCache.keys().next().value;
    currencyCache.delete(firstKey);
  }
  
  currencyCache.set(value, formatted);
  return formatted;
};

// Cache para formatação de data
const dateCache = new Map<string, string>();

// Formatador de data otimizado com cache
export const formatDate = (dateString: string): string => {
  if (dateCache.has(dateString)) {
    return dateCache.get(dateString)!;
  }
  
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  // Limitar o cache para evitar vazamento de memória
  if (dateCache.size > 50) {
    const firstKey = dateCache.keys().next().value;
    dateCache.delete(firstKey);
  }
  
  dateCache.set(dateString, formatted);
  return formatted;
};

// Debounce para otimizar buscas
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Executar após interações para melhor performance
export const runAfterInteractions = (callback: () => void): void => {
  InteractionManager.runAfterInteractions(callback);
};

// Throttle para limitar execuções frequentes
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Limpar caches quando necessário
export const clearCaches = (): void => {
  currencyCache.clear();
  dateCache.clear();
};