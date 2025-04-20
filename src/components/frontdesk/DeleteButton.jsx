import { useDispatch } from "react-redux";
import { deleteFrontDesk } from "../../redux/frontDeskSlice";
import { useParams } from "react-router-dom";

const DeleteButton = ({ id }) => {
  const dispatch = useDispatch();
  const { eventId } = useParams(); // Access eventId from the URL params

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this front desk?")) {
      dispatch(deleteFrontDesk({ id, event_id: eventId }));
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 text-sm">
      Delete
    </button>
  );
};

export default DeleteButton;
