/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router";
import { toast } from 'sonner';

type MutationParams<T> = {
  apiCall: (data: T) => Promise<any>;
  onSuccessMessage?: string;
  queryKeyToInvalidate?: string;
  redirectTo?: string;
};

export const useGenericMutation = <T>({
  apiCall,
  onSuccessMessage = 'Operation successful',
  queryKeyToInvalidate,
  redirectTo
}: MutationParams<T>) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: T) => {
      try {
        console.log(data)
        const response = await apiCall(data);
        return response;
      } catch (error) {
        console.log('Error:', error);
        throw error;
      }
    },
    onMutate: () => {
      console.log('mutate');
    },
    onSettled: async (_, error:any) => {
      if (error) {
        console.log(error);
        toast.error(error.message);
      } else {
        toast.success(onSuccessMessage);
        if (redirectTo) {
          navigate(redirectTo); 
        }
        if (queryKeyToInvalidate) {
          await queryClient.invalidateQueries({ queryKey: [queryKeyToInvalidate] });
        }
      }
    }
  });
};
