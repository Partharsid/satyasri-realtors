import type { Metadata } from "next";
import ListingsClient from "./ListingsClient";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Property Listings",
  description:
    "Browse all properties — land for sale in Nellore, 3 BHK flats for rent in Kondapur and Gachibowli, Hyderabad. Verified listings by Satyasri Realtors.",
};

export const revalidate = 60; // Revalidate every minute

export default async function ListingsPage() {
  const supabase = await createClient();
  const { data: listings } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });

  // Map database format to expected Listing format for frontend
  const formattedListings = (listings || []).map((l: any) => ({
    ...l,
    location: {
      area: l.location_area,
      city: l.location_city,
      state: l.location_state,
      fullAddress: l.location_full_address,
    },
    specs: {
      area: l.specs_area,
      bedrooms: l.specs_bedrooms,
      bathrooms: l.specs_bathrooms,
      facing: l.specs_facing,
      floor: l.specs_floor,
      furnishing: l.specs_furnishing,
      parking: l.specs_parking,
      availability: l.specs_availability,
      tenantRestriction: l.specs_tenant_restriction,
    }
  }));

  return <ListingsClient listings={formattedListings} />;
}
