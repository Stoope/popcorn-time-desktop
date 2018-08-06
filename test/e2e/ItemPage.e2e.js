import { Selector } from 'testcafe';
import {
  BASE_URL,
  cardSelector,
  cardlistSelector,
  titleSelector,
  getPageUrl,
  clearConfigs,
  clickItemPageBackButton,
  navigateTo,
  getLowerCaseCardTitle
} from './helpers';

const TEST_MOVIE_URL = '#/item/movies/351286';

fixture`Item Page`.page(BASE_URL).beforeEach(async t => {
  clearConfigs();
  await t
    .click(Selector('a').withExactText('Home'))
    .typeText('#pct-search-input', 'harry potter', { replace: true })
    .pressKey('enter')
    .click(cardSelector);
});

test('it should load item title', async t => {
  await t
    .expect(
      Selector('h1').withExactText("Harry Potter and the Philosopher's Stone").visible
    )
    .ok();
});

test('it should go back', async t => {
  await clickItemPageBackButton(t);
  await t
    .expect(await getPageUrl().then(str => str.slice(str.length - 11)))
    .eql('app.html?#/');
});

test('it should load similar cards', async t => {
  await t
    .click(cardlistSelector.find('.Card'))
    .expect(getPageUrl())
    .notContains(TEST_MOVIE_URL)
    .expect(cardSelector.visible)
    .ok()
    .expect(cardlistSelector.visible)
    .ok()
    .expect(titleSelector.visible)
    .ok();
});

test('it should add items to favorites', async t => {
  await t.click('.SaveItem--favorites');
  await t
    .expect(Selector('.SaveItem--active-icon.SaveItem--favorites').visible)
    .ok();
  await clickItemPageBackButton(t);
  await navigateTo(t, 'home');
  await t
    .expect(await getLowerCaseCardTitle())
    .contains('harry potter')
    .click(cardSelector)
    .expect(getPageUrl())
    .contains('item/');
});

test('it should add items to watch list', async t => {
  await t.click('.SaveItem--watchlist');
  await t
    .expect(Selector('.SaveItem--active-icon.SaveItem--watchlist').visible)
    .ok();
  await clickItemPageBackButton(t);
  await navigateTo(t, 'home');
  await t
    .expect(await getLowerCaseCardTitle())
    .contains('harry potter')
    .click(cardSelector)
    .expect(getPageUrl())
    .contains('item/');
});

test('it should display torrent loading status', async t => {
  await t
    .expect(
      Selector('.Item--loading-status').withExactText('Fetching torrents...')
        .visible
    )
    .ok();
});

test('it should play trailer', async t => {
  await t
    .click('[data-e2e="item-trailer-button"]')
    .expect(Selector('.plyr').visible)
    .ok();
});

test('it should load and play a movie', async t => {
  const playButton = Selector('[data-e2e="item-play-button"]');
  // Navigate to harry potter because we know it has a lot of torrents. Good for testing purposes
  await t
    .expect(
      Selector('.Item--loading-status').withExactText('Fetching torrents...').visible
    )
    .ok()
    .wait(20000)
    .expect(playButton.visible)
    .ok()
    .click(playButton)
    .expect(
      Selector('.Item--loading-status').withExactText('Loading torrent...')
        .visible
    )
    .ok();
});