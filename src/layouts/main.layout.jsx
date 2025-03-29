import { Outlet } from "react-router";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import Footer from "@/components/footer"
function MainLayout() {
  return (
    <>
      <Navigation  />
      <Outlet />
      <Footer></Footer>

    </>
  );
}

export default MainLayout;
