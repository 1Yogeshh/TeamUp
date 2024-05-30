"use client";
import React, { useEffect, useRef, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategoryAction } from "@/lib/actions/category.action";
import { convertToBase64Image } from "@/lib/ConvertBase64";
import Image from "next/image";
import { BoxIcon, ChevronRight, Images, Loader, Search, Users } from "lucide-react";
import { SearchUserWithQueryAction } from "@/lib/actions/user.action";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from 'sonner'



const CreateTeam = () => {
  const [Sportscategory, setSportscategory] = useState<any>(null);
  const [SelectedCategory, setSelectedCategory] = useState<any>(null);
  const ImageButton = useRef<any>(null);
  const [teamLogo, setteamLogo] = useState<any>(null);
  const [ActiveCaptain, setActiveCaptain] = useState<any>(null);
  const [query, setquery] = useState<string>('');
  const [UserList, setUserList] = useState<any>([]);
  const [TeamCaptain, setTeamCaptain] = useState<any>(null);
  const [IsLoading, setIsLoading] = useState<boolean>(false);

  // convert image into base64

  const handleImage = (e: any) => {
    console.log("this func called");
    console.log(e.target.files);
    const file = e.target.files[0];

    const reader = new FileReader();
    if (file) {
      reader.onloadend = () => {
        setteamLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }

    const data = convertToBase64Image(e.target.files);
    if (data) {
      console.log("Data got: ", data);
    }
    setteamLogo(data);
  };

  


  // adding user when mouse enters
  const handleMouseEnters = (user : any)=>{
    setIsLoading(false);
    setActiveCaptain(user);
  }
  const hanldeMouseLeave = ()=>{
    // setActiveCaptain(null);
  }

  
  useEffect(() => {
    const GetCategory = async () => {
      const res = await getAllCategoryAction();
      if (res.status == 200) {
        console.log("category data: ", res.data);
        setSportscategory(res.data);
      } else {
        console.log(res.data);
      }
    };
    GetCategory();
  }, []);


   const handleSearchChange = async (e:any)=>{ 
    
     if(e.target.value !=''){
      const data = await SearchUserWithQueryAction(e.target.value);
      setUserList(data.data);
     }else{
      setUserList([]);
     }
   }


  //  handling on click for captain selection
  const handleCaptainOnclick =  (user:any)=>{
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Captain Appointed");
      setTeamCaptain(user);
    }, 2000);
    
  }


 
  return (
    <>
      {/* main form component */}
      <div className="min-h-screen w-full px-16 py-8 flex ">
      <Toaster closeButton className="bg-zinc-800"  richColors position="bottom-right" />
        {/* team name component */}
        {/* left div */}
        <div className="flex w-1/2 flex-col border-r border-zinc-700">
          <div className="">
            <input
              className="outline-none border-none  text-white bg-transparent w-full text-2xl placeholder:text-white"
              type="text"
              placeholder="Your Team Name"
            />
          </div>

          {/* team tagline component  */}
          <div className="mt-4">
            <textarea
              className="bg-transparent w-[550px] text-blue-300 focus:border-none active:border-none border-none outline-none"
              placeholder="Your Team Tagline"
            />
          </div>
          {/* team tagline component end */}

          {/* team logo component */}
          <div>
            <input
              type="file"
              hidden
              ref={ImageButton}
              onChange={(e) => {
                handleImage(e);
              }}
            />
            {!teamLogo && (
              <div
                className="h-[300px] w-[550px] rounded-md bg-stone-900 flex items-center justify-center flex-col border-[1px] border-stone-700"
                onClick={() => {
                  ImageButton.current.click();
                }}
              >
                <BoxIcon strokeWidth={1.5} color="white" size={25} />
                <p className="text-white font-medium mt-2">
                  Add your team Logo
                </p>
                <p className="text-xs text-zinc-500">size must be below 2 mb</p>
              </div>
            )}

            {teamLogo && (
              <div>
                <Image
                  ref={ImageButton}
                  src={teamLogo}
                  height={500}
                  width={500}
                  alt="teamlogo"
                />
              </div>
            )}
          </div>
          {/* team logo component end */}

          {/* team category component */}
          <Select
            onValueChange={(val) => {
              setSelectedCategory(val);
            }}
          >
            <SelectTrigger className="w-[550px] mt-8 bg-transparent text-white border-zinc-800">
              <SelectValue placeholder="Select Sports Categotry" />
            </SelectTrigger>
            <SelectContent className="bg-transparent text-white border-zinc-800" >
              {Sportscategory && (
                <div>
                  {Sportscategory.map((curr: any) => {
                    return (
                      <SelectItem value={curr.name}>{curr.name}</SelectItem>
                    );
                  })}
                </div>
              )}
            </SelectContent>
          </Select>
          {/* team category component end */}

          {/* team location component */}
          {/* <div>
            <input className="border-none outline-none text-white bg-transparent mt-8 placeholder:text-zinc-500" placeholder="Enter Your Location" type="text" />
          </div>
          {/* team location component end */}
        </div>
        {/* right div */}
        <div className="h-full flex w-1/2 flex-col px-8 ">
          {/* team code component  */}
          <input className="outline-none border-[1px] border-stone-700 bg-stone-800 w-full h-12 px-4 " type="text" placeholder="Your team code" />
          {/* team code component end */}

          {/* choose captain component */}
          {
            TeamCaptain == null ? <div>
            <div className="flex gap-2 h-12 w-full bg-stone-800 mt-8 border-[1px] border-stone-700 border-b-0 text-zinc-400 items-center px-4" >
              <Search size={18} strokeWidth={1.5} />
              <input onChange={(e)=>{
                handleSearchChange(e);
              }} className="bg-transparent outline-none border-none text-sm" type="text" placeholder="Choose Your Captain" />
            </div>


            {/* captain list section */}
            {
              UserList.length != 0 && (<div className="max-h-80 pb-4 border-[1px] border-stone-700 border-t-0 w-full flex justify-between items-center bg-stone-800" >
              {/* left div */}
              <div className="max-h-80 w-1/2 px-4 py-3 border-r border-zinc-700" >
                <p className="text-xs font-medium text-zinc-500" >all players</p>

                <div className="max-h-64  flex flex-col gap-2 mt-4" >
                  {
                    UserList.map((curr:any)=>{
                      return <div onMouseEnter={()=>{
                        handleMouseEnters(curr)
                      }}  onMouseLeave={hanldeMouseLeave} className="h-14 group w-full flex justify-between items-center gap-2 hover:bg-stone-900 transition-all bg-opacity-5 px-2 rounded-md" >
                        {/* image div  */}
                        <div className="flex gap-2 items-center text-zinc-200 text-xs font-medium" >
                        <div className="h-8 w-8 rounded-full bg-zinc-700" >
                        <Image className="h-full w-full object-cover rounded-full" src={curr.avatar} height={1500} width={1500} alt="user image" />

                        </div>
                        <p className="text-sm text-zinc-300 font-light" >{curr.username}</p>
                        </div>
                        {/* image div end */}
                        {/* right div */}
                        <div className="invisible group-hover:visible group-hover:translate-x-1 transition-all" >
                          <ChevronRight className="text-zinc-600" strokeWidth={1} />
                        </div>
                      </div>
                    })
                  }
                </div>

              </div>
              {/* right div */}
             {
              ActiveCaptain && (
                <div className="h-full w-1/2 flex items-center justify-center flex-col" >
                <div className="h-20 w-20 rounded-full bg-zinc-700" >
                  <Image className="h-full w-full object-cover rounded-full" src={ActiveCaptain.avatar} height={1500} width={1500} alt="user image" />
                </div>
                <h1 className="text-lg font-medium text-zinc-200 mt-4" >{ActiveCaptain.username}</h1>
                <p className="text-zinc-600 font-light text-sm text-balance " >{ActiveCaptain.email}</p>

                <div className="flex gap-4 items-center flex-col mt-2" >
                  <p className="text-zinc-200 text-[10px] tracking-wide font-light" ><span className="font-medium" >Role : {' '} </span>Right Handed Batsman</p>
                </div>
                <div>
                  <div onClick={()=>{
                    handleCaptainOnclick(ActiveCaptain);
                  }} className="h-8 px-4 mt-4 rounded-full bg-green-400  flex items-center justify-center text-stone-900 hover:scale-105 transition-all cursor-pointer" >
                {
                  IsLoading == true ? <Loader className="animate-spin transition-all" strokeWidth={1.5} size={15}  /> : <p className="text-xs font-medium " >Appoint Captain</p>
                }
                  </div>
                </div>
            </div>
              )
             }

            </div>)
            }
            {/* captain list section end */}



          </div> : <div className="mt-4 relative" >
            <h1 className="text-zinc-400 text-sm mt-4" >Team Captain</h1>
            
            
            <div className="h-20 w-20 mt-4 mb-2 peer bg-white rounded-full transition-all" >

            </div>
            <div className="h-9 peer-hover:visible invisible transition-all duration-150 w-24 flex justify-center items-center text-white bg-opacity-15  bg-zinc-600 rounded-full" >
              <p className="text-xs" >Nikhil Kumar</p>
            </div>
          </div>
          }
          {/* choose captain component end */}
          <div className="mt-8" >
              <p className="text-sm font-medium text-zinc-400" >Add Team Members</p>
          </div>

          {/* add team members div start */}
          
          {/* add team members div start end */}
        </div>
        {/* right component end */}
      </div>
      {/* main form component end */}

    </>
  );
};
export default CreateTeam;
