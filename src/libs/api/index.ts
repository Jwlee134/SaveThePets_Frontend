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
} from "./types";
import { QueryFunctionContext } from "@tanstack/react-query";
import withHandler from "./withHandler";

const instance = axios.create({ baseURL: "http://something" });

instance.interceptors.request.use((config) => {
  const token = usePersistStore().auth.token;
  if (token) config.headers.Authorization = token;
  return config;
});

// AlarmController

export const deleteNotification = withHandler<boolean, number>((alarmId) =>
  instance.delete("/alarm", { data: { alarmId } })
);

// BookmarkController

export const createBookmark = withHandler<boolean, number>((postId) =>
  instance.post("/bookmark", { postId })
);

export const deleteBookmark = withHandler<boolean, number>((postId) =>
  instance.delete("/bookmark", { data: { postId } })
);

// CommentController

export const createComment = withHandler<boolean, CreateCommentBody>((data) =>
  instance.post("/comment", data)
);

export const updateComment = withHandler<boolean, CreateCommentBody>((data) =>
  instance.put("/comment", data)
);

export const deleteComment = withHandler<boolean, number>((commentId) =>
  instance.delete("/comment", { data: { commentId } })
);

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
export const createPost = withHandler<boolean, FormData>((data) =>
  instance.post("/post", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
);

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
export const updatePost = withHandler<boolean, FormData>((data) =>
  instance.put("/post", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
);

export const deletePost = withHandler<boolean, string>((postId) =>
  instance.delete("/post", { data: { postId } })
);

export const getPostsGrid = withHandler<PostResponse[], QueryFunctionContext>(
  ({ pageParam = 1 }) => instance.get(`/post/list/${pageParam}`)
);

export const getPostsMap = withHandler<PostResponse[], PostsMapQueryParams>(
  (params) =>
    instance.get(`/post/map?${new URLSearchParams(params).toString()}`)
);

export const getFilteredPosts = withHandler<PostResponse[], FilterParams>(
  (params) =>
    instance.get(`/post/filtered?${new URLSearchParams(params).toString()}`)
);

export const getPostDetail = withHandler<
  PostDetailResponse[],
  QueryFunctionContext
>(({ queryKey }) => instance.get(`/post/${queryKey[1]}`));

export const getMyLostPosts = withHandler<PostResponse[]>(() =>
  instance.get("/post/mylost")
);

export const getAnalyzedPictureResult = withHandler<AnalyzedPicture, FormData>(
  (data) =>
    instance.post("/post/analyze", data, {
      headers: { "Content-Type": "multipart/form-data" },
    })
);

// ReportController

export const createReport = withHandler<boolean, ReportBody>((data) =>
  instance.post("/report", data)
);

// TimelineController

export const createTimeline = withHandler<boolean, TimelineBody>((data) =>
  instance.post("/timeline", data)
);

export const deleteTimeline = withHandler<boolean, TimelineBody>((data) =>
  instance.delete("/timeline", { data })
);

// UserController

export const login = withHandler<LoginResponse, { token: string }>(
  ({ token }) => instance.get("/user/signup", { data: { kakaoToken: token } })
);

export const deleteAccount = withHandler<boolean>(() =>
  instance.get("/user/leaveid")
);

export const updateNickname = withHandler<boolean, { nickname: string }>(
  (data) => instance.put("/user/update-nickname", data)
);

export const updatePicture = withHandler<boolean, FormData>((data) =>
  instance.put("/user/update-picture", data, {
    headers: { "Content-Type": "multipart/form-data" },
  })
);

export const getMe = withHandler<MeResponse>(() => instance.get("/user/info"));

export const getMyPosts = withHandler<PostResponse[]>(() =>
  instance.get("/user/post")
);

export const getMyComments = withHandler<MyCommentsResponse[]>(() =>
  instance.get("/user/comment")
);

export const getNotifications = withHandler<NotificationResponse[]>(() =>
  instance.get("/user/alarm")
);

export const getBookmarks = withHandler<PostResponse[]>(() =>
  instance.get("/user/bookmark")
);
