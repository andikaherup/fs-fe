"use client";

import { useState } from "react";
import RequestList from "@/components/RequestList";
import CreateRequestForm from "@/components/RequestForm";

export default function Home() {
  const [isAddingNew, setIsAddingNew] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      {isAddingNew ? (
        <CreateRequestForm onClose={() => setIsAddingNew(false)} />
      ) : (
        <RequestList onAddNew={() => setIsAddingNew(true)} />
      )}
    </main>
  );
}
