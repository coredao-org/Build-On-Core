import Navbar from "@/components/Navbar";
import SearchComponent from "@/components/Search_Explore";
import React, { useEffect } from "react";
import { Context } from "../Context/ContextProvider";
import RegisterModal from "@/components/RegisterModal";
import Loader from "@/components/Loader";
import Footer from "@/components/Footer";

const Explore = () => {
  const {
    setNavActiveBar,
    setReload,
    account,
    read,
    data,
    likePost,
    savePost,
    setLoader,
    loader,
  } = React.useContext(Context);

  useEffect(() => {
    setNavActiveBar("Explore");
  }, []);
  useEffect(() => {
    // console.log(data.view_all_posts[0]);
    console.log("data?.get_user_profile", data?.get_user_profile);
    console.log("account", account);
    console.log("read > 0", read > 0);
    console.log("data,", data);
  }, [data]);
  return (
    <div className="bg-[#030214]  min-h-screen ">
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

      <div>
        <SearchComponent />
      </div>

      <div>
        <div
          className="grid px-[105px]
        
        grid-cols-12 gap-5 my-6"
        >
          {data?.view_all_posts &&
            // Array.isArray(data.view_all_posts[0]) &&
            data.view_all_posts.map((_data, _index) => {
              console.log("inside explore post", _data, _index);
              return (
                <div key={_index} className=" col-span-3">
                  <div className="flex flex-col gap-5">
                    <img
                      className=" w-[410px] rounded-xl object-cover"
                      src={_data[2]}
                      alt=""
                    />
                    <div className=" flex gap-6 px-7 justify-end">
                      <img
                        onClick={async () => {
                          setLoader(true);
                          await savePost(_index);
                          setLoader(false);
                        }}
                        className=" cursor-pointer h-[26px] object-cover"
                        src="https://i.imgur.com/Yr9KWwO.png"
                        alt="saved  post"
                      />
                      <img
                        onClick={async () => {
                          setLoader(true);
                          await likePost(_index);
                          setLoader(false);
                        }}
                        className=" cursor-pointer h-[26px] object-cover"
                        src="https://i.imgur.com/32UBNkm.png"
                        alt="Like"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default Explore;
