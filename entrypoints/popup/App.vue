<script setup lang="ts">
import { ref, computed } from "vue";
import { PowerUps, PowerUpSettings } from "@/utils/power-ups";

const settings = ref<any>();

const isChanged = computed(() => {
	return settings.value?.isChanged();
});

const apply = () => {
	settings.value?.store();
	PowerUps.reloadCurrentTab();
	close();
};

onMounted(() => {
	// @ts-expect-error
	PowerUpSettings.load((v) => {
		settings.value = v;
	});
});
</script>

<template>
  <section v-for="group in settings?.groups">
    <h3>{{ group.text }}</h3>
    <div class="plugins" v-for="plugin in group.plugins">
      <label>
        <input type="checkbox" v-model="plugin.enabled"/>
        <span>{{ plugin.text }}</span>
      </label>
    </div>
  </section>
  <footer class="buttons">
    <button type="submit" @click="apply()" v-bind:disabled="!isChanged">{{
        browser.i18n.getMessage("popup_apply_button")
      }}
    </button>
  </footer>
</template>