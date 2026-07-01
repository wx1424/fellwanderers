import React, { useState } from 'react';
import Archive from "../types/Archive";
import { Doc } from "../../firebaseAPI";

const btnStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";

type SetArchiveDocState = React.Dispatch<React.SetStateAction<Doc<Archive>[]>>;
type AddArchiveFormSubmit = (archive: Archive, archiveDocs: Doc<Archive>[], setState: SetArchiveDocState) => void;
interface AddArchiveFormProps {
  onSubmit: AddArchiveFormSubmit;
  isValidAdd: (archive: Archive) => [boolean, string | null];
  archiveDocs: Doc<Archive>[];
  setState: SetArchiveDocState;
}

export function AddArchiveForm({ onSubmit, isValidAdd, archiveDocs, setState}: AddArchiveFormProps) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [order, setOrder] = useState(0);
  const [route, setRoute] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls([...imageUrls, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const archive: Archive = { title, desc, images: imageUrls, order, route };
    const [isValid, err] = isValidAdd(archive);
    setError(err);
    if (isValid) {
      onSubmit(archive, archiveDocs, setState);
      setOrder(0);
      setTitle('');
      setDesc('');
      setImageUrls([]);
      setImageUrl('');
      setRoute('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div className={"text-red-500"}>{error}</div>}
        <div>
          <label className={"block mb-2"}>
            {"Title: "}
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
        </div>
        <div>
          <label className={"flex items-start mb-2"}>
            {"Description: "}
            <textarea className={"w-full mx-2 h-40"} value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </label>
        </div>
        <div className={"mb-2"}>
          <label className={"block mb-1"}>{"Images: "}</label>
          <div className={"flex gap-2"}>
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={"flex-1 border px-2 py-1 text-sm"}
            />
            <button type="button" className={btnStyle} onClick={handleAddUrl}>Add</button>
          </div>
          {imageUrls.length > 0 && (
            <ul className={"mt-1 text-sm"}>
              {imageUrls.map((url, index) => (
                <li key={index} className={"flex items-center gap-2 py-0.5"}>
                  <span className={"truncate max-w-xs"}>{url}</span>
                  <button type="button" className={"text-red-500 hover:text-red-700 font-bold"} onClick={() => handleRemoveUrl(index)}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <label className={"block mb-2"}>
            {"Order: "}
            <input
              type="number"
              min="1"
              max={archiveDocs.length + 1}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label className={"block mb-2"}>
            {"Map Link: "}
            <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} />
          </label>
        </div>
        <button type="submit" className={btnStyle}>Submit</button>
      </form>
    </div>
  );
}

type EditArchiveFormSubmit = (newArchive: Archive, oldOrder: number, archiveDocs: Doc<Archive>[], setState: SetArchiveDocState) => void;
interface EditArchiveFormProps {
  onSubmit: EditArchiveFormSubmit;
  isValidEdit: (newArchive: Archive, order: number, archiveDocs: Doc<Archive>[]) => [boolean, string | null];
  archiveDocs: Doc<Archive>[];
  setState: SetArchiveDocState;
}

export function EditArchiveForm({ onSubmit, isValidEdit, archiveDocs, setState}: EditArchiveFormProps) {
  const [order, setOrder] = useState(0);
  const [newTitle, setNewTitle] = useState('');
  const [oldTitle, setOldTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [route, setRoute] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAddUrl = () => {
    if (imageUrl.trim()) {
      setImageUrls([...imageUrls, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleRemoveUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const oldArchive = archiveDocs.filter((doc) => doc.data.title === oldTitle)[0];
    const newArchive: Archive = { title: newTitle, desc, order, images: imageUrls, route };
    const [isValid, err] = isValidEdit(newArchive, order, archiveDocs);
    setError(err);
    if (isValid) {
      onSubmit(newArchive, oldArchive.data.order, archiveDocs, setState);
      setOrder(0);
      setNewTitle('');
      setOldTitle('');
      setDesc('');
      setRoute('');
      setImageUrls([]);
      setImageUrl('');
    }
  };

  const handleTitleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const title = e.target.value;
    setOldTitle(title);
    const doc = archiveDocs.find((doc) => doc.data.title === title) as Doc<Archive>;
    setNewTitle(title);
    setDesc(doc.data.desc);
    setOrder(doc.data.order);
    setRoute(doc.data.route);
    setImageUrls([...(doc.data.images ?? [])]);
  };

  const handleOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrder(parseInt(e.target.value, 10));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {error && <div className={"text-red-500"}>{error}</div>}
        <div>
          <label htmlFor={"edit-dropdown"} className={"block mb-2"}>{"Select Archive: "}</label>
          <select id={"edit-dropdown"} value={oldTitle || ''} onChange={handleTitleOptionChange}>
            <option value=""> -- Select -- </option>
            {archiveDocs.map((archiveDoc, index) => (
              <option key={index} value={archiveDoc.data.title}>{archiveDoc.data.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={"block mb-2"}>
            {"New Title: "}
            <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
          </label>
        </div>
        <div>
          <label className={"flex items-start mb-2"}>
            {"Description: "}
            <textarea className={"w-full mx-2 h-40"} value={desc} onChange={(e) => setDesc(e.target.value)} required />
          </label>
        </div>
        <div>
          <label htmlFor={"order-dropdown"} className={"block mb-2"}>{"Order: "}</label>
          <select id={"order-dropdown"} value={order || ''} onChange={handleOrderChange}>
            <option value=""> -- Select -- </option>
            {archiveDocs.map((archiveDoc, index) => (
              <option key={index} value={archiveDoc.data.order}>{archiveDoc.data.order}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={"block mb-2"}>
            {"New Map Link: "}
            <input type="text" value={route} onChange={(e) => setRoute(e.target.value)} />
          </label>
        </div>
        <div className={"mb-2"}>
          <label className={"block mb-1"}>{"Images: "}</label>
          <div className={"flex gap-2"}>
            <input
              type="text"
              placeholder="Paste image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={"flex-1 border px-2 py-1 text-sm"}
            />
            <button type="button" className={btnStyle} onClick={handleAddUrl}>Add</button>
          </div>
          {imageUrls.length > 0 && (
            <ul className={"mt-1 text-sm"}>
              {imageUrls.map((url, index) => (
                <li key={index} className={"flex items-center gap-2 py-0.5"}>
                  <span className={"truncate max-w-xs"}>{url}</span>
                  <button type="button" className={"text-red-500 hover:text-red-700 font-bold"} onClick={() => handleRemoveUrl(index)}>✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit" className={btnStyle}>Submit</button>
      </form>
    </div>
  );
}

type DeleteArchiveFormSubmit = (title: string, archiveDocs: Doc<Archive>[], setState: SetArchiveDocState) => void;
interface DeleteArchiveFormProps {
  onSubmit: DeleteArchiveFormSubmit;
  isValidDelete: (title: string, archiveDocs: Doc<Archive>[]) => [boolean, string | null];
  archiveDocs: Doc<Archive>[];
  setState: SetArchiveDocState;
}

export function DeleteArchiveForm({ onSubmit, isValidDelete, archiveDocs, setState}: DeleteArchiveFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [isValid, err] = isValidDelete(title, archiveDocs);
    setError(err);
    if (isValid) {
      onSubmit(title, archiveDocs, setState);
      setTitle('');
    }
  };

  return (
    <div className={"p-2"}>
      <form onSubmit={handleSubmit}>
        {error && <div className={"text-red-500"}>{error}</div>}
        <div>
          <label htmlFor={"delete-dropdown"} className={"block mb-2"}>{"Select Hike: "}</label>
          <select id={"delete-dropdown"} value={title || ''} onChange={(e) => setTitle(e.target.value)}>
            <option value=""> -- Select -- </option>
            {archiveDocs.map((archiveDoc, index) => (
              <option key={index} value={archiveDoc.data.title}>{archiveDoc.data.title}</option>
            ))}
          </select>
        </div>
        <button type="submit" className={btnStyle}>Submit</button>
      </form>
    </div>
  );
}
