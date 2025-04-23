import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createFeedback, fetchFeedbacks } from '../../redux/feedbackSlice';

const FeedbackForm = ({ eventId, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.feedback); 

  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [testimony, setTestimony] = useState('');

  const isValid = review.trim() || testimony.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return toast.error('Please write a review or testimony.');

    const payload = {
      name: name.trim() || 'Anonymous',
      review: review.trim() || null,
      testimony: testimony.trim() || null,
      eventId,
    };

    try {
      const actionResult = await dispatch(createFeedback(payload));

      if (createFeedback.fulfilled.match(actionResult)) {
        toast.success('Feedback submitted!');
        onSuccess?.(actionResult.payload);
        setName('');
        setReview('');
        setTestimony('');
        dispatch(fetchFeedbacks(eventId));
      } else {
        throw new Error(actionResult.payload);
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting feedback.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 bg-white p-4 rounded shadow">
      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Your name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Leave a review (optional)"
        rows={3}
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />
      <textarea
        className="w-full border p-2 rounded"
        placeholder="Share a testimony (optional)"
        rows={3}
        value={testimony}
        onChange={(e) => setTestimony(e.target.value)}
      />
      <button
        type="submit"
        disabled={!isValid || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
};

export default FeedbackForm;
