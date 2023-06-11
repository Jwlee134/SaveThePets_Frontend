import Image from "next/image";
import useEmblaCarousel, { EmblaCarouselType } from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { Indicator, NextBtn, PrevBtn } from "./CarouselInteractions";
import { getPostDetail } from "@/libs/api";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export default function Carousel() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["posts", id],
    queryFn: getPostDetail,
    select(data) {
      return data.pictures;
    },
  });
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
          {data?.map((src, i) => (
            <div
              key={i}
              className="relative min-w-0 flex-[0_0_100%] aspect-square"
            >
              <Image src={src} alt="photo" fill className="object-cover" />
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
