import { PriceMonitorProduct } from '@/lib/priceMonitor/getPriceMonitorProduct';
import { TableCell, TableRow } from '../ui/table';
import CompetitorPrice from './CompetitorPrice';
import { STORES } from '@/lib/stores';
import { Checkbox } from '../ui/checkbox';

const PriceMonitorTableRow = ({
  product,
  isSelected,
  onSelect,
}: {
  product: PriceMonitorProduct;
  isSelected: boolean;
  onSelect: (productId: string, checked: boolean) => void;
}) => {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect(product.id, checked as boolean)
          }
        />
      </TableCell>
      <TableCell className="font-medium min-w-[180px]">
        <a href={`/price-monitor/${product.id}`}>{product.title}</a>
      </TableCell>
      <TableCell className="font-mono text-sm text-muted-foreground">
        {product.sku}
      </TableCell>
      <TableCell>
        <span className="font-bold text-gray-500">
          {product.price ? `$${product.price?.toFixed(2)}` : 'N/A'}
        </span>
      </TableCell>
      {Object.keys(STORES).map((storeKey) => (
        <TableCell key={storeKey}>
          <CompetitorPrice
            ourPrice={product.price}
            competitorPrice={
              product.competitorProducts.find((cp) => cp.store === storeKey)
                ?.price
            }
          />
        </TableCell>
      ))}
    </TableRow>
  );
};

export default PriceMonitorTableRow;
