import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faBagShopping } from "@fortawesome/free-solid-svg-icons";
import StyledLink from "../components/StyledLink.tsx";

const whatsappLink = "https://chat.whatsapp.com/C34zRmjyk8vCTr9XKHxlWU"
const instaLink = "https://www.instagram.com/icfellwanderers";
const shopLink = "https://www.imperialcollegeunion.org/student-group-shop?groupId=49";
const mailLink = "https://forms.office.com/Pages/ResponsePage.aspx?id=B3WJK4zudUWDC0-CZ8PTBwDrjO1uK9tNvqNaN-rdDE5UNktTTFBBT1kwWFRFTVRTNUtMNzk3UkpDWCQlQCN0PWcu";

const linkStyle = "shadow-md inline-block p-2 bg-logoGreen-light border-logoGreen-dark border text-xs sm:text-sm font-semibold rounded-md no-underline hover:bg-green-900/60";

export default function PageFooter() {
  return (
    <div className={"w-screen h-20 px-0 sm:px-2"}>
      <div className={"bg-white pt-2 mb-4 shadow-md"}></div>
      <div className={"flex flex-row justify-center sm:justify-center items-center space-x-2 sm:space-x-5 px-1 sm:px-2"}>
        <StyledLink href={whatsappLink} className={linkStyle} children={<div><FontAwesomeIcon icon={faWhatsapp} /> WhatsApp</div>} />
        <StyledLink href={instaLink} className={linkStyle} children={<div><FontAwesomeIcon icon={faInstagram} /> Follow Us</div>} />
        <StyledLink href={mailLink} className={linkStyle} children={<div><FontAwesomeIcon icon={faEnvelope} /> Mailing List</div>} />
        <StyledLink href={shopLink} className={linkStyle} children={<div><FontAwesomeIcon icon={faBagShopping} /> Union Shop</div>} />
      </div>
    </div>
  );
}
