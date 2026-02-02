import useSWR from 'swr';
import type { Project, Service, Banner, Settings, Contact, User } from '@/lib/types';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};

export function useProjects(options?: { featured?: boolean; status?: string; limit?: number }) {
  const params = new URLSearchParams();
  if (options?.featured) params.set('featured', 'true');
  if (options?.status) params.set('status', options.status);
  if (options?.limit) params.set('limit', options.limit.toString());
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return useSWR<Project[]>(`/api/projects${query}`, fetcher);
}

export function useServices(options?: { featured?: boolean }) {
  const params = new URLSearchParams();
  if (options?.featured) params.set('featured', 'true');
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return useSWR<Service[]>(`/api/services${query}`, fetcher);
}

export function useBanners(options?: { active?: boolean }) {
  const params = new URLSearchParams();
  if (options?.active) params.set('active', 'true');
  
  const query = params.toString() ? `?${params.toString()}` : '';
  return useSWR<Banner[]>(`/api/banners${query}`, fetcher);
}

export function useSettings() {
  return useSWR<Settings>('/api/settings', fetcher);
}

export function useContacts() {
  return useSWR<Contact[]>('/api/contacts', fetcher);
}

export function useUsers() {
  return useSWR<User[]>('/api/users', fetcher);
}
