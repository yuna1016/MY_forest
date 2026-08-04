const stage = document.querySelector(".hero-stage");

if (stage) {
  stage.addEventListener("pointermove", (event) => {
    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    stage.style.setProperty("--tilt-x", `${x * 8}px`);
    stage.style.setProperty("--tilt-y", `${y * 8}px`);
  });
}
