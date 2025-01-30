import { useState } from "react";

interface CreateRequestFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    urgency: string;
  }) => void;
  onClose: () => void;
}

export default function CreateRequestForm({
  onSubmit,
  onClose,
}: CreateRequestFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgency: "NONE_URGENT",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 mr-4"
        >
          ←
        </button>
        <h1 className="text-xl font-medium">Maintenance Request</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Urgency *
          </label>
          <select
            value={formData.urgency}
            onChange={(e) =>
              setFormData({ ...formData, urgency: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          >
            <option value="NONE_URGENT">None Urgent</option>
            <option value="LESS_URGENT">Less Urgent</option>
            <option value="URGENT">Urgent</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md h-32"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          Save
        </button>
      </form>
    </div>
  );
}
