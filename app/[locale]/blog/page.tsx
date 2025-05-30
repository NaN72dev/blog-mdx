import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from 'next-intl/server';
import { generateSEOMetadata } from "@/lib/seo";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/lib/blog";
import { Locale } from "@/i18n";

interface BlogPageProps {
  params: {
    locale: Locale;
  };
}

export async function generateMetadata({ params: { locale } }: BlogPageProps): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'blog' });
  
  return generateSEOMetadata({
    title: t('title'),
    description: t('description'),
  });
}

// 🚀 ISR for blog listing - Revalidate every 30 minutes
export const revalidate = 1800; // 30 minutes in seconds

export default async function BlogPage({ params: { locale } }: BlogPageProps) {
  const posts = getAllBlogPosts(locale);
  const t = await getTranslations({ locale, namespace: 'blog' });
  const commonT = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
            {t('title')}
            <span className="text-muted-foreground">.</span>
          </h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-border to-transparent mx-auto" />
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('description')}
        </p>
      </section>

      {/* Posts Grid */}
      <section className="space-y-8">
        {posts.length > 0 ? (
          <div className="grid gap-8">
            {posts.map((post, index) => (
              <article 
                key={post.slug} 
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 transition-all duration-300 hover:border-border hover:bg-card/80 hover:shadow-lg"
              >
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="grid md:grid-cols-4 gap-6 p-8">
                    {/* Cover Image */}
                    {post.metadata.cover_image && (
                      <div className="md:col-span-1">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={post.metadata.cover_image}
                            alt={`Cover image for ${post.metadata.title}`}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className={`space-y-4 ${post.metadata.cover_image ? 'md:col-span-3' : 'md:col-span-4'}`}>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={post.metadata.publishDate}>
                          {new Date(post.metadata.publishDate).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        {post.locale !== locale && (
                          <span className="text-xs bg-muted px-2 py-1 rounded">
                            {post.locale === 'en' ? 'English' : 'Tiếng Việt'}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-medium leading-tight group-hover:text-foreground/80 transition-colors">
                        {post.metadata.title}
                      </h2>
                      
                      {post.metadata.description && (
                        <p className="text-muted-foreground leading-relaxed overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {post.metadata.description}
                        </p>
                      )}
                      
                      {post.metadata.category && (
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            {post.metadata.category}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground/60 group-hover:text-foreground/80 transition-colors">
                        {commonT('readMore')}
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-medium">{t('noPostsFound')}</h3>
              <p className="text-muted-foreground">
                Check back soon for new content!
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/">{commonT('backToHome')}</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
