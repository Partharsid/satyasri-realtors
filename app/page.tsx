import { createClient } from "@/utils/supabase/server";
import HomeClient from "./HomeClient";

export const revalidate = 60; // ISR: Revalidate every 60 seconds

export default async function HomePage() {
  const supabase = await createClient();
  const { data: dbListings } = await supabase
    .from("listings")
    .select("*")
    .eq("isFeatured", true)
    .order("created_at", { ascending: false });

  const featured = (dbListings || []).map((l: any) => ({
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

  return <HomeClient featured={featured} />;
}