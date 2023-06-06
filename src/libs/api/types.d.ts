type Type = 1 | 2 | 3 | 4;

export interface CreateCommentBody {
  postId: number;
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
}

export interface PostsMapQueryParams {
  [key: string]: string;
  userLat: string;
  userLot: string;
  rightUpLat: string;
  rightUpLot: string;
  leftDownlat: string;
  leftDownlot: string;
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
}

export interface TimelineResponse {
  sightingPostId: number;
  time: string;
  postLat: number;
  postLot: number;
  species: number;
  breed: number;
  picture: string;
}

export interface TimelineBody {
  missingPostId: number;
  sightPostId: number;
}

export interface PostDetailResponse {
  species: number;
  breed: number;
  content: string;
  time: string;
  type: number;
  bookmarked: boolean;
  pictures: string[];
  comments: CommentResponse[];
  timeline: TimelineResponse[];
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
