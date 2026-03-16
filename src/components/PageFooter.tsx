import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faBagShopping, faArrowRightToBracket,  faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { signOut } from "firebase/auth";

import { auth } from "../../firebase.ts";
import { useAuth } from "../contexts/AuthContext.tsx";
import LoginPopup from "./LoginPopup.tsx";
import StyledLink from "../components/StyledLink.tsx";

const instaLink = "https://www.instagram.com/icfellwanderers";
const shopLink = "https://www.imperialcollegeunion.org/student-group-shop?groupId=49";
const mailLink = "https://forms.office.com/Pages/ResponsePage.aspx?id=B3WJK4zudUWDC0-CZ8PTBwDrjO1uK9tNvqNaN-rdDE5UNktTTFBBT1kwWFRFTVRTNUtMNzk3UkpDWCQlQCN0PWcu";

export default function PageFooter() {
  const [showLoginPopup, setShowLoginPopup] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();
  const handleLoginButtonClick = () => {
    setShowLoginPopup(true);
  }
  const handleLoginClose = () => {
    setShowLoginPopup(false);
  }
  const handleLogoutButtonClick = () => {
    signOut(auth)
      .catch((error) => {
        console.error(error.message);
      })
  }

  const linkStyle =
    "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";
  const buttonStyle = "m1-auto " + linkStyle;
    return (
    <div className={"w-screen h-20 px-0 sm:px-2"}>
      <div className={"bg-white pt-2 mb-4 shadow-md"}></div>
      <div className={"flex flex-row justify-center sm:justify-between items-center space-x-2 sm:space-x-5 px-1 sm:px-2"}>
        {
          showLoginPopup && 
          <LoginPopup onClose={handleLoginClose} />
        }

        {
          !isLoggedIn && 
          <button className={buttonStyle} onClick={handleLoginButtonClick}>
            <div>
              <FontAwesomeIcon icon={faArrowRightToBracket} /> Sign In
            </div>
          </button>
        }
        
        {
          isLoggedIn &&
          <button className={buttonStyle} onClick={handleLogoutButtonClick}>
            <div>
              <FontAwesomeIcon icon={faArrowRightFromBracket} /> Sign Out
            </div>
          </button>
        }
        <div
        className={
          "flex flex-row justify-center sm:justify-end space-x-2 sm:space-x-5 items-center"
        }
      >
        
        <StyledLink
          href={instaLink}
          className={linkStyle}
          children={
            <div>
              <FontAwesomeIcon icon={faInstagram} /> Follow Us
            </div>
          }
        />
        <StyledLink
          href={mailLink}
          className={linkStyle}
          children={
            <div>
              <FontAwesomeIcon icon={faEnvelope} /> Mailing List
            </div>
          }
        />
        <StyledLink
          href={shopLink}
          className={linkStyle}
          children={
            <div>
              <FontAwesomeIcon icon={faBagShopping} /> Union Shop
            </div>
          }
        />
      </div>
      </div>
    </div>
  );
}
