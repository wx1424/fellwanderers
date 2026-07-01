export enum ActivityType {
  Hike,
  Social,
  Blank,
  Weekend
}

export default interface Activity {
  title: string;
  date: Date;
  endDate?: Date;
  type: ActivityType;
  misc: string;
}
