interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
}

export const breeds: { [key: number]: string[] } = {
  0: [
    "bengal_cat",
    "bombay_cat",
    "british_shorthair_cat",
    "ragdoll_cat",
    "russian_blue_cat",
    "siamese_cat",
    "sphynx_cat",
  ],
  1: [
    "bishon_frise",
    "chihuahua",
    "chow_chow",
    "dalmatian",
    "doberman_pinscher",
    "golden_retriever",
    "pomeranian",
    "poodle",
    "pug",
    "siberian_husky",
    "welsh_corgi",
    "yorkshire_terrier",
  ],
};

export const speciesBreedsOption: CascaderOption[] = [
  {
    value: 0,
    label: "Cat",
    children: breeds[0].map((breed, i) => ({ value: i, label: breed })),
  },
  {
    value: 1,
    label: "Dog",
    children: breeds[1].map((breed, i) => ({ value: i, label: breed })),
  },
];

export const postFormTable: { [key: string]: string[] } = {
  "0": ["부가 정보", "잃어버린 시간", "잃어버린 장소"],
  "1": ["부가 정보", "목격한 시간", "목격한 장소"],
  "2": ["부가 정보", "목격한 시간", "보호중인 장소"],
  "3": ["반려동물 정보"],
};

export const table: { [key: string]: string } = {
  "0": "실종 게시글 작성",
  "1": "목격 게시글 작성",
  "2": "보호 게시글 작성",
  "3": "분양 게시글 작성",
};
