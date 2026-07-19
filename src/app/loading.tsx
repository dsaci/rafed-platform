/* رافد — Loading State */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-gold-primary/20 border-t-gold-primary animate-spin" />
        <p className="text-sm text-white/40">جاري التحميل...</p>
      </div>
    </div>
  );
}

