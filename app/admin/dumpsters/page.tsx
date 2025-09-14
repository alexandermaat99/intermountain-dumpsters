"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Trash, Package, AlertCircle, Edit2, Save, X } from "lucide-react";
import { Dialog } from '@headlessui/react';
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/lib/contexts/AuthContext";

interface DumpsterType {
  id: number;
  name: string;
  descriptor: string;
  price: number;
  image_path: string;
  dumpster_count: number;
}

interface Dumpster {
  id: number;
  identification: string;
  dumpster_type_id: number;
  created_at: string;
  is_in_use?: boolean;
}

export default function AdminDumpstersPage() {
  const { user, loading } = useAuth();
  const [dumpsterTypes, setDumpsterTypes] = useState<DumpsterType[]>([]);
  const [dumpsters, setDumpsters] = useState<Dumpster[]>([]);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [identification, setIdentification] = useState("");
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  // Edit state
  const [editingDumpster, setEditingDumpster] = useState<number | null>(null);
  const [editIdentification, setEditIdentification] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setPageLoading(true);
    setError("");
    
    try {
      // Fetch dumpster types with count of dumpsters
      const { data: typesData, error: typesError } = await supabase
        .from("dumpster_types")
        .select(`
          *,
          dumpsters(count)
        `)
        .order("id");

      if (typesError) {
        throw new Error("Failed to fetch dumpster types.");
      }

      // Transform the data to include dumpster count
      const typesWithCount = (typesData || []).map((type: DumpsterType & { dumpsters?: { count: number }[] }) => ({
        ...type,
        dumpster_count: type.dumpsters?.[0]?.count || 0
      }));

      setDumpsterTypes(typesWithCount);

      // Fetch all dumpsters
      const { data: dumpstersData, error: dumpstersError } = await supabase
        .from("dumpsters")
        .select("*")
        .order("identification");

      if (dumpstersError) {
        throw new Error("Failed to fetch dumpsters.");
      }

      // Fetch active rentals to see which dumpsters are in use
      const { data: activeRentals, error: rentalsError } = await supabase
        .from("rentals")
        .select("dumpster_id, delivered, picked_up")
        .not("dumpster_id", "is", null);

      if (!rentalsError && activeRentals) {
        // Only mark as in use if delivered is true and picked_up is not true
        const inUseDumpsterIds = new Set(
          activeRentals
            .filter(rental => rental.delivered === true && rental.picked_up !== true)
            .map(rental => rental.dumpster_id)
        );
        const dumpstersWithStatus = (dumpstersData || []).map((dumpster: Dumpster) => ({
          ...dumpster,
          is_in_use: inUseDumpsterIds.has(dumpster.id)
        }));
        setDumpsters(dumpstersWithStatus);
      } else {
        setDumpsters(dumpstersData || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setPageLoading(false);
    }
  };

  const handleAddDumpster = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    if (!selectedTypeId) {
      setFormError('Please select a dumpster type');
      setFormLoading(false);
      return;
    }

    if (!identification.trim()) {
      setFormError('Please enter an identification number');
      setFormLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('dumpsters')
        .insert({
          identification: identification.trim(),
          dumpster_type_id: selectedTypeId,
        });

      if (insertError) {
        throw new Error('Failed to add dumpster');
      }

      setShowAddModal(false);
      setIdentification("");
      setSelectedTypeId(null);
      setFormError('');
      
      // Refresh the data
      await fetchData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to add dumpster');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteDumpster = async (dumpsterId: number) => {
    const dumpster = dumpsters.find(d => d.id === dumpsterId);
    
    if (dumpster?.is_in_use) {
      setError('Cannot delete a dumpster that is currently in use');
      return;
    }

    if (!confirm('Are you sure you want to delete this dumpster?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('dumpsters')
        .delete()
        .eq('id', dumpsterId);

      if (error) {
        throw new Error('Failed to delete dumpster');
      }

      // Refresh the data
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dumpster');
    }
  };

  const handleEditDumpster = (dumpster: Dumpster) => {
    setEditingDumpster(dumpster.id);
    setEditIdentification(dumpster.identification);
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingDumpster(null);
    setEditIdentification('');
    setEditError('');
  };

  const handleSaveEdit = async (dumpsterId: number) => {
    if (!editIdentification.trim()) {
      setEditError('Identification cannot be empty');
      return;
    }

    setEditLoading(true);
    setEditError('');

    try {
      const { error } = await supabase
        .from('dumpsters')
        .update({ identification: editIdentification.trim() })
        .eq('id', dumpsterId);

      if (error) {
        throw new Error('Failed to update dumpster');
      }

      setEditingDumpster(null);
      setEditIdentification('');
      
      // Refresh the data
      await fetchData();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Failed to update dumpster');
    } finally {
      setEditLoading(false);
    }
  };

  const getDumpstersByType = (typeId: number) => {
    return dumpsters.filter(dumpster => dumpster.dumpster_type_id === typeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Access denied. Please sign in as an admin.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <main className="flex-1 flex flex-col items-center p-2 sm:p-6">
        <div className="w-full max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dumpster Inventory</h1>
              <p className="text-gray-600 mt-1">Manage your dumpster fleet and track inventory by type</p>
            </div>
            <Button 
              variant="default" 
              className="flex items-center gap-2" 
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4" /> Add Dumpster
            </Button>
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}

          {pageLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 ml-2">Loading inventory...</p>
            </div>
          ) : dumpsterTypes.length === 0 ? (
            <div className="text-gray-500 text-center py-8">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No dumpster types found. Please add dumpster types first.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {dumpsterTypes.map((type) => (
                <Card key={type.id} className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{type.name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{type.dumpster_count}</div>
                        <div className="text-sm text-gray-500">Total Units</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {type.dumpster_count === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No dumpsters of this type in inventory</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700 mb-3">Individual Units:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                          {getDumpstersByType(type.id).map((dumpster) => (
                            <div
                              key={dumpster.id}
                              className={`p-2 rounded border text-sm ${
                                dumpster.is_in_use 
                                  ? 'bg-yellow-50 border-yellow-200' 
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              {editingDumpster === dumpster.id ? (
                                // Edit mode
                                <div className="space-y-2">
                                  <Input
                                    value={editIdentification}
                                    onChange={(e) => setEditIdentification(e.target.value)}
                                    className="h-7 text-xs font-mono border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Enter ID"
                                    autoFocus
                                  />
                                  {editError && (
                                    <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                                      {editError}
                                    </div>
                                  )}
                                  <div className="flex gap-1 justify-end">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                                      onClick={handleCancelEdit}
                                      disabled={editLoading}
                                    >
                                      <X className="h-3 w-3 mr-1" />
                                      Cancel
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleSaveEdit(dumpster.id)}
                                      disabled={editLoading}
                                    >
                                      {editLoading ? (
                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                      ) : (
                                        <Save className="h-3 w-3 mr-1" />
                                      )}
                                      Save
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                // View mode
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs">{dumpster.identification}</span>
                                    {dumpster.is_in_use && (
                                      <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                        In Use
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-md"
                                      onClick={() => handleEditDumpster(dumpster)}
                                      disabled={dumpster.is_in_use}
                                      title={dumpster.is_in_use ? "Cannot edit dumpster that is currently in use" : "Edit dumpster"}
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                                      onClick={() => handleDeleteDumpster(dumpster.id)}
                                      disabled={dumpster.is_in_use}
                                      title={dumpster.is_in_use ? "Cannot delete dumpster that is currently in use" : "Delete dumpster"}
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Add Dumpster Modal */}
          <Dialog 
            open={showAddModal} 
            onClose={() => setShowAddModal(false)} 
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
              <Dialog.Title className="text-lg font-bold mb-4">Add New Dumpster</Dialog.Title>
              <form onSubmit={handleAddDumpster} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dumpster-type">Dumpster Type</Label>
                  <select
                    id="dumpster-type"
                    value={selectedTypeId || ''}
                    onChange={(e) => setSelectedTypeId(Number(e.target.value) || null)}
                    className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a dumpster type</option>
                    {dumpsterTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="identification">Identification Number</Label>
                  <Input
                    id="identification"
                    type="text"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    placeholder="e.g., D001, D002"
                    required
                  />
                </div>

                {formError && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded border">
                    {formError}
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddModal(false)} 
                    disabled={formLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={formLoading}
                    className="flex items-center gap-2"
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add Dumpster
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Dialog.Panel>
          </Dialog>
        </div>
      </main>
    </div>
  );
} 