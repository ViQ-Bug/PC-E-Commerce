import { SignIn, SignUp } from "@clerk/clerk-react";
import React, { useEffect, useState } from "react";

function LoginPage() {
  const [hash, setHash] = useState(window.location.hash.replace("/", ""));

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.replace("/", ""));
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const clerkAppearance = {
    elements: {
      rootBox: "mx-auto w-full flex justify-center",
      card: "shadow-2xl border border-gray-200 w-full max-w-[480px] p-6",
      headerTitle: "text-3xl font-bold tracking-tight",
      headerSubtitle: "text-lg text-gray-600",
      formButtonPrimary: {
        fontSize: "1.1rem",
        textTransform: "none",
        height: "3.5rem",
        fontWeight: "600",
      },
      socialButtonsBlockButton: {
        height: "3.5rem",
        fontSize: "1rem",
        borderRadius: "0.75rem",
      },
      formFieldInput: {
        height: "3.2rem",
        fontSize: "1.1rem",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      },

      formFieldLabel: "text-base font-medium mb-1",
      footerActionLink: "font-bold text-blue-600 text-lg ml-1",
      footerActionText: "text-base",
    },
    variables: {
      borderRadius: "0.75rem",
      colorPrimary: "#000000",
      fontSize: "1rem",
    },
  };

  return (
    <div className="h-screen flex justify-center items-center bg-gray-50">
      {hash === "#sign-up" ? (
        <SignUp
          routing="hash"
          signInUrl="#sign-in"
          appearance={clerkAppearance}
        />
      ) : (
        <SignIn
          routing="hash"
          signUpUrl="#sign-up"
          appearance={clerkAppearance}
        />
      )}
    </div>
  );
}

export default LoginPage;
