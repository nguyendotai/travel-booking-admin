import EditCategoryForm from "../../EditCategoryForm";

export default async function EditCategoryPage({ params, } : {params : Promise<{ id: string }>;}){
    const { id } = await params;

    return (
        <div className="p-6">
            <EditCategoryForm id={id}></EditCategoryForm>
        </div>
    )
}