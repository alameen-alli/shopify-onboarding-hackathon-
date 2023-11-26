const PROFILE_MENU_BTN = document.getElementById("profile-menu-button");
const MENU = document.getElementById("menu");
const MENU_ITEMS = document.querySelectorAll('[role="menuitem"]');
const PROFILE_MENU_ARIA_NOTIFICATION = document.getElementById("profile-menu-notify");
const HIDDENSTYLE = "hidden";
const MENUID = 1;
const NOTIFICATIONS_BTN = document.getElementById("notification-btn");
const NOTIFICATIONS_CONTAINER = document.getElementById("notifications");
const ARIA_NOTIFICATIONS = document.getElementById("alerts-notify");
const POPUPS = [NOTIFICATIONS_CONTAINER, MENU];
const POPUP_BTNS = [NOTIFICATIONS_BTN, PROFILE_MENU_BTN];
const NOTIFICATIONID = 0;
const POPUPS_ARIA_NOTIFICATION = [ARIA_NOTIFICATIONS, PROFILE_MENU_ARIA_NOTIFICATION];
const TRIAL_CALLOUT = document.getElementById("select-a-plan-callout");
const TRIAL_CALLOUT_CLOSE_BTN = document.getElementById(
  "trial-callout-close-button"
);
const TRIAL_CALLOUT_ARIA_NOTIFICATION =
  document.getElementById("trial-callout");
const TOGGLE_SETUP_BTN = document.getElementById("setupguide-toggle-button");
const SETUP = document.getElementById("setup");
const TOGGLE_SETUP_ARIA_NOTIFICATION = document.getElementById(
  "toggle-setup-notify"
);
const PROGRESSBAR = document.getElementById("setupguide-progess-bar");
const PROGRESS_COUNT = document.getElementById("setupguide-progress-count");
const TOGGLE_SETUP_STEP_VISIBILITY_BTNS =
  document.querySelectorAll(".setup-step-toggle");
const SETUP_STEPS = [...document.querySelectorAll(".setup-step")];
const ACTIVE_CLASS = "active";
const SETUP_STEPS_ARIA_NOTIFICATIONS =
  document.querySelectorAll(".setup-step-notify");
const TOGGLE_SETUP_STEP_COMPLETE_BTNS =
  document.querySelectorAll(".check-step-btn");
const TOGGLE_COMPLETE_ARIA_NOTIFICATIONS = document.querySelectorAll(
  ".check-step-btn-notify"
);

const HIDE_POPUPS = () => {
  POPUPS.forEach((popup, index) => {
    const IS_POPUP_OPEN = !popup.classList.contains(HIDDENSTYLE);
    if (!IS_POPUP_OPEN) {
      return;
    }

    popup.classList.add(HIDDENSTYLE);
    POPUP_BTNS[index].setAttribute("aria-expanded", false);
    const POPUP_ARIA_NOTIFICATION = POPUPS_ARIA_NOTIFICATION[index];
    POPUP_ARIA_NOTIFICATION.setAttribute(
      "aria-label",
      POPUP_ARIA_NOTIFICATION.dataset.closeLabel
    );
  });
};


const TOGGLE_POPUP = (event, POPUP_INDEX) => {
  const POPUP = POPUPS[POPUP_INDEX];
  const POPUP_BTN = POPUP_BTNS[POPUP_INDEX];
  const IS_POPUP_OPEN = !POPUP.classList.contains(HIDDENSTYLE);

  HIDE_POPUPS();

  if (!IS_POPUP_OPEN) {
    POPUP.classList.remove(HIDDENSTYLE);
    POPUP_BTN.setAttribute("aria-expanded", true);
    const POPUP_ARIA_NOTIFICATION = POPUPS_ARIA_NOTIFICATION[POPUP_INDEX];
    POPUP_ARIA_NOTIFICATION.setAttribute(
      "aria-label",
      POPUP_ARIA_NOTIFICATION.dataset.openLabel
    );
    event.stopPropagation();
  }
};


