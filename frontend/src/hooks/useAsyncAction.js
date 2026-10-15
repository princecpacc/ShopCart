import { useState } from 'react';

export function useAsyncAction(getErrorMessage) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function run(action) {
    if (saving) return;

    setSaving(true);
    setError('');

    try {
      await action();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return { saving, error, run, setError };
}
