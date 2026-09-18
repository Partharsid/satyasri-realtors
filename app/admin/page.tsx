"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Image as ImageIcon, Users, Home } from "lucide-react";
import listings from "@/data/listings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"properties" | "leads">("properties");

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
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg mb-6 text-sm">
          <p className="font-bold mb-1">Phase 2: Admin Panel Scaffold</p>
          <p>
            This is a UI scaffold for the Phase 2 Admin Panel. Currently, property data is loaded from the static data file. To make this fully functional, we will connect it to <strong>Supabase (PostgreSQL + Auth + Storage)</strong> in the next phase. Environment variables required for Phase 2: <code className="bg-white/50 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="bg-white/50 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </p>
        </div>

        {activeTab === "properties" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[#0f2d5c]">Property Listings</h2>
              <button className="btn-primary !py-2 !px-4 text-sm flex items-center gap-2">
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
                    <tr key={listing.slug} className="border-b border-[#e5e0d8] last:border-0 hover:bg-[#f8f7f4]/50">
                      <td className="py-4 font-medium text-[#1a1a1a]">{listing.title}</td>
                      <td className="py-4 text-sm text-[#64748b]">{listing.transaction} - {listing.type}</td>
                      <td className="py-4 text-sm text-[#1a1a1a] font-medium">{listing.price}</td>
                      <td className="py-4">
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                          Active
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 text-[#64748b]">
                          <button className="p-1.5 hover:text-[#C9A227] hover:bg-[#C9A227]/10 rounded-md transition-colors" title="Edit Images">
                            <ImageIcon size={16} />
                          </button>
                          <button className="p-1.5 hover:text-[#0f2d5c] hover:bg-[#0f2d5c]/10 rounded-md transition-colors" title="Edit Details">
                            <Edit size={16} />
                          </button>
                          <button className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "leads" && (
          <div>
            <h2 className="text-xl font-bold text-[#0f2d5c] mb-6">Recent Leads</h2>
            <div className="text-center py-12 text-[#64748b]">
              <Users size={32} className="mx-auto mb-3 opacity-50" />
              <p>In Phase 2, leads from the Google Sheet / Database will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}