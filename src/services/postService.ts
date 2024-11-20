import { ConflictError, UnauthorizedError } from "@/app/errors/http_errors";

export interface TagDto {
    id: number;
    name: string;
}
export interface UserDto {
    id: number;
    username: string;
    email: string;
    role: string; // Use a specific enum if your roles are predefined
}

export interface PostCommentDto {
    id: number;
    content: string;
    userId: number;
    postId: number;
    createdAt: string;
}

export interface PostDto {
    id: number;
    title: string;
    description: string;
    content: string;
    tags: TagDto[];
    userDto: UserDto;
    image: string;
    comments: PostCommentDto[] | null;
    likes: number;
    createdAt: string;
}

export interface AddPostDto {
    title: string,
    description: string,
    content: string,
    tags: string[],
    image?: string
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
}


async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error;
        if (response.status === 401) {
            throw new UnauthorizedError(errorMessage);
        } else if (response.status === 409) {
            throw new ConflictError(errorMessage);
        } else {
            throw Error("Request failed with status: " + response.status + " message: " + errorMessage);
        }
    }
}

export async function fetchPosts(params: FetchPostsParams): Promise<PaginatedResponse<PostDto>> {
    const { pageNumber = 0, pageSize = 8, postId, postTitle, postContent, postAuthor, postTags } = params;

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

    const endpoint = `/api/posts?${queryParams.toString()}`;
    const response = await fetchData(endpoint,
        {
            method: "GET"
        });
    const result: Result<PaginatedResponse<PostDto>> = await response.json();
    return result.data;
}

export async function addPost(post: AddPostDto): Promise<PostDto> {
    const response = await fetchData(`http://localhost:8080/api/posts/demo`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(post),
        });
    const result: Result<PostDto> = await response.json();
    return result.data;
}