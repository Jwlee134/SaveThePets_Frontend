import { Slice } from ".";

export interface NotificationSlice {
  isEmpty: boolean;
  isDeleteMode: boolean;
  isDeleteAllClicked: boolean;
  setIsEmpty: (isEmpty: boolean) => void;
  toggleDeleteMode: () => void;
  toggleDeleteAllClicked: () => void;
}

const initialState = {
  isEmpty: true,
  isDeleteMode: false,
  isDeleteAllClicked: false,
};

export const createNotificationSlice: Slice<NotificationSlice> = (
  set,
  get
) => ({
  ...initialState,
  setIsEmpty(isEmpty) {
    return set({ isEmpty });
  },
  toggleDeleteMode() {
    return set({ isDeleteMode: !get().isDeleteMode });
  },
  toggleDeleteAllClicked() {
    return set({ isDeleteAllClicked: !get().isDeleteAllClicked });
  },
});
