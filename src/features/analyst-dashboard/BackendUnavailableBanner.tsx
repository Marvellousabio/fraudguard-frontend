import { AlertTriangle } from 'lucide-react';

interface BackendUnavailableBannerProps {
  message?: string;
}

export const BackendUnavailableBanner: React.FC<BackendUnavailableBannerProps> = ({
  message = 'Backend service is currently unavailable. Some features may be limited.',
}) => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
      <AlertTriangle className="h-5 w-5 shrink-0" />
      <div>
        <p className="font-semibold">Cannot reach backend</p>
        <p className="text-xs opacity-90">{message}</p>
      </div>
    </div>
  );
};
