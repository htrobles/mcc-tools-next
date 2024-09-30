import { Input } from '../ui/input';
import { Button } from '../ui/button';
import usePriceUpdate from '@/hooks/usePriceUpdate';

export default function PriceUpdateStep2() {
  const { addFile, errorFile, processFile } = usePriceUpdate();

  return (
    <div className="lg:px-10 space-y-5 border-b py-10 pointer-events-none">
      <h3>Select Error File</h3>
      <ol className="list-decimal ml-8">
        <li>Select error file from Lightspeed.</li>
        <li>Review errors</li>
        <li>Download the updated file.</li>
      </ol>
      <Input
        type="file"
        placeholder="Select a file"
        onChange={(file) => addFile(file, true)}
        className="cursor-pointer"
      />

      <div className="space-x-2 text-right">
        <Button onClick={() => processFile('error')} disabled={!errorFile}>
          Download Error Free File
        </Button>
      </div>
    </div>
  );
}
