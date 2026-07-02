import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import Archive from "../types/Archive.ts";
import { Doc } from "../../firebaseAPI.ts";

interface HikeArchiveProps {
  doc: Doc<Archive>;
  isLoggedIn: boolean;
  onEdit: (doc: Doc<Archive>) => void;
  onDelete: (doc: Doc<Archive>) => void;
}

export default function HikeArchive({ doc, isLoggedIn, onEdit, onDelete }: HikeArchiveProps) {
  const navigate = useNavigate();
  const { title, desc, thumbnail } = doc.data;
  const thumb = thumbnail || null;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  return (
    <div
      className="relative cursor-pointer border-2 border-logoGreen-dark rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white flex flex-col"
      onClick={() => navigate(`/archive/${doc.id}`, { state: { archive: doc.data } })}
    >
      <div className="h-48 bg-gray-100 flex-shrink-0">
        {thumb
          ? <img src={thumb} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No images</div>
        }
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-bold text-lg font-oblique">{title}</h3>
          {doc.data.draft && isLoggedIn && (
            <span className="text-xs font-semibold px-1.5 py-0.5 bg-yellow-100 text-yellow-700 border border-yellow-300 rounded flex-shrink-0">Draft</span>
          )}
        </div>
        <p className="text-sm text-gray-600 line-clamp-3">{desc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
        <span className="mt-3 text-xs font-semibold text-logoGreen-dark underline">Read more</span>
      </div>
      {isLoggedIn && (
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="bg-white/80 hover:bg-white rounded-full w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 shadow"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded shadow-lg min-w-[80px] text-xs">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onEdit(doc); }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(doc); }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
