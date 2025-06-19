'use client';

import { useState, useEffect } from 'react';
import { ContactInfo, getContactInfo, defaultContactInfo } from '../contact-info';

export function useContactInfo() {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContactInfo() {
      try {
        setLoading(true);
        setError(null);
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contact information');
        console.error('Error in useContactInfo:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchContactInfo();
  }, []);

  const refreshContactInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getContactInfo();
      setContactInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh contact information');
      console.error('Error refreshing contact info:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    contactInfo,
    loading,
    error,
    refreshContactInfo
  };
} 