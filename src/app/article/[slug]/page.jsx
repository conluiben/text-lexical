import { allArticles } from "@/data";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;
  const fetchedArticle = allArticles.find(
    (anArticle) => anArticle.slug === slug
  );

  if (!fetchedArticle) return {};

  return {
    title: fetchedArticle.title,
    description: fetchedArticle.content,
    openGraph: {
      images: [
        {
          url: fetchedArticle.banner, // raw URL
          width: 1200,
          height: 630,
          alt: fetchedArticle.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [fetchedArticle.banner],
    },
  };
}

const page = async ({ params }) => {
  const { slug } = await params;
  const fetchedArticle = allArticles.find(
    (anArticle) => anArticle.slug === slug
  );
  if (!fetchedArticle) return notFound();

  return (
    <main className="prose mx-auto">
      <h1>{fetchedArticle.title}</h1>
      <img src={fetchedArticle.banner} alt={fetchedArticle.title} />
      <article dangerouslySetInnerHTML={{ __html: fetchedArticle.content }} />
    </main>
  );
};

export default page;
