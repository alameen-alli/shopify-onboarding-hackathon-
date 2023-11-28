const PROFILE_MENU_BTN = document.getElementById("profile-menu-button");
const MENU = document.getElementById("menu");
const PROFILE_OPTIONS = document.querySelectorAll('[role="profile-menu-option"]');
const PROFILE_MENU_ARIA_NOTIFICATION = document.getElementById(
  "profile-menu-notify"
);
const isHidden = "isHidden";
const menuFirstItem = 1;
const NOTIFICATIONS_BTN = document.getElementById("notification-btn");
const NOTIFICATIONS_CONTAINER = document.getElementById("notifications");
const ARIA_NOTIFICATIONS = document.getElementById("notificationDisplay");
const DROPDOWN = [NOTIFICATIONS_CONTAINER, MENU];
const DROPDOWN_BTNS = [NOTIFICATIONS_BTN, PROFILE_MENU_BTN];
const NOTIFICATIONID = 0;
const DROPDOWN_ARIA_NOTIFICATION = [
  ARIA_NOTIFICATIONS,
  PROFILE_MENU_ARIA_NOTIFICATION,
];
const TRIAL_CALLOUT = document.getElementById("select-a-plan-callout");
const TRIAL_CALLOUT_CLOSE_BTN = document.getElementById(
  "trial-callout-close-button"
);
const TRIAL_CALLOUT_ARIA_NOTIFICATION =
  document.getElementById("trial-callout");
const SETUPGUIDE_TOGGLE_CHECK = document.getElementById(
  "setupguide-toggle-button"
);
const SETUP = document.getElementById("setupguide-section-id");
const TOGGLE_SETUP_ARIA_NOTIFICATION = document.getElementById(
  "toggle-setup-notify"
);
const SETUPGUIDE_PROGRESSBAR = document.getElementById(
  "setupguide-progess-bar"
);
const PROGRESS_COUNT = document.getElementById("setupguide-progress-count");
const SETUPGUIDE_STEP_VISIBILITY_TOGGLE_BTNS =
  document.querySelectorAll(".toggle-check-buttons");
const SETUPGUIDE_STEPS = [
  ...document.querySelectorAll(".setupguide-item"),
];
const ACTIVE_CLASS = "active";
const SETUPGUIDE_STEPS_ARIA_NOTIFICATIONS =
  document.querySelectorAll(".notify-on-step-change");
const SETUPGUIDE_STEPS_COMPLETE_BTNS =
  document.querySelectorAll(".check-button");
const TOGGLE_ARIA_NOTIFICATIONS_ON_COMPLETE = document.querySelectorAll(
  ".notify-on-check-change"
);

const HIDE_DROPDOWN = () => {
  DROPDOWN.forEach((popup, index) => {
    const IS_DROPDOWN = !popup.classList.contains(isHidden);
    if (!IS_DROPDOWN) {
      return;
    }

    popup.classList.add(isHidden);
    DROPDOWN_BTNS[index].setAttribute("aria-expanded", false);
    const DROPDOWN_ARIA = DROPDOWN_ARIA_NOTIFICATION[index];
    DROPDOWN_ARIA.setAttribute("aria-label", DROPDOWN_ARIA.dataset.closeLabel);
  });
};

const TOGGLE_POPUP = (event, DROPDOWNID) => {
  const POPUP = DROPDOWN[DROPDOWNID];
  const POPUP_BTN = DROPDOWN_BTNS[DROPDOWNID];
  const IS_DROPDOWN = !POPUP.classList.contains(isHidden);

  HIDE_DROPDOWN();

  if (!IS_DROPDOWN) {
    POPUP.classList.remove(isHidden);
    POPUP_BTN.setAttribute("aria-expanded", true);
    const DROPDOWN_ARIA = DROPDOWN_ARIA_NOTIFICATION[DROPDOWNID];
    DROPDOWN_ARIA.setAttribute("aria-label", DROPDOWN_ARIA.dataset.openLabel);
    event.stopPropagation();
  }
};

const HIDE_DROPDOWN_ON_CLICK_OUTSIDE = (event) => {
  const IS_ANY_POPUP_CLICKED = DROPDOWN.some((popup) =>
    popup.contains(event.target)
  );
  if (!IS_ANY_POPUP_CLICKED) {
    HIDE_DROPDOWN();
  }
};

