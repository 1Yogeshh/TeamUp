import { ArrowRight, ArrowUpRight } from "lucide-react";
import React from "react";

const SideAllMatches = () => {
    const res = [
        {
        name:"Football",
        match:20,
        state:"active"
    },
        {
        name:"Cricket",
        match:10
    },
        {
        name:"Volleyball",
        match:15
    },
        {
        name:"BasketBall",
        match:2
    },
]
  return (
    <div className="h-full w-full  px-7 py-8">
      {/* upper component fot the sidebar */}

      <div className="h-20 w-full bg-zinc-700 rounded-md bg-opacity-20 flex gap-4">
        {/* upper cards */}
        {
            res.map((curr:any)=>{
                return <div className="flex justify-between gap-8 w-80 h-full ">
                <div className="h-full py-2 px-3 flex gap-4 items-center">
                  <div className="h-full w-2 rounded-md bg-zinc-200"></div>
                  <div>
                    {
                        curr.state == "active"?<p className="text-green-300 text-lg">{curr.name}</p>:<p className="text-zinc-200 text-lg">{curr.name}</p>
                    }
                    <p className="text-zinc-400 text-sm" >{curr.match} matches</p>
                  </div>
                </div>
      
                <div>
                  <ArrowUpRight className="text-zinc-500 mt-4" />
                </div>
              </div>
            })
        }
      </div>
    </div>
  );
};

export default SideAllMatches;
