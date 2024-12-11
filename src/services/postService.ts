import { ConflictError, UnauthorizedError } from "@/app/errors/http_errors";
import { formatAsLocalDateTimeWithMillis } from "@/app/utils/FormatDate";

export interface TagDto {
  id: number;
  name: string;
}
export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  tags: TagDto[];
}

export interface PostCommentDto {

    id: number;
    content: string;
    user: UserDto;
    postId: number;
    createdAt: string;
}

export interface PostDto {
    id: number;
    title: string;
    content: string;
    tags: TagDto[];
    userDto: UserDto;
    image: string;
    comments: PostCommentDto[] | null;
    likes: number;
    createdAt: string;
    updatedAt: string;
}

export interface AddPostDto {
  title: string;
  description: string;
  content: string;
  tags: string[];
  image?: string;
}

export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  items: T[];
}

export interface Result<T> {
  flag: boolean;
  code: number;
  message: string;
  data: T;
}

interface FetchPostsParams {
    pageNumber: number;
    pageSize: number;
    postId?: number;
    postTitle?: string;
    postContent?: string;
    postAuthor?: string;
    postTags?: string[];
    startDate?: string;
    endDate?: string;
}

interface FetchTagsParams {
    pageNumber: number;
    pageSize: number;
    tagId?: number;
    tagName?: string;

}

class TemporaryAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TemporaryAuthError";
    Object.setPrototypeOf(this, TemporaryAuthError.prototype);
  }
}

export async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.message;
    console.log("Error message:", errorMessage);
    if (response.status === 401) {
      throw new UnauthorizedError(errorMessage);
    } else if (response.status === 409) {
      throw new ConflictError(errorMessage);
    } else if (response.status === 500) {
      throw new TemporaryAuthError("Something went wrong, please try again");
    } else {
      throw Error(
        "Request failed with status: " +
          response.status +
          " message: " +
          errorMessage
      );
    }
  }
}

// for requests that require a bearer token (pretty much everything except the '/auth' endpoints)
export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {

    const token = localStorage.getItem('authToken');

    if (token) {
        init = init || {};
        init.headers = {
            ...init.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return fetchData(input, init);
}

// get posts with pagination and different filters 
export async function fetchPosts(params: FetchPostsParams): Promise<PaginatedResponse<PostDto>> {
    const { pageNumber, pageSize, postId, postTitle, postContent, postAuthor, postTags, startDate, endDate } = params;

    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
      });

    if (postId) queryParams.append("postId", postId.toString());
    if (postTitle) queryParams.append("postTitle", postTitle);
    if (postContent) queryParams.append("postContent", postContent);
    if (postAuthor) queryParams.append("postAuthor", postAuthor);
    if (postTags && postTags.length > 0) {
        postTags.forEach((tag) => queryParams.append("postTags", tag));
    }
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const endpoint = `http://localhost:8080/api/posts?${queryParams.toString()}`;
    const response = await fetchWithAuth(endpoint,
        {
            method: "GET"
        });
    const result: Result<PaginatedResponse<PostDto>> = await response.json();
    
    return result.data;

}

export async function addPost(post: AddPostDto): Promise<PostDto> {
  const response = await fetchWithAuth(`http://localhost:8080/api/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  const result: Result<PostDto> = await response.json();
  return result.data;
}

export async function updatePost(
  post: AddPostDto,
  postId: number
): Promise<PostDto> {
  const response = await fetchWithAuth(
    `http://localhost:8080/api/posts/` + postId,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    }
  );
  const result: Result<PostDto> = await response.json();
  return result.data;
}

export async function deletePost(postId: number) {
  await fetchWithAuth(`http://localhost:8080/api/posts/` + postId, {
    method: "DELETE",
  });
}

export async function fetchPostById(postId: number): Promise<PostDto> {
    const response = await fetchWithAuth(`http://localhost:8080/api/posts/` + postId,
        {
            method: "GET"
        }
    );
    const result: Result<PostDto> = await response.json();
    return result.data;
}

export async function fetchTags(params: FetchTagsParams): Promise<PaginatedResponse<TagDto>>{
    const { pageNumber, pageSize, tagId, tagName } = params;

    const queryParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString(),
    });

    if (tagId) queryParams.append("tagId", tagId.toString());
    if (tagName) queryParams.append("tagName", tagName);

    const endpoint = `http://localhost:8080/api/tags?${queryParams.toString()}`;
    const response = await fetchData(endpoint,
        {
            method: "GET"
        });
    const result: Result<PaginatedResponse<TagDto>> = await response.json();
    return result.data;
    
}

