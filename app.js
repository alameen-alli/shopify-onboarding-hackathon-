const TOGGLESETUP = () => {
  const ALERTS_BTN = document.getElementById("notification-btn");
  const ALERTS_CONTAINER = document.getElementById("alerts");
  const ALERTS_ARIA_NOTIFICATION = document.getElementById("alerts-notify");

  const MENU_BTN = document.getElementById("menu-btn");
  const MENU = document.getElementById("menu");
  const MENU_ITEMS = document.querySelectorAll('[role="menuitem"]');
  const MENU_ARIA_NOTIFICATION = document.getElementById("menu-notify");
  const HIDDEN_CLASS = "hidden";
  const ACTIVE_CLASS = "active";
  const ALERT_INDEX = 0;
  const MENU_INDEX = 1;
  const POPUPS = [ALERTS_CONTAINER, MENU];
  const POPUP_BTNS = [ALERTS_BTN, MENU_BTN];
  const POPUPS_ARIA_NOTIFICATION = [ALERTS_ARIA_NOTIFICATION, MENU_ARIA_NOTIFICATION];

  const CALLOUT = document.getElementById("callout");
  const CALLOUT_CLOSE_BTN = document.getElementById("callout-close-btn");
  const CALLOUT_ARIA_NOTIFICATION = document.getElementById("callout-notify");

  const TOGGLE_SETUP_BTN = document.getElementById("toggle-setup-btn");
  const SETUP = document.getElementById("setup");
  const TOGGLE_SETUP_ARIA_NOTIFICATION = document.getElementById("toggle-setup-notify");

  const TOGGLE_SETUP_STEP_VISIBILITY_BTNS = document.querySelectorAll(".setup-step-toggle");
  const SETUP_STEPS = [...document.querySelectorAll(".setup-step")];
  const SETUP_STEPS_ARIA_NOTIFICATIONS = document.querySelectorAll(".setup-step-notify");

  const TOGGLE_SETUP_STEP_COMPLETE_BTNS = document.querySelectorAll(".check-step-btn");
  const TOGGLE_COMPLETE_ARIA_NOTIFICATIONS = document.querySelectorAll(".check-step-btn-notify");
  const PROGRESSBAR = document.getElementById("progess-bar");
  const PROGRESS_COUNT = document.getElementById("progress-count");

  function HIDE_POPUPS() {
    POPUPS.forEach((popup, index) => {
      const IS_POPUP_OPEN = !popup.classList.contains(HIDDEN_CLASS);
      if (!IS_POPUP_OPEN) {
        return;
      }

      popup.classList.add(HIDDEN_CLASS);
      POPUP_BTNS[index].setAttribute("aria-expanded", false);
      const POPUP_ARIA_NOTIFICATION = POPUPS_ARIA_NOTIFICATION[index];
      POPUP_ARIA_NOTIFICATION.setAttribute("aria-label", POPUP_ARIA_NOTIFICATION.dataset.closeLabel);
    });
  }

  function TOGGLE_POPUP(event, POPUP_INDEX) {
    const POPUP = POPUPS[POPUP_INDEX];
    const POPUP_BTN = POPUP_BTNS[POPUP_INDEX];
    const IS_POPUP_OPEN = !POPUP.classList.contains(HIDDEN_CLASS);
    HIDE_POPUPS();

    if (!IS_POPUP_OPEN) {
      POPUP.classList.remove(HIDDEN_CLASS);
      POPUP_BTN.setAttribute("aria-expanded", true);
      const POPUP_ARIA_NOTIFICATION = POPUPS_ARIA_NOTIFICATION[POPUP_INDEX];
      POPUP_ARIA_NOTIFICATION.setAttribute("aria-label", POPUP_ARIA_NOTIFICATION.dataset.openLabel);
      event.stopPropagation();
    }
  }

  function HIDE_POPUPS_ON_CLICK_OUTSIDE(event) {
    const IS_ANY_POPUP_CLICKED = POPUPS.some((popup) => {
      return popup.contains(event.target);
    });
    if (IS_ANY_POPUP_CLICKED) {
      return;
    }

    HIDE_POPUPS();
  }

  function FOCUS_FIRST_MENU_ITEM() {
    MENU_ITEMS.item(0).focus();
  }

  function HANDLE_ESCAPE_KEY_PRESS(event) {
    if (event.key === "Escape") {
      HIDE_POPUPS();
    }
  }

  function HANDLE_MENU_ITEM_KEY_PRESS(event, MENU_ITEM_INDEX) {
    let NEXT_MENU_ITEM_INDEX;

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      NEXT_MENU_ITEM_INDEX = MOD_NUMBER(MENU_ITEM_INDEX + 1, MENU_ITEMS.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      NEXT_MENU_ITEM_INDEX = MOD_NUMBER(MENU_ITEM_INDEX - 1, MENU_ITEMS.length);
    } else if (event.key === "Home") {
      NEXT_MENU_ITEM_INDEX = 0;
    } else if (event.key === "End") {
      NEXT_MENU_ITEM_INDEX = MENU_ITEMS.length - 1;
    } else {
      return;
    }

    MENU_ITEMS.item(NEXT_MENU_ITEM_INDEX).focus();
  }

  function TOGGLE_SETUP() {
    SETUP.classList.toggle(HIDDEN_CLASS);

    const IS_OPEN = !SETUP.classList.contains(HIDDEN_CLASS);
    if (IS_OPEN) {
      TOGGLE_SETUP_ARIA_NOTIFICATION.setAttribute("aria-label", "Setup opened");
    } else {
      TOGGLE_SETUP_ARIA_NOTIFICATION.setAttribute("aria-label", "Setup closed");
    }

    TOGGLE_SETUP_BTN.setAttribute("aria-expanded", IS_OPEN);
    TOGGLE_SETUP_BTN.dataset.isOpen = IS_OPEN ? "" : true;
  }

  function SHOW_SETUP_STEP(SETUP_STEP_INDEX) {
    HIDE_SETUP_STEPS();
    SETUP_STEPS[SETUP_STEP_INDEX].classList.add(ACTIVE_CLASS);

    const SETUP_STEP_ARIA_NOTIFICATION = SETUP_STEPS_ARIA_NOTIFICATIONS.item(SETUP_STEP_INDEX);
    SETUP_STEP_ARIA_NOTIFICATION.setAttribute("aria-label", `Setup step ${SETUP_STEP_INDEX + 1} opened`);

    TOGGLE_SETUP_STEP_VISIBILITY_BTNS.item(SETUP_STEP_INDEX).setAttribute("aria-expanded", true);
  }

  function HIDE_SETUP_STEPS() {
    SETUP_STEPS.forEach((el, INDEX) => {
      const IS_CLOSED = !el.classList.contains(ACTIVE_CLASS);
      if (IS_CLOSED) {
        return;
      }

      el.classList.remove(ACTIVE_CLASS);
      SETUP_STEPS_ARIA_NOTIFICATIONS
        .item(INDEX)
        .setAttribute("aria-label", `Setup step ${INDEX + 1} closed`);
    });

    TOGGLE_SETUP_STEP_VISIBILITY_BTNS.forEach((btn) => btn.setAttribute("aria-expanded", false));
  }

  function UPDATE_ARIA_FOR_TOGGLE_COMPLETE_BTN(TOGGLE_BTN_INDEX) {
    const SETUP_STEP = SETUP_STEPS[TOGGLE_BTN_INDEX];
    const IS_SETUP_STEP_COMPLETE = !!SETUP_STEP.dataset.isCompleted;
    const TOGGLE_BTN = TOGGLE_SETUP_STEP_COMPLETE_BTNS[TOGGLE_BTN_INDEX];
    const TOGGLE_COMPLETE_ARIA_NOTIFICATION = TOGGLE_COMPLETE_ARIA_NOTIFICATIONS.item(TOGGLE_BTN_INDEX);

    if (IS_SETUP_STEP_COMPLETE) {
      TOGGLE_BTN.setAttribute("aria-label", "Mark step incomplete");
      TOGGLE_COMPLETE_ARIA_NOTIFICATION.setAttribute("aria-label", "Setup step marked complete");
    } else {
      TOGGLE_COMPLETE_ARIA_NOTIFICATION.setAttribute("aria-label", "Setup step marked incomplete");
      TOGGLE_BTN.setAttribute("aria-label", "Mark step complete");
    }
  }

  function TOGGLE_SETUP_STEP_COMPLETE(TOGGLE_BTN_INDEX) {
    const SETUP_STEP = SETUP_STEPS[TOGGLE_BTN_INDEX];
    const IS_SETUP_STEP_COMPLETE = !!SETUP_STEP.dataset.isCompleted;
    SETUP_STEP.dataset.isCompleted = IS_SETUP_STEP_COMPLETE ? "" : true;

    UPDATE_PROGRESS_BAR();
    UPDATE_ARIA_FOR_TOGGLE_COMPLETE_BTN(TOGGLE_BTN_INDEX);

    const NEXT_STEP_INDEX = FIND_NEXT_UNCOMPLETED_STEP_INDEX(SETUP_STEPS);
    if (NEXT_STEP_INDEX !== -1) {
      SHOW_SETUP_STEP(NEXT_STEP_INDEX);
    }
  }

  function FIND_NEXT_UNCOMPLETED_STEP_INDEX(SETUP_STEPS) {
    const NEXT_STEP_INDEX = SETUP_STEPS.findIndex((STEP) => !STEP.dataset.isCompleted);
    return NEXT_STEP_INDEX;
  }

  function UPDATE_PROGRESS_BAR() {
    const COMPLETED_STEPS_NO = SETUP_STEPS.filter((STEP) => STEP.dataset.isCompleted).length;
    PROGRESSBAR.style.width = `${COMPLETED_STEPS_NO * 20}%`;
    PROGRESS_COUNT.innerText = COMPLETED_STEPS_NO;
  }

  function MOD_NUMBER(NUM, N) {
    return ((NUM % N) + N) % N;
  }

  ALERTS_BTN.addEventListener("click", (EVENT) => {
    TOGGLE_POPUP(EVENT, ALERT_INDEX);
  });

  MENU_BTN.addEventListener("click", (EVENT) => {
    TOGGLE_POPUP(EVENT, MENU_INDEX);

    const IS_MENU_OPEN = !MENU.classList.contains(HIDDEN_CLASS);
    if (IS_MENU_OPEN) {
      FOCUS_FIRST_MENU_ITEM();
    }
  });

  POPUPS.forEach((POPUP) => {
    POPUP.addEventListener("keyup", HANDLE_ESCAPE_KEY_PRESS);
  });
  ALERTS_BTN.addEventListener("keyup", HANDLE_ESCAPE_KEY_PRESS);

  MENU_ITEMS.forEach((MENU_ITEM, INDEX) =>
    MENU_ITEM.addEventListener("keyup", (EVENT) => HANDLE_MENU_ITEM_KEY_PRESS(EVENT, INDEX))
  );

  document.addEventListener("click", HIDE_POPUPS_ON_CLICK_OUTSIDE);

  CALLOUT_CLOSE_BTN.addEventListener("click", () => {
    CALLOUT.classList.add(HIDDEN_CLASS);
    CALLOUT_ARIA_NOTIFICATION.setAttribute("aria-label", "Callout removed");
  });

  TOGGLE_SETUP_BTN.addEventListener("click", TOGGLE_SETUP);
  TOGGLE_SETUP_STEP_VISIBILITY_BTNS.forEach((BTN, BTN_INDEX) => {
    BTN.addEventListener("click", () => SHOW_SETUP_STEP(BTN_INDEX));
  });

  TOGGLE_SETUP_STEP_COMPLETE_BTNS.forEach((BTN, BTN_INDEX) => {
    BTN.addEventListener("click", () => TOGGLE_SETUP_STEP_COMPLETE(BTN_INDEX));
  });
}

TOGGLESETUP();
