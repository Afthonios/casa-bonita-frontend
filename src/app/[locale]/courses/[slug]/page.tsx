import directus from '@/lib/directus/directus';
import { readItems } from '@directus/sdk';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCloudinaryImageUrl } from '@/lib/cloudinary';

interface CoursePageProps {
  params: { locale: string; slug: string; };
}

// Helper function to format duration
function formatDuration(minutes: number): string {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  let result = '';
  if (hours > 0) result += `${hours} hour${hours > 1 ? 's' : ''} `;
  if (remainingMinutes > 0) result += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  return result.trim();
}

// --- METADATA FUNCTION ---
export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  try {
    const seoData = await directus.request(
      readItems('courses', {
        filter: {
          status: { _eq: 'published' },
          translations: { _and: [{ slug: { _eq: params.slug } }, { languages_code: { _eq: params.locale } }] }
        },
        fields: ['translations.seo_title', 'translations.seo_description'],
        limit: 1,
      })
    );
    const seoTranslation = seoData?.[0]?.translations?.[0];
    if (!seoTranslation) return { title: 'Course Not Found' };
    return { title: seoTranslation.seo_title, description: seoTranslation.seo_description };
  } catch (error) {
    console.error("Error in generateMetadata:", error);
    return { title: 'Error' };
  }
}

// --- MAIN DATA FETCHING FUNCTION ---
async function getCourseData(locale: string, slug: string) {
  try {
    const courseData = await directus.request(
      readItems('courses', {
        filter: {
          status: { _eq: 'published' },
          translations: { _and: [{ slug: { _eq: slug } }, { languages_code: { _eq: locale } }] }
        },
        fields: [
          'image_id', 'duration', 'quote_author',
          'translations.title', 'translations.long_description', 'translations.quote',
          'translations.objectives', 'translations.plan', 'translations.public',
          'translations.image_alt'
        ],
        deep: {
          translations: { _filter: { languages_code: { _eq: locale } } },
        },
        limit: 1,
      })
    );
    return courseData?.[0] ?? null;
  } catch (error) {
    console.error('Error fetching course data:', error);
    return null;
  }
}

// --- STATIC PARAMS FUNCTION ---
export async function generateStaticParams() {
    try {
        const courses = await directus.request(
            readItems('courses', { fields: ['translations.slug', 'translations.languages_code.code'] })
        );
        if (!Array.isArray(courses)) return [];
        const paths = [];
        for (const course of courses) {
            if (Array.isArray(course.translations)) {
                for (const trans of course.translations) {
                    if (trans.slug && trans.languages_code?.code) {
                        paths.push({ locale: trans.languages_code.code, slug: trans.slug });
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


// --- THE COURSE PAGE COMPONENT ---
export default async function CoursePage({ params }: CoursePageProps) {
  const course = await getCourseData(params.locale, params.slug);
  if (!course) { notFound(); }

  const translation = course.translations?.[0];
  if (!translation) { notFound(); }

  const imageUrl = course.image_id
    ? getCloudinaryImageUrl(course.image_id, { width: 800, quality: 'auto', format: 'auto' })
    : null;

  return (
    <article style={{ fontFamily: 'sans-serif', color: '#333' }}>
      <header style={{ padding: '40px 20px', textAlign: 'center', backgroundColor: '#f4f4f4' }}>
        {translation.title && <h1>{translation.title}</h1>}
      </header>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto', gap: '2rem', padding: '1rem' }}>
        
        <aside style={{ flex: '1 1 300px' }}>
          <div style={{ border: '1px solid #eee', padding: '1.5rem', borderRadius: '8px' }}>
            {imageUrl && <img src={imageUrl} alt={translation.image_alt || ''} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {course.duration && (
                <div><strong>Duration:</strong> {formatDuration(Number(course.duration))}</div>
              )}
              {translation.public && (
                <div><strong>Audience:</strong> {translation.public}</div>
              )}
              {translation.quote && course.quote_author && (
                <blockquote style={{ marginTop: '1.5rem', fontStyle: 'italic', borderLeft: '3px solid #ccc', paddingLeft: '1rem' }}>
                  <p dangerouslySetInnerHTML={{ __html: translation.quote }} />
                  <cite>&mdash; {course.quote_author}</cite>
                </blockquote>
              )}
            </div>
          </div>
        </aside>

        <main style={{ flex: '2 1 600px' }}>
          {translation.long_description && (
            <section dangerouslySetInnerHTML={{ __html: translation.long_description }} />
          )}

          {translation.objectives && (
            <section style={{ marginTop: '2rem' }}>
              <h2>Objectives</h2>
              <div dangerouslySetInnerHTML={{ __html: translation.objectives }} />
            </section>
          )}

          {translation.plan && (
            <section style={{ marginTop: '2rem' }}>
              <h2>Plan</h2>
              <div dangerouslySetInnerHTML={{ __html: translation.plan }} />
            </section>
          )}
        </main>
      </div>
    </article>
  );
}