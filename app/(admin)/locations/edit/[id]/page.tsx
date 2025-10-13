import EditLocationForm from "../../EditLocationForm";

export default async function EditLocationPage({ params, } : {params : Promise<{ id: string }>;}){
    const { id } = await params;

    return (
        <div className="p-6">
            <EditLocationForm id={id}></EditLocationForm>
        </div>
    )
}