import SpinnerLoader from '@/components/spinner-loader';

export default async function ClientLoadingComponent() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SpinnerLoader className="text-neutral-600 animate-fade dark:text-neutral-400" />
    </div>
  );
}
