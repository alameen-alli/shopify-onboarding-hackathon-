// Profile Menu
const profileMenuButton = document.getElementById("profile-menu-button");
const menuContainer = document.getElementById("menu");
const profileMenuOptions = document.querySelectorAll('[role="profile-menu-option"]');
const profileMenuAriaNotification = document.getElementById("profile-menu-notify");
const isHiddenClass = "isHidden";
const firstMenuItemIndex = 1;

// Notifications
const notificationsButton = document.getElementById("notification-btn");
const notificationsContainer = document.getElementById("notifications");
const notificationsDisplay = document.getElementById("notificationDisplay");
const dropdownContainers = [notificationsContainer, menuContainer];
const dropdownButtons = [notificationsButton, profileMenuButton];
const defaultNotificationId = 0;
const dropdownNotifications = [notificationsDisplay, profileMenuAriaNotification];

// Trial Callout
const trialCalloutElement = document.getElementById("select-a-plan-callout");
const trialCalloutCloseButton = document.getElementById("trial-callout-close-button");
const trialCalloutAriaNotification = document.getElementById("trial-callout");

// Setup Guide
const setupGuideToggleButton = document.getElementById("setupguide-toggle-button");
const setupGuideSection = document.getElementById("setupguide-section-id");
const toggleSetupAriaNotification = document.getElementById("toggle-setup-notify");
const setupGuideProgressIndicator = document.getElementById("setupguide-progess-bar");
const progressCountElement = document.getElementById("setupguide-progress-count");
const stepVisibilityToggleButtons = document.querySelectorAll(".toggle-check-buttons");
const setupGuideSteps = [...document.querySelectorAll(".setupguide-item")];
const activeStepClass = "active";
const stepAriaNotifications = document.querySelectorAll(".notify-on-step-change");
const stepsCompleteButtons = document.querySelectorAll(".check-button");
const toggleNotificationsOnComplete = document.querySelectorAll(".notify-on-check-change");

// Function to hide all dropdowns
const hideDropdown = () => {
  dropdownContainers.forEach((dropDown, index) => {
    const isDropdownVisible = !dropDown.classList.contains(isHiddenClass);
    if (!isDropdownVisible) {
      return;
    }

    dropDown.classList.add(isHiddenClass);
    dropdownButtons[index].setAttribute("aria-expanded", false);
    const dropdownAria = dropdownNotifications[index];
    dropdownAria.setAttribute("aria-label", dropdownAria.dataset.closeLabel);
  });
};

// Function to show a specific dropdown
const showDropdown = (event, dropdownId) => {
  const popup = dropdownContainers[dropdownId];
  const popupButton = dropdownButtons[dropdownId];
  const isDropdownVisible = !popup.classList.contains(isHiddenClass);

  hideDropdown();

  if (!isDropdownVisible) {
    popup.classList.remove(isHiddenClass);
    popupButton.setAttribute("aria-expanded", true);
    const dropdownAria = dropdownNotifications[dropdownId];
    dropdownAria.setAttribute("aria-label", dropdownAria.dataset.openLabel);
    event.stopPropagation();
  }
};

// Function to hide dropdowns when clicking outside
const hideDropdownOnClickOutside = (event) => {
  const isAnyPopupClicked = dropdownContainers.some((popup) =>
    popup.contains(event.target)
  );
  if (!isAnyPopupClicked) {
    hideDropdown();
  }
};

// Function to focus on the first menu item
const focusFirstMenuItem = () => profileMenuOptions.item(0).focus();

// Function to handle the Escape key press
const handleEscapeKeyPress = (event) => {
  if (event.key === "Escape") {
    hideDropdown();
    profileMenuButton.focus();
  }
};

// Function to handle key changes for menu items
const setMenuItemOnKeyChange = (event, currentMenuItemIndex) => {
  const calculateNextIndex = (currentIndex, totalItems) => calculatePositiveRemainder(currentIndex, totalItems);

  const isMoveDownOrRight = event.key === "ArrowDown" || event.key === "ArrowRight";
  const isMoveUpOrLeft = event.key === "ArrowUp" || event.key === "ArrowLeft";
  const isHomeKey = event.key === "Home";
  const isEndKey = event.key === "End";

  const nextMenuItemIndex =
    isMoveDownOrRight
      ? calculateNextIndex(currentMenuItemIndex + 1, profileMenuOptions.length)
      : isMoveUpOrLeft
      ? calculateNextIndex(currentMenuItemIndex - 1, profileMenuOptions.length)
      : isHomeKey
      ? 0
      : isEndKey
      ? profileMenuOptions.length - 1
      : undefined;

  if (nextMenuItemIndex !== undefined) {
    const nextMenuItem = profileMenuOptions.item(nextMenuItemIndex);
    nextMenuItem.focus();
  }
};

// Function to calculate positive remainder
const calculatePositiveRemainder = (number, divisor) => {
  const remainder = number % divisor;
  const positiveRemainder = (remainder + divisor) % divisor;
  return positiveRemainder;
};

