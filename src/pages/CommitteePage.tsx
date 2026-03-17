import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";

const people = [
  {
    name: 'Daniel Logue',
    role: 'President',
    image: 'committee/dan.jpg',
    course: '3rd year Chemistry'
  },
  {
    name: 'Harry Su',
    role: 'Co-President',
    image: 'committee/harry.jpg',
    course: '3rd year Computing'
  },
  {
    name: 'Zaynub Jamil',
    role: 'Treasurer',
    image: 'committee/zaynub.jpg',
    course: '3rd year Medicine'
  },
  {
    name: 'Ivy Wang',
    role: 'Secretary',
    image: 'committee/ivy.jpg',
    course: '2nd year Biochemistry'
  },
  {
    name: 'Rashika Kiritharan',
    role: 'Deputy President Communication',
    image: 'committee/rashika.png',
    course: '3rd year Medicine'
  },
  {
    name: 'Dia Ajmera',
    role: 'Deputy President Competitions',
    image: 'committee/dia.jpg',
    course: '3rd year Medicine'
  },
  {
    name: 'Will Xiao',
    role: 'Deputy President Socials',
    image: 'committee/will.jpg',
    course: '2nd year Maths'
  },
  {
    name: 'Mateusz Sejda',
    role: 'Deputy President Tours',
    image: 'committee/mateusz.jpg',
    course: '2nd year Physics'
  },
  {
    name: 'Sean Chong',
    role: 'Deputy President Weekend Trips',
    image: 'committee/sean.jpg',
    course: '3rd year Medicine'
  },
  {
    name: 'Rajveer Daga',
    role: 'Deputy President Activities',
    image: 'committee/rajveer.jpg',
    course: '2nd year Physics'
  },
  {
    name: 'Mihnea Lazar',
    role: 'Deputy President Equipment',
    image: 'committee/mihnea.jpg',
    course: '3rd year Chemistry'
  },
  {
    name: 'Eliska Hovorkova',
    role: 'Deputy President Logistics',
    image: 'eliska.jpg',
    course: '2nd year Physics'
  }
]

export default function CommitteePage() {
  return (
    <>
      <PageHeader />
      <div className="bg-white py-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-8 px-6 lg:px-8 lg:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet your committee</h2>
            <p className="mt-6 sm:text-lg leading-8 text-gray-600">
              We're here to assist and support you on your hiking adventures. Whether you're a seasoned hiker or new to the trail, our committee members are ready to help.
              For any enquiries, ideas, or assistance, feel free to email us at <a href={"mailto:fellsoc@imperial.ac.uk"} className={"underline text-blue-600 hover:text-blue-800 visited:text-purple-600"} target={"_blank"}>fellsoc@imperial.ac.uk</a>, or message us through the WhatsApp chat. Let's embark on unforgettable hiking experiences together!
            </p>
          </div>
          <ul role="list" className="grid gap-x-12 gap-y-8 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2 ml-4">
            {people.map((person) => (
              <li key={person.name}>
                <div className="overflow-visible relative max-w-sm mx-auto bg-logoGreen-light border border-logoGreen-dark shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6">
                  <img className="absolute -left-6 w-24 h-24 border border-logoGreen-dark rounded-full shadow-lg"
                       src={person.image} alt={person.name}/>
                    <div className="flex flex-col py-5 pl-24">
                      <strong className="text-slate-900 text-sm font-medium">{person.name + ' • ' + person.role}</strong>
                      <span className="text-slate-500 text-sm font-mediuim">{person.course}</span>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <PageFooter />
    </>
  )
}