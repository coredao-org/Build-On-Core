// "use client";

import Footer from "@/components/shared/footer";
import MaxWrapper from "@/components/shared/max-wrapper";
import React from "react";

export default function LandingPageLayout({ children }: ILayout) {
  // console.log(
  //   "\n\n               :*#*:                :*#*:\n             :%@@@@@#.            .#@@@@@%.\n            *@@@@@@@@@*.        .*@@@@@@@=+=\n          *@@@@@@@@@@@@@*      *@@@@@@@=.=+++-\n        =@@@@@@@=.+@@@@@@@=  =@@@@@@@+  +++++++:\n      =@@@@@@@*.    *@@@%: =@@@@@@@*.    -+++++++:\n    :@@@@@@@#.       .#- :@@@@@@@%.       .=++++++=.\n    %@@@@@%:           .%@@@@@@%.           .=+++++=\n    :@@@@@@@#.       .#@@@@@@@:            =+++++++.\n      =@@@@@@@*     *@@@@@@@=            -+++++++:\n        +@@@@@@@  +@@@@@@@+            :+++++++-\n          *@@@@:=@@@@@@@*            :+++++++=\n           .#@=@@@@@@@#.            =++++++=\n             :%@@@@@%:             .+++++=.\n               :*%*:                .-==.\n\n"
  // );
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col px-4 md:px-0">
        {children}

        <MaxWrapper>
          <Footer />
        </MaxWrapper>
      </div>
    </div>
  );
}
