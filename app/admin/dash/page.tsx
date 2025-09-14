'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContactInfoClient, ContactInfo } from '@/lib/contact-info';
import { Loader2, Settings } from 'lucide-react';
import AdminInfoForm from '@/components/admin/AdminInfoForm';
import AdminInfoSummary from '@/components/admin/AdminInfoSummary';
import AdminAccountsCard from '@/components/admin/AdminAccountsCard';

export default function AdminDashPage() {
  const { user, loading } = useAuth();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [editingContact, setEditingContact] = useState(false);

  const loadContactInfo = useCallback(async () => {
    try {
      const info = await getContactInfoClient();
      setContactInfo(info);
    } catch {
      // Silently handle error, use default values
    }
  }, []);

  // Fetch contact info only after user is authenticated
  useEffect(() => {
    if (user) {
      loadContactInfo();
    }
  }, [user, loadContactInfo]);

  const handleContactInfoUpdate = useCallback((updatedInfo: ContactInfo) => {
    setContactInfo(updatedInfo);
    setEditingContact(false);
  }, []);

  const handleEditCancel = useCallback(() => {
    setEditingContact(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AdminSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AdminSidebar user={user} />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Access Denied</CardTitle>
              <CardDescription>
                Please sign in to access the admin dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <main className="flex-1 p-2 sm:p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Welcome back, {user.email}</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {/* Contact Information Management */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Admin Info
                </CardTitle>
                <CardDescription>
                  Manage your business contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Show loading spinner in card if contactInfo is not loaded yet */}
                {!contactInfo ? (
                  <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-40 bg-gray-200 rounded"></div>
                      <div className="h-40 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Show summary when not editing */}
                    {!editingContact && (
                      <AdminInfoSummary 
                        contactInfo={contactInfo}
                        onEdit={() => setEditingContact(true)}
                      />
                    )}

                    {/* Form only when editing */}
                    {editingContact && (
                      <AdminInfoForm
                        contactInfo={contactInfo}
                        onUpdate={handleContactInfoUpdate}
                        onCancel={handleEditCancel}
                      />
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Admin Accounts Management */}
            <AdminAccountsCard />
          </div>
        </div>
      </main>
    </div>
  );
} 