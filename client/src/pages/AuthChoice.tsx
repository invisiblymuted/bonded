import React from 'react';
import { Button } from "@/components/ui/button";
import { BondedLogo } from "@/components/BondedLogo";

const AuthChoice = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
      <div className="mb-12">
        {/* Centered Logo as per your branding requirements */}
        <BondedLogo className="w-24 h-24" />
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <Button 
          className="w-full py-6 text-lg font-medium" 
          onClick={() => window.location.href = '/signup'}
        >
          Join Bonded
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full py-6 text-lg font-medium"
          onClick={() => window.location.href = '/login'}
        >
          Already Bonded
        </Button>
      </div>
    </div>
  );
};

export default AuthChoice;
