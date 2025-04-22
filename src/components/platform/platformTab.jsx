import React, { useState } from "react";
import EditPlatformModal from "./editPlatformModal";

const PlatformTab = ({ platform, isActive, onClick, onUpdate, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  const renderEmbed = () => {
    if (!platform.embed_code) {
      return <div className="text-sm text-gray-500">No media to display.</div>;
    }

    return (
      <div
        className="mt-2"
        dangerouslySetInnerHTML={{ __html: platform.embed_code }}
      />
    );
  };

  const handleUpdate = async (payload) => {
    await onUpdate(payload);
    setShowEditModal(false);
  };

  return (
    <div>
      <div onClick={onClick}>
        <div>
          <img src={platform.logo} alt={`${platform.platform_name} logo`} />
          <span>{platform.platform_name}</span>
          <span>{platform.views ?? 0} views</span>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditModal(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(platform.id);
            }}
           
          >
            Delete
          </button>
        </div>
      </div>

      {isActive && <div>{renderEmbed()}</div>}

      {showEditModal && (
        <EditPlatformModal
          platform={platform}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default PlatformTab;