const HIDE_POPUPS_ON_CLICK_OUTSIDE = (event) => {
  const IS_ANY_POPUP_CLICKED = POPUPS.some((popup) => popup.contains(event.target));
  if (!IS_ANY_POPUP_CLICKED) {
    HIDE_POPUPS();
  }
};

const FOCUS_FIRST_MENU_ITEM = () => MENU_ITEMS.item(0).focus();

const HANDLE_ESCAPE_KEY_PRESS = (event) => {
  if (event.key === "Escape") {
    HIDE_POPUPS();
  }
};


const HANDLE_MENU_ITEM_KEY_PRESS = (event, MENU_ITEM_INDEX) => {
  const NEXT_MENU_ITEM_INDEX =
    event.key === "ArrowDown" || event.key === "ArrowRight"
      ? MOD_NUMBER(MENU_ITEM_INDEX + 1, MENU_ITEMS.length)
      : event.key === "ArrowUp" || event.key === "ArrowLeft"
      ? MOD_NUMBER(MENU_ITEM_INDEX - 1, MENU_ITEMS.length)
      : event.key === "Home"
      ? 0
      : event.key === "End"
      ? MENU_ITEMS.length - 1
      : undefined;

  if (NEXT_MENU_ITEM_INDEX !== undefined) {
    MENU_ITEMS.item(NEXT_MENU_ITEM_INDEX).focus();
  }
};

const TOGGLE_SETUP = () => {
  SETUP.classList.toggle(HIDDENSTYLE);

  const IS_OPEN = !SETUP.classList.contains(HIDDENSTYLE);
  TOGGLE_SETUP_ARIA_NOTIFICATION.setAttribute(
    "aria-label",
    IS_OPEN ? "Setup opened" : "Setup closed"
  );

  SETUPGUIDE_TOGGLE_CHECK.setAttribute("aria-expanded", IS_OPEN);
  SETUPGUIDE_TOGGLE_CHECK.dataset.isOpen = IS_OPEN ? "" : true;
};

const SHOW_SETUP_STEP = (SETUP_STEP_INDEX) => {
  HIDE_SETUP_STEPS();
  SETUP_STEPS[SETUP_STEP_INDEX].classList.add(ACTIVE_CLASS);

  const SETUP_STEP_ARIA_NOTIFICATION =
    SETUP_STEPS_ARIA_NOTIFICATIONS.item(SETUP_STEP_INDEX);
  SETUP_STEP_ARIA_NOTIFICATION.setAttribute(
    "aria-label",
    `Setup step ${SETUP_STEP_INDEX + 1} opened`
  );

  TOGGLE_SETUP_STEP_VISIBILITY_BTNS.item(SETUP_STEP_INDEX).setAttribute(
    "aria-expanded",
    true
  );
};

const HIDE_SETUP_STEPS = () => {
  SETUP_STEPS.forEach((el, INDEX) => {
    const IS_CLOSED = !el.classList.contains(ACTIVE_CLASS);
    if (IS_CLOSED) {
      return;
    }

    el.classList.remove(ACTIVE_CLASS);
    SETUP_STEPS_ARIA_NOTIFICATIONS.item(INDEX).setAttribute(
      "aria-label",
      `Setup step ${INDEX + 1} closed`
    );
  });

  TOGGLE_SETUP_STEP_VISIBILITY_BTNS.forEach((btn) =>
    btn.setAttribute("aria-expanded", false)
  );
};

const UPDATE_ARIA_FOR_TOGGLE_COMPLETE_BTN = (TOGGLE_BTN_INDEX) => {
  const SETUP_STEP = SETUP_STEPS[TOGGLE_BTN_INDEX];
  const IS_SETUP_STEP_COMPLETE = !!SETUP_STEP.dataset.isCompleted;
  const TOGGLE_BTN = TOGGLE_SETUP_STEP_COMPLETE_BTNS[TOGGLE_BTN_INDEX];
  const TOGGLE_COMPLETE_ARIA_NOTIFICATION =
    TOGGLE_COMPLETE_ARIA_NOTIFICATIONS.item(TOGGLE_BTN_INDEX);

  if (IS_SETUP_STEP_COMPLETE) {
    TOGGLE_BTN.setAttribute("aria-label", "Mark step incomplete");
    TOGGLE_COMPLETE_ARIA_NOTIFICATION.setAttribute(
      "aria-label",
      "Setup step marked complete"
    );
  } else {
    TOGGLE_COMPLETE_ARIA_NOTIFICATION.setAttribute(
      "aria-label",
      "Setup step marked incomplete"
    );
    TOGGLE_BTN.setAttribute("aria-label", "Mark step complete");
  }
};

