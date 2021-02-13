'use strict';
const inputsTextConfig = [
  {
    inputClass: '.js-name',
    cardClass: '.js-preview-name',
    defaultValue: 'Mary Shelly',
    cardPrefix: '',
    cardElementAttribute: 'innerHTML',
  },
  {
    inputClass: '.js-job',
    cardClass: '.js-preview-job',
    defaultValue: 'Master of creatures',
    cardPrefix: '',
    cardElementAttribute: 'innerHTML',
  },
  {
    inputClass: '.js-email',
    cardClass: '.js-preview-email',
    defaultValue: '',
    cardPrefix: 'mailto:',
    cardElementAttribute: 'href',
  },
  {
    inputClass: '.js-phone',
    cardClass: '.js-preview-phone',
    defaultValue: '',
    cardPrefix: '',
    cardElementAttribute: 'href',
  },
  {
    inputClass: '.js-linkedin',
    cardClass: '.js-preview-linkedin',
    defaultValue: '',
    cardPrefix: 'https://www.linkedin.com/in/',
    cardElementAttribute: 'href',
  },
  {
    inputClass: '.js-github',
    cardClass: '.js-preview-github',
    defaultValue: '',
    cardPrefix: 'https://www.github.com/',
    cardElementAttribute: 'href',
  },
];
function updateAllInputs() {
  for (const e of inputsTextConfig) {
    const t = document.querySelector(e.inputClass),
      r = document.querySelector(e.cardClass);
    let l = t.value;
    'innerHTML' === e.cardElementAttribute
      ? ((l = '' === t.value ? e.defaultValue : t.value), (r.innerHTML = l))
      : 'href' === e.cardElementAttribute &&
        ('' === t.value ? (l = '#') : ((l = l.replace(e.cardPrefix, '')), (l = e.cardPrefix + l)), (r.href = l));
  }
  saveInLocalStorage();
}
const inputTextElements = document.querySelectorAll('.js-input-text');
for (const e of inputTextElements) e.addEventListener('keyup', updateAllInputs);
const headerElements = document.querySelectorAll('.collapsable__header');
for (const e of headerElements) e.addEventListener('click', collapsableHandler);
function collapsableHandler(e) {
  const t = e.currentTarget.closest('.js-collapsable'),
    r = document.querySelectorAll('.js-collapsable');
  for (const e of r) t === e ? e.classList.toggle('collapsed') : e.classList.add('collapsed');
}
const paletteElements = document.querySelectorAll('.js-palette'),
  cardElement = document.querySelector('.js-card');
let checkedPalette = 1;
function handlerPalette() {
  cardElement.classList.remove('palette-1', 'palette-2', 'palette-3');
  const e = document.querySelector('.js-palette:checked');
  (checkedPalette = e.value), cardElement.classList.add('palette-' + checkedPalette), saveInLocalStorage();
}
for (const e of paletteElements) e.addEventListener('change', handlerPalette);
const fr = new FileReader(),
  uploadBtn = document.querySelector('.js__profile-trigger'),
  fileField = document.querySelector('.js__profile-upload-btn'),
  profileImage = document.querySelector('.js__profile-image'),
  profilePreview = document.querySelector('.js__profile-preview');
let photo = '';
function getImage(e) {
  const t = e.currentTarget.files[0];
  fr.addEventListener('load', writeImage), fr.readAsDataURL(t);
}
function writeImage() {
  (photo = fr.result), updatePhoto(), saveInLocalStorage();
}
function updatePhoto() {
  const e = photo;
  '' !== e &&
    ((profilePreview.style.backgroundImage = `url(${e})`), (profileImage.style.backgroundImage = `url(${e})`));
}
function clearPhoto() {
  (photo = ''), (profilePreview.style.backgroundImage = ''), (profileImage.style.backgroundImage = '');
}
function fakeFileClick(e) {
  e.preventDefault(), fileField.click();
}
function getUserData() {
  return {
    photo: photo,
    palette: parseInt(document.querySelector('.js-palette:checked').value),
    name: document.querySelector('.js-name').value,
    job: document.querySelector('.js-job').value,
    email: document.querySelector('.js-email').value,
    phone: document.querySelector('.js-phone').value,
    linkedin: document.querySelector('.js-linkedin').value,
    github: document.querySelector('.js-github').value,
  };
}
function saveInLocalStorage() {
  const e = getUserData(),
    t = JSON.stringify(e);
  localStorage.setItem('userData', t);
}
function getFromLocalStorage() {
  const e = localStorage.getItem('userData');
  if (null !== e) {
    const t = JSON.parse(e);
    (document.querySelector('.js-name').value = t.name),
      (document.querySelector('.js-job').value = t.job),
      (document.querySelector('.js-email').value = t.email),
      (document.querySelector('.js-phone').value = t.phone),
      (document.querySelector('.js-linkedin').value = t.linkedin),
      (document.querySelector('.js-github').value = t.github),
      (photo = t.photo);
    const r = document.querySelectorAll('.js-palette');
    for (const e of r) e.value === t.palette && (e.checked = !0);
    updateAllInputs(), handlerPalette(), updatePhoto();
  }
}
uploadBtn.addEventListener('click', fakeFileClick), fileField.addEventListener('change', getImage);
const shareButton = document.querySelector('.js-share-btn'),
  cardResult = document.querySelector('.js-shareclick'),
  linkElement = document.querySelector('.js-card-link'),
  twitterHiddenElement = document.querySelector('.js-twitter-share');
let shareLink = '';
function handleCreateBtn(e) {
  e.preventDefault(),
    fetchAPI(),
    shareButton.classList.remove('share__button'),
    shareButton.classList.add('share__button--dis'),
    (shareButton.disabled = !0),
    twitterHiddenElement.classList.remove('hidden-share');
}
function fetchAPI() {
  const e = getUserData();
  fetch('https://profileawesome.herokuapp.com/card', {
    method: 'POST',
    body: JSON.stringify(e),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((e) => e.json())
    .then((e) => {
      !0 === e.success
        ? (e.cardURL,
          (shareLink = e.cardURL),
          (linkElement.innerHTML = `<a href="${shareLink}" class="shareclick__text js-shareclick" target="_blank">${shareLink}</a>;`))
        : (cardResult.innerHTML = e.error);
    });
}
shareButton.addEventListener('click', handleCreateBtn);
const buttonElement = document.querySelector('.js-reset');
function resetAll() {
  for (const e of inputsTextConfig) {
    document.querySelector(e.inputClass).value = e.defaultValue;
  }
  clearPhoto(), updateAllInputs(), clearInputs();
}
function clearInputs() {
  const e = document.querySelector('.js-name');
  (document.querySelector('.js-job').value = ''),
    (e.value = ''),
    shareButton.classList.remove('share__button--dis'),
    (shareButton.disabled = !1),
    shareButton.classList.add('share__button'),
    twitterHiddenElement.classList.add('hidden-share');
}
buttonElement.addEventListener('click', resetAll);
const twitterElement = document.querySelector('.js-twitter-btn'),
  twitterLinkElement = document.querySelector('.js-twitter-link');
function handleTwitterShare() {
  twitterLinkElement.href = 'https://twitter.com/intent/tweet?ref_src=twsrc%5Etfw&url=' + shareLink;
}
twitterElement.addEventListener('click', handleTwitterShare);
const formElement = document.querySelector('.js-form');
function preventSubmit(e) {
  e.preventDefault();
}
formElement.addEventListener('submit', preventSubmit),
  getFromLocalStorage(),
  updateAllInputs(),
  handlerPalette(),
  updatePhoto();
