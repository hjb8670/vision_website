export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  danger = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onCancel}>
      <div className="w-full max-w-sm bg-bg-elevated rounded-2xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-sm text-text-secondary mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors ${
              danger ? 'bg-error hover:bg-error/80' : 'bg-accent-primary hover:bg-accent-secondary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
