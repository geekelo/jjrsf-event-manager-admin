const FeedbackTabs = ({ activeTab, setActiveTab }) => {
    return (
      <div className="flex space-x-4 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("reviews")}
          className={`py-2 px-4 font-medium ${
            activeTab === "reviews"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Reviews
        </button>
        <button
          onClick={() => setActiveTab("testimonies")}
          className={`py-2 px-4 font-medium ${
            activeTab === "testimonies"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
        >
          Testimonies
        </button>
      </div>
    );
  };
  
  export default FeedbackTabs;
  