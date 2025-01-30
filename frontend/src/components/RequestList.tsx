import { useQuery, useMutation } from "@apollo/client";
import {
  GET_MAINTENANCE_REQUESTS,
  GET_METRICS,
  RESOLVE_REQUEST,
} from "@/graphql/queries";
import { format } from "date-fns";
import { MaintenanceRequest, Urgency } from "@/types";

interface RequestListProps {
  onAddNew: () => void;
}

export default function RequestList({ onAddNew }: RequestListProps) {
  const { data: requestsData } = useQuery(GET_MAINTENANCE_REQUESTS);
  const { data: metricsData } = useQuery(GET_METRICS);
  const [resolveRequest] = useMutation(RESOLVE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const metrics = metricsData?.metrics || {
    openRequests: 0,
    urgentRequests: 0,
    averageResolutionTime: 0,
  };

  const UrgencyIndicator = ({ urgency }: { urgency: Urgency }) => {
    const colors = {
      [Urgency.NONE_URGENT]: "text-gray-500",
      [Urgency.LESS_URGENT]: "text-blue-500",
      [Urgency.URGENT]: "text-yellow-500",
      [Urgency.EMERGENCY]: "text-red-500",
    };

    const icons = {
      [Urgency.NONE_URGENT]: "⚪",
      [Urgency.LESS_URGENT]: "🔵",
      [Urgency.URGENT]: "⚠️",
      [Urgency.EMERGENCY]: "🔴",
    };

    return (
      <span className={`flex items-center ${colors[urgency]}`}>
        {icons[urgency]} {urgency.replace("_", " ").toLowerCase()}
      </span>
    );
  };

  const MetricCard = ({ value, label }: { value: number; label: string }) => (
    <div className="bg-white rounded-full h-24 w-24 flex flex-col items-center justify-center shadow">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 text-center">{label}</div>
    </div>
  );

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Maintenance Request</h1>

      <div className="flex justify-center gap-4 mb-8">
        <MetricCard value={metrics.openRequests} label="Open Requests" />
        <MetricCard value={metrics.urgentRequests} label="Urgent Requests" />
        <MetricCard
          value={Math.round(metrics.averageResolutionTime)}
          label="Avg. Hours to Solve"
        />
      </div>

      <div className="space-y-4">
        {requestsData?.maintenanceRequests.map(
          (request: MaintenanceRequest) => (
            <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{request.title}</h3>
                  <UrgencyIndicator urgency={request.urgency} />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    {format(new Date(request.createdAt), "dd MMM yyyy")}
                  </div>
                  {request.status === "OPEN" && (
                    <button
                      onClick={() =>
                        resolveRequest({ variables: { id: request.id } })
                      }
                      className="mt-2 px-4 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600"
                    >
                      Mark as Resolved
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      <button
        onClick={onAddNew}
        className="fixed bottom-6 right-6 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center text-2xl shadow-lg hover:bg-green-600"
      >
        +
      </button>
    </div>
  );
}