// Function to toggle the setup guide visibility
const toggleSetup = () => {
  setupGuideSection.classList.toggle(isHiddenClass);

  const isOpen = !setupGuideSection.classList.contains(isHiddenClass);
  toggleSetupAriaNotification.setAttribute(
    "aria-label",
    isOpen ? "Setup opened" : "Setup closed"
  );

  setupGuideToggleButton.setAttribute("aria-expanded", isOpen);
  setupGuideToggleButton.dataset.isOpen = isOpen ? "" : true;
};

// Function to show a specific setup guide step
const showSetupStep = (setupStepIndex) => {
  hideSetupGuideSteps();
  setupGuideSteps[setupStepIndex].classList.add(activeStepClass);

  const setupStepAriaNotification = stepAriaNotifications.item(setupStepIndex);
  setupStepAriaNotification.setAttribute(
    "aria-label",
    `Setup step ${setupStepIndex + 1} opened`
  );

  stepVisibilityToggleButtons.item(setupStepIndex).setAttribute(
    "aria-expanded",
    true
  );
};

// Function to hide all setup guide steps
const hideSetupGuideSteps = () => {
  setupGuideSteps.forEach((el, index) => {
    const isClosed = !el.classList.contains(activeStepClass);
    if (isClosed) {
      return;
    }

    el.classList.remove(activeStepClass);
    stepAriaNotifications.item(index).setAttribute(
      "aria-label",
      `Setup step ${index + 1} closed`
    );
  });

  stepVisibilityToggleButtons.forEach((btn) =>
    btn.setAttribute("aria-expanded", false)
  );
};

// Function to update ARIA attributes for toggle complete button
const updateAriaForToggleCompleteBtn = (index) => {
  const setupStep = setupGuideSteps[index];
  const isAllStepsChecked = !!setupStep.dataset.isCompleted;
  const toggleCompleteAriaNotification = toggleNotificationsOnComplete.item(index);

  if (isAllStepsChecked) {
    toggleCompleteAriaNotification.setAttribute(
      "aria-label",
      ` Step ${index + 1} checked`
    );
  } else {
    toggleCompleteAriaNotification.setAttribute(
      "aria-label",
      `Step ${index + 1} unchecked`
    );
  }
};

// Function to toggle the completion of a setup guide step
const toggleSetupStepComplete = (toggleBtnIndex) => {
  const setupStep = setupGuideSteps[toggleBtnIndex];
  if (setupStep) {
    const isAllStepsChecked = !!setupStep.dataset.isCompleted;
    setupStep.dataset.isCompleted = isAllStepsChecked ? "" : true;

    updateProgressBar();
    updateAriaForToggleCompleteBtn(toggleBtnIndex);

    const nextStepIndex = moveToNotChecked(setupGuideSteps);
    if (nextStepIndex !== -1) {
      showSetupStep(nextStepIndex);
    }
  } else {
    console.error("setupStep is undefined or null");
  }
};

// Function to find the index of the next uncompleted setup guide step
const moveToNotChecked = (setupGuideSteps) =>
  setupGuideSteps.findIndex((step) => !step.dataset.isCompleted);

// Function to update the progress bar based on completed steps
const updateProgressBar = () => {
  const checkedSteps = setupGuideSteps.filter(
    (step) => step.dataset.isCompleted
  ).length;
  setupGuideProgressIndicator.style.width = `${checkedSteps * 20}%`;
  progressCountElement.innerText = checkedSteps;
};

// Event listeners
notificationsButton.addEventListener("click", (e) => {
  showDropdown(e, defaultNotificationId);
});

profileMenuButton.addEventListener("click", (e) => {
  showDropdown(e, firstMenuItemIndex);

  const isMenuOpen = !menuContainer.classList.contains(isHiddenClass);
  if (isMenuOpen) {
    focusFirstMenuItem();
  }
});

dropdownContainers.forEach((isVisible) => {
  isVisible.addEventListener("keyup", handleEscapeKeyPress);
});
notificationsButton.addEventListener("keyup", handleEscapeKeyPress);

profileMenuOptions.forEach((profileListItem, index) =>
  profileListItem.addEventListener("keyup", (e) =>
    setMenuItemOnKeyChange(e, index)
  )
);

document.addEventListener("click", hideDropdownOnClickOutside);

trialCalloutCloseButton.addEventListener("click", () => {
  trialCalloutElement.classList.add(isHiddenClass);
  trialCalloutAriaNotification.setAttribute("aria-label", "Trial Callout Hidden");
});

setupGuideToggleButton.addEventListener("click", toggleSetup);
stepVisibilityToggleButtons.forEach((checkButton, index) => {
  checkButton.addEventListener("click", () => showSetupStep(index));
});

stepsCompleteButtons.forEach((checkButton, index) => {
  checkButton.addEventListener("click", () => {
    toggleSetupStepComplete(index);
  });
});
