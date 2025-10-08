import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const NFTS = [
  { id: '1', name: 'NFT #1', image: 'https://placekitten.com/200/200' },
  { id: '2', name: 'NFT #2', image: 'https://placekitten.com/201/200' },
  { id: '3', name: 'NFT #3', image: 'https://placekitten.com/202/200' },
];

export default function NftScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your NFTs</Text>

      <FlatList
        data={NFTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
    padding: 20,
  },
  title: {
    color: '#F7F8FA',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#1C1E26',
    borderWidth: 1,
    borderColor: '#D4AF37',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 12,
  },
  name: {
    color: '#80FFD3',
    fontSize: 16,
    fontWeight: '600',
  },
});
