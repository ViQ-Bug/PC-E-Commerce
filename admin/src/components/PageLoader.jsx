import React from "react";
import { LoaderIcon } from "lucide-react";
function PageLoader() {
  return (
    <div class="flex items-center justify-center h-screen">
      <LoaderIcon class="size-12 animate-spin" />
    </div>
  );
}

export default PageLoader;
