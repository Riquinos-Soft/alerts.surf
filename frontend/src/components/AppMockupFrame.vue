<script setup lang="ts">
import { ref } from 'vue'
import { FEATURED_SPOTS, QUIVER_MOCKS } from '../assets/surfData'

const activeMockTab = ref('radar')
const selectedSpot = ref(FEATURED_SPOTS[0])
const aiRecommendationOpen = ref(false)

const triggerAiAnalysis = () => {
  aiRecommendationOpen.value = true
}
</script>

<template>
  <div class="mockup-device-wrapper" data-test="app-mockup">
    <div class="phone-frame">
      <div class="phone-notch">
        <div class="notch-speaker"></div>
        <div class="notch-camera"></div>
      </div>

      <div class="phone-screen">
        <!-- App status bar -->
        <div class="phone-status-bar">
          <span class="time">07:30</span>
          <div class="status-icons">
            <van-tag type="primary" size="medium" round plain>5G LIVE</van-tag>
          </div>
        </div>

        <!-- App Header inside Mockup -->
        <div class="mockup-app-header">
          <div class="mockup-brand">
            <span class="wave-icon">🌊</span>
            <strong>alerts<span class="highlight">.surf</span></strong>
          </div>
          <van-badge content="2" color="#06d6a0">
            <div class="bell-icon">🔔</div>
          </van-badge>
        </div>

        <!-- Vant Tabs inside Mockup -->
        <van-tabs v-model:active="activeMockTab" shrink animated color="#0077b6" class="mockup-tabs">
          <van-tab title="Radar" name="radar">
            <div class="mockup-content">
              <!-- Live condition hero inside app -->
              <div class="mockup-spot-hero" :style="{ backgroundImage: `url(${selectedSpot.imageUrl})` }">
                <div class="spot-overlay">
                  <div class="spot-header-line">
                    <span class="spot-title">{{ selectedSpot.name }}</span>
                    <van-tag type="success" size="large" round>{{ selectedSpot.score }}/10</van-tag>
                  </div>
                  <div class="spot-meta-chips">
                    <van-tag color="rgba(255,255,255,0.25)" text-color="#fff">🌊 {{ selectedSpot.waveHeight }}</van-tag>
                    <van-tag color="rgba(255,255,255,0.25)" text-color="#fff">⏱️ {{ selectedSpot.period }}</van-tag>
                    <van-tag color="rgba(255,255,255,0.25)" text-color="#fff">💨 {{ selectedSpot.wind }}</van-tag>
                  </div>
                </div>
              </div>

              <!-- Spot Selector Carousel -->
              <div class="spot-carousel-selector">
                <div
                  v-for="spot in FEATURED_SPOTS"
                  :key="spot.id"
                  class="spot-chip-card"
                  :class="{ active: selectedSpot.id === spot.id }"
                  @click="selectedSpot = spot"
                  data-test="spot-chip"
                >
                  <span class="spot-chip-name">{{ spot.name }}</span>
                  <span class="spot-chip-score">{{ spot.score }}</span>
                </div>
              </div>

              <!-- AI Caddy Advisory Card with Vant Button -->
              <div class="ai-caddy-card">
                <div class="ai-badge-row">
                  <van-tag color="#0077b6">AI Quiver Advisory</van-tag>
                  <span class="live-pulse">● Optimal Window Now</span>
                </div>
                <p class="ai-speech">
                  "Swell is peaking with 14s period. Ride the <strong>5'8 Hypto</strong> for speed over the shallow sandbar."
                </p>
                <van-button
                  type="primary"
                  size="small"
                  round
                  block
                  @click="triggerAiAnalysis"
                  data-test="ai-advice-btn"
                  color="linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)"
                >
                  {{ aiRecommendationOpen ? '✓ Advisory Active' : '✨ Ask AI Surf Caddy' }}
                </van-button>
              </div>
            </div>
          </van-tab>

          <van-tab title="Mareas" name="tides">
            <div class="mockup-content">
              <div class="tide-summary-box">
                <div class="tide-header">
                  <span>Tide Station: Cantábrico</span>
                  <van-tag type="primary">Rising</van-tag>
                </div>
                <div class="tide-metric-big">1.85m</div>
                <p class="tide-sub">High Tide: 14:15 (+2.1m) • Low Tide: 20:30 (0.4m)</p>
              </div>
              <div class="tide-schedule-list">
                <div class="tide-row">
                  <span>08:10</span>
                  <span>Low Tide</span>
                  <strong>0.6m</strong>
                </div>
                <div class="tide-row active">
                  <span>14:15</span>
                  <span>High Tide</span>
                  <strong>2.1m</strong>
                </div>
              </div>
            </div>
          </van-tab>

          <van-tab title="Quiver" name="quiver">
            <div class="mockup-content">
              <div v-for="board in QUIVER_MOCKS" :key="board.id" class="quiver-board-item">
                <img :src="board.imageUrl" :alt="board.name" class="board-thumb" />
                <div class="board-info">
                  <strong>{{ board.name }}</strong>
                  <span class="board-dims">{{ board.dims }} • {{ board.volume }}</span>
                  <van-tag color="#06d6a0" text-color="#023e8a">{{ board.matchScore }}</van-tag>
                </div>
              </div>
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mockup-device-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.phone-frame {
  width: 320px;
  height: 620px;
  background: #ffffff;
  border-radius: 42px;
  box-shadow:
    0 0 0 10px #0c2338,
    0 0 0 12px rgba(0, 119, 182, 0.2),
    0 30px 60px -15px rgba(12, 35, 56, 0.35);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.phone-notch {
  width: 140px;
  height: 22px;
  background: #0c2338;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-left-radius: 14px;
  border-bottom-right-radius: 14px;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.notch-speaker {
  width: 40px;
  height: 3px;
  background: #2b455b;
  border-radius: 2px;
}

.notch-camera {
  width: 7px;
  height: 7px;
  background: #143048;
  border-radius: 50%;
}

.phone-screen {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  overflow-y: auto;
}

.phone-status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1.2rem 0.2rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0c2338;
}

.mockup-app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: #ffffff;
  border-bottom: 1px solid rgba(15, 45, 75, 0.06);
}

