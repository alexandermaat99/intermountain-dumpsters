"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";
import { Dialog } from '@headlessui/react';
import Image from "next/image";
import AdminSidebar from "@/components/AdminSidebar";
import { User } from '@supabase/supabase-js';

interface DumpsterType {
  id: number;
  name: string;
  descriptor: string;
  price: number;
  image_path: string;
  description: string;
}

const SUPABASE_IMAGE_URL = "https://acsxwvvvlfajjizqwcia.supabase.co/storage/v1/object/public/dumpster-images/";

export default function AdminDumpsterTypesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [types, setTypes] = useState<DumpsterType[]>([]);
  const [loading, setLoading] = useState(true);
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
      fetchTypes();
    }
  }, [user]);

  const fetchTypes = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.from("dumpster_types").select("*").order("id");
    if (error) {
      setError("Failed to fetch dumpster types.");
    } else {
      setTypes(data || []);
    }
    setLoading(false);
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
      price: Number(form.price),
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 ml-2">Loading types...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : types.length === 0 ? (
            <div className="text-gray-500 text-center py-8">No dumpster types found.</div>
          ) : (
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
                    <div className="text-gray-700 text-sm mb-1">{type.description}</div>
                    <div className="text-blue-800 font-semibold">${type.price.toFixed(2)}</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="icon" variant="outline" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="destructive" aria-label="Delete">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 