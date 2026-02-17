import { render, screen, fireEvent } from '@testing-library/react';
import Timeline from '../Timeline';
import { useHolidayStore } from '@/store/useHolidayStore';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Holiday } from '@/data/types';

// Mocks
vi.mock('@/store/useHolidayStore');
vi.mock('@/hooks/useScrollSpy');
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: vi.fn() }),
}));
// Fix: Filter out 'fill' prop to avoid React warning on img tag
vi.mock('next/image', () => ({
    default: ({ fill, ...props }: any) => <img {...props} />,
}));

// Mock framer-motion to avoid animation complexities in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Timeline', () => {
    const setActiveHolidayId = vi.fn();
    const setMode = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useHolidayStore as any).mockReturnValue({
            activeHolidayId: null,
            mode: 'narrative',
            setActiveHolidayId,
            setMode,
            // Mock other store methods called by HolidayCard
            setFocusPoint: vi.fn(),
            setIsScrollingProgrammatically: vi.fn(),
        });
    });

    // Builder Helper
    const createHoliday = (id: string, overrides = {}): Holiday => ({
        id,
        slug: `slug-${id}`,
        title: `Holiday ${id}`,
        startDate: '2024-01-01',
        endDate: '2024-01-05',
        location: 'Location',
        country: 'Country',
        description: 'Desc',
        coordinates: { lat: 0, lng: 0 },
        coverImage: '/img.jpg',
        images: [],
        tags: [],
        ...overrides,
    });

    it('Timeline_validHolidays_rendersCards', () => {
        // Given
        const holidays = [createHoliday('1'), createHoliday('2')];

        // When
        render(<Timeline holidays={holidays} />);

        // Then
        expect(screen.getByText('Holiday 1')).toBeInTheDocument();
        expect(screen.getByText('Holiday 2')).toBeInTheDocument();
    });

    it('Timeline_emptyHolidays_rendersEmptyState', () => {
        // Given
        const holidays: Holiday[] = [];

        // When
        render(<Timeline holidays={holidays} />);

        // Then
        expect(screen.getByText('No holidays match your filters')).toBeInTheDocument();
    });

    it('Timeline_cardClick_updatesActiveHoliday', () => {
        // Given
        const holidays = [createHoliday('1')];
        render(<Timeline holidays={holidays} />);

        // Find the card wrapper which has the click handler
        // We look for the element with data-holiday-id="1"
        // Note: checking specifically for data-holiday-id as defined in HolidayCard
        // The querySelector approach is sometimes easier but let's use robust queries if possible.
        // We can find by text, then closest.
        const card = screen.getByText('Holiday 1').closest('[data-holiday-id="1"]');
        expect(card).toBeTruthy();

        // When
        fireEvent.click(card!);

        // Then
        expect(setActiveHolidayId).toHaveBeenCalledWith('1');
    });

    it('Timeline_multipleYears_showsYearLabels', () => {
        // Given
        const holidays = [
            createHoliday('1', { startDate: '2023-01-01' }),
            createHoliday('2', { startDate: '2024-01-01' })
        ];

        // When
        render(<Timeline holidays={holidays} />);

        // Then
        expect(screen.getByText('2023')).toBeInTheDocument();
        expect(screen.getByText('2024')).toBeInTheDocument();
    });
});
