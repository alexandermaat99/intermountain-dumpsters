'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import AdminSidebar from '@/components/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceArea, getServiceAreas, createServiceArea, updateServiceArea, deleteServiceArea, checkServiceAreaNameExists } from '@/lib/service-areas';
import { Loader2, MapPin, Plus, Edit, Trash2, Save, X, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ServiceAreasPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    local_tax_rate: 0,
  });

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

  // Load service areas when user is authenticated
  useEffect(() => {
    if (user) {
      loadServiceAreas();
    }
  }, [user]);

  const loadServiceAreas = async () => {
    try {
      const areas = await getServiceAreas();
      setServiceAreas(areas);
    } catch {
      // Silently handle error
    }
  };

  const handleCreate = () => {
    setCreating(true);
    setEditingId(null);
    setFormData({
      name: '',
      latitude: 0,
      longitude: 0,
      local_tax_rate: 0,
    });
    setError('');
    setSuccess('');
  };

  const handleEdit = (serviceArea: ServiceArea) => {
    setEditingId(serviceArea.id);
    setCreating(false);
    setFormData({
      name: serviceArea.name,
      latitude: serviceArea.latitude,
      longitude: serviceArea.longitude,
      local_tax_rate: serviceArea.local_tax_rate,
    });
    setError('');
    setSuccess('');
  };

  const handleCancel = () => {
    setCreating(false);
    setEditingId(null);
    setFormData({
      name: '',
      latitude: 0,
      longitude: 0,
      local_tax_rate: 0,
    });
    setError('');
    setSuccess('');
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError('Service area name is required.');
      return;
    }

    if (formData.local_tax_rate < 0 || formData.local_tax_rate > 100) {
      setError('Tax rate must be between 0 and 100.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Check if name already exists
      const nameExists = await checkServiceAreaNameExists(
        formData.name.trim(), 
        editingId || undefined
      );

      if (nameExists) {
        setError('A service area with this name already exists.');
        setSaving(false);
        return;
      }

      if (creating) {
        // Create new service area
        const newArea = await createServiceArea({
          name: formData.name.trim(),
          latitude: formData.latitude,
          longitude: formData.longitude,
          local_tax_rate: formData.local_tax_rate,
        });

        if (newArea) {
          setServiceAreas([...serviceAreas, newArea]);
          setCreating(false);
          setSuccess('Service area created successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to create service area. Please try again.');
        }
      } else if (editingId) {
        // Update existing service area
        const updatedArea = await updateServiceArea(editingId, {
          name: formData.name.trim(),
          latitude: formData.latitude,
          longitude: formData.longitude,
          local_tax_rate: formData.local_tax_rate,
        });

        if (updatedArea) {
          setServiceAreas(serviceAreas.map(area => 
            area.id === editingId ? updatedArea : area
          ));
          setEditingId(null);
          setSuccess('Service area updated successfully!');
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('Failed to update service area. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving service area:', error);
      setError('An error occurred while saving the service area. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete the service area "${name}"?`)) {
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const success = await deleteServiceArea(id);
      if (success) {
        setServiceAreas(serviceAreas.filter(area => area.id !== id));
        setSuccess('Service area deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete service area. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting service area:', error);
      setError('An error occurred while deleting the service area. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading service areas...</p>
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
                Please sign in to access the service areas
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service Areas</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage your service areas and local tax rates</p>
            </div>
            <Button 
              onClick={handleCreate}
              disabled={creating || editingId !== null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Service Area
            </Button>
          </div>

          {/* Create/Edit Form */}
          {(creating || editingId !== null) && (
            <Card className="w-full mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {creating ? 'Add New Service Area' : 'Edit Service Area'}
                </CardTitle>
                <CardDescription>
                  {creating ? 'Create a new service area with location and tax rate' : 'Update service area information'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Service Area Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Salt Lake City, Provo, Ogden"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="local_tax_rate">Local Tax Rate (%)</Label>
                    <Input
                      id="local_tax_rate"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.local_tax_rate}
                      onChange={(e) => setFormData({...formData, local_tax_rate: parseFloat(e.target.value) || 0})}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={formData.latitude}
                      onChange={(e) => setFormData({...formData, latitude: parseFloat(e.target.value) || 0})}
                      placeholder="40.7608"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={formData.longitude}
                      onChange={(e) => setFormData({...formData, longitude: parseFloat(e.target.value) || 0})}
                      placeholder="-111.8910"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {creating ? 'Create Service Area' : 'Save Changes'}
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Service Areas List */}
          <div className="w-full">
            {serviceAreas.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Service Areas</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first service area.</p>
                <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Service Area
                </Button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4 min-w-[120px]">
                            Service Area
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8 min-w-[80px]">
                            Tax Rate
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 min-w-[110px]">
                            Latitude
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6 min-w-[110px]">
                            Longitude
                          </th>
                          <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/8 min-w-[80px]">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {serviceAreas.map((area) => (
                          <tr key={area.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{area.name}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{(area.local_tax_rate * 100).toFixed(2)}%</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{area.latitude.toFixed(6)}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{area.longitude.toFixed(6)}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleEdit(area)}
                                  disabled={creating || editingId !== null}
                                  className="text-blue-600 hover:text-blue-900 h-8 w-8 p-0"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleDelete(area.id, area.name)}
                                  disabled={saving}
                                  className="text-red-600 hover:text-red-900 h-8 w-8 p-0"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile List */}
                <div className="md:hidden space-y-3">
                  {serviceAreas.map((area) => (
                    <div key={area.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{area.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Tax Rate: {(area.local_tax_rate * 100).toFixed(2)}%
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(area)}
                            disabled={creating || editingId !== null}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(area.id, area.name)}
                            disabled={saving}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Coordinates:</span>
                        <div className="text-xs mt-1">
                          {area.latitude.toFixed(6)}, {area.longitude.toFixed(6)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mt-6 text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
              {success}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 