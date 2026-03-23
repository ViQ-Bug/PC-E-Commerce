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

  return (
    <div className="h-screen flex justify-center items-center">
      {hash === "#sign-up" ? (
        <SignUp routing="hash" signInUrl="#sign-in" />
      ) : (
        <SignIn routing="hash" signUpUrl="#sign-up" />
      )}
    </div>
  );
}

export default LoginPage;
