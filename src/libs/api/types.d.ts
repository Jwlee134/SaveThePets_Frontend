export interface CreateCommentBody {
  postId: number;
  userId: string;
  content: string;
}

export interface UpdateCommentBody {
  commentId: number;
  content: string;
}

export interface PostResponse {
  postId: number;
  time: string;
  timestamp: string;
  postLat: number;
  postLot: number;
  type: number;
  species: number;
  breed: number;
  picture: string;
  address: string;
}

export interface PostsMapQueryParams {
  [key: string]: number;
  userLat: number;
  userLot: number;
  rightUpLat: number;
  rightUpLot: number;
  leftDownlat: number;
  leftDownlot: number;
}

export interface FilterParams {
  [key: string]: string;
  species?: string;
  breed?: string;
  type?: string;
  userLat?: string;
  userLot?: string;
  range?: string;
  startDate?: string;
  endDate?: string;
}

export interface CommentResponse {
  commentId: number;
  nickname: string;
  content: string;
  picture: string;
  timestamp: string;
}

export interface TimelineResponse {
  sightingPostId: number;
  time: string;
  postLat: number;
  postLot: number;
  species: number;
  breed: number;
  picture: string;
  address: string;
}

export interface TimelineBody {
  missingPostId: number;
  sightPostId: number;
}

export interface PostDetailResponse {
  userid: string;
  nickname: string;
  profilePicture: string;
  species: number;
  breed: number;
  content: string;
  time: string;
  type: number;
  bookmarked: boolean;
  pictures: string[];
  comments: CommentResponse[];
  timeline: TimelineResponse[];
  lat: number;
  lot: number;
  address: string;
}

export interface AnalyzedPicture {
  speciesAi: number;
  breedAi: number;
  accuracy: number;
}

export interface ReportBody {
  objectId: number;
  reportType: number;
  reportReason?: string;
  type: boolean;
}

export interface LoginResponse {
  token: string;
  authenticated: boolean;
}

export interface MeResponse {
  userId: string;
  nickname: string;
  picture: string;
}

export interface MyCommentsResponse {
  postId: number;
  postLat: number;
  postLot: number;
  species: number;
  breed: number;
  type: number;
  picture: string;
  content: string;
  time: string;
  timestamp: string;
}

export interface NotificationResponse {
  alarmId: number;
  postId: number;
  nickname: string;
  picture: string;
  species: number;
  breed: number;
  timestamp: string;
  type: Type;
}

export interface PushSubscriptionBody {
  endpoint: string;
  p256dh: string;
  auth: string;
}
