import { Input } from '../ui/input';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { twMerge } from 'tailwind-merge';
import PriceUpdateErrorList from './PriceUpdateErrorList';

export default function PriceUpdateStep2() {
  const { addFile, errorFile, processFile, file, deleteErrorFile } =
    usePriceUpdate();

  const containerClasses = twMerge(
    'lg:px-10 space-y-5 mb-10',
    !file ? 'pointer-events-none' : ''
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
          If you are unable to update the product SKU in Lightspeed, toggle the{' '}
          <strong>Remove</strong> action for the product. You might need to add
          the product in the system.
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
          onChange={(file) => addFile(file, true)}
          className="cursor-pointer"
        />
      )}
      <PriceUpdateErrorList />
      <div className="space-x-2 text-right">
        <Button
          variant="outline"
          onClick={() => processFile('error')}
          disabled={!errorFile}
        >
          Generate Final File
        </Button>
      </div>
    </div>
  );
}
