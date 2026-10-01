import React, { lazy, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import "./MarkdownMessage.css";

const SyntaxHighlighter = lazy(async () => {
    const [{ PrismLight }, { oneDark }] = await Promise.all([
        import("react-syntax-highlighter/dist/esm/prism-light"),
        import("react-syntax-highlighter/dist/esm/styles/prism"),
    ]);

    return {
        default: (props) => (
            <PrismLight style={oneDark} {...props} />
        ),
    };
});

const MarkdownMessage = React.memo(function MarkdownMessage({ content }) {
    return (
        <div className="markdown-body">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");

                        if (!inline && match) {
                            return (
                                <Suspense fallback={<pre>{children}</pre>}>
                                    <SyntaxHighlighter
                                        language={match[1]}
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, "")}
                                    </SyntaxHighlighter>
                                </Suspense>
                            );
                        }

                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
});

export default MarkdownMessage;