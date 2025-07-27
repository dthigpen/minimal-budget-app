// import van from './vender/van.js';
import van from './vender/van.debug.js';
const {
  a,
  select,
  section,
  cite,
  blockquote,
  option,
  details,
  summary,
  label,
  figure,
  fieldset,
  legend,
  article,
  footer,
  form,
  b,
  del,
  button,
  dialog,
  pre,
  code,
  div,
  h1,
  h2,
  h3,
  h4,
  li,
  p,
  ul,
  nav,
  strong,
  header,
  main,
  table,
  thead,
  tbody,
  tr,
  td,
  th,
  input,
  span,
  progress,
} = van.tags;

export const Tabs = (tabOptions) => {
  return div(
    { class: 'tab-container' },
    nav(
      { role: 'tab-control' },
      ul(
        li(label({ for: 'tab1' }, 'Tab 1')),
        li(label({ for: 'tab2' }, 'Tab 2')),
        li(label({ for: 'tab3' }, 'Tab 3')),
      ),
    ),
    div(
      { role: 'tabs' },
      section(
        input({
          hidden: 'hidden',
          type: 'radio',
          name: 'tabs',
          id: 'tab1',
          checked: 'checked',
        }),
        figure(
          blockquote(
            "When you're new to something, you bring an ignorance that can be highly innovative.",
            footer(cite('– Rick Rubin')),
          ),
        ),

        input({
          hidden: 'hidden',
          type: 'radio',
          name: 'tabs',
          id: 'tab2',
        }),

        figure(
          blockquote(
            'Nothing beats a simple worldview. When we know who is the bad guy, the day has structure.',
            footer(cite('– Volker Pispers')),
          ),
        ),

        input({
          hidden: 'hidden',
          type: 'radio',
          name: 'tabs',
          id: 'tab3',
        }),
        figure(
          blockquote(
            'Ignorance is not bliss. Ignorance is poverty. Ignorance is devastation.\nIgnorance is tragedy. And ignorance is illness. It all stems from ignorance.',
            footer(cite('– Jim Rohn')),
          ),
        ),
      ),
    ),
  );
};
