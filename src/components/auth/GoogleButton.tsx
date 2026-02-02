import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";

export function GoogleButton() {
  const { startGoogleLogin, isRedirecting } = useGoogleLogin();

  return (
    <Button
      type="button"
      className="w-full"
      onClick={startGoogleLogin}
      disabled={isRedirecting}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-inner">
        <svg viewBox="0 0 46 46" className="h-4 w-4" aria-hidden="true">
          <path
            d="M23 11.5c3.2 0 5.7 1.3 7.4 2.5l5.5-5.5C32.9 5 28.4 3 23 3 14.7 3 7.3 7.4 4 13.9l6.3 4.9C12.3 13 17.2 11.5 23 11.5Z"
            fill="#EA4335"
          />
          <path
            d="M44.5 23c0-1.6-.1-2.7-.4-3.9H23v7.3h11.8c-.5 2.8-2 4.9-4.2 6.2l6.5 5C40.6 35.5 44.5 29.7 44.5 23Z"
            fill="#34A853"
          />
          <path
            d="M10.3 27.8c-1.2-1.6-1.9-3.7-1.9-5.8s.7-4.2 1.9-5.8L4 11.9C1.7 15 0 19.3 0 23s1.7 8 4 11.1l6.3-4.3Z"
            fill="#FBBC05"
          />
          <path
            d="M23 44.5c6.2 0 11.4-2 15.2-5.3l-6.5-5c-2.1 1.5-5 2.4-8.7 2.4-5.7 0-10.6-2.5-13.9-6.4l-6.3 4.9C7.3 38 14.7 42.5 23 42.5Z"
            fill="#4285F4"
          />
        </svg>
      </span>
      {isRedirecting ? (
        <>
          <Spinner />
          Loading
        </>
      ) : (
        'Continue with Google'
      )}
    </Button>
  );
}
