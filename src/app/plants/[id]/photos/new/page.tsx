import { notFound } from "next/navigation";
import { PhotoUploadForm } from "@/components/photo-upload-form";
import { getPlantById } from "@/lib/data";

interface UploadPhotoPageProps {
  params: Promise<{ id: string }>;
}

export default async function UploadPhotoPage({ params }: UploadPhotoPageProps) {
  const { id } = await params;
  const plant = await getPlantById(id);

  if (!plant) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <header className="card p-5">
        <h1 className="text-3xl">Upload Photo for {plant.nickname}</h1>
        <p className="text-sm text-stone-600">
          The app saves image metadata and prepares a Botanist Agent Review section for this photo.
        </p>
      </header>
      <PhotoUploadForm plantId={plant.id} plantName={plant.nickname} />
    </div>
  );
}