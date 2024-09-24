import React from "react";



function ProfileStats({tokens}) {
  const stats = [
    { label: 'Followers', value: 100 },
    { label: 'Following', value: 100 },
    { label: 'Generations', value: 10 },
    { label: 'Credits Remaining', value: Number(tokens)/100000000 },
  ];

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex gap-5 self-stretch mt-14 max-md:mt-10">
        {stats.slice(0, 2).map((stat, index) => (
          <div key={index} className="grow">
            {stat.value} <span className="text-zinc-600">{stat.label}</span>
          </div>
        ))}
      </div>
      {stats.slice(2).map((stat, index) => (
        <div key={index} className="mt-2.5">
          {stat.value} <span className="text-zinc-600">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}


function ProfileActions({modal}) {
  return (
    <nav className="flex gap-5 text-base font-semibold text-black">
      <button onClick={() => {
        modal(true)
      }} className="overflow-hidden  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 bg-white px-6 py-2.5 rounded-[54px] max-md:px-5">
        Buy Credits
      </button>
      <button className="overflow-hidden px-12 py-2.5 bg-white whitespace-nowrap  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 rounded-[54px] max-md:px-5">
        Edit
      </button>
    </nav>
  );
}

function ProfileInfo({ profile, modal }) {
  return (
    <article className="flex overflow-hidden flex-wrap gap-10 items-start px-7 py-9 rounded-2xl bg-zinc-900 max-md:px-5">
      <div className="flex-auto mt-1.5 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <div className="flex flex-col w-[20%] max-md:ml-0 max-md:w-full">
            <img
              loading="lazy"
              src={profile && profile[2]}
              alt="Profile picture"
              className="object-cover grow shrink-0 max-w-full rounded-xl aspect-[0.8] w-[175px] max-md:mt-10"
            />
          </div>
          <div className="flex flex-col ml-5 w-[61%] max-md:ml-0 max-md:w-full">
            <header className="flex flex-col items-start mt-3.5 w-full text-xl text-white max-md:mt-10">
              <h1 className="text-2xl font-bold">{profile && profile[0]}</h1>
              <p className="mt-1 text-neutral-500">@{profile && profile[1]}</p>
              <p className="mt-1 text-neutral-500">#{profile && profile[3]}</p>
              <ProfileStats tokens={profile && profile[4]} />
            </header>
          </div>
        </div>
      </div>
      <ProfileActions modal={modal} />
    </article>
  );
}

export default ProfileInfo;
