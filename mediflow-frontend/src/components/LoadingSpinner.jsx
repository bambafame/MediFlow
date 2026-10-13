function LoadingSpinner() {
  return (
    <div className="flex justify-center py-12">
      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-slate-200
          border-t-blue-600
        "
      />
    </div>
  );
}

export default LoadingSpinner;
