<template>
  <v-textarea
    ref="v_textarea"
    :value="value"
    outlined
    :label="label"
    rows="2"
  >
    <template v-slot:append-outer>
      <v-tooltip v-model="showsCopied" bottom>
        <template v-slot:activator="{}">
          <v-icon @click="clickCopyIcon">
            {{ icons.mdiContentCopy }}
          </v-icon>
        </template>
        <span>Copied</span>
      </v-tooltip>
    </template>
  </v-textarea>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {mdiContentCopy} from "@mdi/js";
import clipboardCopy from "clipboard-copy";

@Component
export default class TextareaWithCopy extends Vue {
  @Prop() private value!: string;
  @Prop() private label!: string;
  icons = {
    mdiContentCopy,
  };
  showsCopied: boolean = false;

  async clickCopyIcon() {
    await clipboardCopy(this.value);
    // Select textarea
    // TODO: better way
    (this.$refs.v_textarea as any).$el.querySelector('textarea').select();

    this.showsCopied = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.showsCopied = false;
  }
}
</script>
