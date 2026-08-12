"use client";

import { FormEvent, useState } from "react";

const brand = "MilanMitra";

const profiles = [
  { name: "Ananya", age: 27, role: "UX Designer", city: "Bengaluru", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85", match: "96%" },
  { name: "Arjun", age: 30, role: "Product Manager", city: "Mumbai", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=85", match: "94%" },
  { name: "Meera", age: 28, role: "Doctor", city: "Pune", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85", match: "92%" },
  { name: "Rohan", age: 31, role: "Architect", city: "Hyderabad", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=85", match: "91%" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    document.querySelector("#matches")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${brand} home`}>
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>{brand}</span>
        </a>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>☰</button>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#how">How it works</a>
          <a href="#stories">Success stories</a>
          <a href="#safety">Safety</a>
        </nav>
        <div className="header-actions">
          <a className="login" href="#join">Log in</a>
          <a className="button button-small" href="/register">Create profile</a>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span>✦</span> Trusted by families across India</div>
          <h1>Where meaningful<br />beginnings <em>blossom.</em></h1>
          <p className="hero-subtitle">A thoughtful matrimony platform designed for genuine connections, shared values, and a lifetime of togetherness.</p>
          <form className="search-card" onSubmit={handleSearch} aria-label="Find a match">
            <label>
              I&apos;m looking for
              <select aria-label="Looking for">
                <option>A bride</option>
                <option>A groom</option>
              </select>
            </label>
            <label>
              Age
              <select aria-label="Age range">
                <option>24 – 30 years</option>
                <option>28 – 34 years</option>
                <option>32 – 40 years</option>
              </select>
            </label>
            <label>
              Community
              <select aria-label="Community">
                <option>Any community</option>
                <option>Hindu</option>
                <option>Muslim</option>
                <option>Christian</option>
                <option>Sikh</option>
                <option>Jain</option>
              </select>
            </label>
            <button className="button search-button" type="submit">Find matches <span>→</span></button>
          </form>
          {submitted && <p className="search-note" role="status">Showing handpicked profiles for you below.</p>}
          <div className="hero-proof">
            <div className="avatars" aria-hidden="true"><img src={profiles[0].photo} alt="" /><img src={profiles[1].photo} alt="" /><img src={profiles[2].photo} alt="" /></div>
            <div><strong>12,000+ happy couples</strong><span>found their forever with us</span></div>
          </div>
        </div>
        <div className="hero-visual" aria-label="A joyful newly married couple">
          <img src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1100&q=88" alt="Newly married Indian couple smiling together" />
          <div className="floating-card verified"><span>✓</span><div><strong>100% verified</strong><small>Genuine profiles only</small></div></div>
          <div className="floating-card privacy"><span>⌁</span><div><strong>Your privacy, first</strong><small>You&apos;re always in control</small></div></div>
          <div className="petal petal-one" /><div className="petal petal-two" />
        </div>
      </section>

      <section className="trust-strip" aria-label="Platform highlights">
        <div><strong>2.5M+</strong><span>Verified profiles</span></div><i />
        <div><strong>12K+</strong><span>Success stories</span></div><i />
        <div><strong>15+</strong><span>Years of trust</span></div><i />
        <div><strong>4.8 ★</strong><span>Member rating</span></div>
      </section>

      <section className="section matches" id="matches">
        <div className="section-heading"><div><span className="kicker">CURATED FOR YOU</span><h2>People you may connect with</h2></div><a href="#join">View all profiles →</a></div>
        <div className="profile-grid">
          {profiles.map((profile) => (
            <article className="profile-card" key={profile.name}>
              <div className="profile-photo"><img src={profile.photo} alt={`${profile.name}, ${profile.role}`} /><span className="match-badge">✦ {profile.match} match</span><button aria-label={`Save ${profile.name}'s profile`}>♡</button></div>
              <div className="profile-info"><h3>{profile.name}, {profile.age} <span title="Verified profile">✓</span></h3><p>{profile.role} · {profile.city}</p><a href="#join">View profile <span>→</span></a></div>
            </article>
          ))}
        </div>
      </section>

      <section className="section steps" id="how">
        <div className="center-heading"><span className="kicker">SIMPLE & THOUGHTFUL</span><h2>Your journey, in three easy steps</h2><p>We make finding the right person feel personal, safe, and beautifully simple.</p></div>
        <div className="steps-grid">
          <article><span className="step-number">01</span><div className="step-icon">♙</div><h3>Create your profile</h3><p>Tell us about yourself, your values, and what you&apos;re looking for.</p></article>
          <article><span className="step-number">02</span><div className="step-icon">✧</div><h3>Discover meaningful matches</h3><p>Receive compatible profiles curated around what matters to you.</p></article>
          <article><span className="step-number">03</span><div className="step-icon">♡</div><h3>Begin your story</h3><p>Connect securely, take your time, and start something beautiful.</p></article>
        </div>
      </section>

      <section className="story-section" id="stories">
        <div className="story-photo"><img src="https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1100&q=85" alt="Happy couple celebrating their wedding" /></div>
        <div className="story-copy"><span className="quote-mark">“</span><blockquote>We didn&apos;t just find a match.<br />We found a best friend for life.</blockquote><p>Our families connected first, but it was our shared love for travel and terrible jokes that brought us together. Thank you, {brand}, for making it feel so natural.</p><div className="story-author"><strong>Kavya & Siddharth</strong><span>Married in December 2025 · Chennai</span></div><a href="#join">Read their story →</a></div>
      </section>

      <section className="section safety" id="safety">
        <div className="center-heading"><span className="kicker">SAFE BY DESIGN</span><h2>Your trust means everything</h2></div>
        <div className="safety-grid"><article><span>✓</span><div><h3>Human-verified profiles</h3><p>Every profile is carefully reviewed before it goes live.</p></div></article><article><span>⌾</span><div><h3>Privacy you control</h3><p>Choose exactly who can see your photos and details.</p></div></article><article><span>♧</span><div><h3>Dedicated support</h3><p>Our care team is here to help at every step.</p></div></article></div>
      </section>

      <section className="join" id="join"><div><span className="kicker">YOUR STORY STARTS HERE</span><h2>Ready to meet someone meaningful?</h2><p>Create your profile in just a few minutes. It&apos;s free to get started.</p><a className="button button-light" href="/register">Create your free profile <span>→</span></a><small>No credit card required · Your privacy is protected</small></div></section>

      <footer><a className="brand footer-brand" href="#top"><span className="brand-mark">M</span><span>{brand}</span></a><p>Thoughtful connections. Beautiful beginnings.</p><nav aria-label="Footer"><a href="#how">How it works</a><a href="#safety">Safety</a><a href="#stories">Success stories</a><a href="mailto:hello@milanmitra.example">Contact</a></nav><span>© 2026 {brand}. All rights reserved.</span></footer>
    </main>
  );
}
