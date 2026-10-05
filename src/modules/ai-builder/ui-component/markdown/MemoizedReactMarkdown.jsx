import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeMathjax from "rehype-mathjax";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { CodeBlock } from "./CodeBlock";

import "./Markdown.css";

/**
 * Checks if text likely contains LaTeX math notation
 * @param {string} text - Text to check for LaTeX math
 * @param {Object[]} customPatterns - Additional regex patterns to check
 * @returns {boolean} - Whether LaTeX math is likely present
 */
const containsLaTeX = (text, customPatterns = []) => {
  if (!text || typeof text !== "string") return false;

  // Common LaTeX patterns - more permissive to catch edge cases
  const defaultPatterns = [
    { regex: /\$\$.+?\$\$/s, name: "Block math: $$...$$" },
    { regex: /\\\(.+?\\\)/s, name: "Inline math: \\(...\\)" },
    { regex: /\\\[[\s\S]*?\\\]/, name: "Display math: \\[...\\]" },
    {
      regex:
        /\\begin{(equation|align|gather|math|matrix|bmatrix|pmatrix|vmatrix|cases)}.+?\\end{\1}/s,
      name: "Environment math",
    },
    { regex: /\$(.*?[\\{}_^].*?)\$/, name: "Inline math with $" },
    { regex: /\\frac/, name: "LaTeX command: \\frac" },
    { regex: /\\sqrt/, name: "LaTeX command: \\sqrt" },
    { regex: /\\pm/, name: "LaTeX command: \\pm" },
    { regex: /\\cdot/, name: "LaTeX command: \\cdot" },
    { regex: /\\text/, name: "LaTeX command: \\text" },
    { regex: /\\sum/, name: "LaTeX command: \\sum" },
    { regex: /\\prod/, name: "LaTeX command: \\prod" },
    { regex: /\\int/, name: "LaTeX command: \\int" },
  ];

  // Combine default and custom patterns
  const patterns = [...defaultPatterns, ...customPatterns];

  for (const pattern of patterns) {
    if (pattern.regex.test(text)) {
      return true;
    }
  }

  return false;
};

/**
 * Preprocesses text to make LaTeX syntax more compatible with Markdown
 * @param {string} text - Original text with potentially problematic LaTeX syntax
 * @returns {string} - Text with LaTeX syntax adjusted for better compatibility
 */
const preprocessLatex = (text) => {
  if (!text || typeof text !== "string") return text;

  // Replace problematic LaTeX patterns with more compatible alternatives
  const processedText = text
    // Convert display math with indentation to dollar-dollar format
    .replace(/(\n\s*)\\\[([\s\S]*?)\\\](\s*\n|$)/g, (match, before, content, after) => {
      // Preserve indentation but use $$ format which is more reliably handled
      return `${before}$$${content}$$${after}`;
    })
    // Convert inline math to dollar format with spaces to avoid conflicts
    .replace(/\\\(([\s\S]*?)\\\)/g, "$ $1 $");

  return processedText;
};

/**
 * Enhanced Markdown component with memoization for better performance
 * Supports various plugins and custom rendering components
 */
export const MemoizedReactMarkdown = memo(
  ({ children, ...props }) => {
    // Preprocess text to improve LaTeX compatibility
    const processedChildren = useMemo(
      () => (typeof children === "string" ? preprocessLatex(children) : children),
      [children]
    );

    // Enable math by default unless explicitly disabled
    const shouldEnableMath = useMemo(() => {
      const hasLatex =
        processedChildren && containsLaTeX(processedChildren, props.mathPatterns || []);

      return props.disableMath === true ? false : props.forceMath || hasLatex;
    }, [processedChildren, props.forceMath, props.disableMath, props.mathPatterns]);

    // Configure plugins based on content
    const remarkPlugins = useMemo(() => {
      if (props.remarkPlugins) return props.remarkPlugins;
      return shouldEnableMath ? [remarkGfm, remarkMath] : [remarkGfm];
    }, [props.remarkPlugins, shouldEnableMath]);

    const rehypePlugins = useMemo(() => {
      if (props.rehypePlugins) return props.rehypePlugins;
      return shouldEnableMath ? [rehypeMathjax] : [];
    }, [props.rehypePlugins, shouldEnableMath]);

    return (
      <div className="react-markdown">
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={{
            code({ inline, className, children, ...codeProps }) {
              const match = /language-(\w+)/.exec(className || "");
              const codeText = String(children).replace(/\n$/, "");
              const lang = (match && match[1]) || "text";
              const stableKey = `cb-${lang}-${codeText.length}-${codeText.slice(0, 48)}`;
              return !inline ? (
                <CodeBlock
                  key={stableKey}
                  chatflowid={props.chatflowid}
                  isFullWidth={props.isFullWidth !== undefined ? props.isFullWidth : true}
                  language={lang}
                  value={codeText}
                  {...codeProps}
                />
              ) : (
                <code className={className} {...codeProps}>
                  {children}
                </code>
              );
            },
            a({ href, children, ...linkProps }) {
              return (
                <a href={href} target="_blank" rel="noopener noreferrer" {...linkProps}>
                  {children}
                </a>
              );
            },
            // Block widgets (e.g. CodeBlock) use <div>; must not live inside <p>/<pre> (invalid HTML + hydration).
            p({ children, ...rest }) {
              return (
                <div style={{ whiteSpace: "pre-line", marginBlockEnd: "1em" }} {...rest}>
                  {children}
                </div>
              );
            },
            pre({ children, ...rest }) {
              return (
                <div style={{ marginBlock: "1em", overflow: "auto" }} {...rest}>
                  {children}
                </div>
              );
            },
            ...props.components,
          }}
          {...props}
        >
          {processedChildren}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => {
    // More detailed comparison for better memoization
    if (prevProps.children !== nextProps.children) return false;

    // Check if other props have changed
    const prevEntries = Object.entries(prevProps).filter(([key]) => key !== "children");
    const nextEntries = Object.entries(nextProps).filter(([key]) => key !== "children");

    if (prevEntries.length !== nextEntries.length) return false;

    // Simple shallow comparison of remaining props
    for (const [key, value] of prevEntries) {
      if (key === "components" || key === "remarkPlugins" || key === "rehypePlugins") continue; // Skip complex objects

      if (nextProps[key] !== value) return false;
    }

    return true;
  }
);

MemoizedReactMarkdown.displayName = "MemoizedReactMarkdown";

MemoizedReactMarkdown.propTypes = {
  children: PropTypes.any,
  chatflowid: PropTypes.string,
  isFullWidth: PropTypes.bool,
  remarkPlugins: PropTypes.array,
  rehypePlugins: PropTypes.array,
  components: PropTypes.object,
  forceMath: PropTypes.bool,
  disableMath: PropTypes.bool,
  mathPatterns: PropTypes.array,
};
