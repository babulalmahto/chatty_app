import { useInfiniteQuery } from "@tanstack/react-query";
import { messageService } from "../services/messageService";
import { useCallback, type RefObject } from "react";

export function useMessages(
  conversationId: string | undefined,
  containerRef: RefObject<HTMLDivElement | null>,
) {
  const query = useInfiniteQuery({
    queryKey: ["messages", conversationId],
    queryFn: async ({ pageParam }: { pageParam?: string | undefined }) => {
      if (!conversationId) throw new Error("No conversation selected");
      return messageService.fetchMessages(conversationId, pageParam);
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNext) {
        return lastPage.nextCursor;
      }
      return undefined;
    },
    enabled: !!conversationId,
    staleTime: Infinity,
    refetchOnMount: true,
  });

  const handleLoadMore = useCallback(async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollHeightBefore = container.scrollHeight;
    const scrollTopBefore = container.scrollTop;

    try {
      await query.fetchNextPage();

      setTimeout(() => {
        const scrollHeightAfter = container.scrollHeight;
        container.scrollTop =
          scrollTopBefore + (scrollHeightAfter - scrollHeightBefore);
      }, 0);
    } catch (error) {
      console.error("Error fetching next page of messages:", error);
    }
  }, [query, containerRef]);
  return {
    ...query,
    handleLoadMore,
  };
}
