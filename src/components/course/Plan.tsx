'use client'; // <-- This directive makes it a Client Component

import { useState } from 'react';
import RichText from '@/components/RichText';

export default function Plan({ label, content }: { label: string, content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <section style={{ marginTop: '2rem', border: '1px solid #eee', borderRadius: '8px' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1rem',
          textAlign: 'left',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          border: 'none',
          background: '#f9f9f9',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {label}
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '1rem' }}>
          <RichText content={content} />
        </div>
      )}
    </section>
  );
}