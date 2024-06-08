<template>
  <div v-if="error">
    <!-- Display error message -->
    <h1>Something went wrong</h1>
    <p>{{ error.message }}</p>
    <button @click="resetError">Try Again</button>
  </div>
  <div v-else>
    <!-- Display children components -->
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
  errorCaptured(error) {
    this.error = error;
    console.error(error);
    return false; // Prevent the error from propagating further
  },
  methods: {
    resetError() {
      this.error = null;
    },
  },
};
</script>
