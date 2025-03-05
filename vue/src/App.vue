<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, ref } from 'vue';

import { os } from '@neutralinojs/lib';

const user = ref<string>('')

onMounted(() => {
  getUsername();
})

function getUsername() {
  os.getEnv('USER').then((data) => {
    console.log(`USER = ${data}`);
    user.value = data;
  }).catch((err) => {
    console.log(err)
  })
}
</script>

<style scoped lang="scss"></style>
