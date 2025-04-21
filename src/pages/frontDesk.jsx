import FrontDeskList from "../components/frontdesk/FrontDeskList";


export default function FrontDesksPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Front Desks</h1>
      <FrontDeskList />
    </main>
  );
}
