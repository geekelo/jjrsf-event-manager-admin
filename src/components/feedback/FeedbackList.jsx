import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFeedback,  } from "../../redux/feedbackSlice";
import { Delete,  } from "lucide-react";

import { toast } from "react-toastify";

const FeedbackList = ({ feedbacks = [], activeTab, loading }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedText, setEditedText] = useState("");

  const handleDeleteFeedback = async (item) => {
    try {
      const res = await dispatch(
        deleteFeedback({ id: item.id, event_id: item.foundation_event_id })
      ).unwrap();
      toast.success("Feedback deleted successfully");
    } catch (err) {
      console.error("Failed to delete feedback:", err);
      toast.error("Delete failed");
    }
  };

  const feedbackData = feedbacks.map((f) => f.feedback || f);

  const filtered = feedbackData.filter((f) =>
    activeTab === "reviews"
      ? f.review?.trim() !== ""
      : f.testimony?.trim() !== ""
  );

  return (
    <div className="feedback-list">
      {filtered.length === 0 ? (
        <p>No {activeTab === "reviews" ? "reviews" : "testimonies"} yet.</p>
      ) : (
        filtered.map((item) => (
          <div
            key={item.id}
            className="feedback-item p-4 mb-4 bg-white rounded shadow"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">
                {item.name || "Anonymous"}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-2">
              {activeTab === "reviews" ? item.review : item.testimony}
            </p>

            <button
              onClick={() => handleDeleteFeedback(item)}
              disabled={loading}
              className="flex items-center gap-1 text-red-600 hover:text-red-800"
            >
              <Delete size={16} /> Delete
            </button>
          </div>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Edit {activeTab.slice(0, -1)}
            </h2>
            <textarea
              rows="4"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={!editedText.trim()}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackList;
