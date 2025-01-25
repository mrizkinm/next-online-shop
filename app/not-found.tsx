import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className="max-w-[1240px] px-4 sm:px-6 lg:px-8 mx-auto w-full">
      <div className="flex flex-col items-center text-center justify-center h-screen">
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="text-lg mt-2">Oops! The page you are looking for does not exist.</p>
        <Link
          href="/"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  )
}

export default NotFound