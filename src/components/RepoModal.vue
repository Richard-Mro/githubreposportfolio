<template>
  <div class="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-4">{{ repo?.id ? 'Update' : 'Create' }} Repository</h2>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Name</label>
        <input v-model="repo.name" type="text" class="w-full p-2 border border-gray-300 rounded" />
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 mb-2">Description</label>
        <textarea v-model="repo.description" class="w-full p-2 border border-gray-300 rounded"></textarea>
      </div>
      <div class="flex justify-end">
        <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
        <button @click="saveRepo" class="bg-blue-500 text-white px-4 py-2 rounded">{{ repo?.id ? 'Update' : 'Create' }}</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    repo: Object,
  },
  methods: {
    saveRepo() {
      this.$emit('save', this.repo);
    },
  },
};
</script>
