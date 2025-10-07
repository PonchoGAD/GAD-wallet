import React from 'react';
import { View, Text, FlatList } from 'react-native';

const NFTS = [
  { id: '1', name: 'NFT #1' },
  { id: '2', name: 'NFT #2' },
  { id: '3', name: 'NFT #3' },
];

export default function NftScreen() {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Your NFTs</Text>
      <FlatList
        data={NFTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 5 }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}
