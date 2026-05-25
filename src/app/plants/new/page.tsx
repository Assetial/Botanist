import { PlantForm } from "@/components/plant-form";

export default function NewPlantPage() {
  return (
    <div className="space-y-4">
      <header className="card p-5">
        <h1 className="text-3xl">Add Plant</h1>
        <p className="text-sm text-stone-600">
          Create a private plant profile with care notes and health baseline.
        </p>
      </header>
      <PlantForm mode="create" />
    </div>
  );
}