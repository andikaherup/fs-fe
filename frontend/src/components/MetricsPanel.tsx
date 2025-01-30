interface MetricsProps {
  openRequests: number;
  urgentRequests: number;
  averageResolutionTime: number;
}

export default function MetricsPanel({
  openRequests,
  urgentRequests,
  averageResolutionTime,
}: MetricsProps) {
  const MetricCircle = ({
    value,
    label,
  }: {
    value: number | string;
    label: string;
  }) => (
    <div className="bg-white rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-sm">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500 text-center px-2">{label}</div>
    </div>
  );

  return (
    <div className="flex justify-center space-x-4 mb-8">
      <MetricCircle value={openRequests} label="Open Requests" />
      <MetricCircle value={urgentRequests} label="Urgent Requests" />
      <MetricCircle
        value={`${averageResolutionTime.toFixed(1)}h`}
        label="Avg Hours to Solve"
      />
    </div>
  );
}
