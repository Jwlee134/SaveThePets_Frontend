import axios from "axios";

export async function getPosts() {
  return axios
    .get<{ id: string; lat: number; lng: number }[]>(
      "http://localhost:3000/api/list"
    )
    .then((res) => res.data);
}

export async function getTimeline() {
  return axios
    .get<{ id: string; lat: number; lng: number }[]>(
      "http://localhost:3000/api/timeline"
    )
    .then((res) => res.data);
}

export async function getNotifications() {
  return axios
    .get<{ id: string; date: string }[]>(
      "http://localhost:3000/api/notifications"
    )
    .then((res) => res.data);
}

export async function getPostDetail() {
  return axios
    .get<{ ok: boolean }>("http://localhost:3000/api/posts/1")
    .then((res) => res.data);
}