.mockup-brand {
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.highlight {
  color: var(--accent-blue);
}

.mockup-tabs {
  flex: 1;
}

.mockup-content {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mockup-spot-hero {
  height: 140px;
  border-radius: 16px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.spot-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(12, 35, 56, 0.85) 0%, rgba(12, 35, 56, 0.1) 100%);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.spot-header-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.spot-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 1rem;
}

.spot-meta-chips {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.spot-carousel-selector {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.25rem;
}

.spot-chip-card {
  flex: 0 0 auto;
  padding: 0.4rem 0.75rem;
  background: #ffffff;
  border: 1px solid rgba(15, 45, 75, 0.08);
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: border-color 0.2s, background 0.2s;
}

.spot-chip-card.active {
  border-color: #0077b6;
  background: rgba(0, 119, 182, 0.06);
  color: #0077b6;
}

.spot-chip-score {
  background: #e0f2fe;
  color: #0369a1;
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  font-size: 0.7rem;
}

.ai-caddy-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 0.75rem;
  border: 1px solid rgba(0, 119, 182, 0.15);
  box-shadow: 0 4px 10px rgba(0, 119, 182, 0.05);
}

.ai-badge-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.7rem;
  margin-bottom: 0.4rem;
}

.live-pulse {
  color: #059669;
  font-weight: 600;
}

.ai-speech {
  font-size: 0.78rem;
  line-height: 1.35;
  color: #334155;
  margin: 0 0 0.6rem;
}

.tide-summary-box {
  background: #ffffff;
  padding: 1rem;
  border-radius: 14px;
  text-align: center;
  border: 1px solid rgba(15, 45, 75, 0.08);
}

.tide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #64748b;
}

.tide-metric-big {
  font-size: 2rem;
  font-weight: 800;
  color: #0077b6;
  margin: 0.5rem 0;
}

.tide-sub {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

.tide-schedule-list {
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(15, 45, 75, 0.08);
}

.tide-row {
  display: flex;
  justify-content: space-between;
  padding: 0.6rem 0.8rem;
  font-size: 0.8rem;
  border-bottom: 1px solid #f1f5f9;
}

.tide-row.active {
  background: rgba(0, 119, 182, 0.04);
  color: #0077b6;
}

.quiver-board-item {
  display: flex;
  gap: 0.75rem;
  background: #ffffff;
  padding: 0.6rem;
  border-radius: 12px;
  border: 1px solid rgba(15, 45, 75, 0.08);
  align-items: center;
}

.board-thumb {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.board-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.8rem;
}

.board-dims {
  font-size: 0.7rem;
  color: #64748b;
}
</style>
