import { w as spread_props } from "./index2.js";
import { I as Icon } from "./Icon.js";
function Network($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      [
        "rect",
        { "x": "16", "y": "16", "width": "6", "height": "6", "rx": "1" }
      ],
      [
        "rect",
        { "x": "2", "y": "16", "width": "6", "height": "6", "rx": "1" }
      ],
      [
        "rect",
        { "x": "9", "y": "2", "width": "6", "height": "6", "rx": "1" }
      ],
      ["path", { "d": "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" }],
      ["path", { "d": "M12 12V8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "network" },
      /**
       * @component @name Network
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIiAvPgogIDxyZWN0IHg9IjIiIHk9IjE2IiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cmVjdCB4PSI5IiB5PSIyIiB3aWR0aD0iNiIgaGVpZ2h0PSI2IiByeD0iMSIgLz4KICA8cGF0aCBkPSJNNSAxNnYtM2ExIDEgMCAwIDEgMS0xaDEyYTEgMSAwIDAgMSAxIDF2MyIgLz4KICA8cGF0aCBkPSJNMTIgMTJWOCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/network
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function School($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["path", { "d": "M14 21v-3a2 2 0 0 0-4 0v3" }],
      ["path", { "d": "M18 5v16" }],
      ["path", { "d": "m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" }],
      [
        "path",
        {
          "d": "m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11"
        }
      ],
      ["path", { "d": "M6 5v16" }],
      ["circle", { "cx": "12", "cy": "9", "r": "2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "school" },
      /**
       * @component @name School
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIiAvPgogIDxwYXRoIGQ9Ik0xOCA1djE2IiAvPgogIDxwYXRoIGQ9Im00IDYgNy4xMDYtMy43OWEyIDIgMCAwIDEgMS43ODggMEwyMCA2IiAvPgogIDxwYXRoIGQ9Im02IDExLTMuNTIgMi4xNDdhMSAxIDAgMCAwLS40OC44NTRWMTlhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0ydi01YTEgMSAwIDAgMC0uNDgtLjg1M0wxOCAxMSIgLz4KICA8cGF0aCBkPSJNNiA1djE2IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iOSIgcj0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/school
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
export {
  Network as N,
  School as S
};
