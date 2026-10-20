import React from "react";

import { AUTHOR_URL, REPO_URL } from "../links";

const PARTS = [
  { name: "Website", detail: "React, React Router", host: "Netlify" },
  { name: "Vittora Desk", detail: "React, Chart.js", host: "Netlify" },
  { name: "Vittora API", detail: "Node.js, Express", host: "Render" },
  { name: "Database", detail: "MongoDB, Mongoose", host: "MongoDB Atlas" },
];

function Team() {
  return (
    <>
      <section className="section section-tinted">
        <div className="site-container">
          <h2 className="section-title">How it's built</h2>
          <p className="section-lede">
            Four parts, each deployed on its own. The website and the desk are separate React apps; the desk
            talks to the API, and the API keeps the account in MongoDB.
          </p>
          <ol className="architecture" aria-label="How a request travels through Vittora">
            {PARTS.map((part) => (
              <li key={part.name}>
                <strong>{part.name}</strong>
                <span>{part.detail}</span>
                <span className="architecture-host">Hosted on {part.host}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="site-container builder">
          <span className="builder-avatar" aria-hidden="true">
            PJ
          </span>
          <div>
            <h2 className="section-title">Built by Priyanshu Jaiswal</h2>
            <p>
              Vittora is a full-stack project by Priyanshu Jaiswal, a B.Tech Computer Science student. It
              began as a study of how a discount broker's website and trading screen fit together, and grew
              into its own product with a working order engine.
            </p>
            <p className="builder-links">
              <a href={AUTHOR_URL}>GitHub profile</a>
              <a href={REPO_URL}>Project source code</a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Team;
