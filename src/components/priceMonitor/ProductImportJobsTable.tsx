'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { ProductImportJob } from '@prisma/client';
import Link from 'next/link';

interface ProductImportJobsTableProps {
  jobs: ProductImportJob[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'SUCCESS':
      return 'success';
    case 'PENDING':
      return 'secondary';
    case 'ERROR':
      return 'destructive';
    default:
      return 'outline';
  }
};

const formatDate = (date: Date) => {
  return moment(date).fromNow();
};

export default function ProductImportJobsTable({
  jobs,
}: ProductImportJobsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>File Name</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Products</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No import jobs found
              </TableCell>
            </TableRow>
          ) : (
            jobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-medium">
                  <Link href={`/price-monitor/imports/${job.id}`}>
                    {job.filename}
                  </Link>
                </TableCell>
                <TableCell className="font-medium">
                  {formatDate(job.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(job.status)}>
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {job.totalProducts !== null ? job.totalProducts : '-'}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
