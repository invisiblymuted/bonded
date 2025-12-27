import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useChildren } from "@/hooks/use-children";
import { ChildCard } from "@/components/ChildCard";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data: children, isLoading, error } = useChildren();
  const [search, setSearch] = useState("");

  const filteredChildren = children?.filter((child) => 
    child.name.toLowerCase().includes(search.toLowerCase()) || 
    child.lastSeenLocation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-secondary/20 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 flex flex-col items-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-foreground mb-6"
          >
            Reuniting Families, <span className="text-primary">One at a Time</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10 text-balance"
          >
            A secure portal for parents to report missing children and for communities to help bring them home.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative w-full max-w-xl"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input 
              className="pl-10 h-14 rounded-2xl border-2 border-border bg-background shadow-lg text-lg focus-visible:ring-primary focus-visible:border-primary"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </motion.div>
        </div>

        {/* Decorative background element */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold font-display">Recent Reports</h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading cases...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-2xl border border-destructive/20">
            <h3 className="text-lg font-semibold text-destructive mb-2">Unable to load data</h3>
            <p className="text-muted-foreground">Please try refreshing the page.</p>
          </div>
        ) : filteredChildren?.length === 0 ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredChildren?.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ChildCard child={child} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