const FOCUS_FIRST_MENU_ITEM = () => PROFILE_OPTIONS.item(0).focus();

const HANDLE_ESCAPE_KEY_PRESS = (event) => {
  if (event.key === "Escape") {
    HIDE_DROPDOWN();
    PROFILE_MENU_BTN.focus()
  }
};

const HANDLE_MENU_ITEM_KEY_PRESS = (event, MENU_ITEM_INDEX) => {
  const NEXT_MENU_ITEM_INDEX =
    event.key === "ArrowDown" || event.key === "ArrowRight"
      ? MOD_NUMBER(MENU_ITEM_INDEX + 1, PROFILE_OPTIONS.length)
      : event.key === "ArrowUp" || event.key === "ArrowLeft"
      ? MOD_NUMBER(MENU_ITEM_INDEX - 1, PROFILE_OPTIONS.length)
      : event.key === "Home"
      ? 0
      : event.key === "End"
      ? PROFILE_OPTIONS.length - 1
      : undefined;

  if (NEXT_MENU_ITEM_INDEX !== undefined) {
    PROFILE_OPTIONS.item(NEXT_MENU_ITEM_INDEX).focus();
  }
};

const TOGGLE_SETUP = () => {
  SETUP.classList.toggle(isHidden);

  const IS_OPEN = !SETUP.classList.contains(isHidden);
  TOGGLE_SETUP_ARIA_NOTIFICATION.setAttribute(
    "aria-label",
    IS_OPEN ? "Setup opened" : "Setup closed"
  );

  SETUPGUIDE_TOGGLE_CHECK.setAttribute("aria-expanded", IS_OPEN);
  SETUPGUIDE_TOGGLE_CHECK.dataset.isOpen = IS_OPEN ? "" : true;
};

const SHOW_SETUP_STEP = (SETUP_STEP_INDEX) => {
  HIDE_SETUPGUIDE_STEPS();
  SETUPGUIDE_STEPS[SETUP_STEP_INDEX].classList.add(ACTIVE_CLASS);

  const SETUP_STEP_ARIA_NOTIFICATION =
    SETUPGUIDE_STEPS_ARIA_NOTIFICATIONS.item(SETUP_STEP_INDEX);
  SETUP_STEP_ARIA_NOTIFICATION.setAttribute(
    "aria-label",
    `Setup step ${SETUP_STEP_INDEX + 1} opened`
  );

  SETUPGUIDE_STEP_VISIBILITY_TOGGLE_BTNS.item(SETUP_STEP_INDEX).setAttribute(
    "aria-expanded",
    true
  );
};

const HIDE_SETUPGUIDE_STEPS = () => {
  SETUPGUIDE_STEPS.forEach((el, INDEX) => {
    const IS_CLOSED = !el.classList.contains(ACTIVE_CLASS);
    if (IS_CLOSED) {
      return;
    }

    el.classList.remove(ACTIVE_CLASS);
    SETUPGUIDE_STEPS_ARIA_NOTIFICATIONS.item(INDEX).setAttribute(
      "aria-label",
      `Setup step ${INDEX + 1} closed`
    );
  });

  SETUPGUIDE_STEP_VISIBILITY_TOGGLE_BTNS.forEach((btn) =>
    btn.setAttribute("aria-expanded", false)
  );
};

const UPDATE_ARIA_FOR_TOGGLE_COMPLETE_BTN = (TOGGLE_BTN_INDEX) => {
  const SETUP_STEP = SETUPGUIDE_STEPS[TOGGLE_BTN_INDEX];
  const IS_SETUP_STEP_COMPLETE = !!SETUP_STEP.dataset.isCompleted;
  const TOGGLE_BTN = SETUPGUIDE_STEPS_COMPLETE_BTNS[TOGGLE_BTN_INDEX];
  const TOGGLE_COMPLETE_ARIA_NOTIFICATION =
    TOGGLE_ARIA_NOTIFICATIONS_ON_COMPLETE.item(TOGGLE_BTN_INDEX);

  if (IS_SETUP_STEP_COMPLETE) {
        // TOGGLE_BTN.setAttribute("aria-label", "Checked");
    TOGGLE_COMPLETE_ARIA_NOTIFICATION.setAttribute(
      "aria-label",
      ` Step ${TOGGLE_BTN_INDEX + 1} checked`
    );
  } else {
    TOGGLE_COMPLETE_ARIA_NOTIFICATION.setAttribute(
      "aria-label",
      `Step ${TOGGLE_BTN_INDEX + 1} unchecked`
    );
    // TOGGLE_BTN.setAttribute("aria-label", "Unchecked");
  }
};

