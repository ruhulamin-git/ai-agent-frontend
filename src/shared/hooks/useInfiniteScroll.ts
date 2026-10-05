import { useCallback } from "react";

import type { UseInfiniteScrollOptions, UseInfiniteScrollResult } from "./types";

const useInfiniteScroll = ({
  hasNextPage,
  isLoading,
  isEnabled = true,
  threshold = 0.1,
  onLoadMore,
}: UseInfiniteScrollOptions): UseInfiniteScrollResult => {
  const handleScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      if (!isEnabled) return;

      if (!hasNextPage || isLoading) return;

      const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;

      const thresholdDistance = scrollHeight * threshold;

      const isNearBottom = scrollTop + clientHeight >= scrollHeight - thresholdDistance;

      if (isNearBottom) {
        onLoadMore();
      }
    },
    [hasNextPage, isLoading, isEnabled, threshold, onLoadMore]
  );

  return {
    handleScroll,
  };
};

export { useInfiniteScroll };
