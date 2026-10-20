import React from "react";

function FeatureRow({ title, text, image, alt, reverse = false }) {
  return (
    <section className={`site-container feature-row${reverse ? " is-reversed" : ""}`}>
      <div className="feature-row-text">
        <h2 className="section-title">{title}</h2>
        <p>{text}</p>
      </div>
      <figure className="shot">
        <img
          src={`${process.env.PUBLIC_URL}/media/images/${image}`}
          alt={alt}
          width="1440"
          height="900"
          loading="lazy"
        />
      </figure>
    </section>
  );
}

export default FeatureRow;