const TOGGLE_SETUP_STEP_COMPLETE = (TOGGLE_BTN_INDEX) => {
  const SETUP_STEP = SETUP_STEPS[TOGGLE_BTN_INDEX];
  const IS_SETUP_STEP_COMPLETE = !!SETUP_STEP.dataset.isCompleted;
  SETUP_STEP.dataset.isCompleted = IS_SETUP_STEP_COMPLETE ? "" : true;

  UPDATE_PROGRESS_BAR();
  UPDATE_ARIA_FOR_TOGGLE_COMPLETE_BTN(TOGGLE_BTN_INDEX);

  const NEXT_STEP_INDEX = FIND_NEXT_UNCOMPLETED_STEP_INDEX(SETUP_STEPS);
  if (NEXT_STEP_INDEX !== -1) {
    SHOW_SETUP_STEP(NEXT_STEP_INDEX);
  }
};

const FIND_NEXT_UNCOMPLETED_STEP_INDEX = (SETUP_STEPS) =>
  SETUP_STEPS.findIndex((STEP) => !STEP.dataset.isCompleted);

const UPDATE_PROGRESS_BAR = () => {
  const COMPLETED_STEPS_NO = SETUP_STEPS.filter(
    (STEP) => STEP.dataset.isCompleted
  ).length;
  PROGRESSBAR.style.width = `${COMPLETED_STEPS_NO * 20}%`;
  PROGRESS_COUNT.innerText = COMPLETED_STEPS_NO;
};

const MOD_NUMBER = (NUM, N) => ((NUM % N) + N) % N;

NOTIFICATIONS_BTN.addEventListener("click", (EVENT) => {
  TOGGLE_POPUP(EVENT, NOTIFICATIONID);
});

PROFILE_MENU_BTN.addEventListener("click", (EVENT) => {
  TOGGLE_POPUP(EVENT, MENUID);

  const IS_MENU_OPEN = !MENU.classList.contains(HIDDENSTYLE);
  if (IS_MENU_OPEN) {
    FOCUS_FIRST_MENU_ITEM();
  }
});

POPUPS.forEach((POPUP) => {
  POPUP.addEventListener("keyup", HANDLE_ESCAPE_KEY_PRESS);
});
NOTIFICATIONS_BTN.addEventListener("keyup", HANDLE_ESCAPE_KEY_PRESS);

MENU_ITEMS.forEach((MENU_ITEM, INDEX) =>
  MENU_ITEM.addEventListener("keyup", (EVENT) =>
    HANDLE_MENU_ITEM_KEY_PRESS(EVENT, INDEX)
  )
);

document.addEventListener("click", HIDE_POPUPS_ON_CLICK_OUTSIDE);

TRIAL_CALLOUT_CLOSE_BTN.addEventListener("click", () => {
  TRIAL_CALLOUT.classList.add(HIDDENSTYLE);
  TRIAL_CALLOUT_ARIA_NOTIFICATION.setAttribute("aria-label", "Callout removed");
});

TOGGLE_SETUP_BTN.addEventListener("click", TOGGLE_SETUP);
TOGGLE_SETUP_STEP_VISIBILITY_BTNS.forEach((BTN, BTN_INDEX) => {
  BTN.addEventListener("click", () => SHOW_SETUP_STEP(BTN_INDEX));
});

TOGGLE_SETUP_STEP_COMPLETE_BTNS.forEach((BTN, BTN_INDEX) => {
  BTN.addEventListener("click", () => TOGGLE_SETUP_STEP_COMPLETE(BTN_INDEX));
});
