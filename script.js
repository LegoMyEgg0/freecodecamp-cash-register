const changeDueHTML = document.getElementById("change-due");
// register
const totalDue = document.getElementById("total-due");
const totalDueScreen = document.getElementById("total-due-screen");
const keypad = document.getElementById("register-keypad");
const drawer = document.getElementById("register-drawer");
// dollars
const oneDollar = document.getElementById("one-dollar-amount");
const fiveDollar = document.getElementById("five-dollar-amount");
const tenDollar = document.getElementById("ten-dollar-amount");
const twentyDollar = document.getElementById("twenty-dollar-amount");
const hundredDollar = document.getElementById("hundred-dollar-amount");
// change
const pennies = document.getElementById("pennies-total");
const nickels = document.getElementById("nickels-total");
const dimes = document.getElementById("dimes-total");
const quarters = document.getElementById("quarters-total");
// input
const input = document.getElementById("input");
const cash = document.getElementById("cash");

// stored values
const moneyInDrawer = {
  PENNY: pennies,
  NICKEL: nickels,
  DIME: dimes,
  QUARTER: quarters,
  ONE: oneDollar,
  FIVE: fiveDollar,
  TEN: tenDollar,
  TWENTY: twentyDollar,
  "ONE HUNDRED": hundredDollar,
};
Object.freeze(moneyInDrawer);

const currencyValue = {
  PENNY: 1,
  NICKEL: 5,
  DIME: 10,
  QUARTER: 25,
  ONE: 100,
  FIVE: 500,
  TEN: 1000,
  TWENTY: 2000,
  "ONE HUNDRED": 10000,
};
Object.freeze(currencyValue);

let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];

const keypadText = [
  "receipt on/off",
  "copy receipt",
  "#/no sale",
  "done",
  "employ 1",
  "employ 2",
  "employ 3",
  "employ 4",
  "recall check 1",
  "store check 1",
  "list check 1",
  "print bill",
  "recall check 2",
  "store check 2",
  "list check 2",
  "add check",
  "void item",
  "cancel",
  "screen no.",
  "%1",
  "clear",
  "plu no.",
  "x/time",
  "%2",
  "7",
  "8",
  "9",
  "misc tend 2",
  "4",
  "5",
  "6",
  "misc tend 1",
  "1",
  "2",
  "3",
  "sub total",
  "0",
  "00",
  ".",
  "cash",
];
Object.freeze(keypadText);

let price = 1.87;

// functions
const addAmountToDrawer = () => {
  for (let i = 0; i < cid.length; i++) {
    moneyInDrawer[cid[i][0]].textContent = ` ${i <= 3 ? "¢" : "$"}${cid[i][1]}`;
  }
};

const addTextToButtons = () => {
  let textIndex = 0;
  for (let i = 0; i < 10; i++) {
    keypad.innerHTML += `<div class="register-button">${
      keypadText[textIndex]
    }</div>
    <div class="register-button">${keypadText[textIndex + 1]}</div>
    <div class="register-button">${keypadText[textIndex + 2]}</div>
    <div class="register-button">${keypadText[textIndex + 3]}</div>`;
    textIndex += 4;
  }
};

//main function -------------------------------
const returnCashFromCid = (changeDue) => {
  let changeBackStr = "";
  const cidCopy = JSON.parse(JSON.stringify(cid));
  for (let i = cid.length - 1; i >= 0; i--) {
    let change = 0;
    if (currencyValue[cid[i][0]] > changeDue) {
      continue;
    } else {
      while (currencyValue[cid[i][0]] <= changeDue && cid[i][1] > 0) {
        cid[i][1] = parseFloat(
          ((cid[i][1] * 100 - currencyValue[cid[i][0]]) / 100).toFixed(2)
        );
        changeDue -= currencyValue[cid[i][0]];
        change += currencyValue[cid[i][0]];
      }
    }
    if (change) {
      changeBackStr += `<p>${cid[i][0]}: $${change / 100}</p>`;
    }
  }
  if (changeDue) {
    cid = cidCopy;
    return "Status: INSUFFICIENT_FUNDS";
  } else {
    addAmountToDrawer();
    return `<p>Status: OPEN</p>${changeBackStr}`;
  }
};

// event listeners
input.addEventListener("submit", (e) => {
  e.preventDefault();

  const priceInt = price * 100;
  const totalCid = cid.reduce((acc, val) => acc + Math.round(val[1] * 100), 0);
  const cashInt = Number(cash.value) * 100;
  const changeDue = cashInt - priceInt;

  if (cashInt < priceInt) {
    alert("Customer does not have enough money to purchase the item");
  } else if (cashInt === priceInt) {
    changeDueHTML.innerHTML = `<p>No change due - customer paid with exact cash</p>`;
  } else if (totalCid < changeDue) {
    changeDueHTML.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
  } else if (totalCid === changeDue) {
    changeDueHTML.innerHTML = `<p>Status: CLOSED</p>${cid.reduceRight(
      (acc, arr) => acc + `<p>${arr[0]}: $${arr[1]}</p>`,
      ``
    )}`;
    cid.forEach((amount) => (amount[1] = 0));
    addAmountToDrawer();
  } else {
    changeDueHTML.innerHTML = returnCashFromCid(changeDue);
  }
});

drawer.addEventListener("click", () => {
  if (Array(...drawer.classList).includes("translate-open")) {
    drawer.classList.remove("translate-open");
    drawer.classList.add("translate-closed");
  } else {
    drawer.classList.add("translate-open");
    drawer.classList.remove("translate-closed");
  }
});

// function calls
addAmountToDrawer();
addTextToButtons();

totalDue.textContent = price;
