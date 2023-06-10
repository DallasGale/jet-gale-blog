import React from "react";
import { useRouter } from "next/router";
import { BuilderComponent, builder, useIsPreviewing } from "@builder.io/react";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { Builder } from "@builder.io/react";
import dynamic from "next/dynamic";

builder.init(`${process.env.NEXT_PUBLIC_BUILDER_API_KEY}`);

// Define a function that fetches the Builder
// content for a given page
export async function getStaticProps({ params }) {
  // Fetch the builder content for the given page
  const page = await builder
    .get("page", {
      userAttributes: {
        urlPath: "/" + (params?.page?.join("/") || ""),
      },
    })
    .toPromise();

  // Return the page content as props
  return {
    props: {
      page: page || null,
    },
    // Revalidate the content every 5 seconds
    revalidate: 5,
  };
}

// Define a function that generates the
// static paths for all pages in Builder
export async function getStaticPaths() {
  // Get a list of all pages in Builder
  const pages = await builder.getAll("page", {
    // We only need the URL field
    fields: "data.url",
    options: { noTargeting: true },
  });

  // Generate the static paths for all pages in Builder
  return {
    paths: pages.map((page) => `${page.data?.url}`),
    fallback: true,
  };
}

Builder.registerComponent(
  dynamic(() => import("../components/gallery/image/image")),
  {
    name: "Gallery Image",
    inputs: [
      { name: "src", required: true, type: "file" },
      { name: "description", required: true, type: "text" },
    ],
    image: "https://tabler-icons.io/static/tabler-icons/icons-png/camera.png",
  }
);
Builder.registerComponent(
  dynamic(() => import("../components/hero/hero")),
  {
    name: "Hero",
    inputs: [{ name: "title", type: "text" }],
    image:
      "https://tabler-icons.io/static/tabler-icons/icons-png/3d-cube-sphere-off.png",
  }
);

Builder.registerComponent(
  dynamic(() => import("../components/card/card")),
  {
    name: "Card",
    image: "https://tabler-icons.io/static/tabler-icons/icons-png/id-badge.png",
    inputs: [
      {
        name: "title",
        type: "string",
        required: true,
        defaultValue: "I am a React + Tailwind component!",
      },
      {
        name: "description",
        type: "text",
        defaultValue:
          "You can find my source code at: https://github.com/BuilderIO/blog-example/blob/main/components/Card.js",
        required: true,
      },
    ],
  }
);

// Define the Page component
const Page = ({ page }) => {
  const router = useRouter();
  const isPreviewing = useIsPreviewing();

  // If the page is still being generated,
  // show a loading message
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  // If the page content is not available
  // and not in preview mode, show a 404 error page
  if (!page && !isPreviewing) {
    return <DefaultErrorPage statusCode={404} />;
  }

  // If the page content is available, render
  // the BuilderComponent with the page content
  return (
    <>
      <Head>
        <title>{page?.data.title}</title>
      </Head>
      {/* Render the Builder page */}
      <BuilderComponent model="page" content={page} />
    </>
  );
};

export default Page;
