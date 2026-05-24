import {
  useState,
} from "react";

import axios from "axios";

import AIInsightsCards from "../../components/ai/AIInsightsCards";

export default function AIAssistant() {

  const [prompt,
    setPrompt] =
    useState("");

  const [response,
    setResponse] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [insights,
    setInsights] =
    useState(null);

  // ================= AI CHAT =================

  const askAI =
    async () => {

      if (!prompt) return;

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.post(

            "http://localhost:5000/api/ai/chat",

            {
              prompt,
            },

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }

          );

        setResponse(
          res.data.reply
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ================= AI INSIGHTS =================

  const loadInsights =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await axios.get(

            "http://localhost:5000/api/ai/insights",

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,
              },
            }

          );

        setInsights(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-4xl font-bold">

          🤖 AI Assistant

        </h1>

        <p className="text-gray-500 mt-2">

          Gemini Powered AI

        </p>

      </div>

      {/* CHAT BOX */}

      <div className="bg-white rounded-xl shadow p-6 mb-8">

        <h2 className="text-2xl font-bold mb-4">

          AI Chat

        </h2>

        <textarea

          value={prompt}

          onChange={(e) =>
            setPrompt(
              e.target.value
            )
          }

          placeholder="Ask AI anything..."

          className="w-full border rounded p-4 h-40"

        />

        <button

          onClick={askAI}

          className="mt-4 bg-blue-600 text-white px-6 py-3 rounded"

        >

          {
            loading
              ? "Thinking..."
              : "Ask AI"
          }

        </button>

        {/* RESPONSE */}

        {response && (

          <div className="mt-6 bg-gray-100 p-5 rounded">

            <h3 className="font-bold text-lg mb-2">

              AI Response

            </h3>

            <p className="whitespace-pre-wrap">

              {response}

            </p>

          </div>

        )}

      </div>

      {/* AI INSIGHTS */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-bold">

            AI Insights

          </h2>

          <button

            onClick={loadInsights}

            className="bg-green-600 text-white px-4 py-2 rounded"

          >

            Generate Insights

          </button>

        </div>

        <AIInsightsCards

          data={insights}

          loading={loading}

        />

      </div>

    </div>

  );

}