import {ref, watch, type Ref} from "vue";

import {language} from "@/language";
import {type Strings} from "@/strings/en";
const enAsync = () => import("./en").then(p => p.default);
const jaAsync = () => import("./ja").then(p => p.default);
const defaultAsync = enAsync;

export const strings: Ref<Strings | undefined> = (() => {
  const strings = ref<Strings>();

  async function updateLang() {
    if(language.value.startsWith("en")) {
      strings.value = await enAsync();
      return;
    }
    if(language.value.startsWith("ja")) {
      strings.value = await jaAsync();
      return;
    }
    strings.value = await defaultAsync();
  }
  updateLang();

  watch(language, async () => {
    await updateLang();
  });

  return strings;
})();
