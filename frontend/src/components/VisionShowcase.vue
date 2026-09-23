<script setup lang="ts">
import { ref } from 'vue'

const isSimulatingVoice = ref(false)
const agentReply = ref("Grab your 6'0\" Round Pin. The 14s swell is peaking right as the tide begins pushing, giving the sandbar the shape it needs.")

function triggerVoiceSimulation() {
  isSimulatingVoice.value = true
  setTimeout(() => {
    isSimulatingVoice.value = false
  }, 2400)
}
</script>

<template>
  <section id="forecast-showcase" class="vision-section" aria-labelledby="showcase-title">
    <div class="container">
      <div class="section-intro">
        <div class="badge-pill">Architected for Surfers</div>
        <h2 id="showcase-title" class="section-title">
          Everything traditional surf forecasts missed, <span class="gradient-text">reimagined.</span>
        </h2>
        <p class="section-subtitle">
          From micro-climate wind patterns to an AI conversational agent that knows your boards and personal preferences.
        </p>
      </div>

      <div class="showcase-grid">
        <!-- Pillar 1: Wave Physics & Scoring -->
        <article class="glass-panel showcase-card feature-wide" aria-labelledby="pillar-physics">
          <div class="card-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0df2c9" stroke-width="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div class="card-text">
            <h3 id="pillar-physics" class="card-heading">Condition Scoring That Actually Works</h3>
            <p class="card-desc">
              No generic stars based solely on offshore wave height. alerts.surf correlates bathymetry,
              primary and secondary swell vectors, and tide levels into an honest 0-10 session score.
            </p>
            <div class="card-tags">
              <span class="tag">Dual-Swell Decomposition</span>
              <span class="tag">Bathymetry Mapping</span>
              <span class="tag">Tide Curves</span>
            </div>
          </div>
        </article>

        <!-- Pillar 2: Agentic Voice & Chat Quiver Advisor -->
        <article id="agent-vision" class="glass-panel showcase-card feature-agent" aria-labelledby="pillar-agent">
          <div class="agent-badge">
            <span class="sparkle" aria-hidden="true">✦</span>
            <span>Agentic Voice & Vision</span>
          </div>

          <h3 id="pillar-agent" class="card-heading">Your Personal AI Surf Caddy</h3>
          <p class="card-desc">
            Talk or chat naturally. Ask about conditions, save your surfboard quiver, and get tailored
            recommendations based on wave energy and board volume.
          </p>

          <div class="chat-preview-box">
            <div class="chat-bubble user">
              <div class="speaker-tag">
                <span class="speaker-icon" aria-hidden="true">🎙️</span>
                <span>Surfer (Voice Prompt)</span>
              </div>
              <p class="message-text">"Got 2 hours at dawn tomorrow. Should I wax the twin-fin or the round-pin?"</p>
            </div>

            <div class="chat-bubble agent">
              <div class="agent-tag">
                <span class="agent-dot" aria-hidden="true" />
                <span>alerts.surf Agent</span>
                <span v-if="isSimulatingVoice" class="voice-wave" aria-label="Voice synthesizing">
                  <span class="bar" /><span class="bar" /><span class="bar" /><span class="bar" />
                </span>
              </div>
              <p class="message-text">{{ agentReply }}</p>

              <div class="agent-meta">
                <button
                  type="button"
                  class="action-pill-btn"
                  @click="triggerVoiceSimulation"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                  <span>{{ isSimulatingVoice ? 'Listening...' : 'Simulate Voice Query' }}</span>
                </button>
                <span class="board-matched-badge">Board matched: 6'0" Round Pin (32.4L)</span>
              </div>
            </div>
          </div>
        </article>

        <!-- Pillar 3: Predictive Alerts -->
        <article class="glass-panel showcase-card" aria-labelledby="pillar-alerts">
          <div class="card-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <h3 id="pillar-alerts" class="card-heading">Laser-Focused Notifications</h3>
          <p class="card-desc">
            Set custom thresholds for your favorite breaks. We only ping you when conditions align,
            so you never wake up to blown-out surf.
          </p>
          <div class="alert-mock-chip">
            <span class="chip-status">PUSH ALERT</span>
            <span class="chip-desc">Mundaka hitting 9.4 tomorrow 07:30</span>
          </div>
        </article>

        <!-- Pillar 4: Mobile & PWA -->
        <article class="glass-panel showcase-card" aria-labelledby="pillar-mobile">
          <div class="card-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" stroke-width="2">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <h3 id="pillar-mobile" class="card-heading">Native Speed, Zero Bloat</h3>
          <p class="card-desc">
            Designed from day one as a lightning-fast SPA and offline-capable mobile PWA. Instant
            tide tables, real-time webcam links, and zero tracking ads.
          </p>
          <div class="card-tags">
            <span class="tag">PWA Ready</span>
            <span class="tag">Sub-second Loads</span>
            <span class="tag">Ad-Free</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.vision-section {
  padding: 4rem 0 5rem;
}

