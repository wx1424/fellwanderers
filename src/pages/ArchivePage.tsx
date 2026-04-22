import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";

import HikeArchive from "../components/HikeArchive.tsx";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import Archive from "../types/Archive.ts";
import { setCollectionState, Doc } from "../../firebaseAPI";
import { useAuth } from "../contexts/AuthContext.tsx";
import { AddArchiveForm, EditArchiveForm, DeleteArchiveForm } from "../components/ArchiveForms.tsx";
import { storage, db } from "../../firebase.ts";
import { ref, uploadBytes, deleteObject, listAll } from "firebase/storage";
import { doc, addDoc, collection, deleteDoc, setDoc } from "firebase/firestore";

interface CommitteeUpdatesProps {
  archiveDocs: Doc<Archive>[];
  setArchiveDocs: React.Dispatch<React.SetStateAction<Doc<Archive>[]>>;
}

const handleAddArchiveSubmit = (archive: Archive, images: FileList, archiveDocs: Doc<Archive>[], setState: React.Dispatch<React.SetStateAction<Doc<Archive>[]>>) => {
  const handleUpload = () => {
    if (images) {
      const storageRef = ref(storage, archive.directory);
      for (let i = 0; i < images.length; i++) {
        const file = images[i];
        const childRef = ref(storageRef, `${file.name}`);
        uploadBytes(childRef, file)
          .catch((error) => {
            console.error('Error uploading file:', error);
          }
        );
      }
    }
  }
  const newDoc: Doc<Archive> = { id: null, data: archive };
  if (archive.order <= archiveDocs.length) {
    archiveDocs.filter((doc) => doc.data.order >= archive.order)
      .forEach((doc) => doc.data.order++);
  }
  archiveDocs.push(newDoc);
  setState(archiveDocs.sort((a, b) => a.data.order - b.data.order));
  handleUpload();
}

const isValidAddArchive = (archive: Archive, selectedFiles: FileList | null): [boolean, string | null] => {
  if (!selectedFiles) {
    return [false, "No images selected"];
  }
  if (archive.order === 0) {
    return [false, "Archive number cannot be 0"];
  }
  if (archive.title.trim() === '') {
    return [false, "Archive title cannot be empty"];
  }
  if (archive.desc.trim() === '') {
    return [false, "Archive description cannot be empty"];
  }
  if (archive.directory.trimEnd() === '') {
    return [false, "Archive directory empty, message Euan"];
  }
  return [true, null];
}

const handleEditArchiveSubmit = (newArchive: Archive, oldOrder: number, archiveDocs: Doc<Archive>[], setState: React.Dispatch<React.SetStateAction<Doc<Archive>[]>>) => {  
  if (newArchive.order === oldOrder) {
    archiveDocs.forEach((doc) => {
      if (doc.data.order === oldOrder) {
        doc.data = newArchive;
      }
    })
  } else {
    archiveDocs.forEach((doc) => {
      if (doc.data.order === oldOrder) {
        doc.data = newArchive;
      } else if (doc.data.order === newArchive.order) {
        doc.data.order = oldOrder;
      }
    })
  }
  setState(archiveDocs.sort((a, b) => a.data.order - b.data.order));
}

const isValidEditArchive = (newArchive: Archive, order: number, archiveDocs: Doc<Archive>[]): [boolean, string | null] => {
  if (order > archiveDocs.length) {
    return [false, "Must edit existing archive"];
  }
  if (newArchive.order === 0) {
    return [false, "Archive number cannot be 0"];
  }
  if (newArchive.title.trim() === '') {
    return [false, "Archive title cannot be empty"];
  }
  if (newArchive.desc.trim() === '') {
    return [false, "Archive description cannot be empty"];
  }
  if (newArchive.directory.trimEnd() === '') {
    return [false, "Archive directory empty, message Euan"];
  }
  return [true, null];
}

const isValidDeleteArchive = (title: string, archiveDocs: Doc<Archive>[]): [boolean, string | null] => {
  if (archiveDocs.some((doc) => doc.data.title === title)) {
    return [true, null];
  }
  return [false, "Cannot delete non-existent archive"];
}

