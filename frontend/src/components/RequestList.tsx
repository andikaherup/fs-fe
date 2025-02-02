import { format, parseISO } from "date-fns";

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
  onEdit: (request: Request) => void;
}

const UrgencyBadge = ({ urgency }: { urgency: UrgencyType }) => {
  const colors = {
    NONE_URGENT: "text-(--color-nonurgenttext)",
    LESS_URGENT: "text-(--color-lessurgenttext)",
    URGENT: "text-(--color-urgenttext)",
    EMERGENCY: "text-(--color-emergencytext)",
  };

  const icon = {
    NONE_URGENT: "🙂",
    LESS_URGENT: "🔨 ",
    URGENT: "⚡",
    EMERGENCY: "🔥",
  };

  return (
    <span
      className={`inline-flex items-center py-0.5 rounded-full text-sm  ${colors[urgency]}`}
    >
      <span className="mr-1 font-medium">{icon[urgency]}</span>
      <span className="capitalize font-light text-sm">
        {urgency.replace("_", " ").toLowerCase()}
      </span>
    </span>
  );
};

export default function RequestList({
  requests,
  onEdit,
  onResolve,
}: RequestListProps) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-[12px] p-[16px] shadow-md"
        >
          <div
            onClick={() => onEdit(request)}
            className="flex justify-between items-start"
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {request.title}
              </h3>
              {/* <p className="text-sm text-gray-500 mt-1">
                {request.description}
              </p> */}
              <div className="mt-2">
                <UrgencyBadge urgency={request.urgency} />
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-(--color-graytext)">
                {format(parseISO(request.createdAt), "dd MMM yyyy")}
              </p>
              {request.status === "OPEN" ? (
                <button
                  onClick={() => onResolve(request.id)}
                  className="mt-4 px-4 py-1 bg-(--color-cendolgreen) text-white text-sm rounded-[100px] hover:bg-green-600 transition-colors"
                >
                  Mark as Resolved
                </button>
              ) : (
                <button
                  className="mt-4 px-4 py-1 text-white text-sm bg-(--color-graytext) rounded-[100px] "
                  disabled
                >
                  Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
