'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Calendar, User as UserIcon, Package, DollarSign, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Rental {
  id: number;
  created_at: string;
  customer_id: number;
  dumpster_type_id: number;
  dumpster_id: number | null;
  delivery_date_requested: string;
  cancelation_insurance: boolean;
  driveway_insurance: boolean;
  emergency_delivery: boolean;
  delivered: boolean;
  picked_up: boolean;
  date_picked_up: string | null;
  drop_weight: number | null;
  days_dropped: number | null;
  payment_status: string;
  stripe_session_id: string | null;
  total_amount: number;
  subtotal_amount: number;
  tax_amount: number;
  tax_rate: number;
  delivery_zip_code: string;
  delivery_address: string;
  customer?: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    business: boolean;
  };
  dumpster_type?: {
    name: string;
    descriptor: string;
    price: number;
  };
}

export default function RentalsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchRentals();
    }
  }, [user]);

  const fetchRentals = async () => {
    try {
      setRentalsLoading(true);
      
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          customer:customers(first_name, last_name, phone_number, email, business),
          dumpster_type:dumpster_types(name, descriptor, price)
        `)
        .order('delivery_date_requested', { ascending: true });

      if (error) {
        console.error('Error fetching rentals:', error);
        return;
      }

      setRentals(data || []);
    } catch (error) {
      console.error('Error fetching rentals:', error);
    } finally {
      setRentalsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (rental: Rental) => {
    if (rental.picked_up) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Completed</span>;
    }
    if (rental.delivered) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Delivered</span>;
    }
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
      case 'failed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Failed</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
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
                Please sign in to access the rentals dashboard
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
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rentals Dashboard</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage dumpster rentals and deliveries</p>
            </div>
            <Button onClick={fetchRentals} variant="outline" disabled={rentalsLoading} className="w-full sm:w-auto">
              {rentalsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                'Refresh'
              )}
            </Button>
          </div>

          {rentalsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading rentals...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Table layout for desktop */}
              <div className="hidden md:block">
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delivery</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dumpster</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {rentals.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-gray-500">No rentals found</td>
                        </tr>
                      ) : (
                        rentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/rentals/${rental.id}`)} tabIndex={0} role="button" aria-label={`View rental #${rental.id}`}>
                            {/* Customer */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">{rental.customer?.first_name} {rental.customer?.last_name}</div>
                              <div className="text-gray-500">{rental.customer?.phone_number}</div>
                              <div className="text-gray-500">{rental.customer?.email}</div>
                              {rental.customer?.business && (
                                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Business</span>
                              )}
                            </td>
                            {/* Delivery */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium">{formatDate(rental.delivery_date_requested)}</div>
                              <div className="text-gray-500">{rental.delivery_address}</div>
                              <div className="text-gray-500">{rental.delivery_zip_code}</div>
                              {rental.emergency_delivery && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">Emergency</span>
                              )}
                            </td>
                            {/* Dumpster */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium">{rental.dumpster_type?.name}</div>
                              <div className="text-gray-500">{rental.dumpster_type?.descriptor}</div>
                              {rental.dumpster_id && (
                                <div className="text-gray-500">ID: {rental.dumpster_id}</div>
                              )}
                            </td>
                            {/* Status */}
                            <td className="px-4 py-4 align-top text-sm">
                              {getStatusBadge(rental)}
                            </td>
                            {/* Payment */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium">{formatCurrency(rental.total_amount)}</div>
                              <div className="mt-1">{getPaymentStatusBadge(rental.payment_status)}</div>
                              <div className="text-xs text-gray-500">Subtotal: {formatCurrency(rental.subtotal_amount)}</div>
                              <div className="text-xs text-gray-500">Tax: {formatCurrency(rental.tax_amount)}</div>
                              {rental.cancelation_insurance && (
                                <div className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">Cancellation Insurance</div>
                              )}
                              {rental.driveway_insurance && (
                                <div className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">Driveway Insurance</div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Card layout for mobile */}
              <div className="flex flex-col gap-4 md:hidden">
                {rentals.length === 0 ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="text-center">
                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals found</h3>
                        <p className="text-gray-500">No rental orders have been placed yet.</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  rentals.map((rental) => (
                    <Link href={`/admin/rentals/${rental.id}`} key={rental.id} className="hover:shadow-lg transition-shadow w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded block">
                      <Card className="w-full">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Rental #{rental.id}
                              </h3>
                              <p className="text-xs text-gray-500">
                                Created {formatDate(rental.created_at)}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {getStatusBadge(rental)}
                              {getPaymentStatusBadge(rental.payment_status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Customer Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <UserIcon className="h-4 w-4" />
                                <span className="font-medium">Customer</span>
                              </div>
                              <div className="text-xs">
                                <p className="font-medium">
                                  {rental.customer?.first_name} {rental.customer?.last_name}
                                  {rental.customer?.business && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Business</span>
                                  )}
                                </p>
                                <p className="text-gray-500">{rental.customer?.phone_number}</p>
                                <p className="text-gray-500">{rental.customer?.email}</p>
                              </div>
                            </div>
                            {/* Delivery Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">Delivery</span>
                              </div>
                              <div className="text-xs">
                                <p className="font-medium">{formatDate(rental.delivery_date_requested)}</p>
                                <p className="text-gray-500">{rental.delivery_address}</p>
                                <p className="text-gray-500">{rental.delivery_zip_code}</p>
                                {rental.emergency_delivery && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Emergency Delivery
                                  </span>
                                )}
                              </div>
                            </div>
                            {/* Dumpster Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Package className="h-4 w-4" />
                                <span className="font-medium">Dumpster</span>
                              </div>
                              <div className="text-xs">
                                <p className="font-medium">{rental.dumpster_type?.name}</p>
                                <p className="text-gray-500">{rental.dumpster_type?.descriptor}</p>
                                {rental.dumpster_id && (
                                  <p className="text-gray-500">ID: {rental.dumpster_id}</p>
                                )}
                              </div>
                            </div>
                            {/* Financial Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <DollarSign className="h-4 w-4" />
                                <span className="font-medium">Financial</span>
                              </div>
                              <div className="text-xs">
                                <p className="font-medium">{formatCurrency(rental.total_amount)}</p>
                                <p className="text-gray-500">Subtotal: {formatCurrency(rental.subtotal_amount)}</p>
                                <p className="text-gray-500">Tax: {formatCurrency(rental.tax_amount)}</p>
                                {rental.cancelation_insurance && (
                                  <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Cancellation Insurance
                                  </span>
                                )}
                                {rental.driveway_insurance && (
                                  <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Driveway Insurance
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {/* Pickup Info */}
                          {rental.picked_up && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Truck className="h-4 w-4" />
                                <span className="font-medium">Pickup Information</span>
                              </div>
                              <div className="text-xs mt-2">
                                <p className="text-gray-500">
                                  Picked up: {rental.date_picked_up ? formatDate(rental.date_picked_up) : 'N/A'}
                                </p>
                                {rental.drop_weight && (
                                  <p className="text-gray-500">Weight: {rental.drop_weight} lbs</p>
                                )}
                                {rental.days_dropped && (
                                  <p className="text-gray-500">Days: {rental.days_dropped}</p>
                                )}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 