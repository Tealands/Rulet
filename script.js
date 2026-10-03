const participantsInput = document.querySelector("#participants");
const participantCount = document.querySelector("#participant-count");
const digitSlots = [...document.querySelectorAll("#digits span")];
const drawButton = document.querySelector("#draw-button");
const drawStatus = document.querySelector("#draw-status");
const errorMessage = document.querySelector("#error-message");
const result = document.querySelector("#result");
const winnerName = document.querySelector("#winner-name");
const calculation = document.querySelector("#calculation");

function getParticipants() {
  return participantsInput.value
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}

function updateParticipantCount() {
  const count = getParticipants().length;
  participantCount.textContent = `${count}人`;
}

function randomDigit(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

async function revealDigit(slot, min, max) {
  for (let turn = 0; turn < 9; turn += 1) {
    slot.textContent = randomDigit(min, max);
    await wait(45);
  }
  const digit = randomDigit(min, max);
  slot.textContent = digit;
  return digit;
}

participantsInput.addEventListener("input", updateParticipantCount);

drawButton.addEventListener("click", async () => {
  const participants = getParticipants();
  errorMessage.hidden = true;
  result.hidden = true;

  if (participants.length === 0) {
    errorMessage.textContent = "抽選するには、参加者を1人以上入力してください。";
    errorMessage.hidden = false;
    return;
  }

  drawButton.disabled = true;
  digitSlots.forEach((slot) => {
    slot.textContent = "?";
  });

  try {
    const digits = [];
    for (let index = 0; index < digitSlots.length; index += 1) {
      drawStatus.textContent = `${index + 1}桁目を決定中…`;
      digits.push(await revealDigit(digitSlots[index], index === 0 ? 1 : 0, 9));
    }

    const number = Number(digits.join(""));
    const remainder = number % participants.length;
    const winnerIndex = remainder === 0 ? participants.length - 1 : remainder - 1;

    winnerName.textContent = participants[winnerIndex];
    calculation.textContent = `${number} ÷ ${participants.length}人 の余りは ${remainder}`;
    drawStatus.textContent = "5桁の数字が決まりました。";
    result.hidden = false;
  } finally {
    drawButton.disabled = false;
  }
});

updateParticipantCount();
