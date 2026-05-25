import { notFound } from "next/navigation";
import { PlantForm } from "@/components/plant-form";
import { getPlantById } from "@/lib/data";

interface EditPlantPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlantPage({ params }: EditPlantPageProps) {
  const { id } = await params;
  const plant = await getPlantById(id);

  if (!plant) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <header className="card p-5">
        <h1 className="text-3xl">Edit {plant.nickname}</h1>
        <p className="text-sm text-stone-600">Update profile details and private notes.</p>
      </header>
      <PlantForm mode="edit" plant={plant} />
    </div>
  );
}