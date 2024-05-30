"use client";
import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCategoryAction } from "@/lib/actions/category.action";
import { CreateTeamAction } from "@/lib/actions/team.action";
import { convertToBase64Image } from "@/lib/ConvertBase64";
import Image from "next/image";
import { BoxIcon, ChevronRight, Images, Search, Users } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  moto: z.string().min(2).max(50),
  location: z.string().min(2).max(50),
  teamcode: z.string().min(2).max(50),
});

const CreateTeam = () => {
  const [Sportscategory, setSportscategory] = useState<any>(null);
  const [SelectedCategory, setSelectedCategory] = useState<any>(null);
  const ImageButton = useRef<any>(null);
  const [teamLogo, setteamLogo] = useState<any>(null);
  const [ActiveCaptain, setActiveCaptain] = useState<any>(null);

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

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      moto: "",
      teamcode: "",
      location: "",
    },
  });


  // adding user when mouse enters
  const handleMouseEnters = (user : any)=>{
    setActiveCaptain(user);
  }
  const hanldeMouseLeave = ()=>{
    setActiveCaptain(null);
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // team logo pending sending the dummy text instead of sending the image

    if (!values) {
      alert("No value added");
    }
    const user = localStorage.getItem("x-auth-user");
    const userId = +user!;
    const res = await CreateTeamAction({
      data: {
        caption: values.moto,
        locaton: values.location,
        name: values.name,
        teamcode: values.teamcode,
        logo: "Logotext",
        captainId: userId,
        categoryId: 2,
        userid: userId,
      },
    });
    if (res.status == 200) {
      alert("Team Created");
    } else {
      alert("Caught some error");
    }
    console.log(values);
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


  const players = [
    {
      name:"void",
      email:"nikhil@gmail.com",
      role:"wicketkeeper"
    },
    {
      name:"sanjay",
      email:"nikhil@gmail.com",
      role:"wicketkeeper"
    },
    {
      name:"harshit",
      email:"nikhil@gmail.com",
      role:"wicketkeeper"
    },
    {
      name:"raman",
      email:"nikhil@gmail.com",
      role:"wicketkeeper"
    },
    {
      name:"karan",
      email:"nikhil@gmail.com",
      role:"wicketkeeper"
    },
  ]

  return (
    <>
      {/* main form component */}
      <div className="min-h-screen w-full px-16 py-8 flex ">
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
          <div>
            <div className="flex gap-2 h-12 w-full bg-stone-800 mt-8 border-[1px] border-stone-700 border-b-0 text-zinc-400 items-center px-4" >
              <Search size={18} strokeWidth={1.5} />
              <input className="bg-transparent outline-none border-none text-sm" type="text" placeholder="Choose Your Captain" />
            </div>


            {/* captain list section */}
            <div className="h-80 border-[1px] border-stone-700 border-t-0 w-full flex justify-between items-center bg-stone-800" >
              {/* left div */}
              <div className="h-80 w-1/2 px-4 py-3 border-r border-zinc-700" >
                <p className="text-xs font-medium text-zinc-500" >all players</p>

                <div className="h-64  flex flex-col gap-2 mt-4" >
                  {
                    players.map((curr:any)=>{
                      return <div onMouseEnter={()=>{
                        handleMouseEnters(curr)
                      }}  onMouseLeave={hanldeMouseLeave} className="h-14 group w-full flex justify-between items-center gap-2 hover:bg-stone-900 transition-all bg-opacity-5 px-2 rounded-md" >
                        {/* image div  */}
                        <div className="flex gap-2 items-center text-zinc-200 text-xs font-medium" >
                        <div className="h-8 w-8 rounded-full bg-zinc-700" >
                        </div>
                        <p className="text-sm text-zinc-300 font-light" >{curr.name}</p>
                        </div>
                        {/* image div end */}
                        {/* right div */}
                        <div className="invisible group-hover:visible transition-all" >
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
                </div>
                <h1 className="text-lg font-medium text-zinc-200 mt-4" >{ActiveCaptain.name}</h1>
                <p className="text-zinc-600 font-light text-sm text-balance " >nikhildesign00@gmail.com</p>
            </div>
              )
             }

            </div>
            {/* captain list section end */}



          </div>
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

      <div className="min-h-screen w-full flex flex-col justify-center items-center">
        <div>
          <h1>Create Your Team Now</h1>
        </div>

        <div>
          {/* react hook form for the creating the team */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="enter your team name" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="moto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your moto" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <Input type="file" />
              </div>
              <Select
                onValueChange={(val) => {
                  setSelectedCategory(val);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Sports Categotry" />
                </SelectTrigger>
                <SelectContent>
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
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Team Location" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="teamcode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter The Team Code" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button className="w-full" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </div> 
    </>
  );
};
export default CreateTeam;
