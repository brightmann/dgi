import clsx from 'clsx';
import PostCard from 'components/pages/blog/post-card';
import PostCardLoading from 'components/pages/blog/post-card-loading';
import Pagination from 'components/rua/rua-pagination';
import { getPostListPath, PostPerPage, postLists } from 'lib/posts';
import { notFound } from 'next/navigation';
import { Fragment, Suspense } from 'react';

export async function generateStaticParams() {
  return await getPostListPath();
}

export default async function Page({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;
  // 如果能被序列化为 Number，则为页码
  const pageNumber = Number(page);

  if (
    !Number.isNaN(pageNumber) &&
    Number.isInteger(pageNumber) &&
    pageNumber > 0
  ) {
    const allPosts = await postLists();
    const posts = allPosts.slice(
      (pageNumber - 1) * PostPerPage,
      PostPerPage * pageNumber,
    );

    // 如果请求的页码没有文章，返回 404
    if (posts.length === 0) {
      notFound();
    }

    const prev = pageNumber - 1;
    const next = pageNumber + 1;
    const total = Math.ceil(allPosts.length / PostPerPage);

    return (
      <>
        <main className="flex-1 w-full max-w-4xl mx-auto">
          <h1
            className={clsx(
              'text-5xl font-bold text-center font-Barlow',
              'mt-8 mb-20 text-gray-800 dark:text-gray-200',
            )}
          >
            Blog posts
          </h1>
          <div className="px-4 lg:px-0">
            {posts.map((post) => (
              <Fragment key={post.slug}>
                <Suspense fallback={<PostCardLoading />}>
                  <PostCard post={post} />
                </Suspense>
              </Fragment>
            ))}

            <Pagination
              className="py-6 mt-4 px-7 lg:px-5"
              hasPrev={!!prev}
              hasNext={next <= total}
              prevLink={prev === 1 ? '/' : `/${prev}`}
              nextLink={`/${next}`}
              current={next - 1}
              total={total}
            />
          </div>
        </main>
      </>
    );
  } else {
    notFound();
  }
}
