import { Menu, Search } from "lucide-react";

export default function Navigation() {
    return (
        <div className="flex justify-between items-center p-4 lg:p-3.5">
            <article className="flex items-center gap-2">
                <button className="p-1.5 rounded-full bg-white lg:hidden"><Menu size={20} /></button>
                <p className="font-bold ">GIVAUDAN</p>
            </article>

            <article className="w-fit bg-white rounded-full flex items-center gap-5 p-1 px-2 pl-3.5">
                <input className="max-w-80 text-sm outline-none" type="text" placeholder="Recherchez un client" />
                <button className="p-1.5 rounded-full bg-foreground text-white"><Search size={18} /></button>
            </article>
            <button className="max-lg:hidden bg-foreground p-1.5 px-2.5 text-white rounded-full text-sm">Déconnexion</button>
        </div>
    )
}