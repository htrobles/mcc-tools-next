import PageContainer from '@/components/PageContainer';
import {
  getPriceMonitorProduct,
  PriceMonitorProduct,
} from '@/lib/priceMonitor/getPriceMonitorProduct';
import { CompetitorProduct } from '@prisma/client';
import Image from 'next/image';
import PriceMonitorProductHeader from '@/components/priceMonitor/PriceMonitorProductHeader';
import { formatPrice } from '@/lib/utils';
import { STORES } from '@/lib/stores';

const PriceMonitorProductPage = async ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = await params;
  const product = await getPriceMonitorProduct(productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <PageContainer className="space-y-4">
      <div>
        <PriceMonitorProductHeader title={product.title} />
        <p className="text-sm text-gray-500">
          Last checked at {product?.lastCheckedAt.toLocaleString()}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1">
        <ProductCard product={product as PriceMonitorProduct} />
        {Object.keys(STORES).map((storeKey) => {
          const competitorProduct = product.competitorProducts.find(
            (cp) => cp.store === storeKey
          );

          if (!competitorProduct) {
            return null;
          }

          return (
            <ProductCard
              key={storeKey}
              product={competitorProduct}
              isCheaper={
                competitorProduct.price && product?.price
                  ? competitorProduct.price < product.price
                  : false
              }
            />
          );
        })}
      </div>
    </PageContainer>
  );
};

const ProductCard = ({
  product,
  isCheaper,
}: {
  product: PriceMonitorProduct | CompetitorProduct;
  isCheaper?: boolean;
}) => {
  // Only show store name for competitor products
  const isCompetitorProduct = 'store' in product;
  const storeName = isCompetitorProduct
    ? STORES[product.store].name
    : 'Music City Canada';

  let priceColor;

  if (isCheaper) {
    priceColor = 'text-red-500';
  } else if (product.price && product.price < product.price) {
    priceColor = 'text-lime-500';
  } else {
    priceColor = 'text-gray-500';
  }

  return (
    <div className="bg-white overflow-hidden rounded-md p-2 border border-gray-200 flex flex-col">
      <div className="flex justify-center h-[200px]">
        <Image
          src={product.image || '/images/img-placeholder.svg'}
          alt={product.title || 'Image placeholder'}
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col justify-between grow">
        <div className="grow mb-4">
          {<h3 className="text-base font-bold mb-2">{storeName}</h3>}
          {product.url ? (
            <a className="text-sm" href={product.url as string} target="_blank">
              <p className="leading-4">{product.title || 'N/A'}</p>
            </a>
          ) : (
            <p className="text-sm leading-4 text-gray-500">
              {product.title || 'N/A'}
            </p>
          )}
        </div>
        <h3 className={priceColor}>{formatPrice(product.price)}</h3>
      </div>
    </div>
  );
};

export default PriceMonitorProductPage;
