import React from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>ADMIN</h1>

      <SignedOut>
        <SignInButton mode="modal">
          <button>Đăng nhập</button>
        </SignInButton>

        <SignUpButton mode="modal">
          <button>Đăng ký</button>
        </SignUpButton>
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}

export default App;
