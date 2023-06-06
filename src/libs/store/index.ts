import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  NotificationSlice,
  createNotificationSlice,
} from "./notificationSlice";
import { PostFormSlice, createPostFormSlice } from "./postFormSlice";
import { CommentSlice, createCommentSlice } from "./commentSlice";

type BoundStore = NotificationSlice & PostFormSlice & CommentSlice;

export type Slice<T> = StateCreator<
  BoundStore,
  [["zustand/devtools", never]],
  [],
  T
>;

const useBoundStore = create<BoundStore>()(
  devtools((...a) => ({
    ...createNotificationSlice(...a),
    ...createPostFormSlice(...a),
    ...createCommentSlice(...a),
  }))
);

export default useBoundStore;
