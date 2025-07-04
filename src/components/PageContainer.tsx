import { cn } from '@/lib/utils';

const PageContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('container mx-auto p-5 lg:px-14', className)}>
      {children}
    </div>
  );
};

export default PageContainer;
