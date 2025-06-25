import { PriceMonitorProduct } from '@/lib/priceMonitor/getPriceMonitorProduct';
import { TableCell, TableRow } from '../ui/table';
import CompetitorPrice from './CompetitorPrice';

const PriceMonitorTableRow = ({
  product,
}: {
  product: PriceMonitorProduct;
}) => {
  const lmPrice = product.competitorProducts.find(
    (cp) => cp.store === 'LM'
  )?.price;
  const redOnePrice = product.competitorProducts.find(
    (cp) => cp.store === 'REDONE'
  )?.price;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <a href={`/price-monitor/${product.id}`}>{product.title}</a>
      </TableCell>
      <TableCell>{product.lastCheckedAt.toLocaleDateString()}</TableCell>
      <TableCell>
        <span className="font-bold text-gray-500">
          ${product.price?.toFixed(2)}
        </span>
      </TableCell>
      <TableCell>
        <CompetitorPrice ourPrice={product.price} competitorPrice={lmPrice} />
      </TableCell>
      <TableCell>
        <CompetitorPrice
          ourPrice={product.price}
          competitorPrice={redOnePrice}
        />
      </TableCell>
    </TableRow>
  );
};

export default PriceMonitorTableRow;
