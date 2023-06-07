"use client";

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
  ReportBody,
  TimelineBody,
  UpdateCommentBody,
} from "./types";
import { QueryFunctionContext } from "@tanstack/react-query";

const instance = axios.create({ baseURL: "http://localhost:8080" });

instance.interceptors.request.use((config) => {
  const token = usePersistStore.getState().auth.token;
  if (token) config.headers.Authorization = token;
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

export const createBookmark = (postId: number) =>
  instance.post<boolean>("/bookmark", { postId }).then((res) => res.data);

export const deleteBookmark = (postId: number) =>
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
 * @property content 부가 정보 또는 반려동물 정보: string
 * @property pictures 사진 배열: File[]
 * @property species 종: number
 * @property breed 품종: number
 * @property time 실종/목격/보호 시간: string
 * @property lat 위도: number
 * @property lot 경도: number
 * @property type 실종: 0, 목격: 1, 보호: 2, 분양: 3
 */
export const createPost = (data: FormData) =>
  instance
    .post<number>("/post", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

/**
 * @property content 부가 정보 또는 반려동물 정보: string
 * @property pictures 사진 배열: File[]
 * @property species 종: number
 * @property breed 품종: number
 * @property time 실종/목격/보호 시간: string
 * @property lat 위도: number
 * @property lot 경도: number
 * @property type 실종: 0, 목격: 1, 보호: 2, 분양: 3
 */
export const updatePost = (data: FormData) =>
  instance
    .put<boolean>("/post", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const deletePost = (postId: number) =>
  instance
    .delete<boolean>("/post", { data: { postId } })
    .then((res) => res.data);

export const getPostsGrid = ({ pageParam = 1 }: QueryFunctionContext) =>
  instance
    .get<PostResponse[]>(`/post/list/${pageParam}`)
    .then((res) => res.data);

export const getPostsMap = (params: PostsMapQueryParams) =>
  instance
    .get<PostResponse[]>(`/post/map?${new URLSearchParams(params).toString()}`)
    .then((res) => res.data);

export const getFilteredPosts = (params: FilterParams) =>
  instance
    .get<PostResponse[]>(
      `/post/filtered?${new URLSearchParams(params).toString()}`
    )
    .then((res) => res.data);

export const getPostDetail = ({ queryKey }: QueryFunctionContext) =>
  instance
    .get<PostDetailResponse[]>(`/post/${queryKey[1]}`)
    .then((res) => res.data);

export const getMyLostPosts = () =>
  instance.get<PostResponse[]>("/post/mylost").then((res) => res.data);

export const getAnalyzedPictureResult = (data: FormData) =>
  instance
    .post<AnalyzedPicture>("/post/analyze", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

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

export const updateNickname = (data: { nickname: string }) =>
  instance.put<boolean>("/user/update-nickname", data).then((res) => res.data);

export const updatePicture = (data: FormData) =>
  instance
    .put<boolean>("/user/update-picture", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);

export const getMe = () => instance.get<MeResponse>("/user/info");

export const getMyPosts = () =>
  instance.get<PostResponse[]>("/user/post").then((res) => res.data);

export const getMyComments = () =>
  instance.get<MyCommentsResponse[]>("/user/comment").then((res) => res.data);

export const getNotifications = () =>
  instance.get<NotificationResponse[]>("/user/alarm");

export const getBookmarks = () =>
  instance.get<PostResponse[]>("/user/bookmark").then((res) => res.data);

// AuthController

export const getJwtToken = (code: string) =>
  instance
    .get<LoginResponse>(`/oauth/kakao?code=${code}`)
    .then((res) => res.data);
