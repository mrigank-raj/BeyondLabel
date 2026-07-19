import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

export const initAnalytics = () => {
  if (POSTHOG_KEY && typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false, // We'll manually capture specific events
      capture_pageview: true,
      persistence: 'localStorage'
    });
  } else {
    console.warn("PostHog key missing, analytics disabled.");
  }
};

export const trackEvent = (eventName, properties = {}) => {
  if (POSTHOG_KEY) {
    posthog.capture(eventName, properties);
  } else {
    // Fallback logging for local dev
    console.log(`[Analytics Track] ${eventName}`, properties);
  }
};

export const identifyUser = (distinctId, properties = {}) => {
  if (POSTHOG_KEY) {
    posthog.identify(distinctId, properties);
  }
};
