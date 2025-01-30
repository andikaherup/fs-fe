import { useMutation } from "@apollo/client";
import {
  CREATE_REQUEST,
  GET_MAINTENANCE_REQUESTS,
  GET_METRICS,
} from "@/graphql/queries";
import { Urgency } from "@/types";
import { useState } from "react";

interface CreateRequestFormProps {
  onClose: () => void;
}

export default function CreateRequestForm({ onClose }: CreateRequestFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    urgency: Urgency.NONE_URGENT,
  });

  const [createRequest] = useMutation(CREATE_REQUEST, {
    refetchQueries: [GET_MAINTENANCE_REQUESTS, GET_METRICS],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRequest({
        variables: formData,
      });
      onClose();
    } catch (error) {
      console.error("Error creating request:", error);
    }
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
              setFormData({ ...formData, urgency: e.target.value as Urgency })
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {Object.values(Urgency).map((urgency) => (
              <option key={urgency} value={urgency}>
                {urgency.replace("_", " ")}
              </option>
            ))}
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
          className="w-full py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Save
        </button>
      </form>
    </div>
  );
}
