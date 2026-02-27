import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Spacing } from '@/constants/spacing';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { BadgeResponse } from '@/types/gamification';

const ICON_SIZE = 40;
const CARD_WIDTH = 80;

type BadgeCardProps = {
  badge: BadgeResponse;
};

export function BadgeCard({ badge }: BadgeCardProps) {
  const secondaryColor = useThemeColor({}, 'textSecondary');
  const [imageError, setImageError] = useState(false);

  return (
    <View style={[styles.container, !badge.isEarned && styles.unearned]}>
      {badge.iconUrl && !imageError ? (
        <Image
          source={{ uri: badge.iconUrl }}
          style={styles.icon}
          contentFit="contain"
          recyclingKey={badge.id}
          transition={200}
          accessibilityRole="image"
          accessibilityLabel={badge.nameRo ?? badge.name ?? 'Badge'}
          onError={() => setImageError(true)}
        />
      ) : (
        <IconSymbol name="star.fill" size={ICON_SIZE} color={secondaryColor} />
      )}
      <ThemedText type="caption" style={styles.label} numberOfLines={2}>
        {badge.nameRo ?? badge.name ?? ''}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  unearned: {
    opacity: 0.4,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  label: {
    textAlign: 'center',
  },
});
