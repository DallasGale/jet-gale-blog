import Link from "next/link";
import { builder } from "@builder.io/react";

builder.init(`${process.env.NEXT_PUBLIC_BUILDER_API_KEY}`);

const articlesPerPage = 30;

function Blog({ articles }) {
  return (
    <div>
      {articles.map((item) => (
        <Link href={`/blog/${item.data.slug}`}>
          <div style={{ overflow: "hidden", width: 300 }}>
            <div style={{ width: 300, height: 200, display: "block" }}>
              <img src={item.data.image} />
            </div>
            {item.data.title}
            {item.data.description}
          </div>
        </Link>
      ))}
    </div>
  );
}

export async function getStaticProps({ query }) {
  const articles = await builder.getAll("blog-article", {
    // Include references, like the `author` ref
    options: { includeRefs: true },
    // For performance, don't pull the `blocks` (the full blog entry content)
    // when listing
    omit: "data.blocks",
    limit: articlesPerPage,
  });

  return { articles };
}

export default Blog;
