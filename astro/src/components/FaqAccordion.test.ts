import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import FaqAccordion from './FaqAccordion.astro';

describe('FaqAccordion.astro container rendering', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  const sampleFaqs = [
    { question: 'What are your hours?', answer: 'Mon-Fri 9AM-6PM, Sat 9AM-2PM.' },
    {
      question: 'Do I need an appointment for notary?',
      answer: 'No appointment needed for walk-in notary.',
    },
    { question: 'Where are you located?', answer: '7554 Fredle Dr, Concord Township, OH.' },
  ];

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders FAQ questions and answers using details and summary markup', async () => {
    const result = await container.renderToString(FaqAccordion, {
      props: {
        faqs: sampleFaqs,
      },
    });

    expect(result).toContain('What are your hours?');
    expect(result).toContain('Mon-Fri 9AM-6PM, Sat 9AM-2PM.');
    expect(result).toContain('Do I need an appointment for notary?');
    expect(result).toContain('No appointment needed for walk-in notary.');
    expect(result).toContain('<details');
    expect(result).toContain('<summary');
  });

  it('accepts items prop as alias for faqs', async () => {
    const result = await container.renderToString(FaqAccordion, {
      props: {
        items: sampleFaqs,
      },
    });

    expect(result).toContain('What are your hours?');
    expect(result).toContain('Where are you located?');
  });

  it('handles openFirst state by applying open attribute to first item', async () => {
    const result = await container.renderToString(FaqAccordion, {
      props: {
        faqs: sampleFaqs,
        openFirst: true,
      },
    });

    // Match details with open attribute
    expect(result).toMatch(/<details[^>]*\bopen\b/);
  });

  it('handles defaultOpenIndex state', async () => {
    const result = await container.renderToString(FaqAccordion, {
      props: {
        faqs: sampleFaqs,
        defaultOpenIndex: 1,
      },
    });

    // Should render details with open on second FAQ
    expect(result).toMatch(/<details[^>]*\bopen\b/);
    expect(result).toContain('Do I need an appointment for notary?');
  });

  it('applies custom class or className prop to wrapper div', async () => {
    const resultWithClass = await container.renderToString(FaqAccordion, {
      props: {
        faqs: sampleFaqs,
        class: 'my-custom-accordion',
      },
    });
    expect(resultWithClass).toContain('class="space-y-3 my-custom-accordion"');

    const resultWithClassName = await container.renderToString(FaqAccordion, {
      props: {
        faqs: sampleFaqs,
        className: 'alt-custom-accordion',
      },
    });
    expect(resultWithClassName).toContain('class="space-y-3 alt-custom-accordion"');
  });

  it('renders configured headingLevel elements inside summary', async () => {
    const defaultResult = await container.renderToString(FaqAccordion, {
      props: { faqs: sampleFaqs },
    });
    expect(defaultResult).toContain('<h3');

    const h2Result = await container.renderToString(FaqAccordion, {
      props: { faqs: sampleFaqs, headingLevel: 'h2' },
    });
    expect(h2Result).toContain('<h2');

    const num4Result = await container.renderToString(FaqAccordion, {
      props: { faqs: sampleFaqs, headingLevel: 4 },
    });
    expect(num4Result).toContain('<h4');
  });
});
