import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createFrontDesk, updateFrontDesk } from "../../redux/frontDeskSlice";
import { useParams } from "react-router-dom";

const FrontDeskForm = ({ editData }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams();

  const [name, setName] = useState("");
  const [pin, setPin] = useState("");

  // Populate fields when editing
  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setPin(editData.pin || "");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!eventId) {
      console.error("No event ID found in URL.");
      return;
    }

    // Check if we're editing or creating
    if (editData?.id) {
      // Update
      const res = await dispatch(
        updateFrontDesk({
          id: editData.id,
          event_id: eventId, // Pass eventId as part of the payload
          updates: { name, pin },
        })
      );
      console.log("Update response:", res);
    } else {
      // Create
      const res = await dispatch(
        createFrontDesk({ name, pin, event_id: eventId })
      );
      console.log("Create response:", res);

      if (!res.error) {
        setName("");
        setPin("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap gap-2 items-end">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Desk Name"
        className="input px-4 py-2 border rounded w-full"
        required
      />
      <input
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        placeholder="PIN"
        className="input px-4 py-2 border rounded w-full"
        required
      />
      <button type="submit" className="btn bg-blue-600 text-white px-4 py-2 rounded">
        {editData ? "Update" : "Create"}
      </button>
    </form>
  );
};

export default FrontDeskForm;
