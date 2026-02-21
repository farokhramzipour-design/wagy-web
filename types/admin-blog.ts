
export interface BlogPost {
  post_id: number;
  title_en: string;
  title_fa: string;
  slug: string;
  excerpt_en: string;
  excerpt_fa: string;
  content_en: string;
  content_fa: string;
  cover_media_id: number;
  cover_url: string;
  author_id: number;
  author_name: string;
  status: "draft" | "published" | "archived";
  published_at?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  category_id: number;
  category_name: string;
}

export interface BlogCategory {
  category_id: number;
  name_en: string;
  name_fa: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostRequest {
  title_en: string;
  title_fa: string;
  slug: string;
  excerpt_en?: string;
  excerpt_fa?: string;
  content_en: string;
  content_fa: string;
  cover_media_id: number;
  status: "draft" | "published" | "archived";
  tags?: string[];
  category_id: number;
}

export interface UpdateBlogPostRequest {
  title_en?: string;
  title_fa?: string;
  slug?: string;
  excerpt_en?: string;
  excerpt_fa?: string;
  content_en?: string;
  content_fa?: string;
  cover_media_id?: number;
  status?: "draft" | "published" | "archived";
  tags?: string[];
  category_id?: number;
}

export interface CreateCategoryRequest {
  name_en: string;
  name_fa: string;
  slug: string;
  description?: string;
}

export interface PostListResponse {
  total: number;
  skip: number;
  limit: number;
  items: BlogPost[];
}
