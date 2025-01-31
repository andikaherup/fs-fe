"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MAINTENANCE_REQUESTS,
  GET_METRICS,
  CREATE_REQUEST,
  RESOLVE_REQUEST,
} from "@/graphql/queries";
import MetricsPanel from "@/components/MetricsPanel";
import RequestList from "@/components/RequestList";
import CreateRequestForm from "@/components/RequestForm";

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);

  const { data: requestsData, loading: requestsLoading } = useQuery(
    GET_MAINTENANCE_REQUESTS
  );
  const { data: metricsData, loading: metricsLoading } = useQuery(GET_METRICS);

  const [createRequest] = useMutation(CREATE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const [resolveRequest] = useMutation(RESOLVE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const handleCreate = async (formData: {
    title: string;
    description: string;
    urgency: string;
  }) => {
    try {
      await createRequest({
        variables: { input: formData },
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating request:", error);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await resolveRequest({
        variables: { id },
      });
    } catch (error) {
      console.error("Error resolving request:", error);
    }
  };

  if (requestsLoading || metricsLoading) {
    return <div>Loading...</div>;
  }

  if (isCreating) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <CreateRequestForm
          onSubmit={handleCreate}
          onClose={() => setIsCreating(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 ">
      <h1 className="text-xl font-bold text-center mb-6">
        Maintenance Request
      </h1>
      {metricsData && <MetricsPanel {...metricsData.metrics} />}

      {requestsData && (
        <RequestList
          requests={requestsData.maintenanceRequests}
          onResolve={handleResolve}
        />
      )}

      <button
        onClick={() => setIsCreating(true)}
        className="fixed bottom-6 right-6 w-12 h-12 bg-(--color-cendolgreen) text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-green-600 transition-colors"
      >
        +
      </button>
    </div>
  );
}
