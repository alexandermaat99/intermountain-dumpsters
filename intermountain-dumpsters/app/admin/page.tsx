'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContactInfoClient, ContactInfo } from '@/lib/contact-info';
import { Loader2, Eye, EyeOff, Settings } from 'lucide-react';
import AdminInfoForm from '@/components/admin/AdminInfoForm';
import AdminInfoSummary from '@/components/admin/AdminInfoSummary';
import AdminAccountsCard from '@/components/admin/AdminAccountsCard';

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [editingContact, setEditingContact] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const loadContactInfo = useCallback(async () => {
    try {
      const info = await getContactInfoClient();
      setContactInfo(info);
    } catch (error) {
      console.error('Error loading contact info:', error);
      // Don't set error state here, just log it
    }
  }, []);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Error checking session:', error);
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadContactInfo();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [loadContactInfo]);

  // Fetch contact info only after user is authenticated
  useEffect(() => {
    if (user) {
      loadContactInfo();
    }
  }, [user, loadContactInfo]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess('Password reset email sent! Check your inbox.');
        setShowForgotPassword(false);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <CardDescription>
                Sign in to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showForgotPassword ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="admin@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  {success && (
                    <div className="text-green-600 text-sm">{success}</div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={authLoading}
                  >
                    {authLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter your email address"
                    />
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                  )}
                  {success && (
                    <div className="text-green-600 text-sm">{success}</div>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={resetLoading}
                  >
                    {resetLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending Reset Email...
                      </>
                    ) : (
                      'Send Reset Email'
                    )}
                  </Button>
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-sm"
                    >
                      Back to Login
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar user={user} />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          
          {/* Debug info */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-800">
              <strong>Debug Info:</strong> User authenticated: {user ? 'Yes' : 'No'}, 
              Contact info loaded: {contactInfo ? 'Yes' : 'No'}
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1">
            {/* Contact Information Management */}
            <Card>
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