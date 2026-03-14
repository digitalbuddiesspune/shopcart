import React from "react";
import HeroSlider from "./HeroSlider";

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Slider */}
      <HeroSlider
        slides={[
          {
            desktop: "https://res.cloudinary.com/dzd47mpdo/image/upload/v1773386363/Untitled_1920_x_600_px_heqmlh.svg",
            alt: "ShopCart Banner 1",
          },
          {
            desktop: "https://res.cloudinary.com/dzd47mpdo/image/upload/v1773386362/Untitled_1920_x_600_px_1_wbk8gh.svg",
            alt: "ShopCart Banner 2",
          },
        ]}
        mobileSrc="https://res.cloudinary.com/dzd47mpdo/image/upload/v1773472369/Untitled_1920_x_600_px_1080_x_1080_px_fgv6mv.png"
      />
    </div>
  );
};

export default Home;
