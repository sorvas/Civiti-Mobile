import { useMutation } from '@tanstack/react-query';

import { enhanceText } from '@/services/issues';
import type { EnhanceTextRequest } from '@/types/issues';

export function useEnhanceText() {
  return useMutation({
    mutationFn: (data: EnhanceTextRequest) => enhanceText(data),
  });
}
