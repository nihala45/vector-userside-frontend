import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetBanners() {
  return useQuery({
    queryKey: ['getBanners'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/website-management/heros-list/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}


export function useGetFeatures() {
  return useQuery({
    queryKey: ['getBanners'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/website-management/features-list/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}

export function useGetTestimonials() {
  return useQuery({
    queryKey: ['getTestimonials'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/website-management/testimonials-list/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}