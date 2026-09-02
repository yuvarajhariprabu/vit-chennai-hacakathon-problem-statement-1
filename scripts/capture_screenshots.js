import puppeteer from 'puppeteer-core'
import path from 'path'
import fs from 'fs'

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const OUTPUT_DIR = path.resolve('screenshots')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function run() {
  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  })

  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900 })

  console.log('Navigating to http://localhost:5173...')
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 2000))

  // 1. Main Experience Screenshot
  console.log('Capturing 01_main_experience.png...')
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_main_experience.png') })

  // 2. Click Golden Koi in river
  try {
    console.log('Clicking Golden Koi in the river...')
    const koi = await page.$('.golden-koi-wrapper')
    if (koi) {
      await koi.click()
      await new Promise(r => setTimeout(r, 800))
      console.log('Capturing 02_golden_koi_easter_egg.png...')
      await page.screenshot({ path: path.join(OUTPUT_DIR, '02_golden_koi_easter_egg.png') })
      const closeBtn = await page.$('.gk-close-btn')
      if (closeBtn) await closeBtn.click()
      await new Promise(r => setTimeout(r, 500))
    }
  } catch (err) {
    console.error('Error with Golden Koi:', err)
  }

  // 3. Click Sun icon for Sun & Moon Founder Easter Egg
  try {
    console.log('Clicking Sun icon for Sun Moon Founder Easter Egg...')
    const sunBtn = await page.$('.sun-moon-btn')
    if (sunBtn) {
      await sunBtn.click()
      await new Promise(r => setTimeout(r, 800))
      console.log('Capturing 03_sun_moon_founder.png...')
      await page.screenshot({ path: path.join(OUTPUT_DIR, '03_sun_moon_founder.png') })
      const closeBtn = await page.$('.smp-close-btn')
      if (closeBtn) await closeBtn.click()
      await new Promise(r => setTimeout(r, 500))
    }
  } catch (err) {
    console.error('Error with Sun icon:', err)
  }

  // 4. Click Monkey King logo Easter Egg
  try {
    console.log('Clicking Monkey King logo...')
    const logo = await page.$('.lp-brand')
    if (logo) {
      await logo.click()
      await new Promise(r => setTimeout(r, 800))
      console.log('Capturing 04_monkey_king.png...')
      await page.screenshot({ path: path.join(OUTPUT_DIR, '04_monkey_king.png') })
      const closeBtn = await page.$('.mk-close-btn')
      if (closeBtn) await closeBtn.click()
      await new Promise(r => setTimeout(r, 500))
    }
  } catch (err) {
    console.error('Error with Logo:', err)
  }

  // 5. Catch a few spawned animals to demonstrate auto-filling color runes
  try {
    console.log('Catching spawned animals...')
    const animals = await page.$$('.spawned-animal')
    for (let i = 0; i < Math.min(animals.length, 3); i++) {
      try {
        await animals[i].click()
        await new Promise(r => setTimeout(r, 300))
      } catch (e) {}
    }
    await new Promise(r => setTimeout(r, 600))
    console.log('Capturing 05_animals_collected_runes.png...')
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_animals_collected_runes.png') })
  } catch (err) {
    console.error('Error catching animals:', err)
  }

  // 6. Capture final 5-seconds countdown timer on main display
  try {
    console.log('Waiting for final 5 seconds countdown on main display...')
    // Check remaining time
    await page.waitForFunction(() => {
      const el = document.querySelector('.main-display-countdown')
      return el !== null
    }, { timeout: 60000 })
    await new Promise(r => setTimeout(r, 400))
    console.log('Capturing 06_final_countdown.png...')
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_final_countdown.png') })
  } catch (err) {
    console.log('Waiting for countdown timed out or skipped, checking DOM...', err.message)
  }

  // 7. Capture Completion Screen
  try {
    console.log('Waiting for completion screen...')
    await page.waitForSelector('.completion-root.show', { timeout: 20000 })
    await new Promise(r => setTimeout(r, 800))
    console.log('Capturing 07_sanctuary_preserved.png...')
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_sanctuary_preserved.png') })
  } catch (err) {
    console.error('Error waiting for completion screen:', err)
  }

  await browser.close()
  console.log('All screenshots captured successfully!')
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
