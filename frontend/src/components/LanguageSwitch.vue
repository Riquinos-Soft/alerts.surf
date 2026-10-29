<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

const { locale, setLocale, t } = useLocale()
</script>

<template>
  <div class="language-switch" role="group" :aria-label="t('Interface language')">
    <button type="button" lang="es" aria-label="Español" :aria-pressed="locale === 'es'" data-test="language-es" @click="setLocale('es')">ES</button>
    <button type="button" lang="en" aria-label="English" :aria-pressed="locale === 'en'" data-test="language-en" @click="setLocale('en')">EN</button>
  </div>
</template>

<style scoped>
.language-switch {
  display: inline-flex;
  flex: none;
  border: 1px solid rgba(0, 119, 182, 0.24);
  border-radius: 999px;
  padding: 2px;
  background: rgba(255, 255, 255, 0.85);
}

.language-switch button {
  min-width: 2rem;
  min-height: 1.75rem;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #31526b;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.language-switch button[aria-pressed='true'] {
  background: #0077b6;
  color: #fff;
}

.language-switch button:focus-visible {
  outline: 2px solid #0077b6;
  outline-offset: 2px;
}
</style>
