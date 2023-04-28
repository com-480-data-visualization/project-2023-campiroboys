import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

function Option() {
  return (
    <a
      href="#"
      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
      rel="noopener noreferrer"
    >
      <h2 className="mb-3 text-2xl font-semibold">
        Option
      </h2>
      <p className="m-0 max-w-[30ch] text-sm opacity-50">
        Find more.
      </p>
    </a>
  )
}

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="relative flex place-items-center">
        <h1 className="mb-3 text-5xl font-semibold">Zurich Parking Spaces</h1>
      </div>
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Option />
        <Option />
        <Option />
        <Option />
      </div>
    </main>
  )
}
