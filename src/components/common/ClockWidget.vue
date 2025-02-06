<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";

const time = ref(new Date());

const updateTime = () => {
  time.value = new Date();
};

let timer = null;

onMounted(() => {
  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});

const formattedTime = computed(() => {
  return time.value.toLocaleTimeString("en-US", { hour12: false });
});
</script>

<template>
  <div class="clock-widget">
    <div class="digital-clock">{{ formattedTime }}</div>
    <div class="analog-clock">
      <div class="hand hour" style="hourStyle"></div>
      <div class="hand minute" style="minuteStyle"></div>
      <div class="hand second" style="secondStyle"></div>
    </div>
  </div>
</template>

<style scoped>
.clock-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Poppins", sans-serif;
  color: #fff;
}

.digital-clock {
  font-size: 2rem;
  margin-bottom: 10px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.analog-clock {
  width: 120px;
  height: 120px;
  border: 6px solid #fff;
  border-radius: 50%;
  position: relative;
  background: radial-gradient(circle, #2a2a2a 30%, #1a1a1a 70%);
}

.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom;
  background: #fff;
}

.hour {
  width: 6px;
  height: 40px;
  transform: translateX(-50%);
}

.minute {
  width: 4px;
  height: 50px;
  transform: translateX(-50%);
}

.second {
  width: 2px;
  height: 55px;
  background: red;
  transform: translateX(-50%);
}
</style>
