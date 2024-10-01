import { cookies } from "next/headers";

export default function logout(){
    // remove the session
    cookies().set('session','',{expires:new Date(0)});
}