
// for notification number reduce and increse

import { create } from "zustand";
import axios from "axios";

export const useNotificationStore=create((set)=>({
    number:0,
    fetch:async ()=>{
        const res = await axios(`http://localhost:8080/api/user/notification`, {
            withCredentials: true  //this is imprtant
          }); 

          set({number:res.data});
    },

    decrease:()=>{
        set((prev)=>({number:prev.number-1}));
    },

    reset:()=>{
        set({number:0})
    }
}))