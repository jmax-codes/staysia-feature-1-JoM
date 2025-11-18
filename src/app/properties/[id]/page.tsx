import { notFound } from "next/navigation";
import { PropertyDetailClient } from "@/components/PropertyDetailClient";

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getPropertyData(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/properties/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  const data = await getPropertyData(id);

  if (!data) {
    notFound();
  }

  return <PropertyDetailClient data={data} />;
}
