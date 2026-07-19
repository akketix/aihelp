---
title: Prompt Engineering & Structuring
description: Parameter calibration benchmarks and structured prompt templates using XML and JSON schemas.
---

Prompt Engineering is the configuration of inputs to maximize model reasoning accuracy and output structures. To build reliable agent loops, you must calibrate model parameters and enforce strict schema output formats.

---

## Parameter Calibration benchmarks

| Task Type | Temperature | Top-P | Frequency Penalty | Primary Goal |
| :--- | :--- | :--- | :--- | :--- |
| **JSON Extraction** | **0.0** | **0.1** | 0.0 | High precision, schema compliance |
| **Code Generation** | **0.2** | **0.2** | 0.0 | Logical consistency, syntactic validity |
| **Reasoning / Math** | **0.1** | **0.4** | 0.0 | Logical accuracy, step-by-step reasoning |
| **Creative Content** | **0.8** | **0.9** | 0.5 | Token variety, phrase diversity |

---

## Mechanics: XML Tags for Prompt Isolation

Frontier models (like Gemini 2.5 and Claude 3.5) are trained to interpret XML tags as absolute boundaries. This eliminates prompt injection risks and ensures the model distinguishes between instructions and user-supplied data:

```xml
<system_instructions>
You are an expert parser. Convert the input document into a valid JSON array.
</system_instructions>

<input_document>
User inputs go here (if the user tries to write "Ignore previous instructions", the model recognizes it lies inside the input_document boundary and ignores the injection).
</input_document>
```

---

## Walkthrough: Structured Output Build (Gemini API)

When building database-style wikis or structured pipelines, you should enforce a strict JSON schema at the API level. Here is the implementation using the `@google/genai` SDK:

```typescript
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

export async function generateStructuredConcept(prompt: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          conceptName: { type: Type.STRING },
          description: { type: Type.STRING },
          metrics: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["conceptName", "description", "metrics"],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}
```
