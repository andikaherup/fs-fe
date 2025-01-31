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
    <div className="bg-white rounded-[10px] w-24 h-24 pt-3 flex flex-col items-center justify-start gap-1 shadow-sm">
      <div className="text-4xl text-(--color-cendolgreen) font-medium">
        {value}
      </div>
      <div className="text-[9px] text-gray-500 font-normal text-center px-2">
        {label}
      </div>
    </div>
  );

  return (
    <div className="flex justify-center space-x-4 mb-8">
      <MetricCircle value={openRequests} label="Open Requests" />
      <MetricCircle value={urgentRequests} label="Urgent Requests" />
      <MetricCircle
        value={`${averageResolutionTime.toFixed(0)}`}
        label="Average time (days) to Solve"
      />
    </div>
  );
}
