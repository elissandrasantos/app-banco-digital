import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';

const DADOS = [
  { id: '1', descricao: 'TV Led 49' },
  { id: '2', descricao: 'Camisa Trilha' },
  { id: '3', descricao: 'Qualquer semelhança é mera coincidência' },
];

const Item = ({ descricao }: { descricao: string }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{descricao}</Text>
  </View>
);

export default function HomeScreen() {
  const renderItem = ({ item }: { item: typeof DADOS[0] }) => <Item descricao={item.descricao} />;

  return (
    <View style={styles.container}>
      <FlatList data={DADOS} renderItem={renderItem} keyExtractor={(item) => item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: 'yellow',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 12,
  },
});
