(function () {
  /* params */
  const chatUrl = `https://assistants.deepdream.builders/embed?assistant=${assistant}&theme=${chatTheme}&adaptive-theme=${adaptiveTheme}`;

  window.addEventListener("load", function () {
    const idPrefix = Math.random().toString(36).substring(2, 15);
    const bubbleId = `${idPrefix}-chat-bubble`;
    const windowId = `${idPrefix}-chat-window`;
    const bubbleHtml = `
      <div id="${bubbleId}" style="width:60px;height:60px;background:${bubbleColor};position:fixed;bottom:15px;right:15px;z-index:9999;cursor:pointer;border-radius:50%;display:flex;justify-content:center;align-items:center;">
        <img src="${bubbleIconSrc}" style="width:100%;height:100%;padding:10px;box-sizing:border-box;object-fit:cover;">
      </div>
    `;
    const windowHtml = `
      <div id="${windowId}" style="width:450px;height:400px;position:fixed;bottom:85px;right:15px;z-index:9999;display:none;box-shadow:0 0 10px 10px rgba(0, 0, 0, 0.4);border-radius:10px;flex-direction:column;">
        <div style="width:100%;height:50px;background:${bubbleColor};border-radius:10px 10px 0 0;display:flex;justify-content:flex-end;align-items:center;">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" style="height:40px;cursor:pointer;">
            <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m7.758 7.757 8.485 8.486m-8.486 0 8.485-8.486"/>
          </svg>
        </div>
        <iframe src="${chatUrl}" style="width:100%;height:100%;border:none;border-radius:0 0 10px 10px;"></iframe>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", windowHtml);
    document.body.insertAdjacentHTML("beforeend", bubbleHtml);

    const chatBubble = document.getElementById(bubbleId);
    const chatWindow = document.getElementById(windowId);
    const closeButton = chatWindow.querySelector("svg");
    chatBubble.addEventListener("click", function () {
      chatWindow.style.display =
        chatWindow.style.display === "none" ? "flex" : "none";
    });
    closeButton.addEventListener("click", function () {
      chatWindow.style.display = "none";
    });
  });
})();
