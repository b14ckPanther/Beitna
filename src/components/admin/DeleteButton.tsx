'use client';

import { Trash2 } from 'lucide-react';

interface DeleteButtonProps {
  action: () => Promise<void>;
  confirmMessage: string;
}

export default function DeleteButton({ action, confirmMessage }: DeleteButtonProps) {
  return (
    <form
      action={async () => {
        if (!confirm(confirmMessage)) return;
        await action();
      }}
    >
      <button
        type="submit"
        className="p-2 text-cream/40 hover:text-red-400 hover:bg-red-400/5 rounded-sm transition-all duration-200"
      >
        <Trash2 size={13} strokeWidth={1.5} />
      </button>
    </form>
  );
}
