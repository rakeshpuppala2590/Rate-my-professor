import DynamicNavbar from "../components/DynamicNavbar";

export default function Professors() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      <DynamicNavbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Professors List</h1>
        {/* Add your professors list component here */}
      </div>
    </div>
  );
}