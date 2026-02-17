import { renderHook } from '@testing-library/react';
import { useScrollSpy } from '../useScrollSpy';
import { useHolidayStore } from '@/store/useHolidayStore';
import { vi, describe, it, expect, beforeEach, afterEach, type Mock } from 'vitest';

// Mock store
vi.mock('@/store/useHolidayStore');

describe('useScrollSpy', () => {
    const setActiveHolidayId = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useHolidayStore as unknown as Mock).mockReturnValue({
            setActiveHolidayId,
            isScrollingProgrammatically: false,
            isActiveHolidayLocked: false,
        });

        // Mock IntersectionObserver using a class to satisfy 'new' usage
        const observe = vi.fn();
        const unobserve = vi.fn();
        const disconnect = vi.fn();

        global.IntersectionObserver = class {
            constructor(callback: any) {
                // store callback if needed
            }
            observe = observe;
            unobserve = unobserve;
            disconnect = disconnect;
        } as any;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const createContainer = (scrollTop = 0) => {
        const container = document.createElement('div');
        Object.defineProperty(container, 'clientHeight', { value: 500 });
        Object.defineProperty(container, 'scrollHeight', { value: 1000 });
        Object.defineProperty(container, 'scrollTop', { value: scrollTop, writable: true });

        // Add cards
        const card1 = document.createElement('div');
        card1.setAttribute('data-holiday-id', '1');
        container.appendChild(card1);

        const card2 = document.createElement('div');
        card2.setAttribute('data-holiday-id', '2');
        container.appendChild(card2);

        return container;
    };

    it('useScrollSpy_initialMount_scrolledToTop_activatesFirstHoliday', () => {
        // Given
        const container = createContainer(0);
        const ref = { current: container };

        // When
        renderHook(() => useScrollSpy(ref));

        // Then
        expect(setActiveHolidayId).toHaveBeenCalledWith('1');
    });

    it('useScrollSpy_scrollEvent_scrolledToTop_activatesFirstHoliday', () => {
        // Given
        const container = createContainer(100);
        const ref = { current: container };
        renderHook(() => useScrollSpy(ref)); // Mount hook
        setActiveHolidayId.mockClear();        // Clear initial call if any

        // When
        container.scrollTop = 40;
        container.dispatchEvent(new Event('scroll'));

        // Then
        expect(setActiveHolidayId).toHaveBeenCalledWith('1');
    });

    it('useScrollSpy_scrollEvent_scrolledToBottom_activatesLastHoliday', () => {
        // Given
        const container = createContainer(100);
        const ref = { current: container };
        renderHook(() => useScrollSpy(ref));
        setActiveHolidayId.mockClear();

        // When
        // Scroll to bottom: 1000 - 496 - 500 = 4 < 5
        container.scrollTop = 496;
        container.dispatchEvent(new Event('scroll'));

        // Then
        expect(setActiveHolidayId).toHaveBeenCalledWith('2');
    });

    it('useScrollSpy_programmaticScrolling_scrollEvent_doesNotActivateHoliday', () => {
        // Given
        (useHolidayStore as unknown as Mock).mockReturnValue({
            setActiveHolidayId,
            isScrollingProgrammatically: true,
            isActiveHolidayLocked: false,
        });
        const container = createContainer(100);
        const ref = { current: container };
        renderHook(() => useScrollSpy(ref));
        setActiveHolidayId.mockClear();

        // When
        container.dispatchEvent(new Event('scroll'));

        // Then
        expect(setActiveHolidayId).not.toHaveBeenCalled();
    });
});
