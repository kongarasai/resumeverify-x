"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export interface TrustScore {
  userId: string;
  overallScore: number;
  breakdown: {
    codingScore: number;
    projectScore: number;
    communicationScore: number;
    behavioralScore: number;
    githubScore: number;
    leetcodeScore: number;
    certificationScore: number;
    plagiarismPenalty: number;
  };
  trend: {
    direction: "up" | "down" | "stable";
    change: number;
    period: string;
  };
  lastUpdated: string;
  nextRecalculation: string;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    earnedAt: string;
  }>;
  history: Array<{
    date: string;
    score: number;
  }>;
}

export function useTrustScore(userId?: string) {
  const { user } = useAuthStore();
  const targetId = userId || user?.id;
  const queryClient = useQueryClient();

  const query = useQuery<TrustScore>({
    queryKey: ["trust-score", targetId],
    queryFn: () => apiClient.get<TrustScore>(`/trust-score/${targetId}`),
    enabled: !!targetId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    retry: 2,
    placeholderData: (prev) => prev,
  });

  const recalculateMutation = useMutation({
    mutationFn: () => apiClient.post<TrustScore>(`/trust-score/${targetId}/recalculate`),
    onSuccess: (data) => {
      queryClient.setQueryData(["trust-score", targetId], data);
      queryClient.invalidateQueries({ queryKey: ["trust-score", targetId] });
    },
  });

  return {
    trustScore: query.data,
    overallScore: query.data?.overallScore ?? 0,
    breakdown: query.data?.breakdown,
    trend: query.data?.trend,
    history: query.data?.history ?? [],
    badges: query.data?.badges ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    recalculate: recalculateMutation.mutate,
    isRecalculating: recalculateMutation.isPending,
  };
}
