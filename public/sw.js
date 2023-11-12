// https://joshuatz.com/posts/2021/strongly-typed-service-workers/
// @ts-check
/// <reference no-default-lib="false"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

const breeds = {
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
