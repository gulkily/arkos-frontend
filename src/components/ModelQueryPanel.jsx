import { useState } from "react";

const starterPrompt = "Give me a short summary of the current ARKOS frontend state.";

export default function ModelQueryPanel() {
  const [prompt, setPrompt] = useState(starterPrompt);
  const [output, setOutput] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt || isLoading) {
      return;
    }

    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: trimmedPrompt,
        }),
      });

      const payload = await response.json().catch(() => ({
        error: "Request failed.",
      }));

      if (!response.ok) {
        throw new Error(payload.error ?? "Request failed.");
      }

      setOutput(payload.output ?? "");
      setModel(payload.model ?? "");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Request failed.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="query-panel" aria-label="Model query panel">
      <div className="query-panel__header">
        <p className="query-panel__eyebrow">Live Query</p>
        <h1>Prompt the model from the frontend shell.</h1>
      </div>

      <form className="query-panel__form" onSubmit={handleSubmit}>
        <label className="query-panel__label" htmlFor="prompt">
          Prompt
        </label>
        <textarea
          id="prompt"
          className="query-panel__input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          rows={6}
          placeholder="Ask the model something useful."
        />
        <button className="query-panel__submit" type="submit" disabled={isLoading}>
          {isLoading ? "Querying..." : "Send Prompt"}
        </button>
      </form>

      <section className="query-panel__response" aria-live="polite">
        <div className="query-panel__response-header">
          <h2>Response</h2>
          {model ? <span className="query-panel__model">{model}</span> : null}
        </div>

        {error ? <p className="query-panel__error">{error}</p> : null}
        {!error && !output && !isLoading ? (
          <p className="query-panel__empty">Submit a prompt to test the backend query path.</p>
        ) : null}
        {isLoading ? <p className="query-panel__loading">Waiting for the model response...</p> : null}
        {output ? <p className="query-panel__output">{output}</p> : null}
      </section>
    </section>
  );
}
