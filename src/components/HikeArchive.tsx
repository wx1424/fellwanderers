import ImageSlideshow from "./ImageSlideshow.tsx";
import Archive from "../types/Archive.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMapLocationDot} from "@fortawesome/free-solid-svg-icons";
import StyledLink from "./StyledLink.tsx";

export default function HikeArchive(archive: Archive) {
  const style =
    "h-full w-full flex rounded-md border-4 border-logoGreen-dark flex-col ".concat(
      (archive.order % 2 == 0) ? "sm:flex-row" : "sm:flex-row-reverse",
    );
  return (
    <div className={"h-[32rem] px-4 lg:px-10 py-5"}>
      <div className={style}>
        <div className={"flex-1 overflow-y-scroll mb-1 px-2 lg:px-8"}>
          <h1
            className={
              "sticky bg-white bg-opacity-95 top-0 text-xl lg:text-3xl font-bold py-2"
            }
          >
            {archive.title}
            {"\t"}
            {archive.route !== "" && <StyledLink
              href={archive.route}
              className={
                "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border font-semibold rounded-md no-underline hover:bg-green-900/60"
              }
              children={
                <div>
                  <FontAwesomeIcon icon={faMapLocationDot}/>
                </div>
              }
            />}
          </h1>
          
          <p className={"text-sm lg:text-base"}>{archive.desc}</p>
        </div>
        <div className={"flex-1 h-full"}>
          <ImageSlideshow images={archive.images} />
        </div>
      </div>
    </div>
  );
}
