"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function PropertyModal({ 
  listing = null, 
  onClose, 
  onSave 
}: { 
  listing?: any, 
  onClose: () => void,
  onSave: () => void
}) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  
  // Basic form state
  const [formData, setFormData] = useState({
    title: listing?.title || "",
    slug: listing?.slug || "",
    type: listing?.type || "Apartment",
    transaction: listing?.transaction || "Sale",
    price: listing?.price || "",
    location_area: listing?.location_area || "",
    location_city: listing?.location_city || "Hyderabad",
    summary: listing?.summary || "",
    description: listing?.description || "",
    specs_bedrooms: listing?.specs_bedrooms || "",
    specs_bathrooms: listing?.specs_bathrooms || "",
    specs_area: listing?.specs_area || "",
    isFeatured: listing?.isFeatured || false,
    thumbnail: listing?.thumbnail || "/images/placeholder-apartment.jpg",
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // If editing, use upsert/update
      if (listing?.id) {
        await supabase.from("listings").update(formData).eq("id", listing.id);
      } else {
        await supabase.from("listings").insert([formData]);
      }
      onSave();
    } catch (error) {
      console.error(error);
      alert("Failed to save property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl my-8 relative">
        <div className="sticky top-0 bg-white border-b border-[#e5e0d8] p-5 rounded-t-xl flex justify-between items-center z-10">
          <h2 className="text-xl font-bold text-[#0f2d5c]">
            {listing ? "Edit Property" : "Add New Property"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">URL Slug</label>
              <input required name="slug" value={formData.slug} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" placeholder="e.g. 3bhk-kondapur" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg">
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Transaction</label>
              <select name="transaction" value={formData.transaction} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg">
                <option value="Sale">Sale</option>
                <option value="Rent">Rent</option>
                <option value="Lease">Lease</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Price Display</label>
              <input required name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" placeholder="₹52,000/month" />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 accent-[#C9A227]" />
                <span className="text-sm font-medium text-[#0f2d5c]">Featured Property</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Area / Locality</label>
              <input required name="location_area" value={formData.location_area} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" placeholder="e.g. Kondapur" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">City</label>
              <input required name="location_city" value={formData.location_city} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Bedrooms</label>
              <input type="number" name="specs_bedrooms" value={formData.specs_bedrooms} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Bathrooms</label>
              <input type="number" name="specs_bathrooms" value={formData.specs_bathrooms} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Area / Size</label>
              <input name="specs_area" value={formData.specs_area} onChange={handleChange} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" placeholder="e.g. 1,844 Sq. Ft." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Summary (Short)</label>
            <textarea required name="summary" value={formData.summary} onChange={handleChange} rows={2} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-[#0f2d5c]">Full Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows={4} className="w-full px-3 py-2 border border-[#e5e0d8] rounded-lg" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#e5e0d8]">
            <button type="button" onClick={onClose} className="px-5 py-2 rounded-lg border border-gray-300 font-medium">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
