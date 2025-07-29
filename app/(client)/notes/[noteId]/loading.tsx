import { Skeleton } from '@/components/ui/skeleton';

export default async function NoteLoadingComponent() {
  return (
    <div className="space-y-10">
      {/* router back button */}
      <div className="mb-4 flex items-center justify-between gap-4 border-b pb-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>

      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />

      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>

      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
