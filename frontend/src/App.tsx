
import { useEffect, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bug,
  Ghost,
  GitCompare,
  Menu,
  MessageSquare,
  Plus,
  ShieldCheck,
  Sparkles,
  Terminal,
  TestTube2,
  X,
} from "lucide-react";
import DevTools from "./DevTools";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type Message = {
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

type Conversation = {
  id: string;
  title: string;
  updated_at?: string;
};

type ActiveView = "chat" | "devtools";

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const bottomRef = useRef<HTMLDivElement>(null);

  async function loadConversations() {
    try {
      const response = await fetch(`${API}/api/conversations`);
      if (!response.ok) throw new Error("Could not load conversations");
      setConversations(await response.json());
    } catch {
      setError("Can't reach GhostShell's backend. Start the API server first.");
    }
  }

  useEffect(() => {
    void loadConversations();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function newChat() {
    setActiveView("chat");
    setActiveId(null);
    setMessages([]);
    setInput("");
    setError("");
    setSidebarOpen(false);
  }

  async function openConversation(id: string) {
    setError("");
    setActiveView("chat");

    try {
      const response = await fetch(
        `${API}/api/conversations/${id}/messages`,
      );
      if (!response.ok) throw new Error("Could not open conversation");

      const data = await response.json();
      setActiveId(data.id);
      setMessages(data.messages || []);
      setSidebarOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not open conversation",
      );
    }
  }

  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = input.trim();
    if (!text || loading) return;

    setError("");
    setInput("");
    setMessages((old) => [...old, { role: "user", content: text }]);
    setLoading(true);

    try {
      const response = await fetch(`${API}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversation_id: activeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Something went wrong");
      }

      setActiveId(data.conversation_id);
      setMessages((old) => [...old, data.message]);
      await loadConversations();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send message",
      );
    } finally {
      setLoading(false);
    }
  }

  function openDevTools() {
    setActiveView("devtools");
    setSidebarOpen(false);
    setError("");
  }

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : "sidebar-closed"
        }`}
      >
        <div className="brand">
          <div className="brand-mark">
            <Ghost size={23} />
          </div>

          <div>
            <div className="brand-name">
              ghostshell<span>.</span>
            </div>
            <div className="brand-caption">
              YOUR FRIENDLY GHOST IN THE MACHINE
            </div>
          </div>

          <button
            className="icon-button mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <button className="new-chat" onClick={newChat}>
          <Plus size={17} />
          New conversation
          <span className="shortcut">⌘ K</span>
        </button>

        <button
          className={`new-chat devtools-nav ${
            activeView === "devtools" ? "devtools-nav-active" : ""
          }`}
          onClick={openDevTools}
        >
          <Sparkles size={17} />
          Developer tools
        </button>

        <div className="side-label">YOUR HISTORY</div>

        <div className="history-list">
          {conversations.length === 0 && (
            <p className="history-empty">
              Your conversations will appear here.
            </p>
          )}

          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={`history-item ${
                activeId === conversation.id && activeView === "chat"
                  ? "history-active"
                  : ""
              }`}
              onClick={() => void openConversation(conversation.id)}
              title={conversation.title}
            >
              <MessageSquare size={15} />
              <span>{conversation.title}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="privacy-note">
            <ShieldCheck size={17} />
            <div>
              <strong>Local-first AI</strong>
              <span>Your model runs on your machine.</span>
            </div>
          </div>

          <div className="profile-row">
            <div className="avatar">GS</div>
            <div className="profile-copy">
              <strong>GhostShell</strong>
              <span>Developer workspace</span>
            </div>
            <Activity size={16} className="online-icon" />
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button menu-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={19} />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span>{" "}
              <strong>
                {activeView === "chat" ? "Chat" : "Developer tools"}
              </strong>
            </div>
          </div>

          <div className="model-status">
            <span className="status-dot" />
            GEMMA · LOCAL
          </div>
        </header>

        {activeView === "devtools" ? (
          <section className="chat-area devtools-area">
            <DevTools />
          </section>
        ) : (
          <>
            <section className="chat-area">
              {messages.length === 0 ? (
                <div className="welcome">
                  <div className="welcome-symbol">
                    <div className="symbol-ring">
                      <Ghost size={34} strokeWidth={1.4} />
                    </div>
                    <span className="spark spark-one">✳</span>
                    <span className="spark spark-two">✦</span>
                  </div>

                  <div className="eyebrow">
                    <span /> SYSTEM AWAKENED <span />
                  </div>

                  <h1>
                    Something is
                    <br /> <em>stirring</em> in the machine.
                  </h1>

                  <p className="welcome-copy">
                    Your coding companion has entered the terminal.
                    What are we building, debugging, or figuring out today?
                  </p>

                  <div className="suggestions">
                    <button
                      onClick={() =>
                        setInput("Help me debug a coding error step by step.")
                      }
                    >
                      <Terminal size={17} />
                      <span>
                        <strong>Debug a problem</strong>
                        <small>Find the ghost in my code</small>
                      </span>
                      <ArrowDown size={15} />
                    </button>

                    <button
                      onClick={() =>
                        setInput(
                          "Explain a programming concept with a small example.",
                        )
                      }
                    >
                      <Sparkles size={17} />
                      <span>
                        <strong>Learn something</strong>
                        <small>Make a tricky concept click</small>
                      </span>
                      <ArrowDown size={15} />
                    </button>

                    <button
                      onClick={() =>
                        setInput(
                          "Help me plan a clean architecture for a new project.",
                        )
                      }
                    >
                      <Activity size={17} />
                      <span>
                        <strong>Build a project</strong>
                        <small>Turn an idea into a plan</small>
                      </span>
                      <ArrowDown size={15} />
                    </button>
                  </div>

                  <div className="welcome-devtools">
                    <div className="welcome-devtools-heading">
                      <Sparkles size={15} />
                      <span>THE DEVELOPER LAB</span>
                    </div>

                    <p>
                      Purpose-built tools for the bugs, tests, and diffs
                      hiding in your code.
                    </p>

                    <div className="welcome-devtools-tools">
                      <span><Bug size={14} /> Debug errors</span>
                      <span><TestTube2 size={14} /> Generate tests</span>
                      <span><GitCompare size={14} /> Review diffs</span>
                    </div>

                    <button
                      className="welcome-devtools-button"
                      onClick={openDevTools}
                    >
                      Open Developer Tools <ArrowUp size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="messages">
                  {messages.map((message, index) => (
                    <article
                      className={`message message-${message.role}`}
                      key={`${index}-${message.role}`}
                    >
                      <div className={`message-avatar ${message.role}`}>
                        {message.role === "assistant" ? (
                          <Ghost size={17} />
                        ) : (
                          "YOU"
                        )}
                      </div>

                      <div className="message-body">
                        <div className="message-author">
                          {message.role === "assistant" ? "GhostShell" : "You"}
                        </div>
                        <div className="message-content">
                          {message.content}
                        </div>
                      </div>
                    </article>
                  ))}

                  {loading && (
                    <article className="message message-assistant">
                      <div className="message-avatar assistant">
                        <Ghost size={17} />
                      </div>

                      <div className="message-body">
                        <div className="message-author">GhostShell</div>
                        <div className="typing">
                          <span />
                          <span />
                          <span />
                          <small>Thinking in the shadows…</small>
                        </div>
                      </div>
                    </article>
                  )}

                  <div ref={bottomRef} />
                </div>
              )}
            </section>

            <footer className="composer-wrap">
              {error && <div className="error-message">{error}</div>}

              <form className="composer" onSubmit={sendMessage}>
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  placeholder="Ask the ghost anything about code..."
                  rows={2}
                  disabled={loading}
                />

                <div className="composer-bottom">
                  <div className="composer-hint">
                    <span>↵</span> to send <span>⇧ ↵</span> for new line
                  </div>

                  <button
                    className="send-button"
                    type="submit"
                    disabled={loading || !input.trim()}
                    aria-label="Send message"
                  >
                    <ArrowUp size={18} />
                  </button>
                </div>
              </form>

              <div className="footer-caption">
                <span>✳</span> POWERED BY YOUR LOCAL MODEL <i /> YOUR CODE
                STAYS YOURS
              </div>
            </footer>
          </>
        )}
      </main>
    </div>
  );
}

