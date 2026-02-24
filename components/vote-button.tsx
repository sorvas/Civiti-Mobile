import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { Localization } from '@/constants/localization';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useAuth } from '@/store/auth-context';
import { useVote } from '@/hooks/use-vote';

type VoteButtonProps = {
  issueId: string;
  hasVoted: boolean;
  voteCount: number;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function VoteButton({ issueId, hasVoted, voteCount }: VoteButtonProps) {
  const { requireAuth } = useAuth();
  const vote = useVote(issueId);
  const scale = useSharedValue(1);
  const isFirstRender = useRef(true);

  const errorColor = useThemeColor({}, 'error');
  const textSecondary = useThemeColor({}, 'textSecondary');

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scale.value = withSequence(
      withSpring(1.3, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 6, stiffness: 200 }),
    );
  }, [hasVoted, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = useCallback(() => {
    requireAuth(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      vote.mutate(hasVoted);
    });
  }, [requireAuth, vote, hasVoted]);

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.container, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={`${voteCount} ${Localization.detail.voteCount}. ${hasVoted ? Localization.detail.voteRemove : Localization.detail.vote}`}
      accessibilityState={{ selected: hasVoted }}
    >
      <IconSymbol
        name={hasVoted ? 'heart.fill' : 'heart'}
        size={24}
        color={hasVoted ? errorColor : textSecondary}
      />
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
