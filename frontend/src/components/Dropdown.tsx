type UrgencyOption = {
  value: string;
  label: string;
};

// Define default options outside the component
const defaultOptions: UrgencyOption[] = [
  { value: "EMERGENCY", label: "Emergency" },
  { value: "URGENT", label: "Urgent" },
  { value: "LESS_URGENT", label: "Less Urgent" },
  { value: "NONE_URGENT", label: "None Urgent" },
];

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options?: UrgencyOption[];
}

export const CustomDropdown = ({
  value,
  onChange,
  options = defaultOptions,
}: CustomDropdownProps) => {
  return (
    <div className="relative ">
      <select
        className="w-full h-[52px] px-4 py-[14px] bg-white font-light text-(--color-formtext) border border-[#FFFFFF80] rounded-[12px] appearance-none  focus:outline-none focus:border-gray-400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};
