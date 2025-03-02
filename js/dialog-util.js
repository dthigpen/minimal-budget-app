import van from './vender/van.debug.js';
import { Modal } from './vender/van-ui.js';
const { dialog, div, span, article, header, footer, button, p } = van.tags;

export function initDialogWithButtons(states, buttonsFn, renderFn) {
  states.cornerClose ??= van.state(true);
  return initDialog(states, (s, dialogActions) => {
    let innerContent = renderFn(states, dialogActions);
    innerContent = Array.isArray(innerContent) ? innerContent : [innerContent];
    const buttons = buttonsFn(states, dialogActions);
    return dialog(
      { open: true },
      article(
        header(
          () =>
            s.cornerClose.val
              ? button({
                  'aria-label': 'Close',
                  rel: 'prev',
                  onclick: () => dialogActions.close(),
                })
              : null,
          p({ class: 'dialogtitle' }, s.title ?? ''),
        ),
        ...innerContent,
        footer(
          buttons
            ?.filter((b) => b)
            ?.map((b) =>
              button(
                {
                  onclick: b.onclick ?? (() => dialogActions.close()),
                  class: b.class ?? '',
                },
                b.text,
              ),
            ),
        ),
      ),
    );
  });
}

export function initDialog(states, renderFn) {
  states.closed ??= van.state(false);
  function close() {
    states.closed.val = true;
  }
  function open(updateValues = {}) {
    for (const [key, newValue] of Object.entries(updateValues)) {
      if (Object.keys(states).includes(key)) {
        states[key].val = newValue;
      }
    }
    states.closed.val = false;
    const children =
      typeof renderFn === 'function'
        ? renderFn(states, { close, open })
        : renderFn;
    van.add(
      document.body,
      Modal(
        { closed: states.closed },
        ...(Array.isArray(children) ? children : [children]),
      ),
    );
  }

  return {
    states: states,
    close,
    open,
  };
}
