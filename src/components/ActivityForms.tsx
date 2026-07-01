import { useState } from 'react';
import Activity, { ActivityType } from "../types/Activity";
import { Doc } from "../../firebaseAPI";

const toDateInputValue = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const parseLocalDate = (dateStr: string): Date => {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const typeToString = (type: ActivityType) => {
  if (type === ActivityType.Hike) return 'Hike';
  if (type === ActivityType.Social) return 'Social';
  if (type === ActivityType.Weekend) return 'Weekend';
  if (type === ActivityType.Tour) return 'Tour';
  return '';
};

const convertType = (text: string) => {
  if (text === "Hike") return ActivityType.Hike;
  if (text === "Social") return ActivityType.Social;
  if (text === "Weekend") return ActivityType.Weekend;
  if (text === "Tour") return ActivityType.Tour;
  return ActivityType.Blank;
};

interface ActivityFormProps {
  doc: Doc<Activity>;
  onSubmit: (doc: Doc<Activity>) => void;
  onClose: () => void;
  mode?: 'add' | 'edit';
}

export default function ActivityPopup({ doc, onSubmit, onClose, mode = 'add' }: ActivityFormProps) {
  const [title, setTitle] = useState(mode === 'edit' ? doc.data.title : '');
  const [type, setType] = useState(mode === 'edit' ? typeToString(doc.data.type) : '');
  const [misc, setMisc] = useState(mode === 'edit' ? doc.data.misc : '');
  const [startDate, setStartDate] = useState(toDateInputValue(doc.data.date));
  const [endDate, setEndDate] = useState(doc.data.endDate ? toDateInputValue(doc.data.endDate) : '');
  const [error, setError] = useState<string | null>(null);

  const isValid = (): [boolean, string | null] => {
    if (title.trim() === '') return [false, "Title cannot be empty"];
    if (type !== "Hike" && type !== "Social" && type !== "Weekend" && type !== "Tour") return [false, "Must select type"];
    if (endDate && endDate < startDate) return [false, "End date must be on or after start date"];
    return [true, null];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [valid, err] = isValid();
    setError(err);
    if (valid) {
      const data: Activity = {
        title,
        date: parseLocalDate(startDate),
        type: convertType(type),
        misc
      };
      if (endDate) data.endDate = parseLocalDate(endDate);
      onSubmit({ ...doc, data });
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-900/40">
      <div className="bg-white w-80 sm:w-96 p-4 shadow-md rounded">
        <h2 className="text-xl font-bold mb-4">{mode === 'edit' ? 'Edit Activity' : 'Add Activity'}</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1.5 w-full text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="border border-gray-400 rounded px-3 py-1.5 w-full text-sm">
              <option value=""> -- Select -- </option>
              <option value="Hike">Day hike</option>
              <option value="Social">Social</option>
              <option value="Weekend">Weekend trip</option>
              <option value="Tour">Tour</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1.5 w-full text-sm" />
          </div>
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1">
              End Date <span className="text-gray-400">(optional)</span>
            </label>
            <input type="date" min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1.5 w-full text-sm" />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Notes</label>
            <input type="text" value={misc} onChange={(e) => setMisc(e.target.value)}
              className="border border-gray-400 rounded px-3 py-1.5 w-full text-sm" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-1.5 bg-logoGreen-light border border-logoGreen-dark text-sm font-semibold rounded hover:bg-green-900/60">
              {mode === 'edit' ? 'Save' : 'Add'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
