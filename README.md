# Banco Digital - Aplicativo Mobile

![Banco Digital](https://img.shields.io/badge/Banco%20Digital-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue)
![Expo](https://img.shields.io/badge/Expo-53.0.17-white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

Um aplicativo de banco digital moderno desenvolvido com React Native e Expo, oferecendo uma experiência de usuário intuitiva e segura para gerenciamento financeiro.

## 📱 Funcionalidades

- **Tela Inicial**: Visualização de saldo, limite de cartão e ações rápidas
- **Cartões**: Gerenciamento de cartões físicos e virtuais
- **Faturas**: Visualização e pagamento de faturas mensais
- **Extrato**: Acompanhamento de transações e movimentações
- **Transferências**: Envio de dinheiro via PIX, TED e DOC
- **Perfil**: Gerenciamento de dados pessoais e configurações

## 🛠️ Tecnologias Utilizadas

### Core
- **[React Native](https://reactnative.dev/)**: Framework para desenvolvimento mobile
- **[Expo](https://expo.dev/)**: Plataforma para desenvolvimento React Native
- **[TypeScript](https://www.typescriptlang.org/)**: Linguagem de programação tipada
- **[Expo Router](https://docs.expo.dev/router/introduction/)**: Sistema de navegação baseado em arquivos

### UI/UX
- **[React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)**: Animações fluidas
- **[React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/)**: Gestos nativos
- **[React Native Safe Area Context](https://github.com/th3rdwave/react-native-safe-area-context)**: Gerenciamento de área segura
- **[React Native Screens](https://github.com/software-mansion/react-native-screens)**: Otimização de navegação

### Navegação
- **[@react-navigation/native](https://reactnavigation.org/)**: Navegação entre telas
- **[@react-navigation/bottom-tabs](https://reactnavigation.org/docs/bottom-tab-navigator/)**: Navegação por tabs

### Componentes e Utilidades
- **[Expo Font](https://docs.expo.dev/versions/latest/sdk/font/)**: Carregamento de fontes personalizadas
- **[Expo Status Bar](https://docs.expo.dev/versions/latest/sdk/status-bar/)**: Controle da barra de status
- **[Expo Splash Screen](https://docs.expo.dev/versions/latest/sdk/splash-screen/)**: Tela de splash
- **[Expo Linking](https://docs.expo.dev/versions/latest/sdk/linking/)**: Deep linking
- **[Expo Constants](https://docs.expo.dev/versions/latest/sdk/constants/)**: Constantes do ambiente
- **[Expo Image](https://docs.expo.dev/versions/latest/sdk/image/)**: Componente de imagem otimizado
- **[Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)**: Feedback tátil

## 📂 Estrutura do Projeto

```
banco-digital/
├── app/                    # Diretório principal de telas
│   ├── (tabs)/             # Telas com navegação por tabs
│   │   ├── _layout.tsx     # Layout das tabs
│   │   ├── index.tsx       # Tela inicial
│   │   ├── extrato.tsx     # Tela de extrato
│   │   ├── transferencia.tsx # Tela de transferência
│   │   └── perfil.tsx      # Tela de perfil
│   ├── _layout.tsx         # Layout principal
│   ├── cartao.tsx          # Tela de cartão
│   └── faturas.tsx         # Tela de faturas
├── assets/                 # Recursos estáticos
│   ├── fonts/              # Fontes personalizadas
│   └── images/             # Imagens
├── components/             # Componentes reutilizáveis
│   ├── ui/                 # Componentes de UI
│   ├── ThemedText.tsx      # Texto com tema
│   └── ThemedView.tsx      # View com tema
├── constants/              # Constantes da aplicação
│   └── Colors.ts           # Cores do tema
├── hooks/                  # Hooks personalizados
│   └── useColorScheme.ts   # Hook para tema claro/escuro
├── App.js                  # Ponto de entrada da aplicação
├── app.json                # Configuração do Expo
├── package.json            # Dependências do projeto
└── tsconfig.json           # Configuração do TypeScript
```

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn
- Expo CLI
- iOS Simulator ou Android Emulator (opcional)

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/banco-digital.git
cd banco-digital
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Inicie o aplicativo:
```bash
npm start
# ou
yarn start
```

4. Escaneie o QR code com o aplicativo Expo Go (Android) ou a câmera (iOS), ou pressione:
   - `i` para abrir no iOS Simulator
   - `a` para abrir no Android Emulator
   - `w` para abrir na web

## 🔒 Segurança

O aplicativo implementa as melhores práticas de segurança para aplicativos financeiros:

- Autenticação segura
- Proteção de dados sensíveis
- Opção de ocultar informações financeiras
- Bloqueio temporário de cartão



## 📄 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👩‍💻 Autora

Desenvolvido por [Elissandra Santos](https://github.com/elissandrasantos/app-banco-digital)

---

© 2025 Banco Digital. Todos os direitos reservados.