import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, Mock } from 'vitest';

export * from '@testing-library/react';

export const simulateInput = (element: HTMLElement, value: string) => {
  fireEvent.change(element, { target: { value } });
};

export const simulateClick = async (element: HTMLElement) => {
  await userEvent.click(element);
};

export const simulateKeyPress = (element: HTMLElement, key: string) => {
  fireEvent.keyPress(element, { key, code: key });
};

export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    const loading = screen.queryByText(/加载中/i);
    expect(loading).not.toBeInTheDocument();
  });
};

export const mockApiResponse = <T>(data: T) => {
  return new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json' },
  });
};

export const mockApiError = (message: string) => {
  return new Response(JSON.stringify({ success: false, message }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
};
