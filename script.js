const screens = Array.from(document.querySelectorAll('.screen'));
const startButton = document.getElementById('startQuiz');
const nextTo3Button = document.getElementById('nextTo3');
const nextTo4Button = document.getElementById('nextTo4');
const showResultButton = document.getElementById('showResult');
const nextTo6Button = document.getElementById('nextTo6');
const restartButton = document.getElementById('restartQuiz');
const answerButtons = Array.from(document.querySelectorAll('.answer-btn'));

let currentScreenIndex = 0;
let selectedAnswers = [];

// Idol data (at least 3 idols)
const idols = [
  {
    id: 'Wonhae',
    name: 'Wonhae',
    short: 'Charming & versatile',
    description: 'Hasil kuis kamu adalah Wonhee! Kamu punya pesona alami yang imut (shoujo vibes) dan disukai banyak orang. Kamu orang yang ceria, menyenangkan, dan suka menghabiskan waktu bareng teman dekat.',
    img: 'wohae.jpeg',
    min: 3,
    max: 5
  },
  {
    id: 'Haerin',
    name: 'Haerin',
    short: 'Energetic & playful',
    description: 'Hasil kuis kamu adalah Haerin NewJeans! Seperti Haerin yang punya aura kucing (cat-vibes), kamu cenderung pendiam dan sangat menikmati waktu me time. Dalam hal berpakaian, kamu lebih suka gaya yang casual, simpel, tapi tetap kelihatan estetik.',
    img: 'Haerin.jpeg',
    min: 6,
    max: 8
  },
  {
    id: 'carmen',
    name: 'Carmen',
    short: 'Confident & cute',
    description: 'Carmen adalah idola energik dengan pesona manis dan penuh karisma. Kamu percaya diri dan ekspresif di depan orang lain.',
    img: 'carmen.jpg',
    min: 9,
    max: 12
  }
];

const getIdolByScore = (score) => {
  return idols.find((idol) => score >= idol.min && score <= idol.max) || idols[0];
};

function showScreen(index) {
  screens.forEach((screen, screenIndex) => {
    screen.classList.toggle('hidden', screenIndex !== index);
  });
  currentScreenIndex = index;
  updateProgress();
}

function updateProgress() {
  const values = {
    1: '33%',
    2: '66%',
    3: '100%'
  };

  const activeScreen = screens[currentScreenIndex];
  const activeFill = activeScreen?.querySelector('.progress-fill');

  if (activeFill) {
    activeFill.style.width = values[currentScreenIndex] || '0%';
  }
}

function clearSelections() {
  answerButtons.forEach((button) => button.classList.remove('selected'));
  selectedAnswers = [];
}

function handleAnswerSelection(event) {
  const button = event.currentTarget;
  const screen = button.closest('.screen');
  if (!screen) return;

  const screenIndex = screens.indexOf(screen);
  const score = Number(button.dataset.score || 0);
  selectedAnswers[screenIndex] = score;

  const choices = Array.from(screen.querySelectorAll('.answer-btn'));
  choices.forEach((choice) => choice.classList.remove('selected'));
  button.classList.add('selected');
}

answerButtons.forEach((button) => {
  button.addEventListener('click', handleAnswerSelection);
});

startButton.addEventListener('click', () => showScreen(1));
nextTo3Button.addEventListener('click', () => showScreen(2));
nextTo4Button.addEventListener('click', () => showScreen(3));

showResultButton.addEventListener('click', () => {
  // Calculate total points from question screens (screen indices 1..3)
  const scores = [selectedAnswers[1] || 0, selectedAnswers[2] || 0, selectedAnswers[3] || 0];
  const total = scores.reduce((s, v) => s + v, 0);

  const idol = getIdolByScore(total);

  // Fill result screen elements
  const resultName = document.getElementById('resultName');
  const resultShort = document.getElementById('resultShort');
  const resultImg = document.getElementById('resultImg');
  const resultLong = document.getElementById('resultLong');
  const resultBadge = document.getElementById('resultBadge');

  if (resultName) resultName.textContent = idol.name;
  if (resultShort) resultShort.textContent = idol.short;
  if (resultImg) resultImg.src = idol.img;
  if (resultLong) resultLong.textContent = idol.description;
  if (resultBadge) resultBadge.textContent = '✨';

  showScreen(4);
});

nextTo6Button.addEventListener('click', () => showScreen(5));

const shareInstagramButton = document.getElementById('shareInstagram');

function getShareText() {
  const resultName = document.getElementById('resultName')?.textContent || 'Hasil K-Pop Quiz';
  const resultShort = document.getElementById('resultShort')?.textContent || '';
  return `${resultName} - ${resultShort} \nCoba K-Pop Quiz ini juga: ${window.location.href}`;
}

function fallbackShare(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Teks share berhasil disalin. Buka Instagram lalu tempel di story/DM.');
    }).catch(() => {
      prompt('Salin teks ini untuk dibagikan ke Instagram:', text);
    });
  } else {
    prompt('Salin teks ini untuk dibagikan ke Instagram:', text);
  }
}

if (shareInstagramButton) {
  shareInstagramButton.addEventListener('click', () => {
    const text = getShareText();

    if (navigator.share) {
      navigator.share({
        title: 'K-Pop Quiz',
        text,
        url: window.location.href
      }).catch(() => {
        fallbackShare(text);
      });
    } else {
      fallbackShare(text);
    }
  });
}

restartButton.addEventListener('click', () => {
  clearSelections();
  // reset result placeholders
  const resultName = document.getElementById('resultName');
  const resultShort = document.getElementById('resultShort');
  const resultImg = document.getElementById('resultImg');
  const resultLong = document.getElementById('resultLong');
  const resultBadge = document.getElementById('resultBadge');
  if (resultName) resultName.textContent = '';
  if (resultShort) resultShort.textContent = '';
  if (resultImg) resultImg.src = '';
  if (resultLong) resultLong.textContent = '';
  if (resultBadge) resultBadge.textContent = '⭐';

  showScreen(0);
});

// Initialize
showScreen(0);
