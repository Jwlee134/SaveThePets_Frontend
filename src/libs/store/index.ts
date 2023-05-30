import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  NotificationSlice,
  createNotificationSlice,
} from "./notificationSlice";

type BoundStore = NotificationSlice;

export type Slice<T> = StateCreator<
  BoundStore,
  [["zustand/devtools", never]],
  [],
  T
>;

const useBoundStore = create<BoundStore>()(
  devtools((...a) => ({
    ...createNotificationSlice(...a),
  }))
);

export default useBoundStore;
