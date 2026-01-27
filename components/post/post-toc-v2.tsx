'use client';

import { SingleToc } from 'lib/utils';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';

interface Props {
  toc: SingleToc[];
}

const BASE_WIDTH = 17;

const renderLi = (toc: SingleToc, activeId: string) => {
  const isActive = activeId === toc.link;
  return (
    <Fragment key={toc.link}>
      <li
        className={`list-none! rounded-lg mb-4 last:mb-0 transition-colors duration-200 ${
          isActive
            ? 'bg-gray-500 dark:bg-gray-300'
            : 'bg-gray-300 dark:bg-gray-500'
        }`}
        style={{
          // toc.level 从 2 开始，2 就是 BASE_WIDTH
          width: BASE_WIDTH - BASE_WIDTH * (toc.level - 2) * 0.2,
          height: 2,
        }}
      ></li>
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
        rootMargin: '-100px 0px -70% 0px',
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
    <div className="fixed right-3 top-36">
      <ul className="flex flex-col items-end">
        {toc.map((item) => renderLi(item, activeId))}
      </ul>
    </div>
  );
};

export default PostTocV2;
