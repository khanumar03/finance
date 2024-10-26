import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetCarbonFootPrint = () => {

  const query = useQuery({
    queryKey: ["carbonfootprint"],
    queryFn: async () => {
      const response = await client.api.carbonfootprint.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const { data } = await response.json();
      return data
    },
  });

  return query;
};
