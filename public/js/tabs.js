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

const Tab = (id, label, selectedTab) =>
  span(
    {
      class: () => 'tab' + (selectedTab.val === id ? ' active' : ''),
      onclick: () => (selectedTab.val = id),
    },
    label,
  );

const Content = (id, selectedTab, children) =>
  div(
    {
      class: 'tab-content',
      style: () => `display: ${selectedTab.val === id ? 'block' : 'none'}`,
    },
    children,
  );

export const Tabs = (tabObjects, tabOptions = {}) => {
  const selectedTab = van.state(tabOptions.selected ?? tabObjects?.[0]?.id);
  return div(
    {},
    div(
      { class: 'tabs' },
      ...tabObjects.map((t) => Tab(t.id, t.label ?? t.id, selectedTab)),
    ),
    ...tabObjects.map((t) => Content(t.id, selectedTab, t.content ?? [])),
  );
};
