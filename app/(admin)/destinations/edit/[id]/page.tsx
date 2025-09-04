"use client";

import EditDestinationForm from "../../EditDestinationForm";

export default function EditDestinationPage({ params }: { params: { id: string } }) {
    return(
        <div className="p-6">
            <EditDestinationForm id={params.id}></EditDestinationForm>
        </div>
    )
}