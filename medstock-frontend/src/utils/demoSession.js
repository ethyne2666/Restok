const SESSION_KEY = 'restok-demo-session-id';

export function getDemoSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);

  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }

  return id;
}