import 'styles/catppuccin-variables.css';
import clsx from 'clsx';
import components from 'components/mdx/components';
import data from 'content/mdx-data';
import { allPostsPath, readSinglePost } from 'lib/posts';
import { generateToc, SingleToc } from 'lib/utils';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { Post } from 'types';

// const PostToc = dynamic(() => import('components/post/post-toc'));
const PostToc = dynamic(() => import('components/post/post-toc-v2'));
const PostCommnetLine = dynamic(
  () => import('components/post/post-commnet-line'),
);

export async function generateStaticParams() {
  return await allPostsPath();
}

const Page = async ({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) => {
  const { slug } = await params;
  if (!slug) notFound();

  const post = await readSinglePost(slug);
  const toc = generateToc(post);

  const mdxSource = await compileMDX<Post>({
    source: post,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypeHighlight, { alias: { vue: 'xml' } }],
          rehypeSlug,
        ],
      },
      scope: data,
    },
    components: { ...(components as {}) },
  });

  return (
    <>
      <main
        id="article"
        className={clsx(
          'relative max-w-4xl px-4 mx-auto my-10',
          'lg:w-4xl w-full flex-1',
        )}
      >
        <h1>{mdxSource.frontmatter?.title}</h1>
        <time>{mdxSource.frontmatter?.date}</time>

        <article id="post-content">
          {mdxSource.content}
          <PostCommnetLine />
        </article>

        <PostToc toc={toc} />
      </main>
    </>
  );
};

export default Page;
