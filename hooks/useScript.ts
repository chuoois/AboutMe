// File: src/hooks/useScript.ts (hoặc .js)

import { useEffect } from 'react';

/**
 * Hook để tải động một tập lệnh JavaScript bên ngoài vào DOM.
 */
export function useScript(src: string) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);
}