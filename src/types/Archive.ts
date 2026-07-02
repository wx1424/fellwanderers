export default interface Archive {
  title: string;
  desc: string;
  thumbnail: string;
  order: number;
  route: string;
  link?: string;
  draft?: boolean;
}
