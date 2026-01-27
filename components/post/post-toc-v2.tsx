'use client';

import clsx from 'clsx';
import { SingleToc } from 'lib/utils';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  toc: SingleToc[];
}

const BASE_WIDTH = 16;

const renderLi = (toc: SingleToc, activeId: string) => {
  const isActive = activeId === toc.link;
  return (
    <Fragment key={toc.link}>
      <a href={toc.link} className="flex items-center gap-3 last:mb-0 ">
        <span
          className={clsx(
            'text-sm opacity-0 transition-all duration-300',
            isActive ? 'opacity-100' : 'opacity-0',
          )}
        >
          {toc.head}
        </span>
        <li
          className={`list-none! rounded-full transition-colors duration-300 cursor-pointer ${
            isActive
              ? 'bg-gray-500 dark:bg-gray-300'
              : 'bg-gray-300 dark:bg-gray-500'
          }`}
          style={{
            // toc.level 从 2 开始，2 就是 BASE_WIDTH
            width: BASE_WIDTH - BASE_WIDTH * (toc.level - 2) * 0.2,
            height: 3,
          }}
        ></li>
      </a>
      {toc.children && toc.children.map((child) => renderLi(child, activeId))}
    </Fragment>
  );
};

const PostTocV2 = ({ toc }: Props) => {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const sections = document.querySelectorAll('h2, h3');

    // 创建 Intersection Observer 实例
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.getAttribute('id') || ''}`;
            setActiveId(id);
          }
        });
      },
      {
        // 设置根边距，提前 100px 触发观察
        // rootMargin: '-100px 0px -70% 0px',
        threshold: 0.1,
      },
    );

    // 观察所有标题元素
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      // 取消所有观察
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="fixed right-3 top-36 hidden xl:block">
      <ul className="flex flex-col items-end">
        {toc.map((item) => renderLi(item, activeId))}
      </ul>
    </div>
  );
};

export default PostTocV2;
