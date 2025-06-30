'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Users, UserPlus, RefreshCw, Mail } from 'lucide-react';

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
  const { user: currentUser, session } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      if (!session?.access_token) {
        setError('Please log in to view admin accounts. You need to be authenticated to access this feature.');
        setUsers([]);
        return;
      }

      console.log('Fetching users with token length:', session.access_token.length);

      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

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

    if (!session?.access_token) {
      setError('Please log in to invite new admins. You need to be authenticated to access this feature.');
      return;
    }

    try {
      setInviting(true);
      setError('');
      setSuccess('');

      console.log('Inviting user with token length:', session.access_token.length);

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });

      console.log('Invite response status:', response.status);

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

  // Load users when component mounts and user is authenticated
  useEffect(() => {
    if (currentUser && session?.access_token) {
      fetchUsers();
    } else if (!currentUser) {
      setLoading(false);
      setError('Please log in to view admin accounts.');
    }
  }, [currentUser, session?.access_token]);

  const handleRefresh = async () => {
    console.log('Refresh button clicked');
    await fetchUsers();
  };

  if (!currentUser) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Admin Accounts
          </CardTitle>
          <CardDescription>
            Manage admin user accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-gray-500 mb-4">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Authentication Required</p>
              <p className="text-sm">Please log in to view and manage admin accounts.</p>
            </div>
            <Button 
              onClick={() => router.push('/admin')}
              className="flex items-center gap-2"
            >
              Go to Admin Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Admin Accounts
            </CardTitle>
            <CardDescription>
              Manage admin user accounts
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={() => setShowInviteForm(true)}
              size="sm"
              disabled={showInviteForm}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Admin
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200 mb-4">
            {success}
          </div>
        )}

        {/* Invite Form */}
        {showInviteForm && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Invite New Admin</h3>
            <form onSubmit={inviteUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={inviting}
                  className="flex items-center gap-2"
                >
                  {inviting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Invite...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      Send Invite
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowInviteForm(false);
                    setInviteEmail('');
                    setError('');
                  }}
                  disabled={inviting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Admin Accounts</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mr-2" />
              <span className="text-gray-600">Loading admin accounts...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No admin accounts found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-white"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.email}</span>
                      {user.is_super_admin && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Super Admin
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Created: {new Date(user.created_at).toLocaleDateString()}
                      {user.last_sign_in_at && (
                        <span className="ml-4">
                          Last sign in: {new Date(user.last_sign_in_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {user.email_confirmed_at ? (
                      <span className="text-green-600">✓ Confirmed</span>
                    ) : (
                      <span className="text-yellow-600">⏳ Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 