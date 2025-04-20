import { useEffect } from "react";
import DeleteButton from "./DeleteButton";
import FrontDeskForm from "./FrontDeskForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchFrontDesks } from "../../redux/frontDeskSlice";
import { useParams } from "react-router-dom";

const FrontDeskList = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.frontDesk);
  const { eventId } = useParams();

  useEffect(() => {
    if (eventId) {
    const res =  dispatch(fetchFrontDesks(eventId));
    console.log(res)
    }
  }, [dispatch, eventId]);
  console.log(items)

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="space-y-4">
      <FrontDeskForm />
      {items.map((desk) => (
        <div key={desk.id} className="p-4 border rounded shadow flex justify-between items-center">
          <div>
            <h3 className="font-bold">{desk.name}</h3>
            <p>PIN: {desk.pin}</p>
          </div>
          <div className="flex items-center gap-2">
            <FrontDeskForm editData={desk} />
            <DeleteButton id={desk.id} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FrontDeskList;
