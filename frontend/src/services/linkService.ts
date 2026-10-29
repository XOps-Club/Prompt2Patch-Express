import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { request } from './api.js';
import type { LinksResponse, GlobalStatsResponse, LinkItem, ShortenInput } from '../schemas/link.schema.js';

export const linkKeys = {
  all: ['links'] as const,
  lists: () => [...linkKeys.all, 'list'] as const,
  list: (page: number, limit: number, includeDeleted: boolean, search: string) =>
    [...linkKeys.lists(), { page, limit, includeDeleted, search }] as const,
  stats: () => [...linkKeys.all, 'stats'] as const,
  detail: (id: number) => [...linkKeys.all, 'detail', id] as const
};

// API Services
export const linkService = {
  getLinks: (page = 1, limit = 10, includeDeleted = false, search = '') => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      includeDeleted: String(includeDeleted)
    });
    if (search.trim()) params.set('search', search.trim());
    return request<LinksResponse>(`/links?${params.toString()}`);
  },

  getStats: () => {
    return request<GlobalStatsResponse>('/links/stats');
  },

  createLink: (input: ShortenInput) => {
    return request<LinkItem>('/links', {
      method: 'POST',
      body: JSON.stringify(input)
    });
  },

  deleteLink: (id: number) => {
    return request<{ success: boolean; message: string }>(`/links/${id}`, {
      method: 'DELETE'
    });
  },

  restoreLink: (id: number) => {
    return request<LinkItem>(`/links/${id}/restore`, {
      method: 'POST'
    });
  }
};

/**
 * Generates QR code image URL for a given short URL
 */
export function getQrCodeUrl(shortUrl: string): string {
  if (!shortUrl) return '';
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shortUrl)}`;
}

export async function copyToClipboard(text: string): Promise<void> {
  if (!text) throw new Error('Nothing to copy');
  if (!navigator.clipboard?.writeText) {
    throw new Error('Clipboard access is unavailable in this browser');
  }
  await navigator.clipboard.writeText(text);
}

// TanStack Query Hooks
export function useLinks(page = 1, limit = 10, includeDeleted = false, search = '') {
  return useQuery({
    queryKey: linkKeys.list(page, limit, includeDeleted, search),
    queryFn: () => linkService.getLinks(page, limit, includeDeleted, search),
    placeholderData: (previousData) => previousData
  });
}

export function useGlobalStats() {
  return useQuery({
    queryKey: linkKeys.stats(),
    queryFn: () => linkService.getStats(),
    retry: 1
  });
}

export function useCreateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkService.createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: linkKeys.stats() });
    }
  });
}

export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkService.deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: linkKeys.stats() });
    }
  });
}

export function useRestoreLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: linkService.restoreLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: linkKeys.lists() });
      queryClient.invalidateQueries({ queryKey: linkKeys.stats() });
    }
  });
}
