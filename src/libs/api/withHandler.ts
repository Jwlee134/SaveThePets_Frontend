import { AxiosResponse } from "axios";

const withHandler =
  <T, K = unknown>(f: (arg: K) => Promise<AxiosResponse<T>>) =>
  (arg: K) =>
    f(arg).then((res) => res.data);

export default withHandler;
