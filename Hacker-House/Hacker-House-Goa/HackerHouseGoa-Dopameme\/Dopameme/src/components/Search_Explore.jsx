import React from 'react';
// import TagList from './TagList';
// import UserCard from './UserCard';

const SearchComponent = () => {
  const tags = ['Web 3.0', 'Web 3.0', 'Web 3.0', 'Web 3.0', 'Web 3.0', 'Web 3.0', 'Web 3.0', 'Web 3.0'];
  const users = Array(4).fill({ name: 'User 1' });

  return (
    <main className="flex overflow-hidden flex-col items-center px-20 pt-4 pb-11 bg-slate-950 max-md:px-5 max-md:pt-24">
      <section className="flex flex-col w-full max-w-[1229px] max-md:max-w-full">
        <div className="flex overflow-hidden flex-wrap gap-5 justify-between self-center px-2 py-1.5 max-w-full text-xl font-medium leading-none text-center whitespace-nowrap bg-zinc-900 rounded-[81px] w-[945px]">
          <div className="flex gap-5 my-auto text-zinc-500">
            <img
              loading="lazy"
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/abd82c507e83b718b85b77de2672e48ac3359e50ce2dfae4f3054519f032d8e6?apiKey=b93734ecdcb94378af862d5b2ec71620&&apiKey=b93734ecdcb94378af862d5b2ec71620"
              alt=""
              className="object-contain shrink-0 aspect-square w-[31px]"
            />
            <input
              placeholder="Friend"
              type="text"
              className=" outline-none bg-transparent"
            />
          </div>
          <div className="overflow-hidden px-7 py-2.5 text-black bg-white rounded-[81px] max-md:px-5">
            Search
          </div>
        </div>
        <div className="flex w-full  max-w-[945px] gap-3 mt-5 mx-auto">
          <div className=" flex items-center justify-center relative rounded-[81px] bg-[#2b2b2b] border-[#525252] border-[1px] border-solid box-border h-[2.25rem] overflow-hidden text-center text-[1.125rem] text-white font-inter">
            <div className=" w-max p-3 leading-[1.25rem] font-medium">
              Web 3.0
            </div>
          </div>

          <div className=" flex items-center justify-center relative rounded-[81px] bg-[#2b2b2b] border-[#525252] border-[1px] border-solid box-border h-[2.25rem] overflow-hidden text-center text-[1.125rem] text-white font-inter">
            <div className=" w-max p-3 leading-[1.25rem] font-medium">
              Web 3.0
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SearchComponent;