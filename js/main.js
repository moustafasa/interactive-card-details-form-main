let form = document.querySelector("form");

// validate card number input
form.num.addEventListener("input", (e) => {
  spaceAfterFourNum(e);
  validateNum(e);
});

// validate number inputs
[form.month, form.year, form.cvc].forEach((numInput) => {
  numInput.addEventListener("input", (ev) => {
    // sure that all value will be numbers
    ev.currentTarget.value = ev.currentTarget.value.replace(/\D/g, "");
    // validate  month to sure that its value is less than 12
    if (numInput.name === "month") {
      if (ev.currentTarget.value > 12) {
        setErrorMsg(numInput, "not valid date");
      } else {
        success(numInput);
      }
    }
  });
});

// fill cards with data on typing
[...form.elements].forEach((ele) => {
  ele.addEventListener("input", (ev) => {
    let cont = document.querySelector(
      `.card [data-showed=${ev.currentTarget.name}]`
    );
    let inputValue = ev.currentTarget.value;
    let input = ev.currentTarget;

    if (input.name === "num") {
      fillNum(inputValue, cont);
    } else {
      if (inputValue === "") {
        cont.innerHTML = cont.dataset.default;
      } else {
        fillAllExceptNum(inputValue, cont, input);
      }
    }
  });
});

form.addEventListener("submit", (ev) => {
  // sure that all inputs is not empty
  validateAll();
  let notValid = document.querySelector("input.error");
  ev.preventDefault();
  if (!notValid) {
    completeState();
  }
});

function validateAll() {
  [...form.elements].forEach((inp) => {
    if (inp.value === "" || inp.value === 0) {
      setErrorMsg(inp, "can't be empty");
      // remove error on focus
      inp.addEventListener("focus", (ev) => {
        success(ev.currentTarget);
      });
      // return error on blur if it still empty
      inp.addEventListener("blur", (ev) => {
        ev.currentTarget.value === ""
          ? setErrorMsg(ev.currentTarget, "can't be empty")
          : "";
      });
    } else {
      if (inp === form.num || inp === form.cvc) {
        if (inp.value.length < inp.getAttribute("maxlength")) {
          setErrorMsg(inp, "not valid");
        }
      }
    }
  });
}

function spaceAfterFourNum(e) {
  let re = /.{4}/gi;
  e.currentTarget.value = e.currentTarget.value
    .replace(/\s*/g, "")
    .replace(re, (a) => a + " ")
    .trim();
}
function validateNum(e) {
  if (/[^\d\s]/gi.test(e.currentTarget.value)) {
    setErrorMsg(e.currentTarget, "wrong format, numbers only");
  } else {
    success(e.currentTarget);
  }
}

function fillAllExceptNum(value, cont, input) {
  cont.innerHTML = value;
  if (input.closest(".date")) {
    if (value < 10) {
      cont.innerHTML = "0" + value;
    }
  }
}
function fillNum(inputValue, cont) {
  let spanValue = inputValue.match(/\w{1,4}/g);
  let i = 0;
  if (spanValue) {
    spanValue.forEach((value) => {
      if (value.length === 4) {
        cont.children[i].innerHTML = value;
      } else {
        cont.children[i].innerHTML = value + "0".repeat(4 - value.length);
      }
      i++;
    });
  }
  // return span value as 0000 if it not filled
  if (i < 4) {
    for (let c = i; c < 4; c++) {
      cont.children[c].innerHTML = "0000";
    }
  }
}

function setErrorMsg(input, msg) {
  let errorP = input.parentElement.querySelector("p.error");
  input.classList.add("error");
  errorP.innerHTML = msg;
}

function success(input) {
  input.parentElement.querySelector("p.error").innerHTML = "";
  input.classList.remove("error");
}

function completeState() {
  let complete = document.querySelector(".complete");
  form.remove();
  complete.classList.remove("hidden");
}
