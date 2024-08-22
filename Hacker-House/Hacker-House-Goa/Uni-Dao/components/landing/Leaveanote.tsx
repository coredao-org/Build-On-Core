import React from "react";

function Leaveanote() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Leave a note</h1>
        <form className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="First name"
              className="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="text"
              placeholder="Last name"
              className="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex space-x-4">
            <input
              type="tel"
              placeholder="Phone number"
              className="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-1/2 p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <textarea
            placeholder="Your question"
            className="w-full p-2 border border-gray-300 rounded"
            required
          ></textarea>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Leaveanote;
