'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0b1c18] px-6 text-[#f3e2d7]">
      <section role="alert" className="max-w-md text-center">
        <p className="mb-3 text-xs tracking-[0.24em] text-[#d9aa96]">SAKURA TAROT</p>
        <h1 className="font-serif text-3xl">庭院暂时起了雾</h1>
        <p className="mt-4 text-sm leading-7 text-[#d9c8be]">
          页面没有顺利展开。你可以再次尝试，刚才的选择不会因此改变。
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 min-h-11 border border-[#d8aa96]/60 bg-[#17362e] px-6 text-sm transition-colors hover:bg-[#20483e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#edc2ae]"
        >
          再试一次
        </button>
      </section>
    </main>
  );
}
