import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import CoinExDisplay from "./CoinExDisplay";

const RightSideBar = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const location = useLocation();
  const render =
    location.pathname != "/messages" && location.pathname != "/swapper";
  const [searchParams] = useSearchParams();
  const showForm = searchParams.get("mode") !== "special";
  const isProduct = location.pathname !== "/home";
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  console.log(render, location.pathname)

  if (!render) {
    return <></>;
  }
  return (
    <div className="flex flex-col items-center text-white fixed overflow-y-auto overflow-x-hidden bg-[#14162E] right-0 p-14 w-[25vw] min-   h-screen">
      {isProduct ? (
        <Card className="bg-[#1D1932] w-[20vw]">
          <CardHeader>
            <CardTitle className="text-white">Post a product</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="title" />
            <Textarea className="my-4" placeholder="description" />
            <Input placeholder="price" />
            <Input
              className="my-4"
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imagePreview && (
              <div className="my-4">
                <div className="my-2 w-full h-40 bg-gray-700 rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <CardFooter>
              <Button className="bg-[#6F4FF2] w-[22vw] hover:bg-[#462caf] ">
                Post
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-[#1D1932] w-[20vw]">
          <CardHeader>
            <CardTitle className="text-white">Post Something</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea className="my-4" placeholder="content" />
            <Input
              className="my-4"
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imagePreview && (
              <div className="my-4">
                <div className="my-2 w-full h-40 bg-gray-700 rounded-md overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            <CardFooter>
              <Button className="bg-[#6F4FF2] w-[22vw] hover:bg-[#462caf] ">
                Post
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      )}
      <h1 className="mt-9 font-bold text-2xl  ">CoinEx Coin Update</h1>
      <Card className="bg-[#1D1932] text-white w-[20vw]">
        <CardContent className="flex p-5 flex-col justify-center items-center">
          {/* Coins start */}
          <CoinExDisplay />
          {/* Coins end */}
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSideBar;
