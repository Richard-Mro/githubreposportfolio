<template>
  <div v-if="error">
    <h1>Something went wrong</h1>
    <p>{{ error.message }}</p>
    <button @click="resetError">Try Again</button>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      error: null,
    };
  },
  errorCaptured(error, vm, info) {
    this.error = error;
    console.error("Error captured in ErrorBoundary:", error);
    return false; // Prevent the error from propagating further
  },
  methods: {
    resetError() {
      this.error = null;
    },
  },
};
</script>
