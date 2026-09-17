import type { Metadata } from "next";
import ListingsClient from "./ListingsClient";
import listings from "@/data/listings";

export const metadata: Metadata = {
  title: "Property Listings",
  description:
    "Browse all properties — land for sale in Nellore, 3 BHK flats for rent in Kondapur and Gachibowli, Hyderabad. Verified listings by Satyasri Realtors.",
};

export default function ListingsPage() {
  return <ListingsClient listings={listings} />;
}