.section-intro {
  text-align: center;
  max-width: 44rem;
  margin: 0 auto 3.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.section-title {
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  margin: 0;
}

.section-subtitle {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

.showcase-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.showcase-card {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.feature-wide {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 992px) {
  .feature-wide {
    flex-direction: row;
    align-items: center;
    gap: 2rem;
  }
}

.feature-agent {
  grid-column: 1 / -1;
  background: linear-gradient(150deg, rgba(20, 35, 55, 0.7) 0%, rgba(10, 20, 32, 0.85) 100%);
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.15);
}

.agent-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  color: #c7d2fe;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  align-self: flex-start;
}

.sparkle {
  color: #a5b4fc;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.card-heading {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin: 0 0 0.75rem;
  color: var(--text-main);
}

.card-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-muted);
  margin: 0 0 1.25rem;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  color: var(--text-subtle);
}

/* Chat preview box */
.chat-preview-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(4, 9, 15, 0.6);
  border: 1px solid var(--border-subtle);
  border-radius: 1.25rem;
  padding: 1.25rem;
  margin-top: 1rem;
}

.chat-bubble {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.85rem 1.15rem;
  border-radius: 1rem;
}

.chat-bubble.user {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border-subtle);
  align-self: flex-start;
  max-width: 90%;
}

.chat-bubble.agent {
  background: rgba(13, 242, 201, 0.06);
  border: 1px solid rgba(13, 242, 201, 0.2);
  align-self: stretch;
}

.speaker-tag,
.agent-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
}

.agent-tag {
  color: var(--accent-cyan);
}

.agent-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent-cyan);
}

.message-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--text-main);
}

.agent-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(13, 242, 201, 0.15);
}

.action-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  background: rgba(13, 242, 201, 0.1);
  border: 1px solid rgba(13, 242, 201, 0.3);
  color: var(--accent-cyan);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-pill-btn:hover {
  background: rgba(13, 242, 201, 0.2);
}

.board-matched-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-muted);
}

/* Voice waveform animation */
.voice-wave {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: 12px;
}

.voice-wave .bar {
  width: 2px;
  height: 100%;
  background: var(--accent-cyan);
  border-radius: 2px;
  animation: wave-bar 0.8s ease-in-out infinite alternate;
}

.voice-wave .bar:nth-child(2) { animation-delay: 0.2s; }
.voice-wave .bar:nth-child(3) { animation-delay: 0.4s; }
.voice-wave .bar:nth-child(4) { animation-delay: 0.1s; }

@keyframes wave-bar {
  0% { transform: scaleY(0.2); }
  100% { transform: scaleY(1); }
}

.alert-mock-chip {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.85rem;
  border-radius: 0.75rem;
  background: rgba(56, 189, 248, 0.08);
  border: 1px solid rgba(56, 189, 248, 0.2);
  margin-top: auto;
}

.chip-status {
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #38bdf8;
}

.chip-desc {
  font-size: 0.8rem;
  color: var(--text-main);
  font-weight: 500;
}
</style>
