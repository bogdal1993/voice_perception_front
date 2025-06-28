const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to the HTML file
  await page.goto('file://' + encodeURIComponent(__dirname) + '/public/spin-ball.html');

  // Verify the ball element exists and is animated
  const ball = await page.$('.ball');
  const style = await page.evaluate(() => {
    const computedStyle = window.getComputedStyle(document.querySelector('.ball'));
    return computedStyle.animation;
  });

  console.log('Ball animation style:', style);
  await browser.close();
})();
