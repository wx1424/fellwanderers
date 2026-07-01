import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faEllipsisVertical
} from "@fortawesome/free-solid-svg-icons";
import Activity, { ActivityType } from "../types/Activity.ts";
import { Doc, handleSaveChangesClick } from "../../firebaseAPI.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import ActivityPopup from "./ActivityForms.tsx";

interface CalendarProps {
  activities: Doc<Activity>[];
  setActivities: React.Dispatch<React.SetStateAction<Doc<Activity>[]>>;
}

interface DayCell {
  date: Date;
  activities: Doc<Activity>[];
}

function colourActivity(type: ActivityType): string {
  switch (type) {
    case ActivityType.Hike:    return "bg-green-200";
    case ActivityType.Social:  return "bg-orange-200";
    case ActivityType.Weekend: return "bg-blue-200";
    case ActivityType.Tour:    return "bg-yellow-200";
    default:                   return "bg-gray-100";
  }
}

const firstMondayOfMonth = (date: Date) => {
  const tempDate = new Date(date);
  tempDate.setDate(1);
  while (tempDate.getDay() !== 1) {
    tempDate.setDate(tempDate.getDate() - 1);
  }
  return tempDate;
};

const lastSundayOfMonth = (date: Date) => {
  const tempDate = new Date(date);
  tempDate.setDate(1);
  tempDate.setMonth(date.getMonth() + 1);
  tempDate.setDate(tempDate.getDate() - 1);
  while (tempDate.getDay() !== 0) {
    tempDate.setDate(tempDate.getDate() + 1);
  }
  return tempDate;
};

const createMonthCells = (startDate: Date, planned: Doc<Activity>[]): DayCell[] => {
  const currDate = firstMondayOfMonth(startDate);
  const endDate = lastSundayOfMonth(startDate);
  const cells: DayCell[] = [];
  while (currDate.getTime() <= endDate.getTime()) {
    const curr = currDate.getTime();
    const dayActivities = planned.filter(({ data }) => {
      const start = data.date.getTime();
      const end = data.endDate ? data.endDate.getTime() : start;
      return curr >= start && curr <= end;
    });
    cells.push({ date: new Date(currDate), activities: dayActivities });
    currDate.setDate(currDate.getDate() + 1);
  }
  return cells;
};

const monthFirst = () => {
  const date = new Date();
  const res = new Date(date.getFullYear(), date.getMonth(), 1);
  res.setHours(0, 0, 0, 0);
  return res;
};

const todayMidnight = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

interface ChipProps {
  doc: Doc<Activity>;
  menuKey: string;
  openMenuKey: string | null;
  setOpenMenuKey: (k: string | null) => void;
  onDelete: (doc: Doc<Activity>) => void;
  onEdit: (doc: Doc<Activity>) => void;
  isLoggedIn: boolean;
}

