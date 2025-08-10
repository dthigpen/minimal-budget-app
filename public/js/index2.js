import van from './vender/van.debug.js';
import * as vanX from './vender/van-x.js';
const {
  a,
  i,
  select,
  section,
  cite,
  blockquote,
  option,
  details,
  summary,
  small,
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
  h5,
  h6,
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
  img,
} = van.tags;

const App = () => {
  return [
    nav(
      // { class: 'bottom' },
      // a(i('mail'), div('Budget')),
      // a(i('receipt_long'), div('Transactions')),
      // a(i('settings'), div('Settings')),
      button(
      	{
      		class: 'circle transparent',
      	},
     		i('menu')
      ),
      h6({class: 'max center-align'}, 'Minimal Budget'),
      button({class: 'circle transparent'},
				i('account_circle')
      )
    ),
    main(
      {
        class: 'responsive',
      },
      h1({ class: 'small' }, 'Minimal Budget'),
    ),
  ];
};
van.add(document.body, App());
