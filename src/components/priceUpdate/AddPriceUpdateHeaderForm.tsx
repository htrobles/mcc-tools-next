import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import usePriceUpdate from '@/hooks/usePriceUpdate';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { AddSelectedHeaderInput } from './PriceUpdateContextProvider';
import { processError } from '@/utils/helpers';

export default function AddPriceUpdateHeaderForm() {
  const { rawHeaders, addSelectedHeader } = usePriceUpdate();
  const [form, setForm] = useState<{ index?: number; label?: string }>({
    index: undefined,
    label: '',
  });

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    try {
      if (form.index === undefined || !form.label) return;

      addSelectedHeader(form as AddSelectedHeaderInput);
      setForm({
        index: undefined,
        label: '',
      });
    } catch (error) {
      processError('Error adding column', error);
    }
  };

  const handleSelectColumn = (value: string) => {
    const parsedValue = parseInt(value);

    if (isNaN(parsedValue) || !rawHeaders) return;

    const foundHeader = rawHeaders[parsedValue];

    setForm({
      label: foundHeader.value,
      index: parsedValue,
    });
  };

  const handleLabelChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setForm({
      ...form,
      label: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <label htmlFor="index">Column</label>
        <Select
          name="index"
          value={form.index?.toString() || ''}
          onValueChange={handleSelectColumn}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Column from file" />
          </SelectTrigger>
          <SelectContent>
            {rawHeaders?.map(({ value, index }) => (
              <SelectItem
                key={`${index}-${value}`}
                value={index?.toString() as string}
              >
                <span className="text-blue-500">{(index as number) + 1}</span> -{' '}
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="label">Output Column Name</label>
        <Input
          className="w-full"
          name="label"
          placeholder="Enter output column name"
          value={form.label}
          onChange={handleLabelChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        + Add
      </Button>
    </form>
  );
}