function ArchiveCommitteeUpdates({ archiveDocs, setArchiveDocs }: CommitteeUpdatesProps) {
  const baseTabStyle = "w-full rounded-md px-1 sm:px-2.5 py-2 lg:py-2.5 text-sm leading-5 text-black font-semibold " +
  "ring-white ring-opacity-60 ring-offset-2 ring-offset-logoGreen-light " +
  "focus:outline-none focus:ring-2 ";
  const styleTab = (selected: boolean) => baseTabStyle.concat(
    selected ? "bg-white shadow" : "hover:bg-white/20",
  );
  const [docsToDelete, setDocsToDelete] = useState<Doc<Archive>[]>([]);
  
  const handleDeleteArchiveSubmit = (title: string, archiveDocs: Doc<Archive>[], setState: React.Dispatch<React.SetStateAction<Doc<Archive>[]>>) => {
    const newArchiveDocs = archiveDocs.filter((doc) => doc.data.title !== title);
    const oldDoc = archiveDocs.filter((doc) => doc.data.title === title)[0];
    setDocsToDelete([...docsToDelete, oldDoc]);
    newArchiveDocs.forEach((doc) => {
      if (doc.data.order > oldDoc.data.order) {
        doc.data.order--;
      }
    })
    setState(newArchiveDocs);
  }

  const handleSaveChangesClick = () => {
    archiveDocs.forEach(async (archiveDoc) => {
      if (archiveDoc.id) {
        await setDoc(doc(db, "archive", archiveDoc.id), archiveDoc.data);
      } else {
        const docRef = await addDoc(collection(db, "archive"), archiveDoc.data);
        archiveDoc.id = docRef.id;
      }
    });
    docsToDelete.forEach(async ({data, id}) => {
      if (id) {
        console.log("Deleting: ", id, data);
        await deleteDoc(doc(db, "archive", id));
        try {
          const bucket = ref(storage, data.directory);
          const files = await listAll(bucket);
          await Promise.all(files.items.map((object) => deleteObject(object)));
        } catch (error) {
          console.error("Error deleting files: ", error);
        }
      }
    });
    alert("Saved Changes");
    // TODO: Deal with disjoint uploads of images
    localStorage.setItem("archive", JSON.stringify(archiveDocs));
  }

  return (
    <div>
      <Tab.Group>
      <Tab.List
              className={
                "max-h-12 flex lg:inline-flex w-full lg:min-w-max justify-around lg:justify-center items-center rounded-xl bg-logoGreen-light border-logoGreen-dark border py-2 px-1 lg:space-x-2"
              }
            >
          <Tab
                    className={({ selected }) =>
                      styleTab(selected)
                    }
                  >Add Archive</Tab>
          <Tab
                    className={({ selected }) =>
                    styleTab(selected)
                  }
                  >Edit Archive</Tab>
          <Tab
                    className={({ selected }) =>
                    styleTab(selected)
                  }
                  >Delete Archive</Tab>
      </Tab.List> 
      <Tab.Panel>
        <AddArchiveForm 
          onSubmit={handleAddArchiveSubmit}
          isValidAdd={isValidAddArchive}
          archiveDocs={[...archiveDocs]}
          setState={setArchiveDocs}
        />
      </Tab.Panel>
      <Tab.Panel>
        <EditArchiveForm 
          onSubmit={handleEditArchiveSubmit}
          isValidEdit={isValidEditArchive}
          archiveDocs={[...archiveDocs]}
          setState={setArchiveDocs}
        />
      </Tab.Panel>
      <Tab.Panel>
        <DeleteArchiveForm 
          onSubmit={handleDeleteArchiveSubmit}
          isValidDelete={isValidDeleteArchive}
          archiveDocs={[...archiveDocs]}
          setState={setArchiveDocs}
        />
      </Tab.Panel>
      </Tab.Group>
      <button className={"shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60"} onClick={handleSaveChangesClick}>
        <p>Save Changes</p>
      </button>
    </div>
  )

}

export default function ArchivePage() {
  const [archiveDocs, setArchiveDocs] = useState<Doc<Archive>[]>([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    setCollectionState<Archive>(
      "archive", 
      (a, b) => a.order - b.order, 
      setArchiveDocs, 
      (a) => a,
      (a) => a as Archive
      )
  }, []);
  return (
    <>
      <PageHeader />
      <div className={"flex flex-col"}>
        <div className={"px-4 lg:px-10 pt-5"}>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trip Archive
          </h2>
          <p className="mt-3 text-lg leading-8 text-gray-600">
            Looking for some hiking inspiration? Here's a selection of some trip reports for
            the hikes we've been on in the past!
          </p>
        </div>
        {
          isLoggedIn && 
          <div className={"px-4 lg:px-10 pt-5"}>
            <ArchiveCommitteeUpdates 
              archiveDocs={[...archiveDocs]}
              setArchiveDocs={setArchiveDocs}
            />
          </div>
        }
        {archiveDocs.map(({data}) => (
          <div key={data.title}>
            <HikeArchive
              title={data.title}
              desc={data.desc}
              directory={data.directory}
              order={data.order}
              route={data.route}
            />
          </div>
        ))}
      </div>
      <PageFooter />
    </>
  );
}
