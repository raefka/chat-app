"use client"
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<{sender:string, message:string}[]>([]);


  function handleSendMessage(message: string) {
    console.log(message);
  }

  return (
    <div className="flex mt-24 justify-center w-full">
      <div className="w-full max-w-3xl">
          <h1 className="mb-4 text-2xl font-bold">Room : 1</h1>
          <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
            {messages.map((message, index) => (
              <ChatMessage key={index} message={message.message} sender={message.sender} isOwnMessage={message.sender === userName} />
            ))}
          </div>
          <ChatForm  onSendMessage={handleSendMessage}/>
      </div>
    </div>
  );
}
