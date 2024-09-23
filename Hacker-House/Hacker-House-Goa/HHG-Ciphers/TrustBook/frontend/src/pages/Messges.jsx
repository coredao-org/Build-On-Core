import React, { useState } from "react";
import Contact from "@/components/Contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = () => {
  const [messageList, setMessageList] = useState([
    { username: "Krishnav", message: "Hello!" },
    { username: "Krishnav", message: "Which colour T-Shirt would you like" },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      setMessageList([
        ...messageList,
        { username: "You", message: inputValue },
      ]);
      setInputValue("");
    }
  };

  return (
    <div className="min-h-screen flex justify-around w-screen ml-[15vw] p-14 items-center bg-[#14162E]">
      <ScrollArea className="h-[70vh] bg-[#1D1932] rounded-xl w-[27vw]">
        <Contact src="/Character-falling.png" username="Krishnav" />
        <Contact src="/Character-falling.png" username="Vardan" />
        <Contact src="/Character-falling.png" username="Jatin" />
        <Contact src="/Character-falling.png" username="Shressth" />
        {/* Add more contacts as needed */}
      </ScrollArea>
      <ScrollArea className="h-[70vh] relative bg-[#1D1932] rounded-xl w-[40vw]">
        <Contact src="/Character-falling.png" username="Krishnav" />

        <div className="p-4 flex flex-col gap-2 overflow-y-auto">
          {messageList.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.username === "You" ? "self-end" : "self-start"
              } bg-blue-100 text-black p-2 rounded mb-2`}
            >
              <strong>{msg.username}: </strong>
              {msg.message}
            </div>
          ))}
        </div>
        <div className="bottom-0 bg-[#1D1932] absolute w-full flex p-4 gap-5">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full"
            placeholder="Type a message"
          />
          <Button
            className="bg-[#6F4FF2] w-[12vw] hover:bg-[#462caf]"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Messages;
