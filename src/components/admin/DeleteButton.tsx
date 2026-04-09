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
        className="p-2 text-obsidian/15 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 rounded-sm transition-all duration-300"
      >
        <Trash2 size={15} strokeWidth={2} />
      </button>
    </form>
  );
}
