import React from 'react'

function Buttons() {
  return (
    <div>
        <button className="px-8 py-2 border border-black bg-transparent text-black  dark:border-white relative group transition duration-200">
        <div className="absolute -bottom-2 -right-2 bg-yellow-300 h-full w-full -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-200" />
        <span className="relative">
        Unapologetic
        </span>
        </button>
  </div>
  )
}

export default Buttons