import EditDestinationForm from "../../EditDestinationForm";

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6">
      <EditDestinationForm id={id} />
    </div>
  );
}
