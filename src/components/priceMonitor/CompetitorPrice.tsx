import { twMerge } from 'tailwind-merge';

const CompetitorPrice = ({
  ourPrice,
  competitorPrice,
}: {
  ourPrice: number;
  competitorPrice?: number | null;
}) => {
  const isPriceMatch = ourPrice === competitorPrice;
  const isPriceHigher = ourPrice > (competitorPrice ?? 0);
  const isPriceLower = ourPrice < (competitorPrice ?? 0);
  const isPriceMissing = !competitorPrice;

  return (
    <span
      className={twMerge(
        'font-bold',
        isPriceMatch && 'text-lime-500',
        isPriceHigher && 'text-rose-500',
        isPriceLower && 'text-lime-500',
        isPriceMissing && 'text-gray-500'
      )}
    >
      ${competitorPrice ? competitorPrice?.toFixed(2) : 'N/A'}
    </span>
  );
};

export default CompetitorPrice;
