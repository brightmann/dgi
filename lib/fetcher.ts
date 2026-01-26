import { cache } from 'react';

export interface LinkResult {
  meta: Meta;
  links: Link[];
  rel: [];
}
export interface Link {
  href: string;
  rel: string[];
  type: string;
}
export interface Meta {
  description: string;
  title: string;
  author: string;
  canonical: string;
}
const defaultLinkResult: LinkResult = {
  meta: {
    description: '',
    title: '',
    author: '',
    canonical: '',
  },
  links: [],
  rel: [],
};
export const urlMeta = cache(async (url: string) => {
  try {
    const result: LinkResult = await (
      await fetch(`http://iframely.server.crestify.com/iframely?url=${url}`)
    ).json();
    return result;
  } catch (err) {
    console.error(err);
    return defaultLinkResult;
  }
});
