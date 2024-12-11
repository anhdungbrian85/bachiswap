import React from "react";
import "./style.css";
//import component
import BannerHome from "./bannerhome";
import ProductHome from "./bachiproduct";
import BackgroundHome from "./backgroundhome";
import ResourcesHome from "./resourceshome";
//import image

const HomePage = () => {
  return (
    <>
      <section>
        <BannerHome />
      </section>
      <section>
        <ProductHome />
      </section>
      <section>
        <BackgroundHome />
      </section>
      <section>
        <ResourcesHome />
      </section>
    </>
  );
};

export default HomePage;
