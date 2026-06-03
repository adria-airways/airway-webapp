import "../global.css"
import { UserButton, useUser } from "@clerk/clerk-react"
import PlaneMap from "./planeMap";

export default function Dashboard(){
    const { user } = useUser();

    return(
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[url(/index-bg.jpg)] bg-cover bg-center">
            <header className="w-full flex justify-between items-center bg-black/20 p-5 shadow-md">
                <div>
                    <h1 className="text-2xl font-bold text-white drop-shadow-md">AirWay</h1>
                </div>
                <div className="flex items-center gap-3">
                    <h1 className="text-base font-bold text-white drop-shadow-md">{user?.firstName}</h1>
                    <UserButton/>
                </div>
            </header>
            <div className="grow w-full">
                <PlaneMap/>
            </div>
            <footer></footer>
        </div>
    );
};