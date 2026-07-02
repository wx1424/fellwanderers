import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import HikeArchive from "../components/HikeArchive.tsx";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import Archive from "../types/Archive.ts";
import { setCollectionState, Doc } from "../../firebaseAPI";
import { useAuth } from "../contexts/AuthContext.tsx";
import ArchiveFormPage from "../components/ArchiveForms.tsx";
import { db } from "../../firebase.ts";
import { doc, addDoc, collection, deleteDoc, setDoc } from "firebase/firestore";

const btnStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";

// Sort by order field then reassign 1, 2, 3 … N to guarantee sequential unique values.
const normalizeOrders = (docs: Doc<Archive>[]): Doc<Archive>[] =>
  [...docs]
    .sort((a, b) => a.data.order - b.data.order)
    .map((d, i) => ({ ...d, data: { ...d.data, order: i + 1 } }));

const handleAddArchiveSubmit = (
  archive: Archive,
  archiveDocs: Doc<Archive>[],
  setState: React.Dispatch<React.SetStateAction<Doc<Archive>[]>>,
) => {
  const sorted = [...archiveDocs].sort((a, b) => a.data.order - b.data.order);
  const insertAt = Math.max(0, Math.min(archive.order - 1, sorted.length));
  const newDoc: Doc<Archive> = { id: null, data: archive };
  sorted.splice(insertAt, 0, newDoc);
  setState(sorted.map((d, i) => ({ ...d, data: { ...d.data, order: i + 1 } })));
};

export default function ArchivePage() {
  const [archiveDocs, setArchiveDocs] = useState<Doc<Archive>[]>([]);
  const [docsToDelete, setDocsToDelete] = useState<Doc<Archive>[]>([]);
  const [activeDoc, setActiveDoc] = useState<Doc<Archive> | null | 'add'>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setCollectionState<Archive>(
      "archive",
      (a, b) => a.order - b.order,
      // Wrap the setter so data is always normalized on load
      ((docs: Doc<Archive>[]) => setArchiveDocs(normalizeOrders(docs))) as any,
      (a) => a,
      (a) => ({ ...a, thumbnail: (a as any).thumbnail ?? (a as any).images?.[0] ?? '' }) as Archive
    );
  }, []);

  const handleEditSubmit = (updatedDoc: Doc<Archive>, oldOrder: number) => {
    setArchiveDocs((prev) => {
      // Remove the old version of this doc, insert updatedDoc at its new order position
      const without = prev.filter((d) => d.data.order !== oldOrder);
      const sorted = [...without].sort((a, b) => a.data.order - b.data.order);
      const insertAt = Math.max(0, Math.min(updatedDoc.data.order - 1, sorted.length));
      sorted.splice(insertAt, 0, updatedDoc);
      return sorted.map((d, i) => ({ ...d, data: { ...d.data, order: i + 1 } }));
    });
  };

  const handleDeleteFromCard = (archiveDoc: Doc<Archive>) => {
    setArchiveDocs((prev) => {
      const remaining = prev.filter((d) => d !== archiveDoc);
      return normalizeOrders(remaining);
    });
    setDocsToDelete((prev) => [...prev, archiveDoc]);
  };

  const handleSaveChanges = async () => {
    const updated = [...archiveDocs];
    await Promise.all(updated.map(async (archiveDoc, i) => {
      if (archiveDoc.id) {
        await setDoc(doc(db, "archive", archiveDoc.id), archiveDoc.data);
      } else {
        const docRef = await addDoc(collection(db, "archive"), archiveDoc.data);
        updated[i] = { ...archiveDoc, id: docRef.id };
      }
    }));
    await Promise.all(docsToDelete.map(async ({ id }) => {
      if (id) await deleteDoc(doc(db, "archive", id));
    }));
    setDocsToDelete([]);
    setArchiveDocs(updated);
    localStorage.setItem("archive", JSON.stringify(updated));
    alert("Saved Changes");
  };

  if (activeDoc !== null) {
    const popupDoc = activeDoc === 'add' ? null : activeDoc;
    return (
      <ArchiveFormPage
        initialDoc={popupDoc}
        archiveDocs={archiveDocs}
        onAdd={handleAddArchiveSubmit}
        onEdit={handleEditSubmit}
        setArchiveDocs={setArchiveDocs}
        onClose={() => setActiveDoc(null)}
      />
    );
  }

  return (
    <>
      <PageHeader />
      <div className="flex flex-col">
        <div className="px-4 lg:px-10 pt-5">
          <h2 className="font-helvetica-black font-oblique text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trip reports
          </h2>
          <p className="mt-3 text-lg leading-8 text-gray-600">
            Looking for some hiking inspiration? Here's a selection of some trip reports for
            the hikes we've been on in the past!
          </p>
        </div>
        {isLoggedIn && (
          <div className="px-4 lg:px-10 pt-5 flex gap-2">
            <button className={btnStyle} onClick={() => setActiveDoc('add')}>
              <FontAwesomeIcon icon={faPlus} /> Add Report
            </button>
            <button className={btnStyle} onClick={handleSaveChanges}>Save Changes</button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 lg:px-10 py-6">
          {archiveDocs.filter((d) => isLoggedIn || !d.data.draft).map((d) => (
            <HikeArchive
              key={d.id ?? `new-${d.data.order}`}
              doc={d}
              isLoggedIn={isLoggedIn}
              onEdit={(d) => setActiveDoc(d)}
              onDelete={handleDeleteFromCard}
            />
          ))}
        </div>
      </div>
      <PageFooter />
    </>
  );
}
