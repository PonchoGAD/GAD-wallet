import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useTokensStore } from '../state/tokensStore';

export default function AddTokenScreen() {
  const [symbol, setSymbol] = useState('');
  const [address, setAddress] = useState('');
  const { addToken } = useTokensStore();

  const handleAdd = () => {
    if (!symbol || !address)
      return Alert.alert('Error', 'Please fill in all fields');
    addToken(symbol, address);
    Alert.alert('Success', `Token ${symbol} added successfully`);
    setSymbol('');
    setAddress('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Add Token</Text>
        <Text style={styles.subtitle}>Manually add a custom token</Text>

        <Text style={styles.label}>Token Symbol:</Text>
        <TextInput
          value={symbol}
          onChangeText={setSymbol}
          placeholder="e.g. GAD"
          placeholderTextColor="#8A8F99"
          autoCapitalize="characters"
          style={styles.input}
        />

        <Text style={styles.label}>Token Address:</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="0x..."
          placeholderTextColor="#8A8F99"
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.btnWrap}>
          <Button title="Add Token" color="#0A84FF" onPress={handleAdd} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0C10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#1C1E26',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  title: {
    color: '#F7F8FA',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#80FFD3',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
  },
  label: {
    color: '#F7F8FA',
    opacity: 0.8,
    marginTop: 10,
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2E3440',
    backgroundColor: '#2A2E37',
    color: '#F7F8FA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  btnWrap: {
    marginTop: 18,
    overflow: 'hidden',
    borderRadius: 14,
  },
});
