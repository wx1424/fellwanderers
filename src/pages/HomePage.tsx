import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPersonHiking,
  faArrowRight,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";
import StyledLink from "../components/StyledLink.tsx";

const socLink =
  "https://www.imperialcollegeunion.org/activities/a-to-z/fellwanderers";
const joinLink =
  "https://www-s.imperialcollegeunion.org/shop/product/60-fellwanderers-imperial-hiking-society-mship-25-26/";

function HeroSection() {
  const backgroundImageStyle = {
    backgroundImage: `url(/hike_pics/lake-district-2025.jpg)`,
  };
  return (
    <section
      className={
        "bg-cover h-screen flex flex-col justify-start items-start py-8"
      }
      style={backgroundImageStyle}
    >
      <div className={"w-full flex flex-col space-y-2 px-10"}>
        <h1 className={"text-4xl sm:text-6xl font-bold"}>Fellwanderers</h1>
        <h2 className={"text-2xl sm:text-4xl pb-5"}>Imperial's Hiking Society</h2>
        <div className={"flex flex-row justify-start space-x-5"}>
          <StyledLink
            href={joinLink}
            className={
              "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border font-semibold rounded-md no-underline hover:bg-green-900/60"
            }
            children={
              <div>
                <FontAwesomeIcon icon={faPersonHiking} /> Join Now{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            }
          />
          <StyledLink
            href={socLink}
            className={
              "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border font-semibold rounded-md no-underline hover:bg-green-900/60"
            }
            children={
              <div>
                <FontAwesomeIcon icon={faCircleInfo} /> More Info{" "}
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            }
          />
        </div>
      </div>
    </section>
  );
}

interface Desc {
  title: string;
  para: string;
  image: string;
  alt: string;
}

function StickyDescription() {
  const descs: Desc[] = [
    {
      title: "About Us",
      para: "We are Fellwanderers, the hiking society for Imperial College London - your gateway to discovering the breathtaking landscapes and hidden gems of the United Kingdom. We will take you on unforgettable hiking experiences from day hikes, thrilling weekend trips, and captivating holiday tours across the UK. We are also looking for experienced hikers to help out with leading these trips, so get in touch if you are interested.",
      image: "hike_pics/isle-of-skye-2026.jpg",
      alt: "Isle of Skye 2026"
    },
    {
      title: "Explore Nature, Create Memories",
      para: "But we're more than just a hiking club; we're a community of like-minded individuals who share a passion for the great outdoors. When you join us, you're not just signing up for hikes; you're joining a group of kindred spirits who relish the opportunity to escape the bustling city of London and immerse themselves in the tranquility of nature. Our hikes aren't just about the breathtaking views and challenging trails; they're about the connections you make and the conversations you have along the way.",
      image: "hike_pics/bergamesque-alps-2025.jpg",
      alt: "Bergamesque Alpss 2025"
    },
    {
      title: "Hiking and So Much More",
      para: "From striking up great conversations while trekking through beautiful landscapes to unforgettable social events both on campus and in the heart of London, our club offers a vibrant social aspect that complements our outdoor adventures. Whether it's a casual chat during a hike or a lively gathering at one of our socials, you'll find yourself surrounded by welcoming faces and fantastic company.",
      image: "hike_pics/lake-district-2025-2.jpg",
      alt: "Lake District 2025"
    },
    {
      title: "Join the Adventure",
      para: "If you're seeking a club that combines the thrill of hiking through stunning locations with the joy of forging meaningful connections, you've found your perfect match. Join us, and let's explore the wonders of the UK together, one step at a time. At Fellwanderers, we're not just a club; we're a community of nature enthusiasts, adventurers, and friends. Get ready to leave the city behind, embark on unforgettable journeys, and create memories that will last a lifetime. Welcome to Fellwanderers!",
      image: "hike_pics/surrey-three-peaks-2025.jpg",
      alt: "Surrey Three Peaks 2025"
    },
  ]
  
  return (
    <div className="flex-col">
      {descs.map((desc) => (
          <div className="relative">
            {/* Text Section */}
            <div className="h-fit bg-gray-200">
                <div className="h-full mx-auto lg:w-1/3 p-4 flex flex-col justify-center">
                  <h1 className="text-xl font-semibold text-left text-gray-800">
                    {desc.title}
                  </h1>
                  <p className="my-2 text-lg text-gray-600 text-left">
                    {desc.para}
                  </p>
                </div>
            </div>
            
            {/* Sticky Image */}
            <div className="top-0 h-screen">
              <img src={desc.image} alt={desc.alt} className="object-cover h-full w-full" />
            </div>
          </div>
      ))
      }
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    localStorage.clear();
  }, []);
  return (
    <div>
      <PageHeader />
      <HeroSection />
      <StickyDescription />
      <PageFooter />
    </div>
  );
}
