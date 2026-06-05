import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import {
  fetchCommunityRequests,
  type RequestsResponse
} from "../lib/api";
import { requestColumns } from "../components/requestColumns";
import { isOpenRequest, sortRequestsForDefaultView } from "../lib/requestTriage";

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: RequestsResponse };

function formatDateTime(value: string) {
  if (!value) {
    return "None";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export default function Home() {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    fetchCommunityRequests(controller.signal)
      .then((data) => setLoadState({ status: "ready", data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setLoadState({
          status: "error",
          message: error instanceof Error ? error.message : "Could not load requests"
        });
      });

    return () => controller.abort();
  }, []);

  const requests = useMemo(() => {
    if (loadState.status !== "ready") {
      return [];
    }

    return sortRequestsForDefaultView(loadState.data.requests);
  }, [loadState]);

  const openCount = requests.filter(isOpenRequest).length;

  return (
    <>
      <Head>
        <title>Community requests</title>
      </Head>
      <main className="pageShell">
        <header className="pageHeader">
          <div>
            <p className="eyebrow">Community centre</p>
            <h1>Request queue</h1>
          </div>
          {loadState.status === "ready" ? (
            <div className="summaryStrip" aria-label="Request summary">
              <span>{requests.length} total</span>
              <span>{openCount} open</span>
              <span>Updated {formatDateTime(loadState.data.generatedAt)}</span>
            </div>
          ) : null}
        </header>

        {loadState.status === "loading" ? (
          <section className="statePanel">Loading requests...</section>
        ) : null}

        {loadState.status === "error" ? (
          <section className="statePanel statePanelError">
            <h2>Requests could not be loaded</h2>
            <p>{loadState.message}</p>
          </section>
        ) : null}

        {loadState.status === "ready" ? (
          <section className="tableWrap" aria-label="Community requests">
            <table>
              <thead>
                <tr>
                  {requestColumns.map((column) => (
                    <th key={column.id}>{column.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    {requestColumns.map((column) => (
                      <td key={column.id}>{column.render(request)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}
      </main>
    </>
  );
}
