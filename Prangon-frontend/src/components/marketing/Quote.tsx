import React from 'react';

export function Quote({ quote, author, role }: { quote: string, author: string, role: string }) {
  return (
    <figure className="border-l-2 border-ink pl-6 py-2 my-12">
      <blockquote className="font-display text-2xl sm:text-3xl text-ink leading-tight mb-6">
        "{quote}"
      </blockquote>
      <figcaption className="font-sans">
        <div className="font-medium text-ink">{author}</div>
        <div className="text-graphite">{role}</div>
      </figcaption>
    </figure>
  );
}
