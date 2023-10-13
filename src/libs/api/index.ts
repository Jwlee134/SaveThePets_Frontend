import axios from "axios";
import usePersistStore from "../store/usePersistStore";
import {
  AnalyzedPicture,
  CreateCommentBody,
  FilterParams,
  LoginResponse,
  MeResponse,
  MyCommentsResponse,
  NotificationResponse,
  PostDetailResponse,
  PostResponse,
  PostsMapQueryParams,
  PushSubscriptionBody,
  ReportBody,
  TimelineBody,
  UpdateCommentBody,
} from "./types";
import { QueryFunctionContext } from "@tanstack/react-query";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
});

instance.interceptors.request.use((config) => {
  const token = usePersistStore.getState().auth.token;
  if (token) config.headers["token"] = token;
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error(err);
    return Promise.reject(
      new Error(err.message, { cause: err.response?.data?.error })
    );
  }
);

// AlarmController

export const deleteNotification = (alarmId: number) =>
  instance
    .delete<boolean>("/alarm", { data: { alarmId } })
    .then((res) => res.data);

// BookmarkController

export const createBookmark = (postId: string) =>
  instance.post<boolean>("/bookmark", { postId }).then((res) => res.data);

export const deleteBookmark = (postId: string) =>
  instance
    .delete<boolean>("/bookmark", { data: { postId } })
    .then((res) => res.data);

// CommentController

export const createComment = (data: CreateCommentBody) =>
  instance.post<boolean>("/comment", data).then((res) => res.data);

export const updateComment = (data: UpdateCommentBody) =>
  instance.put<boolean>("/comment", data).then((res) => res.data);

export const deleteComment = (commentId: number) =>
  instance
    .delete<boolean>("/comment", { data: { commentId } })
    .then((res) => res.data);

// PostController

/**
 * @property {string} content
 * @property {File[]} pictures
 * @property {number} species
 * @property {number} breed
 * @property {string} time
 * @property {number} lat
 * @property {number} lot
 * @property {string} address
 * @property {number} type - 0: 실종, 1: 목격, 2: 보호, 3: 분양
 */
export const createPost = (data: FormData) =>
  instance
    .post<number>("/post", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

/**
 * @property {number} postId
 * @property {string} content
 * @property {File[]} pictures
 * @property {number} species
 * @property {number} breed
 * @property {string} time
 * @property {number} postLat
 * @property {number} postLot
 * @property {string} address
 * @property {number} type - 0: 실종, 1: 목격, 2: 보호, 3: 분양
 */
export const updatePost = (data: FormData) =>
  instance
    .put<boolean>("/post", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const deletePost = (postId: string) =>
  instance
    .delete<boolean>("/post", { data: { postId } })
    .then((res) => res.data);

export const getPostsGrid = ({ pageParam = 1 }: QueryFunctionContext) =>
  instance.get<PostResponse[]>(`/post/list`).then((res) => res.data);

export const getPostsMap = ({ queryKey }: QueryFunctionContext) =>
  instance
    .get<PostResponse[]>(`/post/map?${queryKey[2]}`)
    .then((res) => res.data);

export const getFilteredPosts = ({ queryKey }: QueryFunctionContext) =>
  instance
    .get<PostResponse[]>(`/post/filtered?${queryKey[1]}`)
    .then((res) => res.data);

export const getPostDetail = ({ queryKey }: QueryFunctionContext) =>
  instance
    .get<PostDetailResponse>(`/post/${queryKey[1]}`)
    .then((res) => res.data);

export const getMyLostPosts = () =>
  instance.get<PostResponse[]>("/post/mylost").then((res) => res.data);

// ReportController

export const createReport = (data: ReportBody) =>
  instance.post<boolean>("/report", data).then((res) => res.data);

// TimelineController

export const createTimeline = (data: TimelineBody) =>
  instance.post<boolean>("/timeline", data).then((res) => res.data);

export const deleteTimeline = (data: TimelineBody) =>
  instance.delete<boolean>("/timeline", { data }).then((res) => res.data);

// UserController

export const deleteAccount = () =>
  instance.get<boolean>("/user/leaveid").then((res) => res.data);

export const updateNickname = (nickname: string) =>
  instance
    .put<boolean>("/user/update-nickname", { nickname })
    .then((res) => res.data);

export const updateAvatar = (data: FormData) =>
  instance
    .put<boolean>("/user/update-picture", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const postPushSubscription = (data: PushSubscriptionBody) =>
  instance.post<boolean>("/user/push", data).then((res) => res.data);

export const getMe = () =>
  instance.get<MeResponse>("/user/info").then((res) => res.data);

export const getMyPosts = () =>
  instance.get<PostResponse[]>("/user/post").then((res) => res.data);

export const getMyComments = () =>
  instance.get<MyCommentsResponse[]>("/user/comment").then((res) => res.data);

export const getNotifications = () =>
  instance.get<NotificationResponse[]>("/user/alarm").then((res) => res.data);

export const getBookmarks = () =>
  instance.get<PostResponse[]>("/user/bookmark").then((res) => res.data);

// AuthController

export const getJwtToken = (code: string) =>
  instance
    .get<LoginResponse>(`/oauth/kakao?code=${code}`)
    .then((res) => res.data);

// Reverse Geocoding

export const getAddress = (lat: number, lng: number) =>
  axios
    .get<{ result: string }>(`/api/address?lat=${lat}&lng=${lng}`)
    .then((res) => res.data);

export const createAnalyzedBreed = (data: FormData) =>
  axios
    .post<number>(
      "http://localhost:8000/breed_classification/classify/",
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    )
    .then((res) => res.data);
