import { useState } from "react";
import { CustomDropdown } from "./Dropdown";

interface CreateRequestFormProps {
  initialData?: FormDataType;
  onSubmit: (data: {
    title: string;
    description: string;
    urgency: string;
  }) => void;
  onClose: () => void;
}

interface FormDataType {
  id?: string;
  title: string;
  description: string;
  urgency: string;
  status: string;
}

type DropdownOption = {
  value: string;
  label: string;
};

const urgencyOptions: DropdownOption[] = [
  { value: "EMERGENCY", label: "Emergency" },
  { value: "URGENT", label: "Urgent" },
  { value: "LESS_URGENT", label: "Less Urgent" },
  { value: "NONE_URGENT", label: "None Urgent" },
];

const statusOptions: DropdownOption[] = [
  { value: "OPEN", label: "Open" },
  { value: "RESOLVED", label: "Resolved" },
];

export default function CreateRequestForm({
  initialData,
  onSubmit,
  onClose,
}: CreateRequestFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    urgency: initialData?.urgency || "NONE_URGENT",
    status: initialData?.status || "OPEN",
  });

  const isEditing = !!initialData;

  const isFormValid = () => {
    return formData.title.trim() !== "" && formData.urgency !== "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleDropdownChange = (field: string) => (value: string) => {
    setFormData((prev: FormDataType) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="rounded-lg p-6">
      <div className="flex items-center mb-6 justify-center">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 mr-4"
        >
          ←
        </button>
        <h1 className="text-xl  font-bold">
          {" "}
          {isEditing ? "Edit Maintenance Request" : "New Maintenance Request"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-light text-(--color-graytext) mb-2">
            Urgency *
          </label>
          <CustomDropdown
            value={formData.urgency}
            onChange={handleDropdownChange("urgency")}
            options={urgencyOptions}
          />
        </div>
        <div>
          <label className="block text-sm font-light text-(--color-graytext) mb-2">
            Status
          </label>
          <CustomDropdown
            value={formData.status}
            onChange={handleDropdownChange("status")}
            options={statusOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-light text-(--color-graytext) mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full h-[52px] px-4 py-[14px] bg-white border border-[#FFFFFF80] rounded-[12px] appearance-none text-gray-700 focus:outline-none focus:border-gray-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-light text-(--color-graytext) mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full h-[188px] px-4 py-[14px] bg-white border border-[#FFFFFF80] rounded-[12px] appearance-none text-gray-700 focus:outline-none focus:border-gray-400"
          />
        </div>
        <div className="w-full flex justify-center">
          <button
            type="submit"
            className="w-[40%] py-2 px-4 bg-(--color-cendolgreen) text-white text-lg rounded-md hover:bg-green-600 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
