<template>
  <div>
    <v-textarea v-if="!masksValue" :value="value" outlined :label="label" rows="2">
      <template v-slot:append-outer>
        <v-tooltip v-model="showsCopied" bottom>
          <template v-slot:activator="{}">
            <v-icon @click="clickCopyIcon">
              {{ mdiContentCopy }}
            </v-icon>
          </template>
          <span>Copied</span>
        </v-tooltip>
      </template>
    </v-textarea>
    <v-text-field v-if="masksValue" :value="value" type="password" outlined :label="label">
      <template v-slot:append-outer>
        <v-tooltip v-model="showsCopied" bottom>
          <template v-slot:activator="{}">
            <v-icon @click="clickCopyIcon">
              {{ mdiContentCopy }}
            </v-icon>
          </template>
          <span>Copied</span>
        </v-tooltip>
      </template>
    </v-text-field>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import {mdiContentCopy} from "@mdi/js";
import clipboardCopy from "clipboard-copy";

const props = withDefaults(defineProps<{
  value: string,
  label: string,
  masksValue: boolean,
}>(), {
  masksValue: false,
});

const showsCopied = ref(false);

async function clickCopyIcon() {
  await clipboardCopy(props.value);
  showsCopied.value = true;
  await new Promise(resolve => setTimeout(resolve, 2000));
  showsCopied.value = false;
}
</script>
