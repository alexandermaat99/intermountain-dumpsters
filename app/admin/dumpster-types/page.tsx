"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";
import { Dialog } from '@headlessui/react';
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Label } from "@/components/ui/label";

interface DumpsterType {
  id: number;
  name: string;
  descriptor: string;
  price: number;
  image_path: string;
  description: string;
  long_description: string;
  length: number;
  width: number;
  height: number;
  uses: string;
}

const SUPABASE_IMAGE_URL = "https://acsxwvvvlfajjizqwcia.supabase.co/storage/v1/object/public/dumpster-images/";

export default function AdminDumpsterTypesPage() {
  const { user, loading } = useAuth();
  const [types, setTypes] = useState<DumpsterType[]>([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    descriptor: '',
    length: '',
    width: '',
    height: '',
    uses: '',
    price: '',
    long_description: '',
    description: '',
    image: null as File | null,
  });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<DumpsterType | null>(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    price: '', 
    descriptor: '', 
    long_description: '', 
    length: '',
    width: '',
    height: '',
    uses: '',
    image: null as File | null 
  });
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTypes();
    }
  }, [user]);

  const fetchTypes = async () => {
    setError("");
    const { data, error } = await supabase.from("dumpster_types").select("*").order("id");
    if (error) {
      setError("Failed to fetch dumpster types.");
    } else {
      setTypes(data || []);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, image: (e.target as HTMLInputElement).files?.[0] || null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    let image_path = '';
    if (form.image) {
      const fileExt = form.image.name.split('.').pop();
      const fileName = `${Date.now()}-${form.name.replace(/\s+/g, '-')}.${fileExt}`;
      const { data, error } = await supabase.storage.from('dumpster-images').upload(fileName, form.image);
      if (error) {
        setFormError('Failed to upload image.');
        setFormLoading(false);
        return;
      }
      image_path = data.path;
    }
    const { error: insertError } = await supabase.from('dumpster_types').insert({
      name: form.name,
      descriptor: form.descriptor,
      length: Number(form.length),
      width: Number(form.width),
      height: Number(form.height),
      uses: form.uses,
      image_path,
      price: Math.round(parseFloat(form.price) * 100) / 100,
      long_description: form.long_description,
    });
    if (insertError) {
      setFormError('Failed to add dumpster type.');
      setFormLoading(false);
      return;
    }
    setShowModal(false);
    setForm({ name: '', descriptor: '', length: '', width: '', height: '', uses: '', price: '', long_description: '', description: '', image: null });
    setFormLoading(false);
    fetchTypes();
  };

  const getImageUrl = (image_path: string | undefined) => {
    if (!image_path) return "/placeholder.png";
    if (image_path.startsWith("http")) return image_path;
    if (/\.(png|jpe?g|webp|gif|svg)$/i.test(image_path)) return SUPABASE_IMAGE_URL + image_path;
    return "/" + image_path;
  };

  const openEditModal = (type: DumpsterType) => {
    setEditType(type);
    setEditForm({
      name: type.name,
      length: String(type.length),
      width: String(type.width),
      height: String(type.height),
      uses: type.uses,
      price: (Math.round(type.price * 100) / 100).toFixed(2),
      descriptor: type.descriptor,
      long_description: type.long_description || '',
      image: null,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditType(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setEditForm(f => ({ ...f, image: (e.target as HTMLInputElement).files?.[0] || null }));
    } else {
      setEditForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    if (!editType) return;
    setEditLoading(true);
    let image_path = editType.image_path;
    if (editForm.image) {
      const fileExt = editForm.image.name.split('.').pop();
      const fileName = `${Date.now()}-${editForm.name.replace(/\s+/g, '-')}.${fileExt}`;
      const cleanFileName = fileName.replace(/^\/+/, '');
      const { data, error } = await supabase.storage
        .from('dumpster-images')
        .upload(cleanFileName, editForm.image, { upsert: true });
      if (error) {
        setEditError('Image upload failed: ' + error.message);
        setEditLoading(false);
        return;
      }
      if (data?.path) {
        image_path = data.path;
      }
    }
    await supabase.from('dumpster_types').update({
      name: editForm.name,
      price: Math.round(parseFloat(editForm.price) * 100) / 100,
      descriptor: editForm.descriptor,
      long_description: editForm.long_description,
      length: Number(editForm.length),
      width: Number(editForm.width),
      height: Number(editForm.height),
      uses: editForm.uses,
      image_path,
    }).eq('id', editType.id);
    setEditLoading(false);
    closeEditModal();
    fetchTypes();
  };

  const handleDelete = async (id: number) => {
    setDeleteError(null);
    
    try {
      // First, check if there are any dumpsters using this type
      const { data: dumpstersData, error: dumpstersError } = await supabase
        .from('dumpsters')
        .select('id')
        .eq('dumpster_type_id', id);
      
      if (dumpstersError) {
        throw new Error('Failed to check for related dumpsters');
      }
      
      if (dumpstersData && dumpstersData.length > 0) {
        setDeleteError('Cannot delete this dumpster type because there are dumpsters assigned to it. Please remove or reassign those dumpsters first.');
        return;
      }
      
      // Check if there are any active (non-archived, non-deleted) rentals using this type
      const { data: activeRentalsData, error: activeRentalsError } = await supabase
        .from('rentals')
        .select('id')
        .eq('dumpster_type_id', id)
        .eq('deleted', false)
        .eq('archived', false);
      
      if (activeRentalsError) {
        throw new Error('Failed to check for related rentals');
      }
      
      if (activeRentalsData && activeRentalsData.length > 0) {
        setDeleteError('Cannot delete this dumpster type because there are active rentals using it. Please archive or delete those rentals first.');
        return;
      }
      
      // Check how many archived/deleted rentals will be affected
      const { data: archivedRentalsData, error: archivedRentalsError } = await supabase
        .from('rentals')
        .select('id')
        .eq('dumpster_type_id', id)
        .or('deleted.eq.true,archived.eq.true');
      
      if (archivedRentalsError) {
        throw new Error('Failed to check for archived rentals');
      }
      
      const archivedRentalsCount = archivedRentalsData?.length || 0;
      
      // Show detailed confirmation
      let confirmMessage = 'Are you sure you want to delete this dumpster type?';
      if (archivedRentalsCount > 0) {
        confirmMessage += `\n\nThis will also remove the dumpster type reference from ${archivedRentalsCount} archived or deleted rental(s).`;
      }
      confirmMessage += '\n\nThis action cannot be undone.';
      
      if (!confirm(confirmMessage)) {
        return;
      }
      
      setDeleteLoading(id);
      
      // Before deleting, set dumpster_type_id to NULL for all rentals (including archived/deleted)
      // This is necessary to satisfy the foreign key constraint
      if (archivedRentalsCount > 0) {
        const { error: updateRentalsError } = await supabase
          .from('rentals')
          .update({ dumpster_type_id: null })
          .eq('dumpster_type_id', id);
        
        if (updateRentalsError) {
          throw new Error('Failed to update related rentals: ' + updateRentalsError.message);
        }
      }
      
      // Now proceed with deletion
      const { error: deleteError } = await supabase
        .from('dumpster_types')
        .delete()
        .eq('id', id);
      
      if (deleteError) {
        throw new Error(deleteError.message || 'Failed to delete dumpster type');
      }
      
      // Success - refresh the list
      await fetchTypes();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete dumpster type');
      console.error('Error deleting dumpster type:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        <AdminSidebar user={user} />
        <main className="flex-1 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">Access denied. Please sign in as an admin.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      <AdminSidebar user={user} />
      <main className="flex-1 flex flex-col items-center p-2 sm:p-6">
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dumpster Types</h1>
            <Button variant="default" className="flex items-center gap-2" onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" /> Add New Type
            </Button>
          </div>
          {/* Modal for Add New Type */}
          <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10">
              <Dialog.Title className="text-lg font-bold mb-4">Add New Dumpster Type</Dialog.Title>
              <form onSubmit={handleAddType} className="flex flex-col gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  required
                />
                <input
                  type="text"
                  name="descriptor"
                  placeholder="Descriptor"
                  value={form.descriptor}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  required
                />
                <input
                  type="number"
                  name="length"
                  placeholder="Length (ft)"
                  value={form.length}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  min={0}
                  step={0.01}
                  required
                />
                <input
                  type="number"
                  name="width"
                  placeholder="Width (ft)"
                  value={form.width}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  min={0}
                  step={0.01}
                  required
                />
                <input
                  type="number"
                  name="height"
                  placeholder="Height (ft)"
                  value={form.height}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  min={0}
                  step={0.01}
                  required
                />
                <input
                  type="text"
                  name="uses"
                  placeholder="Best for (uses)"
                  value={form.uses}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  required
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  min={0}
                  step={0.01}
                  required
                />
                <textarea
                  name="long_description"
                  placeholder="Long Description"
                  value={form.long_description}
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  required
                />
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleFormChange}
                  className="border rounded p-2"
                  required
                />
                {formError && <div className="text-red-600 text-sm">{formError}</div>}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowModal(false)} disabled={formLoading}>Cancel</Button>
                  <Button type="submit" disabled={formLoading}>{formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Add Type'}</Button>
                </div>
              </form>
            </Dialog.Panel>
          </Dialog>
          {/* Edit Modal */}
          <Dialog open={editModalOpen} onClose={closeEditModal} className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <Dialog.Panel className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
              <Dialog.Title className="text-lg font-bold mb-4">Edit Dumpster Type</Dialog.Title>
              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <input id="edit-name" type="text" name="name" value={editForm.name} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-descriptor">Descriptor</Label>
                  <input id="edit-descriptor" type="text" name="descriptor" value={editForm.descriptor} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Descriptor" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <input id="edit-price" type="number" name="price" value={editForm.price} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Price" min={0} step={0.01} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-length">Length (ft)</Label>
                  <input id="edit-length" type="number" name="length" value={editForm.length} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Length" min={0} step={0.01} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-width">Width (ft)</Label>
                  <input id="edit-width" type="number" name="width" value={editForm.width} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Width" min={0} step={0.01} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-height">Height (ft)</Label>
                  <input id="edit-height" type="number" name="height" value={editForm.height} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Height" min={0} step={0.01} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-uses">Best for (uses)</Label>
                  <input id="edit-uses" type="text" name="uses" value={editForm.uses} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Best for" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-long-description">Long Description</Label>
                  <textarea id="edit-long-description" name="long_description" value={editForm.long_description} onChange={handleEditChange} className="border rounded p-2 w-full" placeholder="Long Description" rows={3} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-image">Photo</Label>
                  {/* Show current image preview */}
                  {editType?.image_path && (
                    <Image 
                      src={editType.image_path.startsWith('http') ? editType.image_path : `https://acsxwvvvlfajjizqwcia.supabase.co/storage/v1/object/public/dumpster-images/${editType.image_path}`} 
                      alt="Current" 
                      width={128}
                      height={80}
                      className="w-32 h-20 object-cover rounded mb-2 border" 
                    />
                  )}
                  {/* Show new image preview if selected */}
                  {editForm.image && (
                    <Image 
                      src={URL.createObjectURL(editForm.image)} 
                      alt="New" 
                      width={128}
                      height={80}
                      className="w-32 h-20 object-cover rounded mb-2 border" 
                    />
                  )}
                  <input id="edit-image" type="file" name="image" accept="image/*" onChange={handleEditChange} className="border rounded p-2 w-full" />
                </div>
                {editError && (
                  <div className="text-red-600 text-sm bg-red-50 p-2 rounded border">{editError}</div>
                )}
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={closeEditModal} disabled={editLoading}>Cancel</Button>
                  <Button type="submit" disabled={editLoading}>{editLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
                </div>
              </form>
            </Dialog.Panel>
          </Dialog>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : types.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No dumpster types found.</div>
          ) : (
            <>
              {deleteError && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <p className="font-semibold">Error deleting dumpster type:</p>
                  <p>{deleteError}</p>
                  <button
                    onClick={() => setDeleteError(null)}
                    className="mt-2 text-sm underline hover:no-underline"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            <div className="grid gap-4">
              {types.map((type) => (
                <Card key={type.id} className="flex flex-row items-center gap-4 p-4">
                  <Image
                    src={getImageUrl(type.image_path)}
                    alt={`Image of ${type.name}`}
                    width={160}
                    height={160}
                    className="w-40 h-40 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-lg text-gray-900">{type.name}</div>
                    <div className="text-gray-600 text-sm mb-1">{type.descriptor}</div>
                    <div className="text-blue-800 font-semibold">${type.price.toFixed(2)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="icon" variant="outline" aria-label="Edit" onClick={() => openEditModal(type)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" aria-label="Delete" onClick={() => handleDelete(type.id)} disabled={deleteLoading === type.id}>
                      {deleteLoading === type.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
} 