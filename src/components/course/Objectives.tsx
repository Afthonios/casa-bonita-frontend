// src/components/course/Objectives.tsx
import RichText from '@/components/RichText'; // We'll reuse our secure rich text component

export default function Objectives({ label, content }: { label: string, content: string }) {
  if (!content) return null;

  // Split the content by line breaks, filter out empty lines, and wrap each in <li>
  const objectivesList = content
    .replace(/<p>|<\/p>/g, '') // Remove <p> tags
    .split('<br>')
    .map(item => item.trim())
    .filter(item => item) // Remove any empty strings
    .map((item, index) => <li key={index}>{item}</li>);

  return (
    <section style={{ marginTop: '2rem' }}>
      <h2>{label}</h2>
      <ul style={{ paddingLeft: '20px', listStyleType: 'disc' }}>
        {objectivesList}
      </ul>
    </section>
  );
}