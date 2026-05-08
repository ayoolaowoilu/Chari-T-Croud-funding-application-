import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

const GoogleSvg = () => {
  return (
    <svg className={"w-5 h-5"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
};

const FaceBookSVG = () => (
  <svg className={"w-5 h-5"} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1877F2" d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/>
  </svg>
);

const XIcon = () => (
  <svg className={"w-5 h-5"} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const SocialButtons = () => {

  const search = useSearchParams()
  const redirect = search.get("redir")
  console.log(redirect)
  const handleSignIn = (provider:any) => {
    signIn(provider, { callbackUrl: redirect as any }); 
  };

  return (
    <div className='w-full space-y-3'>
    
      <button
        onClick={() => handleSignIn("google")}
        className="group relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <GoogleSvg />
        <span className="text-sm font-medium text-gray-700">Continue with Google</span>
      </button>

      {/* Twitter/X Button */}
      <button
        onClick={() => handleSignIn("twitter")}
        className="group relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-black rounded-xl shadow-sm hover:shadow-md hover:bg-gray-900 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <XIcon />
        <span className="text-sm font-medium text-white">Continue with X</span>
      </button>

      {/* Facebook Button */}
      <button
        onClick={() => handleSignIn("facebook")}
        className="group relative w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#699fe7] rounded-xl shadow-sm hover:shadow-md hover:bg-[#408cf1] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1877F2]"
      >
        <FaceBookSVG />
        <span className="text-sm font-medium text-white">Continue with Facebook</span>
      </button>
    </div>
  );
};

export default SocialButtons;