import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BASE_URL } from '@/utils/api';
import { getDemoSessionId } from '@/utils/demoSession';

function sendActivity(type, path, target = '') {
  fetch(`${BASE_URL}/api/activity/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Demo-Session': getDemoSessionId(),
    },
    body: JSON.stringify({ type, path, target }),
    keepalive: true,
  }).catch(() => {
    // Tracking should never block normal app interaction.
  });
}

export function ActivityTracker() {
  const location = useLocation();

  useEffect(() => {
    const lastPathKey = 'restok-last-tracked-path';
    const lastPath = sessionStorage.getItem(lastPathKey);

    // Avoid duplicate route events from React StrictMode's development remount.
    if (lastPath !== location.pathname) {
      sessionStorage.setItem(lastPathKey, location.pathname);
      sendActivity('NAVIGATION', location.pathname, location.pathname);
    }
  }, [location.pathname]);

  useEffect(() => {
    function trackClick(event) {
      const target = event.target.closest('a, button, [role="button"]');

      if (!target || target.hasAttribute('data-no-activity')) {
        return;
      }

      const label =
        target.getAttribute('aria-label') ||
        target.getAttribute('data-activity') ||
        target.textContent?.trim().replace(/\s+/g, ' ').slice(0, 80) ||
        target.tagName.toLowerCase();

      sendActivity('CLICK', location.pathname, label);
    }

    document.addEventListener('click', trackClick);

    return () => {
      document.removeEventListener('click', trackClick);
    };
  }, [location.pathname]);

  return null;
}