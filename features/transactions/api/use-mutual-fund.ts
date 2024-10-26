import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";

export const useMutualFunds = () => {

  const query = useQuery({
    queryKey: ["mutualfunds", { savings: 1000 }],
    queryFn: async () => {
      const response = await client.api.mutualfunds.$post(
        {
            param: {savings: 1000}
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();
      return data
    },
  });

  return query;
};
