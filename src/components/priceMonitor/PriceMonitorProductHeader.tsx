const PriceMonitorProductHeader = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-x-2">
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default PriceMonitorProductHeader;
