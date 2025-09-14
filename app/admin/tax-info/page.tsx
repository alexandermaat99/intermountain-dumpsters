'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign, Receipt, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/AdminSidebar';

export default function TaxInfoPage() {
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('')
    const [taxSummary, setTaxSummary] = useState({
        totalRevenue: 0,
        totalTax: 0,
        recordCount: 0
    });

    useEffect(() => {
        if (user) {
            console.log('User found, fetching tax summary...');
            fetchTaxSummary();
        }
    }, [user]);

    const fetchTaxSummary = async () => {
        console.log('Starting to fetch tax summary...');
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase
                .from('rentals')
                .select('total_amount, tax_amount')
                .eq('deleted', false);
            
            console.log('Supabase response:', { data, error });
            
            if (error) {
                console.error('Error fetching the tax summary', error);
                setError('Failed to fetch the tax information');
                return;
            }

            const totalRevenue = data?.reduce((sum, rental) => {
                return sum + (rental.total_amount || 0);
            }, 0) || 0;

            const totalTax = data?.reduce((sum, rental) => {
                return sum + (rental.tax_amount || 0)
            }, 0) || 0;

            setTaxSummary({
                totalRevenue,
                totalTax,
                recordCount: data?.length || 0
            });
            
            console.log('Tax summary set:', { totalRevenue, totalTax, recordCount: data?.length || 0 });

        } catch (err) {
            console.error('Error fetching tax summary:', err);
            setError('Failed to fetch the tax information');
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
                <AdminSidebar user={user} />
                <main className="flex-1 p-2 sm:p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-6">
                            <div className="mb-8">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-32 bg-gray-200 rounded"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
                <AdminSidebar user={user} />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600">Please sign in to access this page</p>
                    </div>
                </main>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
                <AdminSidebar user={user} />
                <main className="flex-1 p-2 sm:p-4 md:p-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse space-y-6">
                            <div className="mb-8">
                                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="h-32 bg-gray-200 rounded"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
 
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
            <AdminSidebar user={user} />
            <main className="flex-1 p-2 sm:p-4 md:p-8">
                <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Tax Information</h1>
                    <p className="text-gray-600">Revenue and tax summary for active rentals</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Revenue Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                                    <p className="text-sm text-gray-600">From {taxSummary.recordCount} active rentals</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
                                ${taxSummary.totalRevenue.toLocaleString('en-US', { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Total Tax Card */}
                    <Card className="shadow-lg">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Receipt className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Total Tax Collected</h3>
                                    <p className="text-sm text-gray-600">Sales tax from active rentals</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                ${taxSummary.totalTax.toLocaleString('en-US', { 
                                    minimumFractionDigits: 2, 
                                    maximumFractionDigits: 2 
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                </div>
            </main>
        </div>
    );
}