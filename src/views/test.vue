<script>
import { onMounted, ref, h } from "vue";

import Editor from "@toast-ui/editor";

import "highlight.js/styles/github.css";

export default {
  props: {
    modelValue: {
      type: String,
      required: false,
      default: ""
    }
  },
  setup(_, { emit }) {
    const editor = ref();

    onMounted(() => {
      const e = new Editor({
        el: editor.value,
        height: "500px",
        initialEditType: "markdown",
        previewStyle: "tab",
        plugins: [[codeSyntaxHighlight, { hljs }]],
        events: {
          change: () => emit("update:modelValue", e.getMarkdown())
        }
      });
    });

    return () =>
      h("div", {
        ref: editor
      });
  }
};
</script>
