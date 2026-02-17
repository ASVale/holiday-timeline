import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../Modal';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useRouter } from 'next/navigation';

vi.mock('next/navigation', () => ({
    useRouter: vi.fn(),
}));

describe('Modal', () => {
    const backMock = vi.fn();

    beforeEach(() => {
        vi.resetAllMocks();
        (useRouter as any).mockReturnValue({ back: backMock });
        document.body.style.overflow = '';
    });

    afterEach(() => {
        document.body.style.overflow = '';
    });

    it('Modal_validChildren_rendersContent', () => {
        // Given
        const children = <div data-testid="content">Test Content</div>;

        // When
        render(<Modal>{children}</Modal>);

        // Then
        expect(screen.getByTestId('content')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('Modal_mount_locksBodyScroll', () => {
        // Given
        expect(document.body.style.overflow).toBe('');

        // When
        render(<Modal><div></div></Modal>);

        // Then
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('Modal_unmount_unlocksBodyScroll', () => {
        // Given
        const { unmount } = render(<Modal><div></div></Modal>);
        expect(document.body.style.overflow).toBe('hidden');

        // When
        unmount();

        // Then
        expect(document.body.style.overflow).not.toBe('hidden');
    });

    it('Modal_backdropClick_navigatesBack', () => {
        // Given
        render(<Modal><div></div></Modal>);

        // When
        fireEvent.click(screen.getByTestId('modal-backdrop'));

        // Then
        expect(backMock).toHaveBeenCalled();
    });

    it('Modal_closeButtonClick_navigatesBack', () => {
        // Given
        render(<Modal><div></div></Modal>);
        const closeButton = screen.getByRole('button', { name: /close/i });

        // When
        fireEvent.click(closeButton);

        // Then
        expect(backMock).toHaveBeenCalled();
    });
});
