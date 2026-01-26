export interface MyMatters {
  title: string;
  date: string;
  tags: string[] | string;
}

export interface Post extends MyMatters {
  slug: string;
}

