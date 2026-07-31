import { useToastStore } from '../store/toastStore';

export function ToastHost() {
  const { toasts, dismiss } = useToastStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`text-left rounded-md border px-4 py-3 text-sm shadow-lg animate-in ${
            t.variant === 'success'
              ? 'bg-bg-elevated border-success text-text-primary'
              : 'bg-bg-elevated border-error text-text-primary'
          }`}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
