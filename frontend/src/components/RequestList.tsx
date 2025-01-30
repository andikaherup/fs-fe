import { format } from "date-fns";

type UrgencyType = "NONE_URGENT" | "LESS_URGENT" | "URGENT" | "EMERGENCY";
type StatusType = "OPEN" | "RESOLVED";

interface Request {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  urgency: UrgencyType;
  createdAt: string;
  resolvedAt?: string | null;
}

interface RequestListProps {
  requests: Request[];
  onResolve: (id: string) => void;
}

const UrgencyBadge = ({ urgency }: { urgency: UrgencyType }) => {
  const colors = {
    NONE_URGENT: "bg-gray-100 text-gray-800",
    LESS_URGENT: "bg-blue-100 text-blue-800",
    URGENT: "bg-yellow-100 text-yellow-800",
    EMERGENCY: "bg-red-100 text-red-800",
  };

  const icon = {
    NONE_URGENT: "⚪",
    LESS_URGENT: "🔵",
    URGENT: "⚠️",
    EMERGENCY: "🔴",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[urgency]}`}
    >
      <span className="mr-1">{icon[urgency]}</span>
      {urgency.replace("_", " ").toLowerCase()}
    </span>
  );
};

export default function RequestList({ requests, onResolve }: RequestListProps) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div key={request.id} className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {request.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {request.description}
              </p>
              <div className="mt-2">
                <UrgencyBadge urgency={request.urgency} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                {format(new Date(request.createdAt), "dd MMM yyyy")}
              </p>
              {request.status === "OPEN" && (
                <button
                  onClick={() => onResolve(request.id)}
                  className="mt-2 px-4 py-1 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
