import { DocumentData, WithFieldValue, collection, getDocs, doc, addDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import React from "react";

type Order<T> = (arg1: T, arg2: T) => number;
type TransformForEach<T> = (value: T) => T;
type TransformFromFirestore<T> = (value: DocumentData) => T;

export type Doc<T> = {
  id: string | null,
  data: T
}
type SetCollection<T> = (value: React.SetStateAction<Doc<T>[]>) => void;

/**
 * Retrieves collection from Firestore, applying transform to each element
 * @param collectionName
 * @param transform
 */
async function retrieveCollection<T>(collectionName: string, transform: TransformFromFirestore<T>) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const collData: Doc<T>[] = [];
  querySnapshot.forEach((doc) => { 
    collData.push({
      id: doc.id,
      data: transform(doc.data())
    });
  });
  return collData;
}

/**
 * Retrieve collection from cache, applying transform to each element
 * @param cacheName
 * @param transform
 */
function getCachedCollection<T>(cacheName: string, transform: TransformForEach<T>) {
  const cachedData = localStorage.getItem(cacheName);
  if (cachedData) {
    const docs = JSON.parse(cachedData);
    docs.forEach((doc: Doc<T>) => {
      doc.data = transform(doc.data)
    });
    return docs;
  }
  return null;
}

/**
 * Fetch collection from Firestore into cache, ordering and updating React
 * component's state
 * @param dataName
 * @param order
 * @param setCollection
 * @param transform
 */
async function fetchCollectionAndCache<T>(dataName: string, order: Order<T>, setCollection: SetCollection<T>, transform: TransformFromFirestore<T>) {
  retrieveCollection<T>(dataName, transform)
    .then((docs) => {
      docs.sort((a, b) => order(a.data, b.data));
      setCollection(docs);
      localStorage.setItem(dataName, JSON.stringify(docs));
    })
    .catch((error) => {
      console.error(error);
    })
}

/**
 * Update React component's collection state, fetching if needed
 * @param dataName
 * @param order
 * @param setCollection
 * @param transform
 * @param firestoreTransform
 */
export function setCollectionState<T>(dataName: string, order: Order<T>, setCollection: SetCollection<T>, transform: TransformForEach<T>, firestoreTransform: TransformFromFirestore<T>) {
  const cachedCollection = getCachedCollection<T>(dataName, transform);
  if (cachedCollection) {
    setCollection(cachedCollection.sort((a: Doc<T>, b: Doc<T>) => order(a.data, b.data)));
  } else {
    fetchCollectionAndCache<T>(dataName, order, setCollection, firestoreTransform)
      .catch((error) => {
        console.error(error.message);
      })
  }
}

/**
 * Add and delete necessary docs from Firestore collection
 * @param dataName
 * @param docsToAdd
 * @param docsToDelete
 */
export async function handleSaveChangesClick<T extends WithFieldValue<DocumentData>>(dataName: string, docsToAdd: Doc<T>[], docsToDelete: Doc<T>[]) {
  await Promise.all(docsToDelete.map(async ({ data, id }) => {
    if (id) {
      await deleteDoc(doc(db, dataName, id));
      console.log("Deleted: ", data);
    }
  }));
  await Promise.all(docsToAdd.map(async (docToAdd) => {
    if (docToAdd.id) {
      await setDoc(doc(db, dataName, docToAdd.id), docToAdd.data);
    } else {
      const docRef = await addDoc(collection(db, dataName), docToAdd.data);
      docToAdd.id = docRef.id;
    }
  }));
  alert("Saved Changes");
  localStorage.setItem(dataName, JSON.stringify(docsToAdd));
}