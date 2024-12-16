"use client"
import ChatForm from "@/components/ChatForm";
import ChatMessage from "@/components/ChatMessage";
import Image from "next/image";
import {socket} from "@/lib/socketClient";
import { useEffect, useState } from "react";

export default function Home() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<{sender:string, message:string}[]>([]);

  useEffect(() =>{
     socket.on("message",(data)=>{
          setMessages((prevData) => [...prevData,data]);
     });

     socket.on("user_joined",(message)=>{
      setMessages((prev) => [...prev,{sender:"system",message}]);
      });



     return () =>{
      socket.off("user_joined");
      socket.off("message");
     }
  },[]);


  function handleSendMessage(message: string) {
    const data ={room,message,sender:userName};
    setMessages((prevData) => [...prevData,{sender:userName,message}]);
    socket.emit("message",data);
  }

  const handleJoinRoom = () => {
    if(room && userName){
      socket.emit("join-room",{room,username:userName});
      setJoined(true);
    }
  }

  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ?(
            <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
              <h1 className="mb-2 font-bold text-2xl">Join A room</h1>
              <input
                type="text"
                placeholder="Enter your userName"
                className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                />
                <input
                type="text"
                placeholder="Enter room name"
                className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                />
                <button className="px-4 py-2 text-white bg-blue-500 rounded-lg" onClick={handleJoinRoom}>
                  Join Room
                </button>
            </div>
      ):(
        <div className="w-full max-w-3xl">
                  <h1 className="mb-4 text-2xl font-bold">Room : 1</h1>
                  <div className="h-[500px] overflow-y-auto p-4 mb-4 bg-gray-200 border-2 rounded-lg">
                    {messages.map((message, index) => (
                      <ChatMessage key={index} message={message.message} sender={message.sender} isOwnMessage={message.sender === userName} />
                    ))}
                  </div>
                  <ChatForm  onSendMessage={handleSendMessage}/>
        </div>
      )}
      
    </div>
  );
}
