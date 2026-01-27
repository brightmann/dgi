export interface MyMatters {
  title: string;
  date: string;
  tags: string[] | string;
}

export interface Post extends MyMatters {
  slug: string;
}

export interface PostSearchData extends Post {
  // 截取的内容 100 字符
  content: string;
}
