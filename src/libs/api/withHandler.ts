import { AxiosResponse } from "axios";

const withHandler =
  <T, K = unknown>(f: (arg: K) => Promise<AxiosResponse<T>>) =>
  (arg: K) =>
    f(arg)
      .then((res) => res.data)
      .catch((err) => {
        console.error(err);
        return Promise.reject(
          new Error(err.response.status, { cause: err.response.statusText })
        );
      });

export default withHandler;
