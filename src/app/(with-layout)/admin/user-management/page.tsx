import db from '@/lib/db';
import PageContainer from '@/components/PageContainer';
import { UserManagementPagination } from '@/components/userManagement/UserManagementPagination';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { UserActions } from '@/components/userManagement/UserActions';

const USERS_PAGE_SIZE = 1;

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const { page } = await searchParams;
  const pageNumber = parseInt(page || '1');

  // Get paginated users
  const users = await db.user.findMany({
    skip: (pageNumber - 1) * USERS_PAGE_SIZE,
    take: USERS_PAGE_SIZE,
    orderBy: {
      name: 'asc',
    },
  });

  // Get total count for pagination
  const total = await db.user.count();
  const totalPages = Math.ceil(total / USERS_PAGE_SIZE);

  return (
    <PageContainer>
      <div className="space-y-4">
        <div className="border rounded bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name || 'N/A'}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.role === 'ADMIN' ? 'destructive' : 'secondary'
                      }
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <UserActions user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {(pageNumber - 1) * USERS_PAGE_SIZE + 1} to{' '}
              {Math.min(pageNumber * USERS_PAGE_SIZE, total)} of {total} users
            </div>
            <UserManagementPagination
              currentPage={pageNumber}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </PageContainer>
  );
}
