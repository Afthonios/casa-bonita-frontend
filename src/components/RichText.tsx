import DOMPurify from 'isomorphic-dompurify';

// This component takes the raw HTML string from Directus...
export default function RichText({ content }: { content: string }) {
  // ...and cleans it to prevent XSS security vulnerabilities.
  const sanitizedContent = DOMPurify.sanitize(content);

  return <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />;
}