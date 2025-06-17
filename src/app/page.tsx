import routes from '@/constants/routes';

export default function Home() {
  return (
    <div className="container mx-auto">
      <p>Select a tool to get started</p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {routes.slice(1).map(({ path, title, description }) => (
          <a
            key={path}
            href={path}
            className="overflow-hidden flex flex-col hover:shadow-md hover:scale-105 transition-all duration-300"
          >
            <div className="bg-black p-2 text-white rounded-t-sm">
              <h4 className="text-lg font-bold">{title}</h4>
            </div>
            <div className="p-2 border border-t-0 border-gray-200 grow rounded-b-sm">
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
