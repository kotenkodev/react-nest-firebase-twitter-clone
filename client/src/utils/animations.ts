import gsap from "gsap";

export const animatePageIn = () => {
  const bannerOne = document.getElementById("banner-1");
  const bannerTwo = document.getElementById("banner-2");
  const bannerThree = document.getElementById("banner-3");
  const bannerFour = document.getElementById("banner-4");
  const birdLoader = document.getElementById("bird-loader");

  if (bannerOne && bannerTwo && bannerThree && bannerFour) {
    const tl = gsap.timeline();

    tl.set([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: 0,
    })
      .set(birdLoader, {
        opacity: 1,
        display: "flex",
      })
      .to([bannerOne, bannerTwo, bannerThree, bannerFour], {
        yPercent: 100,
        stagger: 0.2,
      })
      .to(
        birdLoader,
        {
          opacity: 0,
          display: "none",
          duration: 0.5,
        },
        "-=0.5",
      );
  }
};

export const animatePageOut = (
  href: string,
  navigate: (to: string) => void,
) => {
  const bannerOne = document.getElementById("banner-1");
  const bannerTwo = document.getElementById("banner-2");
  const bannerThree = document.getElementById("banner-3");
  const bannerFour = document.getElementById("banner-4");
  const birdLoader = document.getElementById("bird-loader");

  if (bannerOne && bannerTwo && bannerThree && bannerFour) {
    const tl = gsap.timeline();

    tl.set([bannerOne, bannerTwo, bannerThree, bannerFour], {
      yPercent: -100,
    })
      .to([bannerOne, bannerTwo, bannerThree, bannerFour], {
        yPercent: 0,
        stagger: 0.2,
      })
      .to(
        birdLoader,
        {
          opacity: 1,
          display: "flex",
          duration: 0.3,
        },
        "-=0.3",
      )
      .add(() => {
        navigate(href);
      });
  }
};
