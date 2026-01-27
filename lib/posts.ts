import fs from 'fs/promises';
import matter from 'gray-matter';
import { sortByDate } from 'lib/utils';
import path from 'path';
import { cache } from 'react';
import { MyMatters, Post } from 'types';

// 常量定义
export const DATA_PATH = 'content/posts';
export const PostPerPage = 10;

/**
 * 读取单个文件的元数据
 * @param filename 文件名称
 * @returns 包含slug和元数据的Post对象
 */
const readFileMeta = async (filename: string): Promise<Post> => {
  const filePath = path.join(DATA_PATH, filename);
  const fileContent = await fs.readFile(filePath, 'utf-8');
  const slug = filename.replace(/\.mdx$/, '');
  const { data: meta } = matter(fileContent);

  return {
    slug,
    ...(meta as MyMatters),
  };
};

/**
 * 获取所有MDX文件列表
 * 内部辅助函数，用于避免重复调用fs.readdir
 */
const getMdxFiles = cache(async (): Promise<string[]> => {
  const files = await fs.readdir(DATA_PATH);
  return files.filter((filename) => filename.endsWith('.mdx'));
});

/**
 * 读取所有文章的元数据列表，并按日期排序
 * 使用cache装饰器缓存结果，避免重复计算
 * @returns 排序后的文章列表
 */
export const postLists = cache(async (): Promise<Post[]> => {
  const mdxFiles = await getMdxFiles();
  const posts = await Promise.all(mdxFiles.map(readFileMeta));

  return posts.sort(sortByDate);
});

/**
 * 读取单个文章的内容
 * 使用cache装饰器缓存结果，避免重复读取同一篇文章
 * @param slug 文章的slug
 * @returns 文章的原始内容
 */
export const readSinglePost = cache(async (slug: string): Promise<string> => {
  const filePath = path.join(DATA_PATH, `${slug}.mdx`);
  return fs.readFile(filePath, { encoding: 'utf-8' });
});

/**
 * 获取所有文章的路径信息（slug列表）
 * @returns 包含所有文章slug的数组
 */
export const allPostsPath = cache(async (): Promise<{ slug: string }[]> => {
  const mdxFiles = await getMdxFiles();

  return mdxFiles.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ''),
  }));
});

/**
 * 计算分页信息
 * @param totalPosts 总文章数
 * @returns 总页数
 */
const calculateTotalPages = (totalPosts: number): number => {
  return Math.ceil(totalPosts / PostPerPage);
};

/**
 * 获取文章列表的分页路径
 * @returns 包含页码的路径数组
 */
export const getPostListPath = cache(async (): Promise<{ page: string }[]> => {
  const mdxFilesCount = (await getMdxFiles()).length;
  const totalPages = calculateTotalPages(mdxFilesCount);

  const paths: { page: string }[] = [];

  // 生成分页路径（从第2页开始）
  if (totalPages > 1) {
    Array.from({ length: totalPages - 1 }, (_, index) => {
      paths.push({ page: (index + 2).toString() });
    });
  }

  return paths;
});

/**
 * 获取所有标签路径
 * @returns 包含所有标签的路径数组
 */
export const getTagPaths = cache(async (): Promise<{ tag: string }[]> => {
  const posts = await postLists();
  const allTags = new Set<string>();

  // 收集所有标签并去重
  posts.forEach((post) => {
    if (post.tags) {
      const tagsArray = Array.isArray(post.tags) ? post.tags : [post.tags];
      tagsArray.forEach((tag) => {
        if (tag) {
          allTags.add(tag);
        }
      });
    }
  });

  const paths: { tag: string }[] = [];
  allTags.forEach((tag) => {
    paths.push({ tag });
  });

  return paths;
});

/**
 * 分页获取文章列表
 * @param page 页码（从1开始）
 * @returns 该页的文章列表
 */
export const getPaginatedPosts = cache(
  async (page: number = 1): Promise<Post[]> => {
    const allPosts = await postLists();
    const startIndex = (page - 1) * PostPerPage;
    const endIndex = startIndex + PostPerPage;

    return allPosts.slice(startIndex, endIndex);
  },
);

/**
 * 获取文章总数
 * @returns 文章总数
 */
export const getTotalPostsCount = cache(async (): Promise<number> => {
  return (await getMdxFiles()).length;
});

/**
 * 获取特定标签的文章列表
 * @param tag 标签名称
 * @returns 该标签下的文章列表，按日期排序
 */
export const getPostsByTag = cache(async (tag: string): Promise<Post[]> => {
  const allPosts = await postLists();
  return allPosts.filter((post) => {
    if (!post.tags) return false;
    const tagsArray = Array.isArray(post.tags) ? post.tags : [post.tags];
    return tagsArray.some((t) => t === tag);
  });
});

/**
 * 获取总页数
 * @returns 总页数
 */
export const getTotalPages = cache(async (): Promise<number> => {
  const totalPosts = await getTotalPostsCount();
  return calculateTotalPages(totalPosts);
});

// 为了API一致性，同时保留新的函数名称作为别名
export const getPostList = postLists;
export const getPostContent = readSinglePost;
export const getAllPostPaths = allPostsPath;
export const getPostListPaths = getPostListPath;
export const POSTS_PER_PAGE = PostPerPage;
