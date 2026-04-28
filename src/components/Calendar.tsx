import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPlus,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import Activity, { ActivityType } from "../types/Activity.ts";
import { Doc, handleSaveChangesClick } from "../../firebaseAPI.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import AddActivityPopup from "./ActivityForms.tsx";

interface CalendarProps {
  activities: Doc<Activity>[];
  setActivities: React.Dispatch<React.SetStateAction<Doc<Activity>[]>>;
}

function colourActivity(type: ActivityType): string {
  switch (type) {
    case ActivityType.Blank:
      return "bg-white";
    case ActivityType.Hike:
      return "bg-green-200";
    case ActivityType.Social:
      return "bg-orange-200";
    case ActivityType.Weekend:
      return "bg-blue-200";
  }
}

const firstMondayOfMonth = (date: Date) => {
  const tempDate = new Date(date);
  // Set tempDate to first of current month
  tempDate.setDate(1);
  // Move tempDate to previous Monday
  while (tempDate.getDay() !== 1) {
    tempDate.setDate(tempDate.getDate() - 1);
  }
  return tempDate;
};

const lastSundayOfMonth = (date: Date) => {
  const tempDate = new Date(date);
  // Set tempDate to last day of current month
  tempDate.setDate(1);
  tempDate.setMonth(date.getMonth() + 1);
  tempDate.setDate(tempDate.getDate() - 1);
  // Move tempDate to next Sunday
  while (tempDate.getDay() !== 0) {
    tempDate.setDate(tempDate.getDate() + 1);
  }
  return tempDate;
};

// PRE: planned activities are in chronological order
const createMonthActivities = (startDate: Date, planned: Doc<Activity>[]) => {
  const currDate = firstMondayOfMonth(startDate);
  const endDate = lastSundayOfMonth(startDate);
  const monthActivities = planned.filter(({data}) => {
    const actDate = data.date;
    return actDate >= currDate && actDate <= endDate;
  });
  const activities: Doc<Activity>[] = [];
  const blankActivity = () => {return {
    id: "",
    data: {
    title: "",
    date: new Date(currDate),
    type: ActivityType.Blank,
    misc: "",
    }
  }};
  while (currDate.getTime() <= endDate.getTime()) {
    if (
      monthActivities.length > 0 &&
      currDate.toString() === monthActivities[0].data.date.toString()
    ) {
      activities.push(monthActivities.shift() as Doc<Activity>);
    } else {
      activities.push(blankActivity());
    }
    currDate.setDate(currDate.getDate() + 1);
  }
  return activities;
};

const monthFirst = () => {
  const date = new Date();
  const res = new Date(date.getFullYear(), date.getMonth(), 1);
  res.setHours(0, 0, 0, 0);
  return res;
};

export default function Calendar({ activities, setActivities }: CalendarProps) {
  const [monthStart, setMonthStart] = useState<Date>(monthFirst());
  const [monthActivities, setMonthActivities] = useState<Doc<Activity>[]>([]);
  const [prevDisabled, setPrevDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<null | Doc<Activity>>(null);
  const [addPopupVisible, setAddPopupVisible] = useState(false);
  const [docsToDelete, setDocsToDelete] = useState<Doc<Activity>[]>([]);

  // TODO: Work out if limits necessary, and how dynamic they may need to be
  const earliest = new Date(2023, 4, 1);
  const latest = new Date(2027, 11, 1);
  const { isLoggedIn } = useAuth();
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
  const tileDateFormat = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" })

  const handleAddSubmit = (doc: Doc<Activity>) => {
    const newDocs = [...activities, doc];
    setActivities(newDocs.sort((a, b) => a.data.date.getTime() - b.data.date.getTime()));
    console.log(activities);
  }

  const handleAddClose = () => {
    setAddPopupVisible(false);
  }

  const handleDeleteSubmit = (doc: Doc<Activity>) => {
    const newDocs = activities.filter((actDoc) => actDoc.id !== doc.id);
    setActivities([...newDocs]);
    setDocsToDelete([...docsToDelete, doc]);
  }

  useEffect(() => {
    setMonthActivities(createMonthActivities(monthStart, activities));
  }, [monthStart, activities]);

  return (
    <div className={"container mx-auto w-full lg:py-8"}>
      <div className={"flex justify-center items-center lg:mb-4"}>
        <button
          className={"bg-white hover:scale-y-110 py-2 px-4 rounded-lg"}
          onClick={prevMonth}
          disabled={prevDisabled}
        >
          {!prevDisabled && <FontAwesomeIcon icon={faChevronLeft} />}
        </button>
        <h1 className={"text-xl xl:text-2xl font-bold"}>
          {titleDateFormat.format(monthStart)}
        </h1>

        <button
          className={
            "bg-white hover:scale-y-110 font-bold py-2 px-4 rounded-lg"
          }
          onClick={nextMonth}
          disabled={nextDisabled}
        >
          {!nextDisabled && <FontAwesomeIcon icon={faChevronRight} />}
        </button>
        {
          isLoggedIn && 
          <button className={"shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60"} onClick={() => handleSaveChangesClick<Activity>("activities", activities, docsToDelete)}>
            <p>Save Changes</p>
          </button>

        }
      </div>
      <div className={"w-full h-full overflow-x-scroll overflow-y-scroll"}>
        <div className={"inline-flex flex-col w-[800px] min-h-max lg:w-full lg:h-[725px] "}>
          <div className={"grid grid-rows-5 grid-cols-7 gap-y-1 gap-x-0.5 lg:gap-4 p-2"}>
            {monthActivities.map((doc, actIndex) => (
              <div
                key={actIndex}
                className={`${colourActivity(doc.data.type)} shadow-md p-1 lg:p-4 h-fit border border-slate-400`}
              >
                <div className={"flex flex-row justify-between"}>
                  <h3 className={"text-sm lg:text-base text-gray-700"}>{tileDateFormat.format(doc.data.date)}</h3>
                  {
                    isLoggedIn && doc.data.type === ActivityType.Blank &&
                    <button onClick={() => {setSelectedDoc(doc); setAddPopupVisible(true)}}>
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  }
                  {
                    addPopupVisible && 
                    <AddActivityPopup doc={selectedDoc as Doc<Activity>} onSubmit={handleAddSubmit} onClose={handleAddClose} />
                  }
                  {
                    isLoggedIn && doc.data.type !== ActivityType.Blank && 
                    <button onClick={() => {handleDeleteSubmit(doc)}}>
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  }
                </div>
                <h2 className={"text-base lg:text-lg font-semibold"}>{doc.data.title}</h2>
                <p className={"text-sm lg:text-base text-gray-500"}>{doc.data.misc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
