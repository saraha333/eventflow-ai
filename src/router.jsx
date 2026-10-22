import { useEffect, useState } from "react";

// Tiny hash router: works on GitHub Pages and Vercel without server rewrites.
const get = () => window.location.hash.replace(/^#/, "") || "/";

export function useRoute() {
  const [path, setPath] = useState(get);
  useEffect(() => {
    const onChange = () => { setPath(get()); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return path;
}
export const go = (path) => { window.location.hash = path; };
export const Link = ({ to, children, ...rest }) => (
  <a href={"#" + to} {...rest}>{children}</a>
);
