// import { useState } from "react";
// import { AnimatePresence } from "framer-motion";
// import type { NextPage } from "next";
// import RotateIcon from "@icons/RotateIcon";
// import Counter from "@components/Counter";
// import { CardType, HistoryType, ResultType, SwipeType } from "types";
// import CARDS from "@data/cards";
// import Card from "@components/Card";
// import Head from "next/head";

import {useQueryCommemes } from "@/hooks/use-query-commemes";
import SwipeableStackCards from "./gesturs/swipe-card";


export default function Explore() {
  const {data:commemes,status,error,refetch} = useQueryCommemes(137)
  console.log({error})
  return(
 <div className="w-full h-full flex justify-center items-center">
      {status === 'pending' ? <div>Loading...</div> : null}
      {status === 'error' ? <div>Error ocurred querying the Subgraph</div> : null}
      {/* <ExpandableCardDemo commemes={commemes ?? []} /> */}
      <SwipeableStackCards commemes={commemes ?? []} chainId={137} refetch={refetch}/>
 </div>
);
};


