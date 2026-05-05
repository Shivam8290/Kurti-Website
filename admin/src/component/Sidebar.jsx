import React from 'react'
import { assets } from '../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-16 flex-col bg-white pt-6 shadow-md transition-all duration-300 md:w-48">

      <NavLink to="/add" className={({ isActive }) =>
        `flex items-center justify-center md:justify-start gap-3 px-3 md:px-6 py-4 my-1 mx-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-200 font-medium' : ''}`
      }>
        <img src={assets.add} alt="Add" className="w-6 h-6 object-contain shrink-0" />
        <p className="text-gray-700 hidden md:block">Add</p>
      </NavLink>

      <NavLink to="/list" className={({ isActive }) =>
        `flex items-center justify-center md:justify-start gap-3 px-3 md:px-6 py-4 my-1 mx-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-200 font-medium' : ''}`
      }>
        <img src={assets.list} alt="List" className="w-6 h-6 object-contain shrink-0" />
        <p className="text-gray-700 hidden md:block">List</p>
      </NavLink>

      <NavLink to="/orders" className={({ isActive }) =>
        `flex items-center justify-center md:justify-start gap-3 px-3 md:px-6 py-4 my-1 mx-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${isActive ? 'bg-gray-200 font-medium' : ''}`
      }>
        <img src={assets.order} alt="Orders" className="w-6 h-6 object-contain shrink-0" />
        <p className="text-gray-700 hidden md:block">Orders</p>
      </NavLink>

    </div>
  )
}

export default Sidebar
