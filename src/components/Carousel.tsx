import Image from "next/image";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Indicator, NextBtn, PrevBtn } from "./CarouselInteractions";

export default function Carousel() {
  const length = 3;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {[1, 2, 3].map((item, i) => (
            <div
              key={i}
              className="relative min-w-0 flex-[0_0_100%] aspect-square"
            >
              <Image
                src={`/sample${i + 1}.jpg`}
                alt="photo"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
      <PrevBtn onClick={scrollPrev} />
      <NextBtn onClick={scrollNext} />
      <Indicator index={selectedIndex + 1} length={length} />
    </div>
  );
}
