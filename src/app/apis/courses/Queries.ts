import { useQuery } from '@tanstack/react-query'
import { axiosAdmin } from '../../lib/axios'

export function useGetCourse() {
  return useQuery({
    queryKey: ['getCourses'],
    queryFn: async () => {
      try {
        const response = await axiosAdmin.get('/api/course/courses/');
        return response?.data ?? { results: [], count: 0 };

      } catch (error) {
        console.log('err', error);
        throw error;
      }
    },
  });
}
