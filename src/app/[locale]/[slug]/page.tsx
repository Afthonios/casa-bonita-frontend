import directus from '@/lib/directus/directus';
import { readItems } from '@directus/sdk';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ButtonBlock from '@/components/blocks/ButtonBlock';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

const blockComponents = {
  block_button: ButtonBlock,
  // Add other block components here as you create them
};

interface PageProps {
  params: { locale: string; slug: string; };
}

// --- 1. METADATA FUNCTION FOR SEO ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { locale, slug } = params;
    const seoData = await directus.request(
      readItems('pages', {
        filter: { translations: { _and: [{ slug: { _eq: slug } }, { languages_code: { _eq: locale } }]}},
        fields: ['translations.seo_title', 'translations.seo_description'],
        limit: 1,
      })
    );
    const seoTranslation = seoData?.[0]?.translations?.[0];
    if (!seoTranslation) return { title: 'Page Not Found' };
    return {
      title: seoTranslation.seo_title,
      description: seoTranslation.seo_description,
    };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return { title: 'Error', description: 'Could not fetch page metadata.' };
  }
}

// --- 2. MAIN DATA FETCHING FUNCTION ---
async function getPageData(locale: string, slug: string) {
  try {
    const pageData = await directus.request(
      readItems('pages', {
        filter: { translations: { _and: [{ slug: { _eq: slug } }, { languages_code: { _eq: locale } }]}},
        fields: [
          'image_id',
          'translations.title',
          'translations.subtitle',
          'translations.description',
          'content_blocks.collection',
          'content_blocks.item.*',
          'content_blocks.item.translations.*',
        ],
        deep: {
          translations: { _filter: { languages_code: { _eq: locale } } },
          content_blocks: { item: { translations: { _filter: { languages_code: { _eq: locale } } }}},
        },
        limit: 1,
      })
    );
    if (!pageData?.[0]) return null;
    return pageData[0];
  } catch (error) {
    console.error('Error fetching page data:', error);
    return null;
  }
}

// --- 3. ROBUST STATIC PARAMS FUNCTION ---
export async function generateStaticParams(): Promise<
  { params: { locale: string; slug: string } }[]
> {
  try {
    const pages = await directus.request(
      readItems('pages', { fields: ['translations.slug', 'translations.languages_code.code'] })
    );

    if (!Array.isArray(pages)) {
      console.error("generateStaticParams: Expected an array of pages, but got something else.");
      return [];
    }

    const paths: { params: { locale: string; slug: string } }[] = [];

    for (const page of pages) {
      if (Array.isArray(page.translations)) {
        for (const trans of page.translations) {
          if (trans.slug && trans.languages_code?.code) {
            paths.push({
              params: {
                locale: trans.languages_code.code,
                slug: trans.slug,
              },
            });
          }
        }
      }
    }
    return paths;
  } catch (error) {
    console.error("Error in generateStaticParams:", error);
    return [];
  }
}

// --- 4. THE PAGE COMPONENT ---
export default async function DynamicPage({ params }: PageProps) {
  const page = await getPageData(params.locale, params.slug);
  if (!page) { notFound(); }

  const pageTranslation = page.translations?.[0];
  const blocks = page.content_blocks || [];
  
  const imageUrl = page.image_id
    ? getCloudinaryImageUrl(page.image_id, {
        width: 1200,
        quality: 'auto',
        format: 'auto',
      })
    : null;

  return (
    <article>
      <header style={{ padding: '20px', textAlign: 'center' }}>
        {imageUrl && <img src={imageUrl} alt={pageTranslation?.title || 'Page image'} style={{ maxWidth: '100%', height: 'auto', marginBottom: '2rem' }} />}
        {pageTranslation?.title && <h1>{pageTranslation.title}</h1>}
        {pageTranslation?.subtitle && <h2 style={{color: 'gray'}}>{pageTranslation.subtitle}</h2>}
      </header>
      
      <hr />

      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {pageTranslation?.description && (
          <div dangerouslySetInnerHTML={{ __html: pageTranslation.description }} />
        )}
        <section>
          {blocks.map((block: any, index: number) => {
            const Component = blockComponents[block.collection as keyof typeof blockComponents];
            if (!Component) return <div key={index}>Unknown block: {block.collection}</div>;
            return <Component key={index} data={block.item} />;
          })}
        </section>
      </main>
    </article>
  );
}