// app/mobile/src/wallet/ui/NftScreen.tsx
// ---------------------------------------------
// Экран NFT: список NFT по событиям Transfer,
// AI Mint кнопки, Scroll + FooterNav
// ---------------------------------------------

import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { ethers } from 'ethers';
import { useNavigation } from '@react-navigation/native';

import { MINT_URL, NFT_CONTRACT } from '../../config/env';
import { provider } from '../../lib/provider';
import { toGatewayUrl } from '../../lib/ipfs';
import { ensureWalletCore } from '../state/walletStore';

import { useTheme } from './theme';
import WalletFooterNav from './components/WalletFooterNav';

const DEMO_NFTS = [
  { id: '1', name: 'NFT #1', image: 'https://placekitten.com/200/200' },
  { id: '2', name: 'NFT #2', image: 'https://placekitten.com/201/200' },
  { id: '3', name: 'NFT #3', image: 'https://placekitten.com/202/200' },
];

const ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
  'function tokenURI(uint256 tokenId) view returns (string)',
];

type ChainItem = { tokenId: string; tokenURI: string; image?: string };
type UIItem = { id: string; name: string; image: string; tokenURI?: string };

export default function NftScreen() {
  const G = useTheme();
  const navigation = useNavigation<any>();

  const [items, setItems] = useState<ChainItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');

  const contract = useMemo(
    () => new ethers.Contract(NFT_CONTRACT, ABI, provider),
    [],
  );

  async function fetchByEventsFor(address: string) {
    if (!address) {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const latest = await provider.getBlockNumber();
      const fromBlock = Math.max(1, Number(latest) - 50_000);

      const transferTopic = ethers.id(
        'Transfer(address,address,uint256)',
      );
      const topicFromZero =
        '0x0000000000000000000000000000000000000000000000000000000000000000';
      const topicTo =
        '0x' +
        address.toLowerCase().replace(/^0x/, '').padStart(64, '0');

      let logs: ethers.Log[] = [];
      try {
        logs = await provider.getLogs({
          address: NFT_CONTRACT,
          fromBlock,
          toBlock: latest,
          topics: [transferTopic, topicFromZero, topicTo],
        });
      } catch (err) {
        console.warn('[NftScreen] getLogs error:', err);
        setItems([]);
        return;
      }

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

          if (uri.startsWith('ipfs://')) {
            image = toGatewayUrl(uri);
          } else if (
            uri.endsWith('.png') ||
            uri.endsWith('.jpg') ||
            uri.endsWith('.jpeg')
          ) {
            image = uri;
          }
          results.push({ tokenId, tokenURI: uri, image });
        } catch (e) {
          console.warn('[NftScreen] parse log error:', e);
        }
      }

      results.sort((a, b) => Number(b.tokenId) - Number(a.tokenId));
      setItems(results);
    } catch (e) {
      console.error('[NftScreen] fetchByEventsFor error:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const wallet = await ensureWalletCore();
        const addr = wallet?.address ?? '';
        if (!alive) return;
        setWalletAddress(addr);
        if (addr) {
          await fetchByEventsFor(addr);
        } else {
          setItems([]);
        }
      } catch (e) {
        console.error('[NftScreen] wallet init error:', e);
        if (alive) setItems([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const openExternalMint = () => Linking.openURL(MINT_URL);
  const openInAppMint = () => navigation.navigate('AiMintWeb');

  const onRefresh = () => {
    if (!walletAddress) return;
    fetchByEventsFor(walletAddress).catch(console.error);
  };

  const dataToRender: UIItem[] =
    items.length > 0
      ? items.map((it) => ({
          id: it.tokenId,
          name: `NFT #${it.tokenId}`,
          image: it.image || 'https://placehold.co/400x400?text=NFT',
          tokenURI: it.tokenURI,
        }))
      : DEMO_NFTS.map((d) => ({
          id: d.id,
          name: d.name,
          image: d.image,
        }));

  return (
    <View style={{ flex: 1, backgroundColor: G.colors.bg }}>
      <View style={[styles.header, { borderBottomColor: G.colors.border }]}>
        <Text style={[styles.title, { color: G.colors.text }]}>
          Your NFTs
        </Text>
        {walletAddress ? (
          <Text
            style={[
              styles.subtitle,
              { color: G.colors.textMuted },
            ]}
          >
            Address: {walletAddress.slice(0, 6)}...
            {walletAddress.slice(-4)}
          </Text>
        ) : null}
      </View>

      <View style={[styles.actionsRow]}>
        <TouchableOpacity
          style={[
            styles.ctaPrimary,
            { borderColor: G.colors.accent },
          ]}
          onPress={openExternalMint}
        >
          <Text style={[styles.ctaText, { color: G.colors.text }]}>
            AI Mint (web)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ctaSecondary, { backgroundColor: G.colors.card }]}
          onPress={openInAppMint}
        >
          <Text style={[styles.ctaText, { color: G.colors.text }]}>
            Open In-App
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.refresh,
            { backgroundColor: G.colors.cardAlt },
          ]}
          onPress={onRefresh}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color={G.colors.text} />
          ) : (
            <Text
              style={[
                styles.refreshText,
                { color: G.colors.text },
              ]}
            >
              Refresh
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={dataToRender}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: G.colors.card,
                borderColor: G.colors.accent,
              },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={[styles.name, { color: G.colors.accentSoft }]}>
              {item.name}
            </Text>
            {item.tokenURI ? (
              <Text
                style={[styles.meta, { color: G.colors.textMuted }]}
                numberOfLines={1}
              >
                {item.tokenURI}
              </Text>
            ) : null}
          </View>
        )}
        ListEmptyComponent={
          <View style={{ padding: 24, alignItems: 'center' }}>
            <Text style={{ color: G.colors.textMuted }}>
              No NFTs found by recent mint events. Try AI Mint.
            </Text>
          </View>
        }
      />

      <WalletFooterNav active="NFT" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  ctaPrimary: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  ctaSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  ctaText: {
    fontWeight: '600',
    fontSize: 13,
  },
  refresh: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  refreshText: {
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  image: { width: 120, height: 120, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  meta: { marginTop: 6, fontSize: 12, maxWidth: '100%' },
});
