import { toast } from '@/hooks/use-toast';

export function processError(title: string, error: unknown) {
  if (error instanceof Error) {
    toast({
      variant: 'destructive',
      title,
      description: error.message,
    });
    console.log(error);
    console.log(error.cause);
  } else {
    toast({
      variant: 'destructive',
      title,
      description: 'Something went wrong. Please try again.',
    });
    console.log(error);
  }
}
