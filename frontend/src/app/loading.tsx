export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-md z-50">
      <div className="loading-spinner">Đang tải...</div>
    </div>
  );
}