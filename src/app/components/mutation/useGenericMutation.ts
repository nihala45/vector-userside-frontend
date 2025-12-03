/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type MutationParams<TVariables, TData = unknown, TError = Error, TContext = unknown> = {
  apiCall: (data: TVariables) => Promise<TData>;
  onSuccessMessage?: string;
  queryKeyToInvalidate?: string | string[];
  redirectTo?: string;
  onSuccess?: (data: TData, variables: TVariables, context: TContext | undefined) => void;
  onError?: (error: TError, variables: TVariables, context: TContext | undefined) => void;
  onSettled?: (
    data: TData | undefined,
    error: TError | null,
    variables: TVariables,
    context: TContext | undefined
  ) => void;
};

export const useGenericMutation = <
  TVariables,
  TData = unknown,
  TError = Error,
  TContext = unknown,
>({
  apiCall,
  onSuccessMessage = "Operation successful",
  queryKeyToInvalidate,
  redirectTo,
  onSuccess,
  onError,
  onSettled,
}: MutationParams<TVariables, TData, TError, TContext>) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<TData, TError, TVariables, TContext>({
    mutationFn: apiCall,

    onSuccess: (data, variables, context) => {
      toast.success(onSuccessMessage);

      if (redirectTo) {
        router.push(redirectTo);
      }

      if (queryKeyToInvalidate) {
        const keys = Array.isArray(queryKeyToInvalidate)
          ? queryKeyToInvalidate
          : [queryKeyToInvalidate];

        keys.forEach((key) => {
          queryClient.invalidateQueries({ 
            queryKey: typeof key === "string" ? [key] : key 
          });
        });
      }

      // Safely call external onSuccess with proper typing
      onSuccess?.(data, variables, context);
    },

    onError: (error, variables, context) => {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);

      // Safely call external onError with proper typing
      onError?.(error, variables, context);
    },

    onSettled: (data, error, variables, context) => {
      onSettled?.(data, error, variables, context);
    },
  });
};