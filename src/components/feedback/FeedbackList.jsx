import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updateFeedback } from "../../redux/feedbackSlice";
import { Edit } from "lucide-react";

import { toast } from 'react-toastify';

const FeedbackList = ({ feedbacks = [], activeTab, loading }) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleEditClick = (item) => {
    setEditingItem(item);
    setEditedText(activeTab === "reviews" ? item.review : item.testimony);
    setIsModalOpen(true);
  };

  const handleUpdate = () => {
    const updatedData =
      activeTab === "reviews"
        ? { review: editedText, testimony: editingItem.testimony }
        : { testimony: editedText, review: editingItem.review };

   const res = dispatch(updateFeedback({ id: editingItem.id, data: updatedData }));
   console.log(res)
   toast.success('Feedback updated!');
    setIsModalOpen(false);
  };

  const feedbackData = feedbacks.map((f) => f.feedback || f);

  const filtered = feedbackData.filter((f) =>
    activeTab === "reviews" ? f.review?.trim() !== "" : f.testimony?.trim() !== ""
  );

  return (
    <div className="feedback-list">
      {filtered.length === 0 ? (
        <p>No {activeTab === "reviews" ? "reviews" : "testimonies"} yet.</p>
      ) : (
        filtered.map((item) => (
          <div key={item.id} className="feedback-item p-4 mb-4 bg-white rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold">{item.name || "Anonymous"}</h3>
              <span className="text-sm text-gray-500">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="mb-2">
              {activeTab === "reviews" ? item.review : item.testimony}
            </p>
            <button
              onClick={() => handleEditClick(item)}
              disabled={loading}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <Edit size={16} /> Edit
            </button>
          </div>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit {activeTab.slice(0, -1)}</h2>
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
