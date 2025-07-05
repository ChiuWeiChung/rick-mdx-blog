import SpinnerLoader from '@/components/spinner-loader';

const loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-2xl font-bold">存取筆記中...</p>
      <SpinnerLoader />
    </div>
  );
};

export default loading;
