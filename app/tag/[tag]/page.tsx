import clsx from 'clsx';
import PostCard from 'components/pages/blog/post-card';
import PostCardLoading from 'components/pages/blog/post-card-loading';
import { getPostsByTag, getTagPaths } from 'lib/posts';
import { notFound } from 'next/navigation';
import { Fragment, Suspense } from 'react';

export async function generateStaticParams() {
  return await getTagPaths();
}

export default async function Page({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;

  const posts = await getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      <main className="flex-1 w-full max-w-4xl mx-auto">
        <h1
          className={clsx(
            'text-5xl font-bold text-center font-Barlow',
            'mt-8 mb-20 text-gray-800 dark:text-gray-200',
          )}
        >
          Posts tagged with "{tag}"
        </h1>
        <div className="px-4 lg:px-0">
          {posts.map((post) => (
            <Fragment key={post.slug}>
              <Suspense fallback={<PostCardLoading />}>
                <PostCard post={post} />
              </Suspense>
            </Fragment>
          ))}
        </div>
      </main>
    </>
  );
}
