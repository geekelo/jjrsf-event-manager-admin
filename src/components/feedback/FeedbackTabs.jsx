const FeedbackTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-4 mb-4 border-b border-gray-200">
      <button onClick={() => setActiveTab("reviews")}>Reviews</button>
      <button onClick={() => setActiveTab("testimonies")}>Testimonies</button>
    </div>
  );
};

export default FeedbackTabs;
