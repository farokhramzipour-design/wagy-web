
import {
  BlogPost,
  BlogCategory,
  CreateBlogPostRequest,
  UpdateBlogPostRequest,
  CreateCategoryRequest,
  PostListResponse
} from "@/types/admin-blog";

const BASE_URL = "/api/admin/blog";

// Helper for local API calls
async function localFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.detail || errorData.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return res.json();
}

export const adminBlogApi = {
  // Posts
  getPosts: async (params: {
    status?: string;
    category_id?: number;
    search?: string;
    skip?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append("status", params.status);
    if (params.category_id) searchParams.append("category_id", params.category_id.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.skip !== undefined) searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined) searchParams.append("limit", params.limit.toString());

    return localFetch<PostListResponse>(`/posts?${searchParams.toString()}`);
  },

  getPostById: async (id: number) => {
    return localFetch<BlogPost>(`/posts/${id}`);
  },

  createPost: async (data: CreateBlogPostRequest) => {
    return localFetch<BlogPost>(`/posts`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updatePost: async (id: number, data: UpdateBlogPostRequest) => {
    return localFetch<BlogPost>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deletePost: async (id: number) => {
    return localFetch<void>(`/posts/${id}`, {
      method: "DELETE",
    });
  },

  // Categories
  getCategories: async () => {
    return localFetch<BlogCategory[]>(`/categories`);
  },

  createCategory: async (data: CreateCategoryRequest) => {
    return localFetch<BlogCategory>(`/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  deleteCategory: async (id: number) => {
    return localFetch<void>(`/categories/${id}`, {
      method: "DELETE",
    });
  }
};
