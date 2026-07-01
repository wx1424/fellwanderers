export enum ActivityType {
  Hike,
  Social,
  Weekend,
  Tour,
  Blank
}

export default interface Activity {
  title: string;
  date: Date;
  endDate?: Date;
  type: ActivityType;
  misc: string;
}
