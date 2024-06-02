import Nav from "@/src/components/navBars/Nav";
import React from "react";

const MyView: React.FC = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Nav />
      <div className="flex-grow flex items-center justify-center p-4">
        <h1>Settings Here</h1>
      </div>
    </main>
  );
};

export default MyView;
