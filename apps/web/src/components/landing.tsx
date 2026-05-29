import "../global.css"
import { SignedIn, SignedOut, SignIn, SignUp, UserButton, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { createTimeline } from 'animejs';

export default function Landing() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const titleRef = useRef<HTMLDivElement>(null);
  const authContainerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if(isLoaded && isSignedIn){
        navigate('/dashboard');
    }
  }, [isSignedIn, isLoaded, navigate])

  const hideFooter = {
    elements: {
      footer: {display: "none"},
    }
  }

  useEffect(() => {
    if(!titleRef.current || !authContainerRef.current) return;

    const tl = createTimeline({
      defaults: {
        ease: 'outExpo'
      }
    });

    tl.add(titleRef.current, {
      opacity: [0, 1],
      scale: [0, 1],
      duration: 1200,
      delay: 300
    })
    .add(titleRef.current, {
      translateY: [0, -300],
      duration: 1000,
      ease: 'inOutCubic'
    }, '+=200')
    .add(authContainerRef.current, {
      opacity: [0, 1],
      translateY: [-50, 0],
      duration: 800
    }, '-=600')
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[url(/index-bg.jpg)] bg-cover bg-center gap-6">
      <div ref={titleRef} className="absolute z-20 pointer-events-none opacity-0">
        <h1 className="text-4xl font-bold text-white drop-shadow-md tracking-wide">AirWays</h1>
      </div>

      <div ref={authContainerRef} className="absolute mt-24 flex flex-col items-center gap-4 z-10 opacity-0">
        <SignedOut>
          {authMode === 'signin' ? (
            <SignIn 
              routing="virtual" 
              fallbackRedirectUrl="/dashboard" 
              forceRedirectUrl="/dashboard"
              appearance={hideFooter}
            />
          ) : (
            <SignUp 
              routing="virtual" 
              fallbackRedirectUrl="/dashboard" 
              forceRedirectUrl="/dashboard"
              appearance={hideFooter}
            />
          )}

          <button 
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
            className="text-white cursor-pointer hover:underline text-sm font-semibold drop-shadow-sm bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all hover:bg-black/50"
          >
            {authMode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
}