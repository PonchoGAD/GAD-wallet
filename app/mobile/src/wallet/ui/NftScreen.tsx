import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { ethers } from 'ethers';
import { useNavigation } from '@react-navigation/native';

import { MINT_URL, NFT_CONTRACT } from '../../config/env';
import { provider } from '../../lib/provider';
import { toGatewayUrl } from '../../lib/ipfs';

// === DEMO LIST (оставляем как фолбэк, если нет найденных по сети) ===
const NFTS = [
  { id: '1', name: 'NFT #1', image: 'https://placekitten.com/200/200' },
  { id: '2', name: 'NFT #2', image: 'https://placekitten.com/201/200' },
  { id: '3', name: 'NFT #3', image: 'https://placekitten.com/202/200' },
];

// Минимальный ABI для получения tokenURI и парсинга Transfer
const ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

type ChainItem = { tokenId: string; tokenURI: string; image?: string };
type UIItem = { id: string; name: string; image: string; tokenURI?: string };

export default function NftScreen() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState<ChainItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ⚠️ укажи адрес текущего пользователя (временный способ)
  const walletAddress =
    (process.env as any).EXPO_PUBLIC_WALLET_ADDRESS?.toString() || '';

  const contract = useMemo(
    () => new ethers.Contract(NFT_CONTRACT, ABI, provider),
    []
  );

  async function fetchByEvents() {
    if (!walletAddress) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const latest = await provider.getBlockNumber();
      const fromBlock = Math.max(1, Number(latest) - 200_000);

      const transferTopic = ethers.id('Transfer(address,address,uint256)');
      const topicFromZero =
        '0x0000000000000000000000000000000000000000000000000000000000000000';
      const topicTo =
        '0x' + walletAddress.toLowerCase().replace(/^0x/, '').padStart(64, '0');

      const logs = await provider.getLogs({
        address: NFT_CONTRACT,
        fromBlock,
        toBlock: latest,
        topics: [transferTopic, topicFromZero, topicTo],
      });

      const unique = new Set<string>();
      const results: ChainItem[] = [];

      for (const log of logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          const tokenId = (parsed.args?.tokenId as bigint).toString();
          if (unique.has(tokenId)) continue;
          unique.add(tokenId);

          const uri: string = await contract.tokenURI(tokenId);
          let image: string | undefined;
          if (
            uri.startsWith('ipfs://') ||
            uri.endsWith('.png') ||
            uri.endsWith('.jpg') ||
            uri.endsWith('.jpeg')
          ) {
            image = toGatewayUrl(uri);
          }
          results.push({ tokenId, tokenURI: uri, image });
        } catch {}
      }

      results.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
      setItems(results);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchByEvents().catch(console.error);
  }, [walletAddress]);

  const openExternalMint = () => Linking.openURL(MINT_URL);
  const openInAppMint = () => navigation.navigate('AiMintWeb');

  // Приводим данные к единому типу UIItem
  const dataToRender: UIItem[] =
    items.length > 0
      ? items.map((it) => ({
          id: it.tokenId,
          name: `NFT #${it.tokenId}`,
          image: it.image || 'https://placehold.co/400x400?text=NFT',
          tokenURI: it.tokenURI,
        }))
      : NFTS.map((d) => ({
          id: d.id,
          name: d.name,
          image: d.image,
        }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your NFTs</Text>

      {/* Кнопки для минта */}
      <View style={styles.row}>
        <TouchableOpacity style={styles.ctaPrimary} onPress={openExternalMint}>
          <Text style={styles.ctaText}>AI Mint (web)</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ctaSecondary} onPress={openInAppMint}>
          <Text style={styles.ctaText}>Open In-App</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.refresh}
          onPress={fetchByEvents}
          disabled={loading}
        >
          <Text style={styles.refreshText}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
            {item.tokenURI ? (
              <Text style={styles.meta} numberOfLines={1}>
                {item.tokenURI}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: '#9CA3AF' }}>
              No NFTs found by recent mint events. Try AI Mint.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // твоя палитра — без изменений
  container: { flex: 1, backgroundColor: '#0B0C10', padding: 20 },
  title: {
    color: '#F7F8FA',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },

  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimary: {
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderColor: '#D4AF37',
    borderWidth: 1,
  },
  ctaSecondary: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaText: { color: '#fff', fontWeight: '600' },

  refresh: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: { color: '#111', fontWeight: '600' },

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
  image: { width: 120, height: 120, borderRadius: 12, marginBottom: 12 },
  name: { color: '#80FFD3', fontSize: 16, fontWeight: '600' },
  meta: { color: '#9CA3AF', marginTop: 6, fontSize: 12, maxWidth: '100%' },
});
