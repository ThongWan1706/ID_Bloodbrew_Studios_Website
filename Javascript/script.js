document.addEventListener("DOMContentLoaded", function () {
  const miniGameButton = document.querySelector(".minigamebutton");
  const loadingScreen = document.getElementById("loading-screen");

  if (miniGameButton && loadingScreen) {
    miniGameButton.addEventListener("click", function (e) {
      e.preventDefault();
      const targetUrl = this.getAttribute("href");

      loadingScreen.style.display = "flex";

      setTimeout(function () {
        window.location.href = targetUrl;
      }, 1500); 
    });
  }
});
