export default function Sidebar() {
  return (
    <div className="w-[300px] border-r bg-gray-50">
      <div className="p-4 border-b">
        <a href="/">
          <img src="/mcc-logo.png" alt="Music City Canada logo" />
        </a>
      </div>
      <div className="p-4">
        <ul>
          <li>
            <a href="/supplier-master-feed" className="font-semibold">
              Supplier Master Feed
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
