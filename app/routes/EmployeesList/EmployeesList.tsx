import EmployeeTable from "components/Table/EmployeeTable";
import { useLoaderData } from "react-router";
import { fetchEmployees } from "services/employees";
import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { Route } from "../../+types/root";

export async function loader({ params }: Route.LoaderArgs) {
  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["employees", 1, 10],
      queryFn: () => fetchEmployees(1, 10),
    });

    return {
      dehydratedState: dehydrate(queryClient),
    };
  } catch (err) {
    return {
      dehydratedState: dehydrate(queryClient),
      error: "Failed to fetch employees!",
    };
  }
}

export default function EmployeesList() {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const { data, isLoading, error } = useQuery({
    queryKey: ["employees", page, perPage],
    queryFn: () => fetchEmployees(page, perPage),
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to fetch employees!</div>;

  return (
    <div>
      <EmployeeTable
        data={data?.items ?? []}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        setPage={setPage}
      />
    </div>
  );
}
