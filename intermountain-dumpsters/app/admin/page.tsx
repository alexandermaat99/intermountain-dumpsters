'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getContactInfo, updateContactInfo, ContactInfo } from '@/lib/contact-info';
import { Loader2, Eye, EyeOff, Settings, Phone, Mail, MapPin, Clock } from 'lucide-react';

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
  const [saving, setSaving] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
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
  }, []);

  const loadContactInfo = async () => {
    try {
      const info = await getContactInfo();
      setContactInfo(info);
    } catch (error) {
      console.error('Error loading contact info:', error);
    }
  };

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
    } catch (error) {
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
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleContactInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo) return;

    setSaving(true);
    try {
      const updated = await updateContactInfo(contactInfo);
      if (updated) {
        setContactInfo(updated);
        setEditingContact(false);
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation currentPage="admin" />
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
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage="admin" />
      
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Contact Information Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Manage your business contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contactInfo && (
                <form onSubmit={handleContactInfoUpdate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="phone"
                          value={contactInfo.phone}
                          onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                          className="pl-10"
                          disabled={!editingContact}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="email"
                          type="email"
                          value={contactInfo.email}
                          onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                          className="pl-10"
                          disabled={!editingContact}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="address"
                        value={contactInfo.address}
                        onChange={(e) => setContactInfo({...contactInfo, address: e.target.value})}
                        className="pl-10"
                        disabled={!editingContact}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={contactInfo.city}
                        onChange={(e) => setContactInfo({...contactInfo, city: e.target.value})}
                        disabled={!editingContact}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={contactInfo.state}
                        onChange={(e) => setContactInfo({...contactInfo, state: e.target.value})}
                        disabled={!editingContact}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        value={contactInfo.zip_code}
                        onChange={(e) => setContactInfo({...contactInfo, zip_code: e.target.value})}
                        disabled={!editingContact}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_phone">Emergency Phone</Label>
                    <Input
                      id="emergency_phone"
                      value={contactInfo.emergency_phone}
                      onChange={(e) => setContactInfo({...contactInfo, emergency_phone: e.target.value})}
                      disabled={!editingContact}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Business Hours</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Input
                        placeholder="Monday-Friday (e.g., 7:00 AM - 6:00 PM)"
                        value={contactInfo.business_hours.monday_friday}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          business_hours: {
                            ...contactInfo.business_hours,
                            monday_friday: e.target.value
                          }
                        })}
                        disabled={!editingContact}
                      />
                      <Input
                        placeholder="Saturday (e.g., 8:00 AM - 4:00 PM)"
                        value={contactInfo.business_hours.saturday}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          business_hours: {
                            ...contactInfo.business_hours,
                            saturday: e.target.value
                          }
                        })}
                        disabled={!editingContact}
                      />
                      <Input
                        placeholder="Sunday (e.g., Closed)"
                        value={contactInfo.business_hours.sunday}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          business_hours: {
                            ...contactInfo.business_hours,
                            sunday: e.target.value
                          }
                        })}
                        disabled={!editingContact}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {editingContact ? (
                      <>
                        <Button type="submit" disabled={saving}>
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setEditingContact(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button 
                        type="button" 
                        onClick={() => setEditingContact(true)}
                      >
                        Edit Contact Info
                      </Button>
                    )}
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Pricing Management */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Configuration</CardTitle>
              <CardDescription>
                Manage your service pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contactInfo && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price_per_lb">Price per lb ($)</Label>
                      <Input
                        id="price_per_lb"
                        type="number"
                        step="0.01"
                        value={contactInfo.price_per_lb || 0}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          price_per_lb: parseFloat(e.target.value)
                        })}
                        disabled={!editingContact}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day_rate">Day Rate ($)</Label>
                      <Input
                        id="day_rate"
                        type="number"
                        step="0.01"
                        value={contactInfo.day_rate || 0}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          day_rate: parseFloat(e.target.value)
                        })}
                        disabled={!editingContact}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cancelation_insurance">Cancellation Insurance ($)</Label>
                      <Input
                        id="cancelation_insurance"
                        type="number"
                        step="0.01"
                        value={contactInfo.cancelation_insurance || 0}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          cancelation_insurance: parseFloat(e.target.value)
                        })}
                        disabled={!editingContact}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driveway_insurance">Driveway Insurance ($)</Label>
                      <Input
                        id="driveway_insurance"
                        type="number"
                        step="0.01"
                        value={contactInfo.driveway_insurance || 0}
                        onChange={(e) => setContactInfo({
                          ...contactInfo, 
                          driveway_insurance: parseFloat(e.target.value)
                        })}
                        disabled={!editingContact}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rush_fee">Rush Fee ($)</Label>
                    <Input
                      id="rush_fee"
                      type="number"
                      step="0.01"
                      value={contactInfo.rush_fee || 0}
                      onChange={(e) => setContactInfo({
                        ...contactInfo, 
                        rush_fee: parseFloat(e.target.value)
                      })}
                      disabled={!editingContact}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 