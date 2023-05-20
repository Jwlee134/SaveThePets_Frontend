import { create } from "zustand";
import { persist } from "zustand/middleware";

type HomeViewOpt = "map" | "grid";

type PostTimelineViewOpt = "map" | "timeline";

interface PersistSlice {
  lat: number;
  lng: number;
  zoom: number;
  homeViewOpt: HomeViewOpt;
  postTimelineViewOpt: PostTimelineViewOpt;
  setCoords: (lat: number, lng: number, zoom: number) => void;
  setHomeViewOpt: (opt: HomeViewOpt) => void;
  setPostTimelineViewOpt: (opt: PostTimelineViewOpt) => void;
}

const usePersistStore = create<PersistSlice>()(
  persist(
    (set) => ({
      lat: 37.3595704,
      lng: 127.105399,
      zoom: 15,
      homeViewOpt: "map",
      postTimelineViewOpt: "timeline",
      setCoords(lat, lng, zoom) {
        return set(() => ({ lat, lng, zoom }));
      },
      setHomeViewOpt(opt) {
        return set(() => ({ homeViewOpt: opt }));
      },
      setPostTimelineViewOpt(opt) {
        return set(() => ({ postTimelineViewOpt: opt }));
      },
    }),
    { name: "persist-store" }
  )
);

export default usePersistStore;
