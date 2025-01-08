import React, { useState } from "react";
import { Tab } from "@headlessui/react";
import {
  Wifi,
  Globe,
  FileSearch,
  Shield,
  Gauge,
  Copy,
  Check,
} from "lucide-react";

const NetworkTools = () => {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({
    IP: null,
    DNS: null,
    Headers: null,
    Compression: null,
    SSL: null,
  });
  const [copied, setCopied] = useState(false);

  const tools = [
    { name: "IP", icon: Wifi },
    { name: "DNS", icon: Globe },
    { name: "Headers", icon: FileSearch },
    { name: "Compression", icon: Gauge },
    { name: "SSL", icon: Shield },
  ];

  const handleCheck = async (tool) => {
    setLoading(true);
    try {
      let endpoint;
      if (tool === "IP") {
        endpoint = "https://wandering-cell-41a3.andrei-simplenet.workers.dev"; // Your Cloudflare Worker URL for IP check
      } else {
        endpoint = `/api/${tool.toLowerCase()}?domain=${encodeURIComponent(domain)}`;
      }

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setResults((prev) => ({
        ...prev,
        [tool]: data,
      }));
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [tool]: { error: "An error occurred while processing the request." },
      }));
    }
    setLoading(false);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Network Tools</h1>
        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-slate-100 p-1">
            {tools.map((tool) => (
              <Tab
                key={tool.name}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? "bg-white text-slate-700 shadow"
                      : "text-slate-500 hover:bg-white/[0.12] hover:text-slate-600"
                  }`
                }
              >
                <div className="flex flex-col items-center gap-1">
                  <tool.icon className="h-5 w-5" />
                  <span>{tool.name}</span>
                </div>
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-4">
            {tools.map((tool) => (
              <Tab.Panel key={tool.name} className="rounded-xl bg-white p-3">
                <div className="space-y-4">
                  {tool.name === "IP" ? (
                    <div className="flex items-center gap-4">
                      <p className="text-slate-600">
                        Click the Check IP button to see your IP address.
                      </p>
                      <button
                        onClick={() => handleCheck(tool.name)}
                        disabled={loading}
                        className="bg-slate-800 text-white rounded-lg py-2 px-4 hover:bg-slate-700 disabled:bg-slate-300"
                      >
                        {loading ? "Loading..." : "Check IP"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <input
                        type="text"
                        placeholder="Enter domain..."
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="flex-1 p-2 border rounded-lg"
                      />
                      <button
                        onClick={() => handleCheck(tool.name)}
                        disabled={loading}
                        className="bg-slate-800 text-white rounded-lg py-2 px-4 hover:bg-slate-700 disabled:bg-slate-300 whitespace-nowrap"
                      >
                        {loading ? "Loading..." : `Check ${tool.name}`}
                      </button>
                    </div>
                  )}
                  {results[tool.name] && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                      {tool.name === "IP" ? (
                        <div
                          onClick={() => copyToClipboard(results[tool.name].ip)}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors"
                          title="Click to copy IP address"
                        >
                          <span className="font-mono">
                            {results[tool.name].ip}
                          </span>
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="text-sm text-slate-500">
                            (Click to copy)
                          </span>
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap overflow-x-auto">
                          {JSON.stringify(results[tool.name], null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
      <footer className="border-t border-slate-200 p-4">
        <div className="text-center text-slate-600 text-sm">
          Made by{" "}
          <a
            href="https://simplenet.io"
            className="text-blue-600 hover:underline"
          >
            Simplenet
          </a>
          . Powered by{" "}
          <a
            href="https://workers.cloudflare.com"
            className="text-blue-600 hover:underline"
          >
            Cloudflare Workers
          </a>
          .
        </div>
      </footer>
    </div>
  );
};

export default NetworkTools;
