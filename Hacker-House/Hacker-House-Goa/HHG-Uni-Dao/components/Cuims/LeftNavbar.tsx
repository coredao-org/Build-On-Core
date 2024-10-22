//@ts-nocheck
"use client";
import { ConnectWallet, useAddress, useContract } from "@thirdweb-dev/react";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
// import { PurposeDao } from "../component/purpose-dao";
import PurposeList from "../proposalList";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AddCourse } from "../component/add-course";
import { AddWorkshop } from "../component/add-workshop";
import { Analytics } from "../component/analytics";
import Wallet from "../thirdweb/Wallet"
import Purpose from '@/components/thirdweb/propose'
import Read from "@/components/thirdweb/ChainRead"
import PurposeLimit from "@/components/thirdweb/proposalThreshold"
// import { purposeDao } from "../component/purpose-dao";
// import VotingComponent from "@/components/thirdweb/castVote"

// Corrected Purposals component
const Purposals = () => {

  return (
    <div className="flex justify-center overflow-y-scroll items-center flex-col w-full bg-black">
      
        <div className="w-[200px]">
          <Wallet/>

        </div>

        <Purpose/>
        

        <Read/>

        {/* <PurposeList/> */}
        

        

    </div>
  );
};

const Addcourse = () => {
  return (
    <div className="flex justify-center items-center w-full bg-black">
      <AddCourse />
    </div>
  );
};

const Addworkshop = () => {
  return (
    <div className="flex justify-center items-center w-full bg-black">
      <AddWorkshop />
    </div>
  );
};

const StudentStats = () => {
  return (
    <div className="flex justify-center items-center w-full bg-black">
      <Analytics />
    </div>
  );
};

export default function SidebarDemo() {
  const [currentTab, setCurrentTab] = useState("Addcourse");

  const links = [
    {
      label: "Purposals",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: "Purposals",
    },
    {
      label: "Add Course",
      href: "#",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: "Addcourse",
    },
    {
      label: "Workshop",
      href: "#",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: "Addworkshop",
    },
    {
      label: "Activity",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      component: "StudentStats",
    },
  
  ];

  const [open, setOpen] = useState(false);

  const renderComponent = () => {
    switch (currentTab) {
      case "Purposals":
        return <Purposals />;
      case "Addcourse":
        return <Addcourse />;
      case "Addworkshop":
        return <Addworkshop />;
      case "StudentStats":
        return <StudentStats />;
      default:
        return <Addcourse />;
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen  w-full" 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1  overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <button key={idx} onClick={() => setCurrentTab(link.component)}>
                  <SidebarLink link={link} />
                </button>
              ))}
            </div>
          </div>
          
        </SidebarBody>
      </Sidebar>
      {renderComponent()}
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
