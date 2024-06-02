const inputs = document.querySelectorAll(".input");

window.addEventListener('scroll', () => {
  if (window.scrollY >= 70) {
    nav.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  }
  else{
    nav.style.backgroundColor = "transparent";
  }
});

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});