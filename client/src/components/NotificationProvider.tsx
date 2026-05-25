import { Toaster, toast } from 'react-hot-toast';

/**
 * Play a short notification sound and show a styled toast popup.
 */
export const notify = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
  // Try to play the notification sound — will silently fail if the file is missing
  try {
    const audio = new Audio('/notification.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {
      /* browser may block autoplay until user interaction */
    });
  } catch {
    /* noop */
  }

  switch (type) {
    case 'error':
      toast.error(message, { duration: 4000, position: 'top-right' });
      break;
    case 'warning':
      toast(message, {
        duration: 4000,
        position: 'top-right',
        icon: '⚠️',
        style: {
          background: 'hsl(38 92% 50%)',
          color: '#fff',
        },
      });
      break;
    case 'info':
      toast(message, {
        duration: 4000,
        position: 'top-right',
        icon: 'ℹ️',
      });
      break;
    case 'success':
    default:
      toast.success(message, { duration: 4000, position: 'top-right' });
      break;
  }
};

export default function NotificationProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'hsl(220 40% 13%)',
          color: '#f1f5f9',
          border: '1px solid hsl(217 33% 20%)',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontFamily: "'Inter', system-ui, sans-serif",
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
        },
        success: {
          iconTheme: {
            primary: 'hsl(25 95% 53%)',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}
