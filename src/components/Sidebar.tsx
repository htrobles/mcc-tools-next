import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-[300px] border-r bg-gray-50">
      <div className="p-4 border-b">
        <Link href="/">
          <Image
            src="/mcc-logo.png"
            alt="Music City Canada logo"
            width={250}
            height={250}
            // fill
          />
        </Link>
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