const TOGGLE_SETUP_STEP_COMPLETE = (TOGGLE_BTN_INDEX) => {
  const SETUP_STEP = SETUPGUIDE_STEPS[TOGGLE_BTN_INDEX];
  if (SETUP_STEP) {
    const IS_SETUP_STEP_COMPLETE = !!SETUP_STEP.dataset.isCompleted;
    SETUP_STEP.dataset.isCompleted = IS_SETUP_STEP_COMPLETE ? "" : true;

    UPDATE_PROGRESS_BAR();
    UPDATE_ARIA_FOR_TOGGLE_COMPLETE_BTN(TOGGLE_BTN_INDEX);

    const NEXT_STEP_INDEX = FIND_NEXT_UNCOMPLETED_STEP_INDEX(SETUPGUIDE_STEPS);
    if (NEXT_STEP_INDEX !== -1) {
      SHOW_SETUP_STEP(NEXT_STEP_INDEX);
    }
  } else {
    console.error("SETUP_STEP is undefined or null");
  }
};

const FIND_NEXT_UNCOMPLETED_STEP_INDEX = (SETUPGUIDE_STEPS) =>
  SETUPGUIDE_STEPS.findIndex((STEP) => !STEP.dataset.isCompleted);

const UPDATE_PROGRESS_BAR = () => {
  const COMPLETED_STEPS_NO = SETUPGUIDE_STEPS.filter(
    (STEP) => STEP.dataset.isCompleted
  ).length;
  SETUPGUIDE_PROGRESSBAR.style.width = `${COMPLETED_STEPS_NO * 20}%`;
  PROGRESS_COUNT.innerText = COMPLETED_STEPS_NO;
};

const MOD_NUMBER = (NUM, N) => ((NUM % N) + N) % N;

NOTIFICATIONS_BTN.addEventListener("click", (EVENT) => {
  TOGGLE_POPUP(EVENT, NOTIFICATIONID);
});

PROFILE_MENU_BTN.addEventListener("click", (e) => {
  TOGGLE_POPUP(e, menuFirstItem);

  const IS_MENU_OPEN = !MENU.classList.contains(isHidden);
  if (IS_MENU_OPEN) {
    FOCUS_FIRST_MENU_ITEM();
  }
});

DROPDOWN.forEach((isNotHidden) => {
  isNotHidden.addEventListener("keyup", HANDLE_ESCAPE_KEY_PRESS);
});
NOTIFICATIONS_BTN.addEventListener("keyup", HANDLE_ESCAPE_KEY_PRESS);

PROFILE_OPTIONS.forEach((profileListItem, index) =>
  profileListItem.addEventListener("keyup", (e) =>
    HANDLE_MENU_ITEM_KEY_PRESS(e, index)
  )
);

document.addEventListener("click", HIDE_DROPDOWN_ON_CLICK_OUTSIDE);

TRIAL_CALLOUT_CLOSE_BTN.addEventListener("click", () => {
  TRIAL_CALLOUT.classList.add(isHidden);
  TRIAL_CALLOUT_ARIA_NOTIFICATION.setAttribute("aria-label", "Trial Callout Hidden");
});

SETUPGUIDE_TOGGLE_CHECK.addEventListener("click", TOGGLE_SETUP);
SETUPGUIDE_STEP_VISIBILITY_TOGGLE_BTNS.forEach((checkButton, index) => {
  checkButton.addEventListener("click", () => SHOW_SETUP_STEP(index));
});

SETUPGUIDE_STEPS_COMPLETE_BTNS.forEach((checkButton, index) => {
  checkButton.addEventListener("click", () => {
    TOGGLE_SETUP_STEP_COMPLETE(index);
  });
});
