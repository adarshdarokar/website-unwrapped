import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { useSafeNavigate } from "./useSafeNavigate";

const assign = vi.fn();
const replace = vi.fn();
const go = vi.fn();

beforeEach(() => {
  assign.mockClear();
  replace.mockClear();
  go.mockClear();

  // jsdom's window.location is not writable by default.
  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: { ...window.location, assign, replace, href: "http://localhost/" },
  });
  vi.spyOn(window.history, "go").mockImplementation(go);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useSafeNavigate outside a Router", () => {
  it("does not throw and returns a function", () => {
    const { result } = renderHook(() => useSafeNavigate());
    expect(typeof result.current).toBe("function");
  });

  it("falls back to window.location.assign for string paths", () => {
    const { result } = renderHook(() => useSafeNavigate());
    result.current("/pricing");
    expect(assign).toHaveBeenCalledWith("/pricing");
    expect(replace).not.toHaveBeenCalled();
  });

  it("uses window.location.replace when replace option is set", () => {
    const { result } = renderHook(() => useSafeNavigate());
    result.current("/auth", { replace: true });
    expect(replace).toHaveBeenCalledWith("/auth");
    expect(assign).not.toHaveBeenCalled();
  });

  it("supports location objects via pathname", () => {
    const { result } = renderHook(() => useSafeNavigate());
    result.current({ pathname: "/history" });
    expect(assign).toHaveBeenCalledWith("/history");
  });

  it("defaults to / when no pathname is available", () => {
    const { result } = renderHook(() => useSafeNavigate());
    result.current({} as never);
    expect(assign).toHaveBeenCalledWith("/");
  });

  it("delegates numeric deltas to history.go", () => {
    const { result } = renderHook(() => useSafeNavigate());
    result.current(-1);
    expect(go).toHaveBeenCalledWith(-1);
    expect(assign).not.toHaveBeenCalled();
  });
});

describe("useSafeNavigate inside a Router", () => {
  it("returns the real router navigate and does not touch window.location", () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(
      () => ({ safe: useSafeNavigate(), real: useNavigate() }),
      { wrapper }
    );

    expect(result.current.safe).toBe(result.current.real);

    result.current.safe("/history");
    expect(assign).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });
});
