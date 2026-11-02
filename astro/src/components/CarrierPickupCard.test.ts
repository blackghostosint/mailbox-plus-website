import { describe, it, expect, beforeEach } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import CarrierPickupCard from './CarrierPickupCard.astro';

describe('CarrierPickupCard.astro accessibility and rendering', () => {
  let container: Awaited<ReturnType<typeof AstroContainer.create>>;

  const sampleSchedule = [
    { days: 'Monday – Friday:', hours: '4:00 PM' },
    { days: 'Saturday:', hours: '12:00 PM (Noon)' },
    { days: 'Sunday:', hours: 'No pickup' },
  ];

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders a keyboard-scrollable container with tabindex="0", role="region", and dynamic aria-label', async () => {
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'FedEx Ground',
        schedule: sampleSchedule,
      },
    });

    expect(result).toContain('class="overflow-x-auto"');
    expect(result).toContain('tabindex="0"');
    expect(result).toContain('role="region"');
    expect(result).toContain('aria-label="FedEx Ground pickup schedule"');
  });

  it('renders a visually hidden caption matching the carrier pickup schedule', async () => {
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'USPS',
        schedule: sampleSchedule,
      },
    });

    expect(result).toContain('<caption class="sr-only">USPS pickup schedule</caption>');
  });

  it('renders structured table rows with scope="row" headers', async () => {
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'UPS',
        schedule: sampleSchedule,
      },
    });

    expect(result).toContain(
      '<th scope="row" class="py-2 font-medium width-[120px]">Monday – Friday:</th>'
    );
    expect(result).toContain('<td class="py-2">4:00 PM</td>');
    expect(result).toContain(
      '<th scope="row" class="py-2 font-medium width-[120px]">Saturday:</th>'
    );
    expect(result).toContain('<td class="py-2">12:00 PM (Noon)</td>');
    expect(result).toContain('<th scope="row" class="py-2 font-medium width-[120px]">Sunday:</th>');
    expect(result).toContain('<td class="py-2">No pickup</td>');
  });

  it('renders notes paragraph when notes prop is provided', async () => {
    const notesText = 'Accepts pre-labeled drop-offs and Amazon returns.';
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'UPS',
        schedule: sampleSchedule,
        notes: notesText,
      },
    });

    expect(result).toContain(notesText);
    expect(result).toContain('class="mt-4 text-[var(--color-text-secondary)] text-sm italic"');
  });

  it('omits notes paragraph when notes prop is not provided', async () => {
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'UPS',
        schedule: sampleSchedule,
      },
    });

    expect(result).not.toContain('italic');
  });

  it('supports custom carrier SVG icon via slot', async () => {
    const iconSvg =
      '<svg data-testid="custom-icon" class="w-5 h-5 mr-2"><path d="M0 0h24v24H0z"></path></svg>';
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'FedEx Express',
        schedule: sampleSchedule,
      },
      slots: {
        icon: iconSvg,
      },
    });

    expect(result).toContain('data-testid="custom-icon"');
    expect(result).toContain('FedEx Express');
  });

  it('applies custom accentColor and card title', async () => {
    const result = await container.renderToString(CarrierPickupCard, {
      props: {
        carrierName: 'FedEx Express',
        title: 'FedEx Express Custom Title',
        accentColor: 'text-[var(--color-primary)]',
        schedule: sampleSchedule,
      },
    });

    expect(result).toContain('text-[var(--color-primary)]');
    expect(result).toContain('FedEx Express Custom Title');
    expect(result).toContain('aria-label="FedEx Express pickup schedule"');
    expect(result).toContain('<caption class="sr-only">FedEx Express pickup schedule</caption>');
  });
});
