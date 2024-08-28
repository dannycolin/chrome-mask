const enabledHostnames = new EnabledHostnamesList();

async function updateUiState() {
  const hostnamesList = document.getElementById("hostnamesList");
  const hostnamesListHeader = document.getElementById("hostnamesListHeader");
  hostnamesList.innerHTML = "";
  hostnamesListHeader.textContent =
    browser.i18n.getMessage("optionHostnamesListHeader");

  if (enabledHostnames.get_size() < 1) {
    const hostnamesItem = document.createElement("p");
    hostnamesItem.textContent =
      browser.i18n.getMessage("optionHostnamesListText");
    hostnamesList.appendChild(hostnamesItem);
    return;
  }

  for (const hostname of enabledHostnames.get_values()) {
    console.log("Hey");
    const hostnamesItem = document.createElement("div");
    hostnamesItem.classList.add("hostnamesItem");

    const hostnamesItemInput = document.createElement("input");
    hostnamesItemInput.value = `${hostname}`;
    hostnamesItemInput.setAttribute("readonly", "readonly");

    const hostnamesItemButton = document.createElement("button");
    hostnamesItemButton.textContent = "Delete";

    hostnamesItemButton.addEventListener("click", () => {
      enabledHostnames.remove(hostname);
      updateUiState();
    });

    hostnamesItem.appendChild(hostnamesItemInput);
    hostnamesItem.appendChild(hostnamesItemButton);
    hostnamesList.appendChild(hostnamesItem);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await enabledHostnames.load();
  await updateUiState();

});

  browser.runtime.onMessage.addListener(async (msg) => {
    switch (msg.action) {
      case "enabled_hostnames_changed":
        await updateUiState();
        location.reload(); // It does not reload without it. Why?
        break;
      default:
        throw new Error("unexpected message received", msg);
    }
  });
