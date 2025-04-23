import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { createFeedback, fetchFeedbacks } from "../../redux/feedbackSlice";

const FeedbackForm = ({ eventId, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.feedback);

  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [testimony, setTestimony] = useState("");

  const isValid = review.trim() || testimony.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return toast.error("Please write a review or testimony.");

    const payload = {
      name: name.trim() || "Anonymous",
      review: review.trim() || null,
      testimony: testimony.trim() || null,
      eventId,
    };

    try {
      const actionResult = await dispatch(createFeedback(payload));

      if (createFeedback.fulfilled.match(actionResult)) {
        toast.success("Feedback submitted!");
        onSuccess?.(actionResult.payload);
        setName("");
        setReview("");
        setTestimony("");
        dispatch(fetchFeedbacks(eventId));
      } else {
        throw new Error(actionResult.payload);
      }
    } catch (err) {
      toast.error(err.message || "Error submitting feedback.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="Leave a review (optional)"
        rows={3}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <textarea
        placeholder="Share a testimony (optional)"
        rows={3}
        value={testimony}
        onChange={(e) => setTestimony(e.target.value)}
      />
      <button type="submit" disabled={!isValid || loading}>
        {loading ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

export default FeedbackForm;
