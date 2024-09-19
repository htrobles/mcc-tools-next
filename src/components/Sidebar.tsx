import Image from 'next/image';
import Link from 'next/link';
import mccLogo from '/public/mcc-logo.png';
import routes from '@/constants/routes';

export default function Sidebar() {
  return (
    <div className="w-[250px] border-r bg-gray-50">
      <div className="p-4 border-b h-[80px]">
        <Link href="/">
          <Image
            src={mccLogo}
            alt="Music City Canada logo"
            className="object-contain h-full"
          />
        </Link>
      </div>
      <div className="p-4">
        <ul>
          {routes.map(({ path, title }) => (
            <li>
              <a href={path} className="font-semibold">
                {title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
