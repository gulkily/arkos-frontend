import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number.parseInt(process.env.ARKOS_SERVER_PORT ?? "3001", 10);
const apiBase = (process.env.ARKOS_API_BASE ?? "http://127.0.0.1:30000/v1").replace(/\/$/, "");
const queryTimeoutMs = Number.parseInt(process.env.ARKOS_QUERY_TIMEOUT_MS ?? "30000", 10);
const staticRoot = path.resolve(__dirname, "../dist");

app.use(express.json({ limit: "1mb" }));

async function resolveModel() {
  if (process.env.ARKOS_MODEL) {
    return process.env.ARKOS_MODEL;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), queryTimeoutMs);

  try {
    const response = await fetch(`${apiBase}/models`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Model lookup failed with status ${response.status}`);
    }

    const payload = await response.json();
    const model = payload?.data?.[0]?.id;

    if (!model) {
      throw new Error("No models were returned by the upstream API");
    }

    return model;
  } finally {
    clearTimeout(timeout);
  }
}

async function listModels() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), queryTimeoutMs);

  try {
    const response = await fetch(`${apiBase}/models`, {
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? `Model lookup failed with status ${response.status}`);
    }

    return payload?.data ?? [];
  } finally {
    clearTimeout(timeout);
  }
}

async function queryModel(prompt) {
  const model = await resolveModel();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), queryTimeoutMs);

  try {
    const response = await fetch(`${apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(payload?.error?.message ?? `Upstream request failed with status ${response.status}`);
    }

    const output = payload?.choices?.[0]?.message?.content;

    if (!output) {
      throw new Error("Upstream response did not contain message content");
    }

    return {
      model,
      output,
    };
  } finally {
    clearTimeout(timeout);
  }
}

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    apiBase,
  });
});

app.get("/api/models", async (_request, response) => {
  try {
    const models = await listModels();

    return response.json({
      data: models,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Model lookup failed.";

    return response.status(502).json({
      error: message,
    });
  }
});

app.post("/api/query", async (request, response) => {
  const prompt = request.body?.prompt?.trim();

  if (!prompt) {
    return response.status(400).json({
      error: "Prompt is required.",
    });
  }

  try {
    const result = await queryModel(prompt);

    return response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Request failed.";

    return response.status(502).json({
      error: message,
    });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(staticRoot));

  app.get("*", (_request, response) => {
    response.sendFile(path.join(staticRoot, "index.html"));
  });
}

app.listen(port, () => {
  console.log(`ARKOS proxy listening on http://127.0.0.1:${port}`);
});
