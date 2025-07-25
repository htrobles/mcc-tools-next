import PageContainer from '@/components/PageContainer';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

const PriceMonitorHealthPage = async () => {
  console.log(process.env.MONITOR_PRICE_APP_HOST);
  const res = await fetch(`${process.env.MONITOR_PRICE_APP_HOST}/health`);

  const data = await res.json();

  const isHealthy = data.status === 'ok';

  return (
    <PageContainer className="flex items-center justify-center h-full">
      <Card className="p-4">
        <h3 className="mb-4">Price Monitor Health</h3>
        <p>{format(new Date(), 'PPP p')}</p>
        <p>
          Status:{' '}
          {isHealthy ? (
            <Badge variant="success">Healthy</Badge>
          ) : (
            <Badge variant="destructive">Unhealthy</Badge>
          )}
        </p>
      </Card>
    </PageContainer>
  );
};

export default PriceMonitorHealthPage;
