import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, vi } from "vitest";

import { ResendEmail } from "../ResendEmail";

const mockHandleResendEmail = vi.hoisted(() => vi.fn());
const mockUseResendMail = vi.hoisted(() => vi.fn());
const mockUseSendMail = vi.hoisted(() => vi.fn());

vi.mock("@/shared/hooks", () => ({
  useResendMail: mockUseResendMail,
}));

vi.mock("@/shared/services", () => ({
  useSendMail: mockUseSendMail,
}));

const mockSearchParams = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useSearchParams: vi.fn(() => mockSearchParams),
  useRouter: vi.fn(),
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("ResendEmail", () => {
  const mockMutate = vi.fn();
  const SECONDS_PER_MINUTE = 60;
  const COOLDOWN_SECONDS = 120;

  beforeEach(() => {
    mockUseSendMail.mockReturnValue({
      mutate: mockMutate,
    });

    mockUseResendMail.mockReturnValue({
      coolDown: 0,
      handleResendEmail: mockHandleResendEmail,
      isLoading: false,
      isCoolDownActive: false,
      formatTime: vi.fn((seconds: number) => {
        const mins = Math.floor(seconds / SECONDS_PER_MINUTE);
        const secs = seconds % SECONDS_PER_MINUTE;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
      }),
    });

    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "email") return "test@example.com";
      return null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the component with all required elements", () => {
    render(<ResendEmail />);

    expect(screen.getByRole("button", { name: /resend email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /back to login/i })).toBeInTheDocument();
  });

  it("calls handleResendEmail when resend button is clicked", async () => {
    const user = userEvent.setup();
    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    await user.click(resendButton);

    expect(mockHandleResendEmail).toHaveBeenCalledTimes(1);
  });

  it("has correct link to login page", () => {
    render(<ResendEmail />);

    const backToLoginLink = screen.getByRole("link", { name: /back to login/i });
    expect(backToLoginLink).toHaveAttribute("href", "/auth/login");
  });

  it("disables resend button when loading", () => {
    mockUseResendMail.mockReturnValue({
      coolDown: 0,
      handleResendEmail: mockHandleResendEmail,
      isLoading: true,
      isCoolDownActive: false,
      formatTime: vi.fn(),
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).toBeDisabled();
  });

  it("disables resend button during cooldown", () => {
    mockUseResendMail.mockReturnValue({
      coolDown: 60,
      handleResendEmail: mockHandleResendEmail,
      isLoading: false,
      isCoolDownActive: true,
      formatTime: vi.fn((_) => `1:00`),
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).toBeDisabled();
  });

  it("shows cooldown timer in button text during cooldown", () => {
    const mockFormatTime = vi.fn((_) => "1:30");
    mockUseResendMail.mockReturnValue({
      coolDown: 90,
      handleResendEmail: mockHandleResendEmail,
      isLoading: false,
      isCoolDownActive: true,
      formatTime: mockFormatTime,
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).toHaveTextContent("Resend in 1:30");
  });

  it("enables resend button when cooldown is not active and not loading", () => {
    mockUseResendMail.mockReturnValue({
      coolDown: 0,
      handleResendEmail: mockHandleResendEmail,
      isLoading: false,
      isCoolDownActive: false,
      formatTime: vi.fn(),
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).not.toBeDisabled();
  });

  it("initializes useResendMail with correct parameters", () => {
    render(<ResendEmail />);

    expect(mockUseResendMail).toHaveBeenCalledWith(
      "test@example.com",
      mockMutate,
      expect.any(Function)
    );
  });

  it("formats email correctly for the mutation", () => {
    render(<ResendEmail />);

    const valuesFormatter = mockUseResendMail.mock.calls[0][2];
    const result = valuesFormatter("test@example.com");

    expect(result).toEqual({ email: "test@example.com" });
  });

  it("handles missing email parameter", () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "email") return null;
      return null;
    });

    render(<ResendEmail />);

    expect(mockUseResendMail).toHaveBeenCalledWith("", mockMutate, expect.any(Function));
  });

  it("shows loading state correctly", () => {
    mockUseResendMail.mockReturnValue({
      coolDown: 0,
      handleResendEmail: mockHandleResendEmail,
      isLoading: true,
      isCoolDownActive: false,
      formatTime: vi.fn(),
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).toBeDisabled();
  });

  it("shows cooldown loading state correctly", () => {
    const mockFormatTime = vi.fn((_) => "0:45");
    mockUseResendMail.mockReturnValue({
      coolDown: 45,
      handleResendEmail: mockHandleResendEmail,
      isLoading: false,
      isCoolDownActive: true,
      formatTime: mockFormatTime,
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).toBeDisabled();
  });

  it("does not show loading indicator text when actually loading", () => {
    mockUseResendMail.mockReturnValue({
      coolDown: 60,
      handleResendEmail: mockHandleResendEmail,
      isLoading: true,
      isCoolDownActive: true,
      formatTime: vi.fn((_) => "1:00"),
    });

    render(<ResendEmail />);

    const resendButton = screen.getByRole("button", { name: /resend email/i });
    expect(resendButton).not.toHaveTextContent("Resend in 1:00");
  });

  it("calls formatTime with correct cooldown value", () => {
    const mockFormatTime = vi.fn((_) => "2:00");
    mockUseResendMail.mockReturnValue({
      coolDown: 120,
      handleResendEmail: mockHandleResendEmail,
      isLoading: false,
      isCoolDownActive: true,
      formatTime: mockFormatTime,
    });

    render(<ResendEmail />);

    expect(mockFormatTime).toHaveBeenCalledWith(COOLDOWN_SECONDS);
  });

  it("handles different email formats correctly", () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === "email") return "user+test@domain.co.uk";
      return null;
    });

    render(<ResendEmail />);

    expect(mockUseResendMail).toHaveBeenCalledWith(
      "user+test@domain.co.uk",
      mockMutate,
      expect.any(Function)
    );

    const valuesFormatter = mockUseResendMail.mock.calls[0][2];
    const result = valuesFormatter("user+test@domain.co.uk");

    expect(result).toEqual({ email: "user+test@domain.co.uk" });
  });
});
