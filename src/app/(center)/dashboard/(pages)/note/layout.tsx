"use client";

// import { Spinner } from "@/components/Spinner";
// import { useLocalSession } from "@/providers/SessionProvider";
import Navigation from "./_components/navigation";
import { SearchCommand } from "./_components/search-command";
import { redirect } from "next/navigation";
import ContextMenuWrapper from "@/components/ui/ContextMenuWrapper";

const NoteLayout = ({ children }: { children: React.ReactNode }) => {
    // const { session, isLoading } = useLocalSession();

    // if (isLoading) {
    //     return (
    //         <div className="h-full flex items-center justify-center">
    //             <Spinner size="lg" />
    //         </div>
    //     );
    // }

    // if (!session?.user) {
    //     return redirect("/login");
    // }

    return (
        <ContextMenuWrapper>
            <div className="h-full flex dark:bg-[#1F1F1F]">
                <Navigation />
                <main className="flex-1 h-full overflow-y-auto">
                    <SearchCommand />
                    {children}
                </main>
            </div>
        </ContextMenuWrapper>
    );
};

export default NoteLayout;
