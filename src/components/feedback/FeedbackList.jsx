import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteFeedback } from "../../redux/feedbackSlice";
import { Delete } from "lucide-react";

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
    <div>
      {filtered.length === 0 ? (
        <p>No {activeTab === "reviews" ? "reviews" : "testimonies"} yet.</p>
      ) : (
        filtered.map((item) => (
          <div key={item.id}>
            <div>
              <h3>{item.name || "Anonymous"}</h3>
              <span>{new Date(item.created_at).toLocaleDateString()}</span>
            </div>
            <p>{activeTab === "reviews" ? item.review : item.testimony}</p>

            <button
              onClick={() => handleDeleteFeedback(item)}
              disabled={loading}
            >
              <Delete size={16} /> Delete
            </button>
          </div>
        ))
      )}

      {/* Modal */}
      {isModalOpen && (
        <div>
          <div>
            <h2>Edit {activeTab.slice(0, -1)}</h2>
            <textarea
              rows="4"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button onClick={handleUpdate} disabled={!editedText.trim()}>
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
