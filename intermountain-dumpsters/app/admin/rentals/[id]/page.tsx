'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, ArrowLeft, ShieldCheck, AlertTriangle, Clipboard, Check } from 'lucide-react';

export default function RentalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [rental, setRental] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [availableDumpsters, setAvailableDumpsters] = useState<({ id: number; identification: string; dumpster_type_id: number; status?: 'assigned' | 'in_use' })[]>([]);
  const [loadingDumpsters, setLoadingDumpsters] = useState(false);

  // Driver update state
  const [driverFields, setDriverFields] = useState({
    dumpster_id: '',
    date_picked_up: '',
    drop_weight: '',
    days_dropped: '',
    delivered: false,
  });
  const [daysAutoCalculated, setDaysAutoCalculated] = useState(false);

  // Other Info section state
  const [otherInfoEdit, setOtherInfoEdit] = useState(false);
  const [otherInfoFields, setOtherInfoFields] = useState({
    delivery_date_requested: '',
    cancelation_insurance: false,
    driveway_insurance: false,
    emergency_delivery: false,
  });

  // Add state for copy feedback
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchRental();
    // eslint-disable-next-line
  }, [id]);

  const fetchRental = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('rentals')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      setError('Could not fetch rental.');
    } else {
      setRental(data);
      setDriverFields({
        dumpster_id: data.dumpster_id ?? '',
        date_picked_up: data.date_picked_up ? data.date_picked_up.split('T')[0] : '',
        drop_weight: data.drop_weight ?? '',
        days_dropped: data.days_dropped ?? '',
        delivered: !!data.delivered,
      });
      setOtherInfoFields({
        delivery_date_requested: data.delivery_date_requested ? data.delivery_date_requested.split('T')[0] : '',
        cancelation_insurance: !!data.cancelation_insurance,
        driveway_insurance: !!data.driveway_insurance,
        emergency_delivery: !!data.emergency_delivery,
      });
      // Reset auto-calculated flag when loading data
      setDaysAutoCalculated(false);
      
      // Fetch available dumpsters for this rental's dumpster type
      if (data.dumpster_type_id) {
        await fetchAvailableDumpsters(data.dumpster_type_id);
      }
    }
    setLoading(false);
  };

  const fetchAvailableDumpsters = async (dumpsterTypeId: number) => {
    setLoadingDumpsters(true);
    try {
      // Fetch all dumpsters of this type
      const { data, error } = await supabase
        .from('dumpsters')
        .select('id, identification, dumpster_type_id')
        .eq('dumpster_type_id', dumpsterTypeId)
        .order('identification');
      if (error) {
        console.error('Error fetching dumpsters:', error);
        setAvailableDumpsters([]);
      } else {
        // Fetch status for these dumpsters
        const ids = (data || []).map(d => d.id);
        const statusMap: Record<number, 'assigned' | 'in_use' | undefined> = {};
        if (ids.length > 0) {
          const { data: rentals } = await supabase
            .from('rentals')
            .select('dumpster_id, delivered, picked_up')
            .in('dumpster_id', ids);
          if (rentals) {
            rentals.forEach(rental => {
              if (rental.delivered === true && rental.picked_up !== true) {
                statusMap[rental.dumpster_id] = 'in_use';
              } else if (rental.delivered === false && rental.picked_up !== true) {
                statusMap[rental.dumpster_id] = 'assigned';
              }
            });
          }
        }
        setAvailableDumpsters((data || []).map(d => ({ ...d, status: statusMap[d.id] })));
      }
    } catch (err) {
      console.error('Error fetching dumpsters:', err);
      setAvailableDumpsters([]);
    } finally {
      setLoadingDumpsters(false);
    }
  };

  // Driver update handler
  const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setDriverFields((prev) => {
      const updatedFields = { ...prev, [name]: fieldValue };
      
      // Auto-calculate days dropped when pickup date is set
      if (name === 'date_picked_up') {
        if (value) {
          const deliveryDate = rental?.delivery_date_requested as string;
          if (deliveryDate) {
            // Create dates and set to midnight UTC to avoid timezone issues
            const delivery = new Date(deliveryDate + 'T00:00:00.000Z');
            const pickup = new Date(value + 'T00:00:00.000Z');
            
            // Calculate difference in days
            const timeDiff = pickup.getTime() - delivery.getTime();
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            // Only auto-fill if the calculation is valid (positive number)
            if (daysDiff >= 0) {
              updatedFields.days_dropped = daysDiff.toString();
              setDaysAutoCalculated(true);
            }
          }
        } else {
          // Clear auto-calculated flag if pickup date is cleared
          setDaysAutoCalculated(false);
        }
      }
      
      // Reset auto-calculated flag if days_dropped is manually edited
      if (name === 'days_dropped') {
        setDaysAutoCalculated(false);
      }
      
      return updatedFields;
    });
  };

  const handleDriverSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    const { dumpster_id, date_picked_up, drop_weight, days_dropped, delivered } = driverFields;
    // Ensure booleans are always true/false
    const deliveredBool = typeof delivered === 'string' ? delivered === 'true' : !!delivered;
    const picked_up = drop_weight && Number(drop_weight) > 0;
    
    const updateData = {
      dumpster_id: dumpster_id === '' ? null : parseInt(dumpster_id, 10),
      date_picked_up: date_picked_up ? `${date_picked_up}T00:00:00.000Z` : null,
      drop_weight: drop_weight === '' ? null : Number(drop_weight),
      days_dropped: days_dropped === '' ? null : Number(days_dropped),
      delivered: deliveredBool,
      picked_up: !!picked_up,
    };
    
    console.log('Updating rental with data:', updateData);
    
    const { error } = await supabase
      .from('rentals')
      .update(updateData)
      .eq('id', id);
      
    if (error) {
      console.error('Update error:', error);
      setError(`Failed to update: ${error.message}`);
    } else {
      setSuccess('Updated!');
      setDaysAutoCalculated(false);
      // Redirect back to admin rentals page after successful save
      setTimeout(() => {
        router.push('/admin/rentals');
      }, 1000); // 1 second delay to show success message
    }
    setSaving(false);
  };

  // Other Info section handlers
  const handleOtherInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setOtherInfoFields((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  const handleOtherInfoEdit = () => {
    setOtherInfoEdit(true);
    setSuccess('');
    setError('');
  };
  const handleOtherInfoCancel = () => {
    setOtherInfoEdit(false);
    setOtherInfoFields({
      delivery_date_requested: (rental?.delivery_date_requested as string)?.split('T')[0] || '',
      cancelation_insurance: !!rental?.cancelation_insurance,
      driveway_insurance: !!rental?.driveway_insurance,
      emergency_delivery: !!rental?.emergency_delivery,
    });
  };
  const handleOtherInfoSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    const { delivery_date_requested, cancelation_insurance, driveway_insurance, emergency_delivery } = otherInfoFields;
    
    const updateData = {
      delivery_date_requested: delivery_date_requested ? `${delivery_date_requested}T00:00:00.000Z` : null,
      cancelation_insurance,
      driveway_insurance,
      emergency_delivery,
    };
    
    console.log('Updating other info with data:', updateData);
    
    const { error } = await supabase
      .from('rentals')
      .update(updateData)
      .eq('id', id);
      
    if (error) {
      console.error('Update error:', error);
      setError(`Failed to update: ${error.message}`);
    } else {
      setSuccess('Updated!');
      setOtherInfoEdit(false);
      fetchRental();
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (!rental) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">Rental not found.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-2 sm:p-6">
      <div className="w-full max-w-xl">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="font-semibold text-xl tracking-tight">Rental #{rental && (rental.id as React.ReactNode)}</span>
        </div>
        <Card className="shadow-xl rounded-2xl border border-gray-100">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 text-base text-gray-500 font-medium truncate">
              {rental && (rental.delivery_address as React.ReactNode)}
              <button
                type="button"
                onClick={async () => {
                  if (rental?.delivery_address) {
                    await navigator.clipboard.writeText(rental.delivery_address as string);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1200);
                  }
                }}
                className="ml-2 p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Copy address"
              >
                {copied ? <Check className="h-4 w-4 text-green-600" /> : <Clipboard className="h-4 w-4 text-gray-600" />}
              </button>
              {copied && <span className="text-xs text-green-600 ml-1">Copied!</span>}
            </div>
          </CardHeader>
          <CardContent className="space-y-10 p-6">
            {/* DRIVER UPDATE SECTION */}
            <form onSubmit={handleDriverSave} className="bg-blue-50/60 border border-blue-100 rounded-xl p-5 flex flex-col gap-4 mb-4 shadow-sm">
              <div className="mb-2">
                <span className="font-semibold text-blue-900 text-lg">Driver Update</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    name="delivered"
                    checked={driverFields.delivered}
                    onChange={handleDriverChange}
                    className="h-4 w-4 accent-blue-600 mr-2"
                    id="delivered-checkbox"
                  />
                  <label htmlFor="delivered-checkbox" className="text-sm font-semibold text-gray-700">Dropped Off</label>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Dumpster ID</label>
                  {loadingDumpsters ? (
                    <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-md bg-gray-50">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Loading dumpsters...</span>
                    </div>
                  ) : (
                    <select
                      name="dumpster_id"
                      value={driverFields.dumpster_id}
                      onChange={handleDriverChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Unassigned</option>
                      {availableDumpsters.map((dumpster) => (
                        <option key={dumpster.id} value={dumpster.id} disabled={dumpster.status === 'in_use' && String(driverFields.dumpster_id) !== String(dumpster.id)}>
                          {dumpster.identification}
                          {dumpster.status === 'in_use' ? ' (In Use)' : dumpster.status === 'assigned' ? ' (Assigned)' : ''}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Pickup Date</label>
                  <Input
                    type="date"
                    name="date_picked_up"
                    value={driverFields.date_picked_up}
                    onChange={handleDriverChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Drop Weight (lbs)</label>
                  <Input
                    type="number"
                    name="drop_weight"
                    value={driverFields.drop_weight}
                    onChange={handleDriverChange}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">Days Dropped</label>
                  <Input
                    type="number"
                    name="days_dropped"
                    value={driverFields.days_dropped}
                    onChange={handleDriverChange}
                    min={0}
                    step={1}
                  />
                  {daysAutoCalculated && (
                    <p className="text-xs text-blue-600 mt-1">
                      ✓ Auto-calculated from pickup date
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" disabled={saving} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold shadow">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save
                </Button>
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {success && <div className="text-green-600 text-sm">{success}</div>}
            </form>

            {/* OTHER INFO SECTION */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center mb-3">
                <div className="font-semibold text-gray-900 text-lg mr-2">Other Info</div>
                {!otherInfoEdit && (
                  <Button size="icon" variant="ghost" onClick={handleOtherInfoEdit} aria-label="Edit Other Info">
                    <Pencil />
                  </Button>
                )}
              </div>
              <div className="flex flex-col gap-3 divide-y divide-gray-100">
                {/* Delivery Date */}
                <div className="flex items-center gap-2 py-2 first:pt-0">
                  <span className="w-40 text-gray-600 font-medium">Delivery Date:</span>
                  {otherInfoEdit ? (
                    <Input
                      type="date"
                      name="delivery_date_requested"
                      value={otherInfoFields.delivery_date_requested}
                      onChange={handleOtherInfoChange}
                      className="max-w-xs"
                    />
                  ) : (
                    <span className="text-gray-900">{otherInfoFields.delivery_date_requested || 'N/A'}</span>
                  )}
                </div>
                {/* Insurance toggles */}
                <div className="flex items-center gap-2 py-2">
                  <span className="w-40 text-gray-600 font-medium">Cancellation Insurance:</span>
                  {otherInfoEdit ? (
                    <input
                      type="checkbox"
                      name="cancelation_insurance"
                      checked={otherInfoFields.cancelation_insurance}
                      onChange={handleOtherInfoChange}
                      className="h-4 w-4 accent-blue-600"
                    />
                  ) : (
                    otherInfoFields.cancelation_insurance ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs">
                        <ShieldCheck className="h-4 w-4" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-900">No</span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 py-2">
                  <span className="w-40 text-gray-600 font-medium">Driveway Insurance:</span>
                  {otherInfoEdit ? (
                    <input
                      type="checkbox"
                      name="driveway_insurance"
                      checked={otherInfoFields.driveway_insurance}
                      onChange={handleOtherInfoChange}
                      className="h-4 w-4 accent-blue-600"
                    />
                  ) : (
                    otherInfoFields.driveway_insurance ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-800 font-semibold text-xs">
                        <ShieldCheck className="h-4 w-4" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-900">No</span>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 py-2">
                  <span className="w-40 text-gray-600 font-medium">Emergency Delivery:</span>
                  {otherInfoEdit ? (
                    <input
                      type="checkbox"
                      name="emergency_delivery"
                      checked={otherInfoFields.emergency_delivery}
                      onChange={handleOtherInfoChange}
                      className="h-4 w-4 accent-blue-600"
                    />
                  ) : (
                    otherInfoFields.emergency_delivery ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-800 font-semibold text-xs">
                        <AlertTriangle className="h-4 w-4" /> Yes
                      </span>
                    ) : (
                      <span className="text-gray-900">No</span>
                    )
                  )}
                </div>
                {otherInfoEdit && (
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={handleOtherInfoSave} disabled={saving} className="bg-blue-700 hover:bg-blue-800 text-white font-semibold">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleOtherInfoCancel}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 