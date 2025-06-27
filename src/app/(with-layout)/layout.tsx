import PageLayout from '@/components/PageLayout';
import Sidebar from '@/components/Sidebar';
import moment from 'moment';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-1 overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="w-full overflow-auto">
          {/* <PageHeader /> */}
          <PageLayout>{children}</PageLayout>
        </div>
      </div>
      <footer className="bg-black text-white p-4">
        © {moment().format('YYYY')} Music City Canada | Developed and maintained
        by Hector Robles
      </footer>
    </>
  );
}
