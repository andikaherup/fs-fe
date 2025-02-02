"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MAINTENANCE_REQUESTS,
  GET_METRICS,
  CREATE_REQUEST,
  RESOLVE_REQUEST,
  UPDATE_REQUEST,
} from "@/graphql/queries";
import MetricsPanel from "@/components/MetricsPanel";
import RequestList from "@/components/RequestList";
import RequestForm from "@/components/RequestForm";

interface Request {
  id: string;
  title: string;
  description: string;
  urgency: string;
}

export default function Home() {
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const { data: requestsData, loading: requestsLoading } = useQuery(
    GET_MAINTENANCE_REQUESTS
  );
  const { data: metricsData, loading: metricsLoading } = useQuery(GET_METRICS);

  const [createRequest] = useMutation(CREATE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const [updateRequest] = useMutation(UPDATE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const [resolveRequest] = useMutation(RESOLVE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const handleSubmit = async (formData: {
    title: string;
    description: string;
    urgency: string;
  }) => {
    try {
      if (selectedRequest?.id) {
        // Update existing request
        console.log(selectedRequest);
        await updateRequest({
          variables: {
            id: selectedRequest.id,
            input: formData,
          },
        });
      } else {
        // Create new request
        await createRequest({
          variables: { input: formData },
        });
      }
      setSelectedRequest(null);
    } catch (error) {
      console.error("Error saving request:", error);
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

  if (selectedRequest !== null) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 max-w-[600px]">
        <RequestForm
          initialData={selectedRequest}
          onSubmit={handleSubmit}
          onClose={() => setSelectedRequest(null)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-center mb-6">
        Maintenance Request
      </h1>
      {metricsData && <MetricsPanel {...metricsData.metrics} />}

      {requestsData && (
        <RequestList
          requests={requestsData.maintenanceRequests}
          onResolve={handleResolve}
          onEdit={setSelectedRequest}
        />
      )}

      <button
        onClick={() => setSelectedRequest({})}
        className="fixed bottom-6 right-6 w-12 h-12 bg-(--color-cendolgreen) text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-green-600 transition-colors"
      >
        +
      </button>
    </div>
  );
}
