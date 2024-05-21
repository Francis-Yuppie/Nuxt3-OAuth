<script setup lang="ts">
// import { defineProps } from 'vue';

    interface AuthSocialButtonProps{
        icon: string
    }

    const props = defineProps<AuthSocialButtonProps>()
</script>

<template>
    <button
        type="submit"
        class="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-slate-900 shadow-sm
        ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
    >
    <Icon :name="icon"/>
    </button>
</template>

<style scoped>

</style>