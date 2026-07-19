/* رافد — Error Boundary */
'use client';

import { GoldButton } from '@/components/ui/GoldButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-base">
      <div className="text-center px-4">
        <span className="text-6xl block mb-4">⚠️</span>
        <h2 className="text-2xl font-extrabold text-white mb-2">حدث خطأ غير متوقع</h2>
        <p className="text-white/40 mb-6 max-w-md mx-auto">
          نعتذر عن هذا الخطأ. يرجى المحاولة مرة أخرى.
        </p>
        <GoldButton onClick={reset}>إعادة المحاولة</GoldButton>
      </div>
    </div>
  );
}

