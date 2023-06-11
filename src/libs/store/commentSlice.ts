import { Slice } from ".";

export interface CommentSlice {
  isEdit: boolean;
  id: number;
  value: string;
  enableEditMode: ({ id, value }: { id: number; value: string }) => void;
  disableEditMode: () => void;
}

const initialState = {
  isEdit: false,
  id: 0,
  value: "",
};

export const createCommentSlice: Slice<CommentSlice> = (set, get) => ({
  ...initialState,
  enableEditMode({ id, value }) {
    return set(({ comment }) => {
      comment.isEdit = true;
      comment.id = id;
      comment.value = value;
    });
  },
  disableEditMode() {
    return set((state) => {
      state.comment = { ...state.comment, ...initialState };
    });
  },
});
