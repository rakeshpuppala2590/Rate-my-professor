import DynamicNavbar from "../components/DynamicNavbar";

export default function Team() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-800">
      <DynamicNavbar />
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-4xl font-bold text-white mb-8">Our Team</h1>
        {/* Add your team information here */}
      </div>
    </div>
  );
}