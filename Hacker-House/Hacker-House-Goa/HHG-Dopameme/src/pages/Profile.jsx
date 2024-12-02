import Navbar from '@/components/Navbar'
import ProfileInfo from '@/components/ProfileInfo'
import React, { useState, useEffect } from "react";
import { Context } from "../Context/ContextProvider";
import RegisterModal from '@/components/RegisterModal';
import Loader from '@/components/Loader';
import BuyCoin from '@/components/BuyCoin';

const Profile = () => {
  const [userPost, setUserPost] = useState(null)
  const [savedPost, setSavedPost] = useState(null)
  const [buyCoinModal, setBuyCoinModal] = useState(false)
  const {
    setNavActiveBar,
    setLoader,
    likePost,savePost,
    setReload,
    account,
    read,
    data,
    loader,
  } = React.useContext(Context);

  useEffect(() => {
    setNavActiveBar("profile");
    // setReload((prev) => prev + 1);
    if (data && data.get_user_profile) {
      
      setUserPost(data?.get_user_profile[5]);
      setSavedPost(data?.get_user_profile[6]);
    }
  }, [data]);

  const [activeButton, setActiveButton] = useState('public')

  function handleActiveButton(button) {
    setActiveButton(button);
  }

    useEffect(() => {
      // console.log(data.view_all_posts[0]);
      // console.log("userpost", data?.view_all_posts[0][2],userPost);
    }, [userPost]);
  return (
    <div className="bg-[#030214] pb-40 min-h-screen ">
      {/* Buycoin */}
      <div
        className={` top-0 left-0 w-full h-full z-40 backdrop-filter backdrop-blur-sm ${
          buyCoinModal ? "fixed" : "hidden"
        } `}
      >
        <BuyCoin run={setBuyCoinModal} />
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center min-h-[70vh] "></div>
      </div>
      {/* Buycoin end */}
      {/* loader */}
      <div
        className={` top-0 left-0 w-full h-full z-40 backdrop-filter backdrop-blur-sm ${
          loader ? "fixed" : "hidden"
        } `}
      >
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex flex-col items-center justify-center min-h-[70vh] ">
          <Loader run={loader} />
        </div>
      </div>
      {/* loader end*/}
      {/* Register Popup */}
      <div
        className={` top-0 left-0 w-full h-full z-40 backdrop-filter backdrop-blur-sm ${
          data?.get_user_profile == null && account && read > 0
            ? "fixed"
            : "hidden"
        } `}
      >
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center min-h-[70vh] ">
          <RegisterModal reload={setReload} />
        </div>
      </div>
      <div>
        <Navbar />
      </div>

      <div className=" flex flex-col px-[105px]">
        <ProfileInfo profile={data.get_user_profile} modal={setBuyCoinModal} />
      </div>

      <div className=" mt-8 flex justify-center items-center gap-4 ">
        <div
          onClick={() => {
            handleActiveButton("public");
          }}
          className="w-max  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 relative text-[1.25rem] font-medium font-inter text-white text-left inline-block"
        >
          Public Memes
          {activeButton == "public" && (
            <div className=" mt-2 w-full h-0.5 bg-white"></div>
          )}
        </div>
        <div
          onClick={() => {
            handleActiveButton("private");
          }}
          className="w-max  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 relative text-[1.25rem] font-medium font-inter text-white text-left inline-block"
        >
          Private Memes
          {activeButton == "private" && (
            <div className=" mt-2 w-full h-0.5 bg-white"></div>
          )}
        </div>
        <div
          onClick={() => {
            handleActiveButton("saved");
          }}
          className="w-max  cursor-pointer hover:scale-105 hover:opacity-80 transition-all duration-200 relative text-[1.25rem] font-medium font-inter text-white text-left inline-block"
        >
          Saved Memes
          {activeButton == "saved" && (
            <div className=" mt-2 w-full h-0.5 bg-white"></div>
          )}
        </div>
      </div>

      <div className="grid px-[105px] grid-cols-12 gap-5 my-6">
        {activeButton == "public" &&
          userPost?.map((post, _index) => {
            let _num = Number(post) - 1;
            console.log(data?.view_all_posts[_num], _num);
            return (
              <div key={_index} className=" col-span-3">
                <div className="flex flex-col gap-5">
                  <img
                    draggable={`false`}
                    className=" w-[410px] object-cover"
                    src={data?.view_all_posts[_num][2]}
                    alt=""
                  />
                  <div className=" flex gap-6 px-7 justify-end">
                    <img
                      draggable={`false`}
                      onClick={async () => {
                        setLoader(true);
                        await savePost(_index);
                        setLoader(false);
                      }}
                      className=" cursor-pointer h-[26px] object-cover"
                      src="https://i.imgur.com/Yr9KWwO.png"
                      alt=""
                    />
                    <img
                      draggable={`false`}
                      onClick={async () => {
                        setLoader(true);
                        await likePost(_index);
                        setLoader(false);
                      }}
                      className=" cursor-pointer h-[26px] object-cover"
                      src="https://i.imgur.com/32UBNkm.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            );
          })}

        {activeButton == "saved" &&
          savedPost?.map((post, _index) => {
            let _num = Number(post);
            console.log(data?.view_all_posts[_num], _num);
            return (
              <div key={_index + post} className=" col-span-3">
                <div className="flex flex-col gap-5">
                  <img
                    draggable={`false`}
                    className=" w-[410px] object-cover"
                    src={data?.view_all_posts[_num][2]}
                    alt=""
                  />
                  <div className=" flex gap-6 px-7 justify-end">
                    <img
                      draggable={`false`}
                      onClick={async () => {
                        setLoader(true);
                        await savePost(_index);
                        setLoader(false);
                      }}
                      className=" cursor-pointer h-[26px] object-cover"
                      src="https://i.imgur.com/Yr9KWwO.png"
                      alt=""
                    />
                    <img
                      draggable={`false`}
                      onClick={async () => {
                        setLoader(true);
                        await likePost(_index);
                        setLoader(false);
                      }}
                      className=" cursor-pointer h-[26px] object-cover"
                      src="https://i.imgur.com/32UBNkm.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Profile
