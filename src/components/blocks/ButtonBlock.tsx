// FINAL version for: src/components/blocks/ButtonBlock.tsx

import Link from 'next/link';

const baseStyle = {
  display: 'inline-block',
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0'
};

const styles = {
  primary: { ...baseStyle, backgroundColor: '#ff6600', color: 'white' },
  secondary: { ...baseStyle, backgroundColor: '#e0e0e0', color: '#333333' },
  link: { ...baseStyle, padding: '0', backgroundColor: 'transparent', color: '#0070f3', borderRadius: '0', margin: '10px 0' },
};

export default function ButtonBlock({ data }: { data: any }) {
  // ✅ THE FIX: Safely handle a null 'kind' field and default to 'link'
  const kind = data?.kind ? data.kind.toLowerCase() : 'link';

  const translation = data?.translations?.[0];
  const label = translation?.label;
  const url = translation?.url;

  if (!label || !url) {
    return null;
  }

  // Now 'kind' is guaranteed to be a safe, lowercase string
  const selectedStyle = styles[kind as keyof typeof styles] || styles.link;

  return (
    <div>
      <Link href={url} style={selectedStyle}>
        {label}
      </Link>
    </div>
  );
}