
import { useState } from "react";
import {
  Bug,
  Check,
  Clipboard,
  GitCompare,
  LoaderCircle,
  Sparkles,
  TestTube2,
} from "lucide-react";

const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

type ToolName = "error" | "tests" | "diff";

const tools: {
  id: ToolName;
  title: string;
  description: string;
  placeholder: string;
  icon: typeof Bug;
}[] = [
  {
    id: "error",
    title: "Error Investigator",
    description: "Find the likely cause and work toward a fix.",
    placeholder:
      "Paste your traceback, compiler error, and relevant code here...",
    icon: Bug,
  },
  {
    id: "tests",
    title: "Test Generator",
    description: "Generate unit tests and explore edge cases.",
    placeholder:
      "Paste the function or module you want to test...",
    icon: TestTube2,
  },
  {
    id: "diff",
    title: "Diff Reviewer",
    description: "Inspect a Git diff for bugs and regressions.",
    placeholder:
      "Paste your git diff here, including file and line context...",
    icon: GitCompare,
  },
];

export default function DevTools() {
  const [selected, setSelected] = useState<ToolName>("error");
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("Auto-detect");
  const [framework, setFramework] = useState("None specified");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const activeTool = tools.find((tool) => tool.id === selected)!;
  const Icon = activeTool.icon;

  async function analyze() {
    if (!content.trim() || loading) return;

    setLoading(true);
    setError("");
    setAnalysis("");
    setCopied(false);

    try {
      const response = await fetch(`${API}/api/devtools/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: selected,
          content: content.trim(),
          language,
          framework,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed. Please try again.");
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to GhostShell.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyAnalysis() {
    try {
      await navigator.clipboard.writeText(analysis);
      setCopied(true);
    } catch {
      setError("Clipboard access failed. Select and copy the result manually.");
    }
  }

  function changeTool(id: ToolName) {
    setSelected(id);
    setAnalysis("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="devtools">
      <div className="devtools-heading">
        <div className="devtools-eyebrow">
          <Sparkles size={14} /> GHOSTSHELL / DEVELOPER LAB
        </div>
        <h1>Tools for the <em>unknown.</em></h1>
        <p>
          Investigate errors, generate tests, and catch issues before they
          escape into production.
        </p>
      </div>

      <div className="devtools-grid">
        <aside className="devtools-tools">
          <div className="devtools-label">WORKBENCH</div>
          {tools.map((tool) => {
            const ToolIcon = tool.icon;
            return (
              <button
                key={tool.id}
                className={`devtool-option ${
                  selected === tool.id ? "devtool-option-active" : ""
                }`}
                onClick={() => changeTool(tool.id)}
              >
                <ToolIcon size={19} />
                <span>
                  <strong>{tool.title}</strong>
                  <small>{tool.description}</small>
                </span>
              </button>
            );
          })}

          <div className="devtools-local-note">
            <span className="status-dot" />
            <div>
              <strong>LOCAL ANALYSIS</strong>
              <small>Powered by your configured Ollama model</small>
            </div>
          </div>
        </aside>

        <div className="devtools-workspace">
          <div className="devtools-panel-heading">
            <div className="devtools-tool-icon">
              <Icon size={20} />
            </div>
            <div>
              <h2>{activeTool.title}</h2>
              <p>{activeTool.description}</p>
            </div>
          </div>

          <label className="devtools-field-label" htmlFor="dev-language">
            LANGUAGE
          </label>
          <select
            id="dev-language"
            className="devtools-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {[
              "Auto-detect",
              "C++",
              "Python",
              "JavaScript",
              "TypeScript",
              "Java",
              "Go",
              "Rust",
              "Other",
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          {selected === "tests" && (
            <>
              <label className="devtools-field-label" htmlFor="dev-framework">
                TEST FRAMEWORK
              </label>
              <select
                id="dev-framework"
                className="devtools-select"
                value={framework}
                onChange={(event) => setFramework(event.target.value)}
              >
                {[
                  "None specified",
                  "pytest",
                  "unittest",
                  "Jest",
                  "Vitest",
                  "React Testing Library",
                  "JUnit",
                  "Catch2",
                ].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </>
          )}

          <label className="devtools-field-label" htmlFor="dev-input">
            {selected === "error"
              ? "ERROR + RELEVANT CODE"
              : selected === "tests"
                ? "SOURCE CODE"
                : "GIT DIFF"}
          </label>
          <textarea
            id="dev-input"
            className="devtools-input"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder={activeTool.placeholder}
            rows={9}
            maxLength={30000}
            spellCheck={false}
          />

          <div className="devtools-input-footer">
            <span>{content.length.toLocaleString()} / 30,000 characters</span>
            <button
              className="devtools-run"
              onClick={() => void analyze()}
              disabled={loading || !content.trim()}
            >
              {loading ? (
                <LoaderCircle size={16} className="devtools-spinner" />
              ) : (
                <Sparkles size={16} />
              )}
              {loading ? "Investigating..." : "Run analysis"}
            </button>
          </div>

          {error && <div className="devtools-error">{error}</div>}

          {loading && (
            <div className="devtools-loading">
              <LoaderCircle size={18} className="devtools-spinner" />
              Asking the local model to inspect your submission…
            </div>
          )}

          {analysis && (
            <section className="devtools-results">
              <div className="devtools-results-header">
                <div>
                  <span className="devtools-label">ANALYSIS COMPLETE</span>
                  <h2>Here's what the ghost found.</h2>
                </div>
                <button
                  className="devtools-copy"
                  onClick={() => void copyAnalysis()}
                >
                  {copied ? <Check size={15} /> : <Clipboard size={15} />}
                  {copied ? "Copied" : "Copy result"}
                </button>
              </div>
              <pre className="devtools-analysis">{analysis}</pre>
              <p className="devtools-disclaimer">
                AI-generated suggestions may be incorrect. Review changes and
                run tests in your own environment before relying on them.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
