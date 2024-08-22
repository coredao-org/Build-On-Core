import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

const Item = ({ title, description, src, price }) => {
  return (
    <Card className="w-[17vw] bg-[#1D1932]  text-white  overflow-hidden hover:scale-105 duration-150 cursor-pointer">
      <CardContent className="p-0">
        <img
          alt="product"
          src="https://picsum.photos/200"
          className=" object-cover h-48 w-96"
        />
      </CardContent>
      <CardContent className="text-center my-2">
        <CardTitle>{title} </CardTitle>
        <div className="flex justify-between items-center">
          <CardDescription className="max-w-[13vw] text-left">
            {description}
          </CardDescription>
          <span className="w-[5vw]">
            Price{" "}
            <span className="text-[#6F4FF2] text-xl">&#x20b9;{price}</span>
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex items-baseline justify-around">
        <Button className="bg-[#6F4FF2] w-[22vw] hover:bg-[#462caf] ">
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Item;
