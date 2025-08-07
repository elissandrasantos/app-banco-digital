// Lazy loading de componentes para melhorar performance de inicialização
import { lazy } from 'react';

// Lazy load das telas secundárias
export const LazyInvestirScreen = lazy(() => import('../app/investir'));
export const LazyCartaoScreen = lazy(() => import('../app/cartao'));

// Lazy load de componentes pesados
export const LazyIconSymbol = lazy(() => import('../components/ui/IconSymbol').then(module => ({ default: module.IconSymbol })));

// Preload crítico - componentes que devem ser carregados rapidamente
export const preloadCriticalComponents = () => {
  // Preload apenas componentes essenciais para a tela inicial
  import('../components/ThemedText');
  import('../components/ThemedView');
  import('../hooks/useColorScheme');
};

// Preload secundário - componentes que podem ser carregados depois
export const preloadSecondaryComponents = () => {
  setTimeout(() => {
    import('../app/investir');
    import('../app/cartao');
    import('../components/ui/IconSymbol');
  }, 1000); // Carrega após 1 segundo
};