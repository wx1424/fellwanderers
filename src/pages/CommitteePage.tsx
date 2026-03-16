import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";

const people = [
  {
    name: 'Daniel Logue',
    role: 'President',
    image: 'committee/dan.jpg'
  },
  {
    name: 'Zong Junn Lee',
    role: 'Co-President',
    image: 'committee/zong.jpeg'
  },
  {
    name: 'Ethan Clark',
    role: 'Treasurer, Deputy President Logistics',
    image: 'committee/ethan.jpeg'
  },
  {
    name: 'Chris O\'Sullivan',
    role: 'Secretary, Deputy President Activities',
    image: 'committee/chris.jpeg'
  },
  {
    name: 'Euan Turner',
    role: 'Deputy President Communication',
    image: 'committee/euan.jpeg'
  },
  {
    name: 'Daniel Hesk',
    role: 'Deputy President Competitions',
    image: 'committee/daniel.jpeg'
  },
  {
    name: 'Sydney Xie',
    role: 'Deputy President Socials',
    image: 'committee/sydney.jpeg'
  },
  {
    name: 'Felix Aubugeau-Williams',
    role: 'Deputy President Tours',
    image: 'committee/felix.jpeg'
  },
  {
    name: 'Sami Kibal',
    role: 'Deputy President Weekend Trips',
    image: 'committee/sami.jpeg'
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
                      <strong className="text-slate-900 text-sm font-medium">{person.name}</strong>
                      <span className="text-slate-500 text-sm font-medium">{person.role}</span>
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