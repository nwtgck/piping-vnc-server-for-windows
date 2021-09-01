<template>
  <div>
    <v-textarea v-if="!masksValue" :value="value" outlined :label="label" rows="2">
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
    <v-text-field v-if="masksValue" :value="value" type="password" outlined :label="label">
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
    </v-text-field>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {mdiContentCopy} from "@mdi/js";
import clipboardCopy from "clipboard-copy";

@Component
export default class TextareaWithCopy extends Vue {
  @Prop() private value!: string;
  @Prop() private label!: string;
  @Prop({default: false}) private masksValue!: boolean;
  icons = {
    mdiContentCopy,
  };
  showsCopied: boolean = false;

  async clickCopyIcon() {
    await clipboardCopy(this.value);
    this.showsCopied = true;
    await new Promise(resolve => setTimeout(resolve, 2000));
    this.showsCopied = false;
  }
}
</script>
