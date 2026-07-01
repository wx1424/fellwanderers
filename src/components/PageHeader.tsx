import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Tab } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import LoginPopup from "./LoginPopup.tsx";

export default function PageHeader() {
  const links: { id: number; link: string; text: string }[] = [
    { id: 0, link: "/", text: "Home" },
    { id: 1, link: "/activities", text: "Upcoming" },
    { id: 2, link: "/committee", text: "Committee" },
    { id: 3, link: "/archive", text: "Trip reports" },
    { id: 4, link: "/faqs", text: "FAQs" }
  ];
  const location = useLocation();
  const page = links.filter((link) => link.link === location.pathname)[0].id;
  const { isLoggedIn } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleLogout = () => {
    signOut(auth).catch((error) => console.error(error.message));
  };

  const btnStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";

  return (
    <div
      className={
        "shadow-md flex flex-col sm:flex-row space-y-2 justify-around items-center w-screen h-30 sm:px-4 py-2 sm:py-4 mb-4"
      }
    >
      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
      <NavLink to={"/"} className={""}>
        <img
          className={"px-5 h-20 mx-auto"}
          src={"logo.png"}
          alt={"society logo"}
        />
      </NavLink>
      <div className={"w-full sm:w-auto"}>
        <Tab.Group selectedIndex={page}>
          <Tab.List
            className={
              "max-h-12 mx-auto flex lg:inline-flex w-full lg:min-w-max justify-around lg:justify-center items-center sm:rounded-xl bg-logoGreen-light border-logoGreen-dark border-t border-b sm:border py-2 px-1 lg:space-x-2"
            }
          >
            {links.map((link) => (
              <NavLink key={link.id} to={link.link} className={"inline-block max-w-full"}>
                <Tab
                  key={link.id}
                  className={({ selected }) =>
                    "w-full rounded-md px-1 sm:px-2.5 py-2 lg:py-2.5 text-sm leading-5 text-black font-semibold " +
                    "ring-white ring-opacity-60 ring-offset-2 ring-offset-logoGreen-light " +
                    "focus:outline-none focus:ring-2 ".concat(
                      selected ? "bg-white shadow" : "hover:bg-white/20",
                    )
                  }
                >
                  <span className={"font-oblique"}>{link.text}</span>
                </Tab>
              </NavLink>
            ))}
          </Tab.List>
        </Tab.Group>
      </div>
      {!isLoggedIn && (
        <button className={btnStyle} onClick={() => setShowLoginPopup(true)}>
          <FontAwesomeIcon icon={faArrowRightToBracket} /> Sign In
        </button>
      )}
      {isLoggedIn && (
        <button className={btnStyle} onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out
        </button>
      )}
    </div>
  );
}
