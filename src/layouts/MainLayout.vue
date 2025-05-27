<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
import MainFooter from './components/MainFooter.vue'
import ServiceFAB from '../components/common/ServiceFAB.vue'
</script>

<template>
  <div class="main-layout">
    <MainHeader />
    <main class="main-content">
      <slot></slot>
    </main>
    <ServiceFAB />
    <MainFooter />
  </div>
</template>

<style lang="scss" scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  background-color: var(--background-color);
  padding-top: 60px; // Header height
}
</style>