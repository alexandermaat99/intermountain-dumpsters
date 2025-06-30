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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
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
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Loading contact information...</p>
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