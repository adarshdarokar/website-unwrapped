import { useCallback } from "react";
import { useInRouterContext, useNavigate, type NavigateFunction } from "react-router-dom";

/**
 * Safe wrapper around useNavigate().
 *
 * useNavigate() throws ("may be used only in the context of a <Router>") when a
 * component is rendered outside the router tree (portals, previews, tests,
 * storybook-like harnesses). This hook keeps rendering alive by falling back to
 * a hard browser navigation instead of crashing the app.
 */
export function useSafeNavigate(): NavigateFunction {
  const inRouter = useInRouterContext();
  // Hooks must be called unconditionally; useNavigate is safe to call only in-router,
  // so we guard by branching on the returned function below.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const routerNavigate = inRouter ? useNavigate() : undefined;

  const fallback = useCallback((to: unknown, options?: { replace?: boolean }) => {
    if (typeof to === "number") {
      window.history.go(to);
      return;
    }
    const href = typeof to === "string" ? to : String((to as { pathname?: string })?.pathname ?? "/");
    if (options?.replace) window.location.replace(href);
    else window.location.assign(href);
  }, []);

  return (routerNavigate ?? fallback) as NavigateFunction;
}
