import { Input } from '../ui/input';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { twMerge } from 'tailwind-merge';
import PriceUpdateErrorList from './PriceUpdateErrorList';

export default function PriceUpdateStep2() {
  const {
    addErrorFile,
    errorFile,
    processErrorFile,
    initialFile,
    deleteErrorFile,
  } = usePriceUpdate();

  const containerClasses = twMerge(
    'lg:px-10 space-y-5 mb-10',
    !initialFile ? 'pointer-events-none' : ''
  );

  return (
    <div className={containerClasses}>
      <h3>Select Error File</h3>
      <ol className="list-decimal ml-8 space-y-2 leading-snug">
        <li>
          If you obtained an error file from Lightspeed, upload the error file
          from this page.
        </li>
        <li>
          Review the errors. You may need to update the Manufacturer SKU of
          products in Lightspeed.
        </li>
        <li>
          The products in the generated list will be removed from the final
          output file. If you wish to include certain products from the error
          list, toggle the <strong>Remove</strong> action off for those
          products.
        </li>
        <li>Generate the final file and upload it to Lightspeed.</li>
      </ol>
      {!!errorFile ? (
        <div>
          {errorFile.name}
          <Button
            variant="outline"
            className="ml-2"
            size="sm"
            onClick={deleteErrorFile}
          >
            Clear
          </Button>
        </div>
      ) : (
        <Input
          type="file"
          placeholder="Select a file"
          onChange={addErrorFile}
          className="cursor-pointer"
        />
      )}
      <PriceUpdateErrorList />
      <div className="space-x-2 text-right">
        <Button
          variant="outline"
          onClick={processErrorFile}
          disabled={!errorFile}
        >
          Generate Final File
        </Button>
      </div>
    </div>
  );
}
