import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useTokensStore } from '../state/tokensStore';

export default function AddTokenScreen() {
  const [symbol, setSymbol] = useState('');
  const [address, setAddress] = useState('');
  const { addToken } = useTokensStore();

  const handleAdd = () => {
    if (!symbol || !address) return Alert.alert('Error', 'Please fill in all fields');
    addToken(symbol, address);
    Alert.alert('Success', `Token ${symbol} added successfully`);
    setSymbol('');
    setAddress('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Add Token</Text>
      <Text>Token Symbol:</Text>
      <TextInput
        value={symbol}
        onChangeText={setSymbol}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      <Text>Token Address:</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={{ borderWidth: 1, marginBottom: 20 }}
      />
      <Button title="Add Token" onPress={handleAdd} />
    </View>
  );
}
