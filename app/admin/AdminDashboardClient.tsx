"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, Users, Home } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import PropertyModal from "@/components/PropertyModal";

export default function AdminDashboardClient({ initialListings, initialLeads }: { initialListings: any[], initialLeads: any[] }) {
  const [activeTab, setActiveTab] = useState<"properties" | "leads">("properties");
  const [listings, setListings] = useState(initialListings);
  const [leads, setLeads] = useState(initialLeads);
  const [editingListing, setEditingListing] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleDeleteListing = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    await supabase.from("listings").delete().eq("id", id);
    setListings(listings.filter((l) => l.id !== id));
  };

  const handleSaveListing = async () => {
    // Refresh listings from DB
    const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false });
    if (data) setListings(data);
    setShowModal(false);
    setEditingListing(null);
  };

  const openAddModal = () => {
    setEditingListing(null);
    setShowModal(true);
  };

  const openEditModal = (listing: any) => {
    setEditingListing(listing);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-[#e5e0d8] pb-4">
        <button
          onClick={() => setActiveTab("properties")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-t-lg transition-colors ${
            activeTab === "properties" ? "bg-white text-[#0f2d5c] border-t-2 border-t-[#C9A227] shadow-sm" : "text-[#64748b] hover:text-[#0f2d5c]"
          }`}
        >
          <Home size={18} /> Manage Properties
        </button>
        <button
          onClick={() => setActiveTab("leads")}
          className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-t-lg transition-colors ${
            activeTab === "leads" ? "bg-white text-[#0f2d5c] border-t-2 border-t-[#C9A227] shadow-sm" : "text-[#64748b] hover:text-[#0f2d5c]"
          }`}
        >
          <Users size={18} /> Leads Inbox
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e5e0d8]">
        {/* WARNING MESSAGE FOR PHASE 2 */}
        {listings.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
            <p className="font-bold mb-1">Database Connected</p>
            <p>
              Supabase is connected, but the properties table is empty. Click "Add New Property" to create your first listing.
            </p>
          </div>
        )}

        {activeTab === "properties" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2d5c]">Property Listings</h2>
              <button onClick={openAddModal} className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2">
                <Plus size={16} /> Add New Property
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e5e0d8] text-[#64748b] text-sm">
                    <th className="pb-3 font-semibold">Title</th>
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id || listing.slug} className="border-b border-[#e5e0d8] last:border-0 hover:bg-[#f8f7f4]/50">
                      <td className="py-4 font-medium text-[#1a1a1a]">{listing.title}</td>
                      <td className="py-4 text-sm text-[#64748b]">{listing.transaction} - {listing.type}</td>
                      <td className="py-4 text-sm text-[#1a1a1a] font-medium">{listing.price}</td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          {listing.isFeatured ? "Featured" : "Active"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 text-[#64748b]">
                          <button className="p-1.5 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded-md transition-colors" title="Edit Images">
                            <ImageIcon size={16} />
                          </button>
                          <button
                            className="p-1.5 hover:text-[#0f2d5c] hover:bg-[#0f2d5c]/10 rounded-md transition-colors"
                            title="Edit Details"
                            onClick={() => openEditModal(listing)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {listings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#64748b]">
                        No properties found. Add one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div>
            <h2 className="text-xl font-bold text-[#0f2d5c] mb-6">Recent Leads</h2>

            {leads.length === 0 ? (
              <div className="text-center py-12 text-[#64748b]">
                <Users size={32} className="mx-auto mb-3 opacity-50" />
                <p>No leads found in the database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#e5e0d8] text-[#64748b] text-sm">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Name</th>
                      <th className="pb-3 font-semibold">Contact</th>
                      <th className="pb-3 font-semibold">Requirement</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id} className="border-b border-[#e5e0d8] last:border-0 hover:bg-[#f8f7f4]/50">
                        <td className="py-4 text-sm text-[#64748b]">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 font-medium text-[#1a1a1a]">{lead.name}</td>
                        <td className="py-4 text-sm text-[#64748b]">
                          <div>{lead.phone}</div>
                          {lead.email && <div className="text-xs">{lead.email}</div>}
                        </td>
                        <td className="py-4 text-sm text-[#1a1a1a]">
                          <div className="line-clamp-2 max-w-xs">{lead.requirement}</div>
                          {lead.budget && <div className="text-xs text-[#C9A227] mt-1">Budget: {lead.budget}</div>}
                        </td>
                        <td className="py-4">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status || 'new'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <PropertyModal
          listing={editingListing}
          onClose={() => {
            setShowModal(false);
            setEditingListing(null);
          }}
          onSave={handleSaveListing}
        />
      )}
    </div>
  );
}