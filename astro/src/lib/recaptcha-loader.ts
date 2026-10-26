let scriptLoadPromise: Promise<void> | null = null;

export function resetRecaptchaLoader(): void {
  scriptLoadPromise = null;
}

export function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !siteKey) {
    return Promise.resolve();
  }

  if (window.grecaptcha) {
    return Promise.resolve();
  }

  const existingScript = document.getElementById('recaptcha-v3-script') as HTMLScriptElement | null;

  if (!existingScript && !window.grecaptcha) {
    scriptLoadPromise = null;
  }

  if (scriptLoadPromise) {
    return scriptLoadPromise;
  }

  if (existingScript) {
    scriptLoadPromise = new Promise<void>((resolve) => {
      const handleLoad = () => resolve();
      const handleError = () => resolve();
      existingScript.addEventListener('load', handleLoad, { once: true });
      existingScript.addEventListener('error', handleError, { once: true });
      setTimeout(() => resolve(), 2000);
    });
    return scriptLoadPromise;
  }

  scriptLoadPromise = new Promise<void>((resolve) => {
    const script = document.createElement('script');
    script.id = 'recaptcha-v3-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;

    const cleanupAndResolve = () => {
      resolve();
    };

    script.onload = cleanupAndResolve;
    script.onerror = cleanupAndResolve;

    document.head.appendChild(script);

    if (window.grecaptcha) {
      resolve();
    }
  });

  return scriptLoadPromise;
}

export async function executeRecaptcha(
  siteKey: string,
  action: string = 'contact_us'
): Promise<string> {
  if (!siteKey) {
    return '';
  }

  try {
    await loadRecaptchaScript(siteKey);

    if (typeof window === 'undefined' || !window.grecaptcha) {
      return '';
    }

    return await new Promise<string>((resolve) => {
      try {
        window.grecaptcha?.ready(() => {
          if (!window.grecaptcha?.execute) {
            resolve('');
            return;
          }
          window.grecaptcha
            .execute(siteKey, { action })
            .then((token) => resolve(token || ''))
            .catch((err) => {
              console.error('reCAPTCHA execution error:', err);
              resolve('');
            });
        });
      } catch (err) {
        console.error('reCAPTCHA execution error:', err);
        resolve('');
      }
    });
  } catch (err) {
    console.error('reCAPTCHA execution error:', err);
    return '';
  }
}
