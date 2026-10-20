import React from "react";

import Hero from "./Hero";
import DeskPreview from "./DeskPreview";
import Features from "./Features";
import Pricing from "./Pricing";
import Education from "./Education";
import OpenAccount from "../OpenAccount";

function HomePage() {
  return (
    <>
      <Hero />
      <DeskPreview />
      <Features />
      <Pricing />
      <Education />
      <OpenAccount />
    </>
  );
}

export default HomePage;
