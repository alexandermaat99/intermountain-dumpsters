'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Users, UserPlus, Mail, Calendar, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  email_confirmed_at: string | null;
  role: string;
  is_super_admin: boolean;
}

export default function AdminAccountsCard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Session check:', session ? 'Session exists' : 'No session');
      
      if (!session) {
        setError('Please log in to view admin accounts. You need to be authenticated to access this feature.');
        setUsers([]);
        return;
      }

      console.log('Fetching users with token:', session.access_token ? 'Token present' : 'No token');
      console.log('Token length:', session.access_token?.length || 0);

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Users data:', data);
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load admin accounts');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const inviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Invite form submitted with email:', inviteEmail);
    
    if (!inviteEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setInviting(true);
      setError('');
      setSuccess('');

      const { data: { session } } = await supabase.auth.getSession();
      console.log('Invite - Session check:', session ? 'Session exists' : 'No session');
      
      if (!session) {
        setError('Please log in to invite new admins. You need to be authenticated to access this feature.');
        return;
      }

      console.log('Inviting user with token length:', session.access_token?.length || 0);

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      console.log('Invite response status:', response.status);
      console.log('Invite response ok:', response.ok);

      const data = await response.json();
      console.log('Invite response data:', data);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(data.error || 'Failed to invite user');
      }

      setSuccess('Invitation sent successfully!');
      setInviteEmail('');
      setShowInviteForm(false);
      
      // Refresh the user list
      await fetchUsers();
    } catch (err) {
      console.error('Error inviting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to invite user');
    } finally {
      setInviting(false);
    }
  };

  useEffect(() => {
    console.log('AdminAccountsCard mounted, fetching users...');
    fetchUsers();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (user: AdminUser) => {
    if (!user.email_confirmed_at) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
    }
    if (user.last_sign_in_at) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Admin Accounts
        </CardTitle>
        <CardDescription>
          Manage admin user accounts and invite new administrators
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {/* Invite New Admin Section */}
            <div className="mb-6">
              {!showInviteForm ? (
                <Button 
                  onClick={() => {
                    console.log('Invite button clicked');
                    setShowInviteForm(true);
                  }}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Invite New Admin
                </Button>
              ) : (
                <form onSubmit={inviteUser} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email Address</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="invite-email"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="admin@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                      <Button 
                        type="submit" 
                        disabled={inviting}
                        className="flex items-center gap-2"
                      >
                        {inviting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4" />
                            Send Invite
                          </>
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => {
                          console.log('Cancel button clicked');
                          setShowInviteForm(false);
                          setInviteEmail('');
                          setError('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                  {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
                      {success}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Users List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Admin Accounts</h3>
              {error && error.includes('log in') ? (
                <div className="text-center py-8">
                  <div className="text-gray-500 mb-4">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Authentication Required</p>
                    <p className="text-sm">Please log in to view and manage admin accounts.</p>
                  </div>
                  <Button 
                    onClick={() => window.location.href = '/admin'}
                    className="flex items-center gap-2"
                  >
                    Go to Admin Login
                  </Button>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No admin accounts found
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{user.email}</div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Joined: {formatDate(user.created_at)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last login: {formatDate(user.last_sign_in_at)}
                              </div>
                            </div>
                          </div>
                          {getStatusBadge(user)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <div className="mt-6 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => {
                  console.log('Refresh button clicked');
                  fetchUsers();
                }}
                disabled={loading}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Refresh List
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 