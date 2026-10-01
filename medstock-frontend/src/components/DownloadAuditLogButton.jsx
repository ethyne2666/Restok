import { useState } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

export function DownloadAuditLogButton() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const credentials = btoa(`${username}:${password}`);
      const response = await fetch(
        `${API_BASE_URL}/api/admin/audit-logs/download`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        }
      );

      if (response.status === 401 || response.status === 403) {
        throw new Error('Admin username or password is incorrect.');
      }

      if (!response.ok) {
        throw new Error(`Download failed (${response.status}).`);
      }

      const contentType = response.headers.get('content-type') ?? '';

      if (contentType.includes('text/html')) {
        throw new Error(
          'The server returned a web page instead of the log. Check VITE_API_URL.'
        );
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = 'medstock.log';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      setPassword('');
    } catch (downloadError) {
      setError(downloadError.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
    >
      <label className="grid gap-1 text-sm text-slate-600">
        Admin username
        <input
          required
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </label>

      <label className="grid gap-1 text-sm text-slate-600">
        Admin password
        <input
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-w-0 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </label>

      <button
        type="submit"
        disabled={busy}
        className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-60"
      >
        {busy ? 'Downloading…' : 'Download .log'}
      </button>

      {error && (
        <p role="alert" className="text-sm text-red-600 sm:col-span-3">
          {error}
        </p>
      )}
    </form>
  );
}