function ActivityChip({ doc, menuKey, openMenuKey, setOpenMenuKey, onDelete, onEdit, isLoggedIn }: ChipProps) {
  const colour = colourActivity(doc.data.type);
  const menuOpen = openMenuKey === menuKey;

  return (
    <div className={`${colour} rounded px-1.5 py-0.5 flex justify-between items-start gap-1 relative`}>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-oblique font-semibold break-words">{doc.data.title}</p>
        {doc.data.misc && <p className="text-xs text-gray-500 break-words">{doc.data.misc}</p>}
      </div>
      {isLoggedIn && (
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); setOpenMenuKey(menuOpen ? null : menuKey); }}
            className="text-gray-500 hover:text-gray-800 px-0.5 leading-none"
          >
            <FontAwesomeIcon icon={faEllipsisVertical} size="xs" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-5 z-20 bg-white border border-gray-200 rounded shadow-lg min-w-[80px] text-xs">
              <button
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                onClick={(e) => { e.stopPropagation(); setOpenMenuKey(null); onEdit(doc); }}
              >
                Edit
              </button>
              <button
                className="block w-full text-left px-3 py-2 hover:bg-red-50 text-red-600"
                onClick={(e) => { e.stopPropagation(); setOpenMenuKey(null); onDelete(doc); }}
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

export default function Calendar({ activities, setActivities }: CalendarProps) {
  const [monthStart, setMonthStart] = useState<Date>(monthFirst());
  const [monthCells, setMonthCells] = useState<DayCell[]>([]);
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<null | Doc<Activity>>(null);
  const [popupMode, setPopupMode] = useState<'add' | 'edit'>('add');
  const [popupVisible, setPopupVisible] = useState(false);
  const [docsToDelete, setDocsToDelete] = useState<Doc<Activity>[]>([]);
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const earliest = new Date(2023, 4, 1);
  const latest = new Date(2027, 11, 1);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuKey(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const nextMonth = () => {
    setMonthStart(new Date(monthStart.setMonth(monthStart.getMonth() + 1)));
    setNextDisabled(monthStart.getTime() >= latest.getTime());
    setPrevDisabled(false);
  };
  const prevMonth = () => {
    setMonthStart(new Date(monthStart.setMonth(monthStart.getMonth() - 1)));
    setPrevDisabled(monthStart.getTime() <= earliest.getTime());
    setNextDisabled(false);
  };

  const titleDateFormat = new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long" });

  const openAddPopup = (date: Date = todayMidnight()) => {
    setSelectedDoc({ id: "", data: { title: "", date, type: ActivityType.Blank, misc: "" } });
    setPopupMode('add');
    setPopupVisible(true);
  };

  const openEditPopup = (doc: Doc<Activity>) => {
    setSelectedDoc(doc);
    setPopupMode('edit');
    setPopupVisible(true);
  };

  const handleAddSubmit = (doc: Doc<Activity>) => {
    const newDocs = [...activities, doc];
    setActivities(newDocs.sort((a, b) => a.data.date.getTime() - b.data.date.getTime()));
  };

  const handleEditSubmit = (updatedDoc: Doc<Activity>) => {
    const orig = selectedDoc;
    setActivities(prev =>
      prev
        .map((a) => (a === orig ? updatedDoc : a))
        .sort((a, b) => a.data.date.getTime() - b.data.date.getTime())
    );
  };

  const handleDeleteSubmit = (doc: Doc<Activity>) => {
    setActivities(activities.filter((a) => a !== doc));
    setDocsToDelete([...docsToDelete, doc]);
  };

  useEffect(() => {
    setMonthCells(createMonthCells(monthStart, activities));
  }, [monthStart, activities]);

  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const btnStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md hover:bg-green-900/60";

  return (
    <div ref={calendarRef} className={"container mx-auto w-full lg:py-8"}>
      <div className={"flex flex-wrap justify-center items-center gap-3 lg:mb-4"}>
        <button className={"bg-white hover:scale-y-110 py-2 px-4 rounded-lg"} onClick={prevMonth} disabled={prevDisabled}>
          {!prevDisabled && <FontAwesomeIcon icon={faChevronLeft} />}
        </button>
        <h1 className={"text-xl xl:text-2xl font-bold"}>{titleDateFormat.format(monthStart)}</h1>
        <button className={"bg-white hover:scale-y-110 font-bold py-2 px-4 rounded-lg"} onClick={nextMonth} disabled={nextDisabled}>
          {!nextDisabled && <FontAwesomeIcon icon={faChevronRight} />}
        </button>

        <div className={"flex flex-row justify-end sm:justify-end items-center space-x-2 sm:space-x-2 px-1 sm:px-2"}>
          <div className={"bg-green-200 rounded px-1.5 py-0.5"}>
            <span className={"text-xs font-semibold font-oblique"}>Day hike</span>
          </div>
          <div className={"bg-orange-200 rounded px-1.5 py-0.5"}>
            <span className={"text-xs font-semibold font-oblique"}>Social</span>
          </div>
          <div className={"bg-blue-200 rounded px-1.5 py-0.5"}>
            <span className={"text-xs font-semibold font-oblique"}>Weekend trip</span>
          </div>
          <div className={"bg-yellow-200 rounded px-1.5 py-0.5"}>
            <span className={"text-xs font-semibold font-oblique"}>Tour</span>
          </div>
        </div>
        {isLoggedIn && (
          <>
            <button className={btnStyle} onClick={() => openAddPopup()}>
              <FontAwesomeIcon icon={faPlus} /> Add Event
            </button>
            <button className={btnStyle} onClick={() => handleSaveChangesClick<Activity>("activities", activities, docsToDelete)}>
              Save Changes
            </button>
          </>
        )}
      </div>

      {popupVisible && selectedDoc && (
        <ActivityPopup
          doc={selectedDoc}
          mode={popupMode}
          onSubmit={popupMode === 'edit' ? handleEditSubmit : handleAddSubmit}
          onClose={() => setPopupVisible(false)}
        />
      )}

      <div className={"w-full overflow-x-auto"}>
        <div className={"min-w-[600px]"}>
          <div className={"grid grid-cols-7 mb-1"}>
            {dayHeaders.map((day) => (
              <div key={day} className={"text-center text-sm font-semibold text-gray-500 py-1"}>
                {day}
              </div>
            ))}
          </div>
          <div className={"grid grid-cols-7 gap-1"}>
            {monthCells.map((cell, i) => {
              const isCurrentMonth = cell.date.getMonth() === monthStart.getMonth();
              return (
                <div
                  key={i}
                  className={`border border-slate-200 p-1 min-h-20 flex flex-col gap-0.5 ${isCurrentMonth ? "bg-white" : "bg-gray-50"}`}
                >
                  <div className={"flex justify-between items-center"}>
                    <span className={`text-xs font-medium ${isCurrentMonth ? "text-gray-700" : "text-gray-300"}`}>
                      {cell.date.getDate()}
                    </span>
                    {isLoggedIn && isCurrentMonth && (
                      <button onClick={() => openAddPopup(cell.date)} className={"text-gray-300 hover:text-gray-600"}>
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                      </button>
                    )}
                  </div>
                  {cell.activities.map((act, j) => (
                    <ActivityChip
                      key={j}
                      menuKey={`${i}-${j}`}
                      openMenuKey={openMenuKey}
                      setOpenMenuKey={setOpenMenuKey}
                      doc={act}
                      onDelete={handleDeleteSubmit}
                      onEdit={openEditPopup}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
