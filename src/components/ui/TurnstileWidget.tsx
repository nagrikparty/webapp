

import { Turnstile } from '@marsidev/react-turnstile';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
}

export default function TurnstileWidget({ onSuccess, onError }: TurnstileWidgetProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full flex justify-center py-4">
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
        onSuccess={onSuccess}
        onError={onError}
        options={{
          theme: resolvedTheme === 'dark' ? 'dark' : 'light',
          size: 'normal',
        }}
      />
    </div>
  );
}
