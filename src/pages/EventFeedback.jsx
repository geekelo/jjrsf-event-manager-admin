import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbacks } from "../redux/feedbackSlice"; 
import FeedbackTabs from "../components/feedback/FeedbackTabs";
import FeedbackForm from "../components/feedback/FeedbackForm";
import FeedbackList from "../components/feedback/FeedbackList";

const EventFeedback = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch();

  // Accessing feedback state from Redux
  const { allFeedbacks, loading, error } = useSelector((state) => state.feedback);
  const [activeTab, setActiveTab] = useState("reviews");

  useEffect(() => {
    // Dispatch fetchFeedbacks action to get feedbacks from the API
    dispatch(fetchFeedbacks(eventId));
  }, [eventId, dispatch]);
  // Filter feedbacks based on the active tab
 
  const handleNewFeedback = () => {
    // Re-fetch feedbacks after submitting a new one to get the updated list
    dispatch(fetchFeedbacks(eventId));
  };
console.log(allFeedbacks)
  return (
    <div className="container">
      <FeedbackTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <FeedbackForm eventId={eventId} onSuccess={handleNewFeedback} />
      <FeedbackList
        feedbacks={allFeedbacks}
        activeTab={activeTab}
        loading={loading}
      />
      {error && <p >{error}</p>} {/* Display error if any */}
    </div>
  );
};

export default EventFeedback;
