import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";

const people = [
  {
    name: 'Harry Su',
    role: 'Co-President',
    image: 'committee/harrys.jpeg',
    course: '4th year Computing'
  },
  {
    name: 'Zaynub Jamil',
    role: 'Co-President',
    image: 'committee/zaynub.jpeg',
    course: '4th year Medicine'
  },
  {
    name: 'Hannah Ghafur',
    role: 'Treasurer',
    image: 'committee/hannah.jpeg',
    course: '4th year Physics'
  },
  {
    name: 'Ivy Wang',
    role: 'Secretary',
    image: 'committee/archive-committee/ivy.jpg',
    course: '3rd year Biochemistry'
  },
  {
    name: 'Dia Ajmera',
    role: 'Deputy President Communication',
    image: 'committee/archive-committee/dia.jpg',
    course: '4th year Medicine'
  },
  {
    name: 'Cathy Song',
    role: 'Deputy President Competitions',
    image: 'committee/cathy.png',
    course: '2nd year'
  },
  {
    name: 'Elişka Hovorkova',
    role: 'Deputy President Socials',
    image: 'committee/eliska.jpeg',
    course: '3rd year Physics'
  },
  {
    name: 'Will Xiao',
    role: 'Deputy President Tours',
    image: 'committee/will.jpg',
    course: 'who knows'
  },
  {
    name: 'Kristin Li',
    role: 'Deputy President Weekend Trips',
    image: '../person.png',
    course: 'who knows'
  },
  {
    name: 'Rajveer Daga',
    role: 'Deputy President Activities',
    image: 'committee/archive-committee/rajveer.jpg',
    course: '3rd year Physics'
  },
  {
    name: 'Ivy Xue',
    role: 'Deputy President Equipment',
    image: 'committee/ivyx.jpeg',
    course: 'Management'
  },
  {
    name: 'Harry Kerfoot',
    role: 'Deputy President Logistics',
    image: 'committee/harryk.jpeg',
    course: '2nd year Physics'
  },
  {
    name: 'Tate Trussell-Richards',
    role: 'Deputy President Tea Break',
    image: 'committee/tate.jpeg',
    course: '2nd year Physics'
  },
  {
    name: 'Mateusz Sejda',
    role: 'Hike Leader',
    image: 'committee/archive-committee/mateusz.jpg',
    course: '3rd year Physics'
  },
  {
    name: 'Sean Chong',
    role: 'Hike Leader',
    image: 'committee/sean.jpeg',
    course: '4th year Medicine'
  },
  {
    name: 'Cazza Chen',
    role: 'Hike Leader',
    image: 'committee/cazza.jpeg',
    course: '4th year Physics'
  },
  {
    name: 'Chaitanya Khemani',
    role: 'Hike Leader',
    image: 'committee/chaitanya.jpeg',
    course: '3rd year EEE'
  },
  {
    name: 'Ming Guo Foo',
    role: 'Hike Leader',
    image: 'committee/mingguo.jpeg',
    course: 'dunno'
  }
]

export default function CommitteePage() {
  return (
    <>
      <PageHeader />
      <div className="bg-white py-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-8 px-6 lg:px-8 lg:grid-cols-3">
          <div className="max-w-2xl">
            <h2 className="font-helvetica-black font-oblique text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Meet your committee!</h2>
            <p className="mt-6 sm:text-lg leading-8 text-gray-600">
              Ever wanted to know the faces behind the organising of all of those fantastic trips you've been on? Well, here they are. Scary though we may appear, we promise we're actually a really nice bunch! If you have any questions, problems, or need any support, we'll always be happy to help!
            </p>
          </div>
          <ul role="list" className="grid gap-x-12 gap-y-8 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2 ml-4">
            {people.map((person) => (
              <li key={person.name}>
                <div className="overflow-visible relative max-w-sm mx-auto bg-logoGreen-light border border-logoGreen-dark shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6">
                  <img className="absolute -left-6 w-24 h-24 border border-logoGreen-dark rounded-full shadow-lg"
                       src={person.image} alt={person.name}/>
                    <div className="flex flex-col py-5 pl-24">
                      <strong className="font-helvetica-black font-oblique text-slate-900 text-sm font-medium">{person.name}</strong>
                      <strong className="text-slate-500 text-sm">{person.role}</strong>
                      <span className="text-slate-500 text-sm font-medium">{person.course}</span>
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