"use client"



import { createContext, ReactNode, useContext, useState } from "react";




    interface IFormContext {
        Step:number
        nextStep: ()=> void
        backStep:()=>void
        customStep:(step:number)=>void
    }

    const defaultValue : IFormContext = {
        Step:0,
        nextStep() {
            
        },
        backStep() {
            
        },
        customStep(step) {
            
        },
    }


const FormContext = createContext<IFormContext>(defaultValue);

interface IForm {
    children:ReactNode
}

 const FormProvider = ({children}:IForm)=>{

    const [Step, setStep] = useState<number>(0);
    

     const nextStep = ()=>{
        setStep(prev => prev+1);
    }

    const backStep = ()=>{
        setStep(prev => prev-1);
    }

    const customStep = (step:number)=>{
        setStep(step);
    }


    return <FormContext.Provider value={{Step , nextStep , backStep , customStep}} >{children}</FormContext.Provider>
}


export {FormContext , FormProvider};