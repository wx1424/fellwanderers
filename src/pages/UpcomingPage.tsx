import { useEffect, useState } from "react";

import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import Calendar from "../components/Calendar";
import { setCollectionState, Doc } from "../../firebaseAPI"
import Activity from "../types/Activity.ts";


export default function UpcomingPage() {
  const [activityDocs, setActivityDocs] = useState<Doc<Activity>[]>([]);
  
  useEffect(() => {
    setCollectionState<Activity>(
      "activities", 
      (a, b) => a.date.getTime() - b.date.getTime(), 
      setActivityDocs, 
      (a) => { a.date = new Date(a.date); if (a.endDate) a.endDate = new Date(a.endDate); return a; },
      (a) => { a.date = a.date.toDate(); if (a.endDate) a.endDate = a.endDate.toDate(); return a as Activity; }
      );
  }, []);
  return (
    <>
      <PageHeader />
      <Calendar activities={[...activityDocs]} setActivities={setActivityDocs}/>
      <PageFooter />
    </>
  )
}