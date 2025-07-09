// src/components/course/Quote.tsx
import RichText from '@/components/RichText';

export default function Quote({ text, author }: { text: string, author: string }) {
  if (!text) return null;

  return (
    <blockquote style={{ marginTop: '1.5rem', fontStyle: 'italic', borderLeft: '3px solid #ccc', paddingLeft: '1rem' }}>
      <RichText content={text} />
      {author && <cite>&mdash; {author}</cite>}
    </blockquote>
  );
}