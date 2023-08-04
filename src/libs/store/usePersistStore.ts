import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HomeViewOpt = "map" | "grid";

type PostTimelineViewOpt = "map" | "timeline";

type CoordsObject = {
  lat: number;
  lng: number;
  zoom: number;
};

type ViewOptsObject = {
  homeViewOpt: HomeViewOpt;
  postTimelineViewOpt: PostTimelineViewOpt;
};

type AuthObject = {
  isLoggedIn: boolean;
  token: string;
};

interface PersistSlice {
  coords: CoordsObject;
  viewOpts: ViewOptsObject;
  auth: AuthObject;
  setCoords: (lat: number, lng: number, zoom: number) => void;
  setHomeViewOpt: () => void;
  setPostTimelineViewOpt: () => void;
  setAuth: (authObj: AuthObject | null) => void;
}

const usePersistStore = create<PersistSlice>()(
  persist(
    (set) => ({
      coords: { lat: 37.3595704, lng: 127.105399, zoom: 15 },
      viewOpts: { homeViewOpt: "map", postTimelineViewOpt: "timeline" },
      auth: { isLoggedIn: false, token: "" },

      setCoords(lat, lng, zoom) {
        return set(() => ({ coords: { lat, lng, zoom } }));
      },
      setHomeViewOpt() {
        return set((state) => ({
          viewOpts: {
            ...state.viewOpts,
            homeViewOpt: state.viewOpts.homeViewOpt === "grid" ? "map" : "grid",
          },
        }));
      },
      setPostTimelineViewOpt() {
        return set((state) => ({
          viewOpts: {
            ...state.viewOpts,
            postTimelineViewOpt:
              state.viewOpts.postTimelineViewOpt === "timeline"
                ? "map"
                : "timeline",
          },
        }));
      },
      setAuth(authObj) {
        return set(() => {
          if (authObj)
            return { auth: { isLoggedIn: true, token: authObj.token } };
          return { auth: { isLoggedIn: false, token: "" } };
        });
      },
    }),
    { name: "persist-store" }
  )
);

export default usePersistStore;
