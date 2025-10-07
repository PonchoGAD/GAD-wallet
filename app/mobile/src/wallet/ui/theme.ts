// GAD Wallet — Dark Tech V2
export const G = {
  colors: {
    bg: '#0B0C10',
    surface: '#1C1F26',
    gold: '#D4AF37',
    text: '#F7F8FA',
    mint: '#80FFD3',
    blue: '#0A84FF',
    glass: 'rgba(255,255,255,0.10)',
    borderGold: 'rgba(212,175,55,0.55)',
    sub: 'rgba(247,248,250,0.7)',
  },
  radius: { sm: 10, md: 16, lg: 24, xl: 32 },
  shadow: {
    glow: { shadowColor: '#D4AF37', shadowOpacity: 0.25, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
    elevated: { shadowColor: '#000', shadowOpacity: 0.35, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  },
  spacing: (n: number) => n * 8,
};
