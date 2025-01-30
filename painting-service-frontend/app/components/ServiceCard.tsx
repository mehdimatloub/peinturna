export default function ServiceCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
