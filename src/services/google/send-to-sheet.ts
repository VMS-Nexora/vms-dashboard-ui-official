/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from 'dayjs';
import { useState } from 'react';

const useGoogleSheetSubmit = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any | null>(null);
  const scriptURL = 'ADD_LATER' as string;
  const submit = async (values: T) => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const now = dayjs().format('DD/MM/YYYY HH:mm:ss');
      const res = await fetch(scriptURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, date: now }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error, response };
};

export default useGoogleSheetSubmit;
