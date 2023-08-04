import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  NotificationSlice,
  createNotificationSlice,
} from "./notificationSlice";
import { CommentSlice, createCommentSlice } from "./commentSlice";

interface BoundStore {
  notification: NotificationSlice;
  comment: CommentSlice;
}

export type Slice<T> = StateCreator<
  BoundStore,
  [["zustand/devtools", never], ["zustand/immer", never]],
  [],
  T
>;

const useBoundStore = create<BoundStore>()(
  devtools(
    immer((...a) => ({
      notification: createNotificationSlice(...a),
      comment: createCommentSlice(...a),
    }))
  )
);

export default useBoundStore;
