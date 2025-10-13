import EditTourForm from "../../EditTourForm";

export default function EditTourPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  return (
    <div className="p-6">
      <EditTourForm slug={slug} />
    </div>
  );
}
