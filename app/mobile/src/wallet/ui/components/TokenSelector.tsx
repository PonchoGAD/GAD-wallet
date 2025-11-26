// app/mobile/src/wallet/ui/components/TokenSelector.tsx
// ---------------------------------------------
//   Универсальный селектор токена (BottomSheet)
//   Для Send / Swap / будущего AddToken и прочего
// ---------------------------------------------

import React from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../theme';

export type TokenInfoLite = {
  address: string;       // 0x...
  symbol: string;        // GAD, BNB, USDT...
  name?: string;
  decimals?: number;
};

type TokenSelectorProps = {
  visible: boolean;
  tokens: TokenInfoLite[];
  /** Текущий выбранный токен (по symbol или address — на твой выбор) */
  selectedKey?: string;
  /** Выбор токена */
  onSelect: (token: TokenInfoLite) => void;
  /** Закрытие модалки */
  onClose: () => void;
  title?: string;
};

/**
 * TokenSelector — простой bottom-sheet с прокруткой.
 * Логика:
 *  - передаём список токенов (из TOKENS + кастомные из tokensStore)
 *  - показываем символ + name
 *  - выделяем текущий selectedKey
 */
export function TokenSelector({
  visible,
  tokens,
  selectedKey,
  onSelect,
  onClose,
  title = 'Select token',
}: TokenSelectorProps) {
  const G = useTheme();

  const handleSelect = (t: TokenInfoLite) => {
    onSelect(t);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      {/* полупрозрачный фон */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* ловим только клик по фону; ниже — сама панель */}
      </Pressable>

      {/* bottom-sheet панель */}
      <View
        style={[
          styles.sheet,
          {
            backgroundColor: G.colors.card,
            borderTopColor: G.colors.border,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerHandle} />
          <Text style={[styles.title, { color: G.colors.text }]}>
            {title}
          </Text>
        </View>

        <ScrollView
          style={{ maxHeight: 420 }}
          contentContainerStyle={styles.listContent}
        >
          {tokens.map((t) => {
            const key = selectedKey ?? '';
            const isActive =
              key.toLowerCase() === t.symbol.toLowerCase() ||
              key.toLowerCase() === t.address.toLowerCase();

            return (
              <Pressable
                key={`${t.address}-${t.symbol}`}
                onPress={() => handleSelect(t)}
                style={({ pressed }) => [
                  styles.item,
                  {
                    borderColor: isActive
                      ? G.colors.accent
                      : G.colors.border,
                    backgroundColor: isActive
                      ? G.colors.cardAlt
                      : 'transparent',
                  },
                  pressed && { opacity: 0.9 },
                ]}
              >
                <View style={styles.iconStub} />
                <View style={styles.itemTextCol}>
                  <Text
                    style={[
                      styles.symbol,
                      { color: G.colors.text },
                    ]}
                  >
                    {t.symbol}
                  </Text>
                  {t.name ? (
                    <Text
                      style={[
                        styles.name,
                        { color: G.colors.textMuted },
                      ]}
                      numberOfLines={1}
                    >
                      {t.name}
                    </Text>
                  ) : null}
                </View>
                {typeof t.decimals === 'number' && (
                  <Text
                    style={[
                      styles.decimals,
                      { color: G.colors.textMuted },
                    ]}
                  >
                    {t.decimals}
                  </Text>
                )}
              </Pressable>
            );
          })}

          {tokens.length === 0 && (
            <View style={styles.emptyBox}>
              <Text style={{ color: G.colors.textMuted }}>
                No tokens to show yet.
              </Text>
            </View>
          )}
        </ScrollView>

        <Pressable
          onPress={onClose}
          style={({ pressed }) => [
            styles.closeBtn,
            {
              borderColor: G.colors.border,
              backgroundColor: G.colors.cardAlt,
            },
            pressed && { opacity: 0.9 },
          ]}
        >
          <Text style={{ color: G.colors.text, fontWeight: '600' }}>
            Close
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 12,
  },
  headerHandle: {
    width: 48,
    height: 4,
    borderRadius: 999,
    backgroundColor: '#4B5563',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  listContent: {
    paddingVertical: 4,
    paddingBottom: 8,
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  iconStub: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#80FFD3',
    backgroundColor: '#1F2933',
    marginRight: 10,
  },
  itemTextCol: {
    flex: 1,
  },
  symbol: {
    fontSize: 15,
    fontWeight: '700',
  },
  name: {
    fontSize: 12,
    marginTop: 2,
  },
  decimals: {
    fontSize: 12,
    marginLeft: 8,
  },
  emptyBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
});
