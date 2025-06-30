'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/contexts/AuthContext';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User as UserIcon, Package, DollarSign, Truck } from 'lucide-react';
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
  dumpster?: {
    identification: string;
  };
}

// Helper to get most recent Sunday (start of week)
function getMostRecentSunday(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // 0 = Sunday, so if today is Sunday, return today
  d.setDate(d.getDate() - day);
  return d;
}

export default function RentalsPage() {
  const { user, loading } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [rentalsLoading, setRentalsLoading] = useState(true);
  const router = useRouter();

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
          dumpster_type:dumpster_types(name, descriptor, price),
          dumpster:dumpsters(identification)
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
    const daysUntil = getDaysUntil(rental.delivery_date_requested);
    if (rental.picked_up) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
    }
    if (rental.delivered) {
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Active</span>;
    }
    if (!rental.delivered && !rental.picked_up) {
      if (daysUntil > 2) {
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Ordered</span>;
      } else if (daysUntil >= 0) {
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Needs Drop Off</span>;
      } else {
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Late</span>;
      }
    }
    // Fallback
    return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
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

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const delivery = new Date(dateString);
    // Zero out the time for both dates
    today.setHours(0,0,0,0);
    delivery.setHours(0,0,0,0);
    const diff = Math.ceil((delivery.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Partition rentals into main and archived
  const mostRecentSunday = getMostRecentSunday();
  const mainRentals = rentals.filter(rental => {
    if (!rental.picked_up) return true;
    if (!rental.date_picked_up) return true;
    // If picked up, only show if completed after most recent Sunday
    return new Date(rental.date_picked_up) >= mostRecentSunday;
  });
  const archivedRentals = rentals.filter(rental => {
    if (!rental.picked_up) return false;
    if (!rental.date_picked_up) return false;
    // Archived if completed before most recent Sunday
    return new Date(rental.date_picked_up) < mostRecentSunday;
  });

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
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delivery Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Days Until</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dumpster Info</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delivery Address</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mainRentals.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-gray-500">No rentals found</td>
                        </tr>
                      ) : (
                        mainRentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/rentals/${rental.id}`)} tabIndex={0} role="button" aria-label={`View rental #${rental.id}`}>
                            {/* Delivery Date */}
                            <td className="px-4 py-4 align-top text-sm font-semibold text-blue-900">{formatDate(rental.delivery_date_requested)}</td>
                            {/* Days Until */}
                            <td className="px-4 py-4 align-top text-sm font-semibold text-green-700">{getDaysUntil(rental.delivery_date_requested)}</td>
                            {/* Dumpster Info */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">
                                {rental.dumpster_type?.name || 'Unknown Type'}
                              </div>
                              <div className="text-gray-500">
                                ID: {rental.dumpster?.identification || 'Not Assigned'}
                              </div>
                            </td>
                            {/* Delivery Address */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">{rental.delivery_address}</div>
                              <div className="text-gray-500">{rental.delivery_zip_code}</div>
                              {rental.emergency_delivery && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">Emergency</span>
                              )}
                            </td>
                            {/* Customer */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">{rental.customer?.first_name} {rental.customer?.last_name}</div>
                              <div className="text-gray-500">{rental.customer?.phone_number}</div>
                              <div className="text-gray-500">{rental.customer?.email}</div>
                              {rental.customer?.business && (
                                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Business</span>
                              )}
                            </td>
                            {/* Status */}
                            <td className="px-4 py-4 align-top text-sm">{getStatusBadge(rental)}</td>
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
              {/* Archived Orders Table (desktop) */}
              {archivedRentals.length > 0 && (
                <div className="hidden md:block mt-10">
                  <h2 className="text-lg font-bold mb-2 text-gray-700">Archived Orders</h2>
                  <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delivery Date</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Days Until</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dumpster Info</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Delivery Address</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Payment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {archivedRentals.map((rental) => (
                          <tr key={rental.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => router.push(`/admin/rentals/${rental.id}`)} tabIndex={0} role="button" aria-label={`View rental #${rental.id}`}>
                            {/* Delivery Date */}
                            <td className="px-4 py-4 align-top text-sm font-semibold text-blue-900">{formatDate(rental.delivery_date_requested)}</td>
                            {/* Days Until */}
                            <td className="px-4 py-4 align-top text-sm font-semibold text-green-700">{getDaysUntil(rental.delivery_date_requested)}</td>
                            {/* Dumpster Info */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">
                                {rental.dumpster_type?.name || 'Unknown Type'}
                              </div>
                              <div className="text-gray-500">
                                ID: {rental.dumpster?.identification || 'Not Assigned'}
                              </div>
                            </td>
                            {/* Delivery Address */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">{rental.delivery_address}</div>
                              <div className="text-gray-500">{rental.delivery_zip_code}</div>
                              {rental.emergency_delivery && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">Emergency</span>
                              )}
                            </td>
                            {/* Customer */}
                            <td className="px-4 py-4 align-top text-sm">
                              <div className="font-medium text-gray-900">{rental.customer?.first_name} {rental.customer?.last_name}</div>
                              <div className="text-gray-500">{rental.customer?.phone_number}</div>
                              <div className="text-gray-500">{rental.customer?.email}</div>
                              {rental.customer?.business && (
                                <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Business</span>
                              )}
                            </td>
                            {/* Status */}
                            <td className="px-4 py-4 align-top text-sm">{getStatusBadge(rental)}</td>
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* Card layout for mobile */}
              <div className="flex flex-col gap-4 md:hidden">
                {mainRentals.length === 0 ? (
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
                  mainRentals.map((rental) => (
                    <Link href={`/admin/rentals/${rental.id}`} key={rental.id} className="hover:shadow-lg transition-shadow w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded block">
                      <Card className="w-full">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2 mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                {formatDate(rental.delivery_date_requested)}
                              </h3>
                              <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 rounded px-2 py-0.5 mt-1 mb-1">
                                {getDaysUntil(rental.delivery_date_requested)} days until
                              </span>
                              <p className="text-xs text-blue-900 font-medium">
                                {rental.delivery_address}
                              </p>
                              <p className="text-xs text-gray-500">
                                {rental.delivery_zip_code}
                              </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                              {getStatusBadge(rental)}
                              {getPaymentStatusBadge(rental.payment_status)}
                            </div>
                          </div>
                          <div className="grid grid-cols-1 gap-4">
                            {/* Dumpster Info */}
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Package className="h-4 w-4" />
                                <span className="font-medium">Dumpster</span>
                              </div>
                              <div className="text-xs">
                                <p className="font-medium text-gray-900">
                                  {rental.dumpster_type?.name || 'Unknown Type'}
                                </p>
                                <p className="text-gray-500">
                                  ID: {rental.dumpster?.identification || 'Not Assigned'}
                                </p>
                              </div>
                            </div>
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
                {archivedRentals.length > 0 && (
                  <div className="flex flex-col gap-4 md:hidden mt-10">
                    <h2 className="text-lg font-bold mb-2 text-gray-700">Archived Orders</h2>
                    {archivedRentals.map((rental) => (
                      <Link href={`/admin/rentals/${rental.id}`} key={rental.id} className="hover:shadow-lg transition-shadow w-full focus:outline-none focus:ring-2 focus:ring-blue-500 rounded block">
                        <Card className="w-full">
                          <CardContent className="p-4">
                            <div className="flex flex-col gap-2 mb-4">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {formatDate(rental.delivery_date_requested)}
                                </h3>
                                <span className="inline-block text-xs font-semibold text-green-700 bg-green-50 rounded px-2 py-0.5 mt-1 mb-1">
                                  {getDaysUntil(rental.delivery_date_requested)} days until
                                </span>
                                <p className="text-xs text-blue-900 font-medium">
                                  {rental.delivery_address}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {rental.delivery_zip_code}
                                </p>
                              </div>
                              <div className="flex gap-2 mt-2">
                                {getStatusBadge(rental)}
                                {getPaymentStatusBadge(rental.payment_status)}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                              {/* Dumpster Info */}
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <Package className="h-4 w-4" />
                                  <span className="font-medium">Dumpster</span>
                                </div>
                                <div className="text-xs">
                                  <p className="font-medium text-gray-900">
                                    {rental.dumpster_type?.name || 'Unknown Type'}
                                  </p>
                                  <p className="text-gray-500">
                                    ID: {rental.dumpster?.identification || 'Not Assigned'}
                                  </p>
                                </div>
                              </div>
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
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 