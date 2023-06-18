interface CascaderOption {
  value: string | number;
  label: string;
  children?: CascaderOption[];
}

export const breeds: { [key: number]: string[] } = {
  0: [
    "australian kelpie",
    "cardigan welsh corgi",
    "chesapeake bay retriever",
    "chihuahua",
    "chow chow",
    "clumber",
    "cocker spaniel",
    "curly-coated retriever",
    "dalmatian",
    "dandie dinmont",
    "doberman pinscher",
    "english foxhound",
    "english setter",
    "english springer spaniel",
    "entlebucher",
    "eskimo dog",
    "flat-coated retriever",
    "french bulldog",
    "german shepherd",
    "german short-haired pointer",
    "giant schnauzer",
    "gordon setter dog",
    "great dane",
    "great pyrenees",
    "greater swiss mountain dog",
    "groenendael",
    "ibizan_hound",
    "irish setter",
    "irish terrier",
    "irish water spaniel",
    "irish wolfhound",
    "italian greyhound",
    "jack russell terrier",
    "japanese chin",
    "keeshond",
    "kerry blue terrier",
    "koeran jindo",
    "komondor",
    "kuvasz",
    "labrador retriever",
    "lakeland terrier",
    "leonberg dog",
    "lhasa apso",
    "malamute",
    "malinois",
    "maltese dog",
    "mexican hairless",
    "miniature pinscher",
    "miniature poodle",
    "miniature schnauzer",
    "newfoundland dog",
    "norfolk terrier",
    "norwegian elkhound",
    "norwich terrier",
    "old english sheepdog",
    "otterhound",
    "papillon dog",
    "pekinese dog",
    "pembroke welsh corgi",
    "pomeranian",
    "pug",
    "redbone coonhound",
    "rhodesian ridgeback",
    "rottweiler",
    "saint bernard",
    "saluki",
    "samoyed",
    "schipperke",
    "scotch terrier",
    "scottish deerhound",
    "sealyham terrier",
    "shetland sheepdog",
    "shiba",
    "shih tzu",
    "siberian husky",
    "silky terrier",
    "standard poodle",
    "standard schnauzer",
    "sussex spaniel",
    "tibetan mastiff",
    "tibetan terrier",
    "toy poodle",
    "vizsla",
    "weimaraner",
    "welsh springer spaniel",
    "west highland white terrier",
    "whippet",
    "wire-haired fox terrier",
    "yorkshire terrier",
  ],
  1: [
    "abyssinian cat",
    "american shorthair cat",
    "balinese cat",
    "bengal cat",
    "birman cat",
    "bombay cat",
    "british longhair cat",
    "british shorthair cat",
    "chartreux cat",
    "devon rex cat",
    "havana brown cat",
    "highland fold cat",
    "japanese bobtail cat",
    "maine coon cat",
    "manx cat",
    "munchkin cat",
    "nebelung cat",
    "norway forest cat",
    "persian cat",
    "persian chinchilla cat",
    "ragdoll cat",
    "russian blue cat",
    "savannah cat",
    "scottish fold cat",
    "selkirk rex cat",
    "siamese cat",
    "siberian cat",
    "singapura cat",
    "snowshoe cat",
    "somali cat",
    "sphynx cat",
    "tonkinese cat",
    "turkish angora cat",
  ],
};

export const speciesBreedsOption: CascaderOption[] = [
  {
    value: 0,
    label: "Dog",
    children: breeds[0].map((breed, i) => ({ value: i, label: breed })),
  },
  {
    value: 1,
    label: "Cat",
    children: breeds[1].map((breed, i) => ({ value: i, label: breed })),
  },
];

export const postFormTable: { [key: string]: string[] } = {
  "0": ["부가 정보", "잃어버린 시간", "잃어버린 장소"],
  "1": ["부가 정보", "목격한 시간", "목격한 장소"],
  "2": ["부가 정보", "목격한 시간", "보호중인 장소"],
  "3": ["반려동물 정보"],
};
