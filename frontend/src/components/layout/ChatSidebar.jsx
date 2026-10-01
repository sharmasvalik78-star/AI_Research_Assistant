import { useEffect, useRef, useState } from "react";

export default function ChatSidebar({
    sessions,
    selectedSession,
    onSelectSession,
    onNewChat,
    onRenameSession,
    onDeleteSession,
}) {
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRefs = useRef({});
    const [visibleCount, setVisibleCount] = useState(50);

    useEffect(() => {
        function handleClickOutside(event) {
            if (openMenuId === null) return;

            const menu = menuRefs.current[openMenuId];

            if (menu && !menu.contains(event.target)) {
                setOpenMenuId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, [openMenuId]);

    const handleMenuToggle = (e, sessionId) => {
        e.stopPropagation();

        setOpenMenuId((prev) =>
            prev === sessionId ? null : sessionId
        );
    };

    const handleRename = (e, session) => {
        e.stopPropagation();
        setOpenMenuId(null);

        onRenameSession(session);
    };

    const handleDelete = (e, session) => {
        e.stopPropagation();
        setOpenMenuId(null);

        onDeleteSession(session);
    };

    return (
        <div className="chat-sidebar">
            <div className="chat-sidebar-header">
                <button
                    className="new-chat-btn"
                    onClick={onNewChat}
                >
                    + New Chat
                </button>
            </div>

            <div className="chat-list">
                {sessions.length === 0 ? (
                    <div className="empty-chat">
                        No conversations
                    </div>
                ) : (
                    <>
                        {sessions
                            .slice(0, visibleCount)
                            .map((session) => (
                                <div
                                    key={session.id}
                                    className={`chat-item ${
                                        selectedSession?.id === session.id
                                            ? "active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        onSelectSession(session)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            onSelectSession(session);
                                        }
                                    }}
                                    tabIndex={0}
                                    role="button"
                                    aria-current={
                                        selectedSession?.id === session.id
                                            ? "true"
                                            : undefined
                                    }
                                >
                                    <div className="chat-title">
                                        {session.title || "New Chat"}
                                    </div>

                                    <div
                                        className="chat-menu-wrapper"
                                        ref={(el) => {
                                            if (el) {
                                                menuRefs.current[
                                                    session.id
                                                ] = el;
                                            }
                                        }}
                                        onClick={(e) =>
                                            e.stopPropagation()
                                        }
                                    >
                                        <button
                                            className="menu-button"
                                            aria-label={`Actions for ${
                                                session.title || "New Chat"
                                            }`}
                                            onClick={(e) =>
                                                handleMenuToggle(
                                                    e,
                                                    session.id
                                                )
                                            }
                                        >
                                            ⋮
                                        </button>

                                        {openMenuId === session.id && (
                                            <div className="menu-dropdown">
                                                <button
                                                    onClick={(e) =>
                                                        handleRename(
                                                            e,
                                                            session
                                                        )
                                                    }
                                                >
                                                    Rename
                                                </button>

                                                <button
                                                    onClick={(e) =>
                                                        handleDelete(
                                                            e,
                                                            session
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                        {visibleCount < sessions.length && (
                            <button
                                type="button"
                                className="show-more-chats-btn"
                                onClick={() =>
                                    setVisibleCount(
                                        (prev) => prev + 50
                                    )
                                }
                            >
                                Show Older Chats
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}