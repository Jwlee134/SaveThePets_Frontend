// https://joshuatz.com/posts/2021/strongly-typed-service-workers/
// @ts-check
/// <reference no-default-lib="false"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

const breeds = {
  0: [
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
    "munchkin cat",
    "nebelung cat",
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
  1: [
    "australian kelpie",
    "cardigan welsh corgi",
    "chihuahua",
    "chow chow",
    "cocker spaniel",
    "dalmatian",
    "doberman pinscher",
    "english springer spaniel",
    "eskimo dog",
    "french bulldog",
    "german shepherd",
    "giant schnauzer",
    "gordon setter dog",
    "great dane",
    "great pyrenees",
    "greater swiss mountain dog",
    "groenendael",
    "ibizan_hound",
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
    "rhodesian ridgeback",
    "rottweiler",
    "saint bernard",
    "samoyed",
    "schipperke",
    "scotch terrier",
    "scottish deerhound",
    "shiba",
    "shih tzu",
    "siberian husky",
    "silky terrier",
    "standard poodle",
    "standard schnauzer",
    "sussex spaniel",
    "tibetan mastiff",
    "toy poodle",
    "weimaraner",
    "welsh springer spaniel",
    "west highland white terrier",
    "whippet",
    "yorkshire terrier",
  ],
};

// Using IIFE to provide closure to redefine `self`
(() => {
  // This is a little messy, but necessary to force type assertion
  // Same issue as in TS -> https://github.com/microsoft/TypeScript/issues/14877
  // prettier-ignore
  const self = /** @type {ServiceWorkerGlobalScope} */ (/** @type {unknown} */ (globalThis.self));

  /**
   * @typedef {Object} Data
   * @property {number} postId
   * @property {string} nickname
   * @property {string} picture
   * @property {number} species
   * @property {number} breed
   * @property {number} type
   */

  /**
   *
   * @param {string} name
   * @returns {string}
   */
  function checkName(name) {
    const charCode = name.charCodeAt(name.length - 1);
    const consonantCode = (charCode - 44032) % 28;
    if (consonantCode === 0) return `${name}로`;
    return `${name}으로`;
  }

  const table = {
    0: "실종",
    1: "목격",
    2: "보호",
    3: "분양",
  };

  self.addEventListener("push", (event) => {
    /**
     * @type {Data}
     */
    const data = event.data?.json();
    let body;

    if (data.type === 4) {
      body = `${data.nickname || "Anonymous"}님이 ${
        breeds[data.species][data.breed]
      } 게시글에 댓글을 남겼습니다.`;
    } else {
      body = `${
        breeds[data.species][data.breed]
      }의 실종 위치 근처에 ${checkName(
        breeds[data.species][data.breed]
      )} 추정되는 동물이 ${
        data.type === 1 ? "목격되었습니다." : "보호중입니다."
      } 클릭하여 확인해 보세요.`;
    }

    event.waitUntil(
      self.registration.showNotification("Save The Pets", {
        body,
        icon: data.picture,
        data,
      })
    );
  });

  self.addEventListener("notificationclick", (event) => {
    /**
     * @type {Data}
     */
    const data = event.notification.data;
    const dest = data.nickname
      ? `/posts/${data.postId}/comments`
      : `/posts/${data.postId}`;
    event.notification.close();
    event.waitUntil(
      self.clients
        .matchAll({
          type: "window",
        })
        .then((clients) => {
          for (const client of clients)
            if (new URL(client.url).pathname === dest) return client.focus();
          return self.clients.openWindow(dest);
        })
    );
  });
})();
