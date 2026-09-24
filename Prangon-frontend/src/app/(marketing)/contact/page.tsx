import React from 'react';
import { ContactForm } from '@/components/marketing/ContactForm';
import { Section } from '@/components/marketing/Section';

export default function ContactPage() {
  return (
    <Section variant="paper" className="py-24 sm:py-32">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-6">Get in touch</h1>
          <p className="font-sans text-xl text-graphite mb-12">
            Have questions about pricing, features, or need a custom enterprise solution? Our team is ready to help.
          </p>
          <div className="space-y-6 font-sans text-ink">
            <div>
              <strong className="block font-medium">Sales inquiries</strong>
              <a href="mailto:sales@prangon.com" className="text-graphite hover:text-ink transition-colors">sales@prangon.com</a>
            </div>
            <div>
              <strong className="block font-medium">Technical support</strong>
              <a href="mailto:support@prangon.com" className="text-graphite hover:text-ink transition-colors">support@prangon.com</a>
            </div>
            <div>
              <strong className="block font-medium">Office</strong>
              <p className="text-graphite">123 Tech Lane<br/>San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
        <div>
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
