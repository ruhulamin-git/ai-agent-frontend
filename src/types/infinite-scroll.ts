interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isLoading: boolean;
  isEnabled?: boolean;
  threshold?: number;
  onLoadMore: () => void;
}

interface UseInfiniteScrollResult {
  handleScroll: (event: React.UIEvent<HTMLElement>) => void;
}

export type { UseInfiniteScrollOptions, UseInfiniteScrollResult };
