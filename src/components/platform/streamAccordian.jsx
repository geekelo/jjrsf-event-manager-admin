import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlatformTab from "./platformTab";
import AddPlatformModal from "./addPlatformModal";
import {
  fetchPlatforms,
  createPlatform,
  updatePlatform,
  deletePlatform,
} from "../../redux/platformSlice";
import { toast } from "react-toastify";

const StreamAccordion = ({ eventId }) => {
  const dispatch = useDispatch();
  const {
    items: platforms,
    loading,
    error,
  } = useSelector((state) => state.platform);

  const [activePlatformId, setActivePlatformId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchPlatforms(eventId));
    }
  }, [dispatch, eventId]);

  const handleAddPlatform = async (platformData) => {
    try {
      const payload = {
        name: platformData.platform_name,
        embedUrl: platformData.embed_link,
        visit_link: platformData.visit_link,
        event_id: eventId,
      };
      const resultAction = await dispatch(createPlatform(payload));
      toast.success("Platform created successfully");
      setShowAddModal(false); 
      dispatch(fetchPlatforms(eventId));
    } catch (error) {
      console.error("Failed to add platform:", error);
      toast.error("Failed to create platform");
    }
  };

  const getPlatformLogo = (name) => {
    switch (name.toLowerCase()) {
      case "youtube":
        return "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg";
      case "mixlr":
        return "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Mixlr_Logo.png/220px-Mixlr_Logo.png";
      case "zoom":
        return "https://upload.wikimedia.org/wikipedia/commons/4/4b/Zoom_Communications_Logo.svg";
      default:
        return "https://via.placeholder.com/40x40?text=LOGO";
    }
  };

  const handleUpdatePlatform = async ({ id, updates }) => {
    try {
      await dispatch(
        updatePlatform({ id, event_id: eventId, updates })
      ).unwrap();
      toast.success("Platform updated successfully");
    } catch (err) {
      console.error("Failed to update platform:", err);
      toast.error("Update failed");
    }
  };
  const handleDeletePlatform = async (id) => {
    try {
     const res = await dispatch(deletePlatform({ id, event_id: eventId })).unwrap();
     console.log(res)
      toast.success("Platform deleted successfully");
    } catch (err) {
      console.error("Failed to delete platform:", err);
      toast.error("Delete failed");
    }
  };
  

  if (loading) return <div>Loading platforms...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <div>
        <h2>Streams</h2>
        <button onClick={() => setShowAddModal(true)}>➕ Add Platform</button>
      </div>
      {platforms.length === 0 && <div>No platforms added yet.</div>}

      <div>
        {platforms.map((platform) => (
         <PlatformTab
         key={platform.id}
         platform={{
           ...platform,
           logo: getPlatformLogo(platform.platform_name),
         }}
         isActive={activePlatformId === platform.id}
         onClick={() =>
           setActivePlatformId(
             activePlatformId === platform.id ? null : platform.id
           )
         }
         onUpdate={handleUpdatePlatform}
         onDelete={handleDeletePlatform} 
       />
       
        ))}
      </div>

      {showAddModal && (
        <AddPlatformModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPlatform}
        />
      )}
    </div>
  );
};

export default StreamAccordion;
