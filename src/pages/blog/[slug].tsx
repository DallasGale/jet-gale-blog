import { useRouter } from "next/router";
import ErrorPage from "next/error";
// import Container from "@/components/container";
// import PostBody from "@/components/post-body";
// import Header from "@/components/header";
// import PostHeader from "@/components/post-header";
// import Layout from "@/components/layout";
// import PostTitle from "@/components/post-title";
import Head from "next/head";
import { builder, BuilderContent, useIsPreviewing } from "@builder.io/react";
import "@builder.io/widgets";

builder.init(`${process.env.NEXT_PUBLIC_BUILDER_API_KEY}`);

// Post model created to display a specific blog post.
// read more at: https://www.builder.io/blog/creating-blog
export default function BlogArticle({ post }) {
  console.log({ post });
  const router = useRouter();
  const isPreviewing = useIsPreviewing();
  if (!router.isFallback && !post && !isPreviewing) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <>
      {router.isFallback ? (
        <h1>Loading…</h1>
      ) : (
        <>
          <BuilderContent
            {...(!isPreviewing && { content: post })}
            modelName="blog-article"
            options={{ includeRefs: true }}
            isStatic
          >
            {(data, loading, fullContent) =>
              data && (
                <article>
                  <Head>
                    <title>
                      {data.title} | Next.js Blog Example with Builder.io
                    </title>
                    <meta property="og:image" content={data.image} />
                  </Head>
                  {/* {data.author?.value && (
                      <PostHeader
                        title={data.title}
                        coverImage={data.image}
                        date={data.lastUpdated}
                        author={data.author.value?.data}
                      />
                    )} */}
                  <h1>{data.title}</h1>
                  <p>{data.blurb}</p>

                  <p>{data.body}</p>
                  {/* <PostBody content={data.body} /> */}
                </article>
              )
            }
          </BuilderContent>
        </>
      )}
    </>
  );
}

export async function getStaticProps({ params }) {
  console.log({ params });
  const slug = params.slug;

  /*
    usage of builder sdks to fetch data
    more examples at https://github.com/BuilderIO/builder/tree/main/packages/core  */

  let post =
    (await builder
      .get("blog-article", {
        // Content API params are detailed in this doc
        // https://www.builder.io/c/docs/query-api
        includeRefs: true,
        query: {
          "data.slug": slug,
        },
      })
      .toPromise()) || null;

  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const allPosts = await builder.getAll("blog-article", {
    options: { noTargeting: true },
  });
  return {
    paths: allPosts?.map((post) => `/blog/${post?.data?.slug}`) || [],
    fallback: true,
  };
}
