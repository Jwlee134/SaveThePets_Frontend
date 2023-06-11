import { Slice } from ".";

interface InitialState {
  photos: string[];
  species: number | null;
  breed: number | null;
  time: string | null;
  lat: number | null;
  lng: number | null;
  content: string;
}

export interface PostFormSlice extends InitialState {
  setValues: (values: Partial<InitialState>) => void;
  resetValues: () => void;
}

const initialState: InitialState = {
  photos: [],
  species: null,
  breed: null,
  time: null,
  lat: null,
  lng: null,
  content: "",
};

export const createPostFormSlice: Slice<PostFormSlice> = (set, get) => ({
  ...initialState,
  setValues({ photos, species, breed, time, lat, lng, content }) {
    return set((state) => {
      state.postForm = {
        ...state.postForm,
        photos: photos || [],
        species: species ?? null,
        breed: breed ?? null,
        time: time || null,
        lat: lat || null,
        lng: lng || null,
        content: content || "",
      };
    });
  },
  resetValues() {
    return set((state) => {
      state.postForm = { ...state.postForm, ...initialState };
    });
  },
});
